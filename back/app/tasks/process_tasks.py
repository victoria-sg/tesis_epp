from app.core.celery_app import celery_app
from app.core.config import settings
from app.db.session import SessionLocal
from datetime import datetime
import os

_model = None

# Clases relevantes del dataset de Construction Site Safety
CLASES_INFRACCION = {"NO-Hardhat", "NO-Safety Vest", "NO-Mask"}
CLASES_EPP_POSITIVO = {"Hardhat", "Safety Vest", "Mask", "Gloves"}


def get_model():
    global _model
    if _model is None:
        from ultralytics import YOLO

        model_path = settings.MODEL_PATH
        if os.path.exists(model_path):
            print(f"[🤖] Cargando modelo entrenado desde {model_path}")
            _model = YOLO(model_path)
        else:
            print(f"[⚠️] Modelo entrenado no encontrado en {model_path}.")
            print("[🤖] Usando modelo base yolov8n.pt (sin clases EPP específicas)")
            _model = YOLO("yolov8n.pt")
    return _model


@celery_app.task(bind=True, max_retries=3, name="process_frame")
def process_frame(self, camara_id: int, frame_b64: str, timestamp: str):
    try:
        import base64
        import io
        import numpy as np
        from PIL import Image

        if "," in frame_b64:
            frame_b64_clean = frame_b64.split(",", 1)[1]
        else:
            frame_b64_clean = frame_b64

        frame_bytes = base64.b64decode(frame_b64_clean)
        imagen = Image.open(io.BytesIO(frame_bytes)).convert("RGB")
        frame_np = np.array(imagen)
        ancho, alto = imagen.size

        model = get_model()
        results = model(frame_np, verbose=False)

        detecciones = []
        clases_detectadas = set()

        for r in results:
            for box in r.boxes:
                clase_idx = int(box.cls)
                nombre_clase = model.names[clase_idx]
                confianza = float(box.conf)

                if confianza < 0.4:
                    continue

                bbox = box.xyxy[0].tolist()
                detecciones.append({
                    "clase": clase_idx,
                    "nombre_clase": nombre_clase,
                    "confianza": round(confianza, 3),
                    "bbox": [round(b, 2) for b in bbox],
                })
                clases_detectadas.add(nombre_clase)

        hay_infraccion = bool(clases_detectadas & CLASES_INFRACCION)

        resultado = {
            "camara_id": camara_id,
            "timestamp": timestamp,
            "detecciones": detecciones,
            "total_detecciones": len(detecciones),
            "clases_detectadas": list(clases_detectadas),
            "hay_infraccion": hay_infraccion,
            "ancho_frame": ancho,
            "alto_frame": alto,
        }

        print(
            f"[🔍] Cámara {camara_id}: {len(detecciones)} detecciones, "
            f"infracción={hay_infraccion}"
        )

        _guardar_ultimo_resultado(camara_id, resultado)

        if hay_infraccion:
            _guardar_alerta(camara_id, frame_b64, resultado)

        return resultado

    except Exception as exc:
        print(f"[❌] Error procesando frame de cámara {camara_id}: {exc}")
        raise self.retry(exc=exc, countdown=10)


def _guardar_ultimo_resultado(camara_id: int, resultado: dict):
    """Guarda el último resultado de detección en Redis para que el frontend lo consulte."""
    try:
        import json
        import redis as redis_lib

        r = redis_lib.from_url(settings.REDIS_URL)
        key = f"deteccion:ultima:{camara_id}"
        r.set(key, json.dumps(resultado), ex=30)
    except Exception as e:
        print(f"[❌] Error guardando resultado en Redis: {e}")


def _guardar_alerta(camara_id: int, frame_b64: str, resultado: dict):
    try:
        from app.models.alerta import Alerta
        import base64
        import io
        from PIL import Image, ImageDraw, ImageFont

        # Decodificar frame
        frame_b64_clean = frame_b64.split(",", 1)[1] if "," in frame_b64 else frame_b64
        frame_bytes = base64.b64decode(frame_b64_clean)
        imagen = Image.open(io.BytesIO(frame_bytes)).convert("RGB")
        draw = ImageDraw.Draw(imagen)

        ancho, alto = imagen.size

        COLORES = {
            "infraccion": (239, 68, 68),   # rojo
            "normal": (34, 197, 94),        # verde
        }
        CLASES_INFRACCION = {"NO-Hardhat", "NO-Safety Vest", "NO-Mask"}

        for det in resultado.get("detecciones", []):
            bbox = det.get("bbox", [])
            if len(bbox) < 4:
                continue

            x1, y1, x2, y2 = [int(b) for b in bbox]
            nombre = det.get("nombre_clase", "")
            confianza = det.get("confianza", 0)
            color = COLORES["infraccion"] if nombre in CLASES_INFRACCION else COLORES["normal"]

            # Recuadro
            draw.rectangle([x1, y1, x2, y2], outline=color, width=3)

            # Etiqueta
            etiqueta = f"{nombre} {int(confianza * 100)}%"
            label_w = len(etiqueta) * 7
            label_h = 18
            draw.rectangle([x1, y1 - label_h, x1 + label_w, y1], fill=color)
            draw.text((x1 + 3, y1 - label_h + 2), etiqueta, fill=(255, 255, 255))

        # Re-encodificar a base64
        buffer = io.BytesIO()
        imagen.save(buffer, format="JPEG", quality=85)
        frame_con_overlay = "data:image/jpeg;base64," + base64.b64encode(buffer.getvalue()).decode()

        db = SessionLocal()
        alerta = Alerta(
            id_camara=camara_id,
            fecha_hora_deteccion=datetime.now(),
            segundos_transcurridos=0,
            estado_alerta="Pendiente",
            captura_frame=frame_con_overlay,
        )
        db.add(alerta)
        db.commit()
        db.refresh(alerta)
        print(f"[🚨] Alerta #{alerta.id_alerta} creada con overlay para cámara {camara_id}")
        db.close()
    except Exception as e:
        print(f"[❌] Error guardando alerta: {e}")