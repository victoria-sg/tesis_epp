import base64
import io
from functools import lru_cache

import numpy as np
from PIL import Image
from ultralytics import YOLO

# Mapeo de clases del dataset a categorías EPP relevantes
CLASES_EPP_RELEVANTES = {
    "Hardhat": "casco_si",
    "NO-Hardhat": "casco_no",
    "Safety Vest": "chaleco_si",
    "NO-Safety Vest": "chaleco_no",
    "Mask": "mascarilla_si",
    "NO-Mask": "mascarilla_no",
    "Gloves": "guantes_si",
    "Person": "persona",
}


@lru_cache(maxsize=1)
def get_model() -> YOLO:
    """Carga el modelo una sola vez y lo reutiliza (singleton)."""
    # TODO: cuando termines el entrenamiento, cambia esta ruta
    # al modelo entrenado, ej: "./models/epp_best.pt"
    return YOLO("yolov8n.pt")


def _decodificar_frame(frame_base64: str) -> Image.Image:
    """Convierte un data:image/jpeg;base64,... a imagen PIL."""
    if "," in frame_base64:
        frame_base64 = frame_base64.split(",", 1)[1]
    data = base64.b64decode(frame_base64)
    return Image.open(io.BytesIO(data)).convert("RGB")


def detectar_epp(frame_base64: str, confianza_minima: float = 0.4) -> dict:
    """
    Analiza un frame y devuelve las detecciones de EPP encontradas.

    Returns:
        {
            "detecciones": [{"clase": str, "confianza": float, "caja": [x1,y1,x2,y2]}],
            "infraccion": bool,   # True si detecta a alguien sin EPP
            "personas_detectadas": int,
        }
    """
    model = get_model()
    imagen = _decodificar_frame(frame_base64)
    imagen_np = np.array(imagen)

    results = model(imagen_np, verbose=False)

    detecciones = []
    personas = 0
    infraccion = False

    for r in results:
        for box in r.boxes:
            clase_idx = int(box.cls)
            clase_nombre = model.names[clase_idx]
            confianza = float(box.conf)

            if confianza < confianza_minima:
                continue

            if clase_nombre == "person":
                personas += 1

            # Si el modelo entrenado detecta clases NO-Hardhat o NO-Safety Vest
            if clase_nombre in ("NO-Hardhat", "NO-Safety Vest", "NO-Mask"):
                infraccion = True

            x1, y1, x2, y2 = box.xyxy[0].tolist()
            detecciones.append({
                "clase": clase_nombre,
                "confianza": round(confianza, 3),
                "caja": [round(x1), round(y1), round(x2), round(y2)],
            })

    return {
        "detecciones": detecciones,
        "infraccion": infraccion,
        "personas_detectadas": personas,
    }