from fastapi import APIRouter, Depends
from app.core.dependencies import get_current_user
from app.models.usuario import Usuario
from app.schemas.deteccion import DeteccionRequest, DeteccionResponse
from app.services import epp_detection_service

router = APIRouter(prefix="/deteccion", tags=["Detección EPP"])


@router.post("/analizar", response_model=DeteccionResponse)
def analizar_frame(
    data: DeteccionRequest,
    _: Usuario = Depends(get_current_user),
):
    """Analiza un frame y devuelve las detecciones de EPP encontradas."""
    resultado = epp_detection_service.detectar_epp(
        data.frame_base64, data.confianza_minima
    )
    return resultado


@router.get("/ultima/{camara_id}")
def obtener_ultima_deteccion(
    camara_id: int,
    _: Usuario = Depends(get_current_user),
):
    """Devuelve la última detección guardada en Redis para esa cámara, si existe."""
    import json
    import redis as redis_lib
    from app.core.config import settings

    r = redis_lib.from_url(settings.REDIS_URL)
    key = f"deteccion:ultima:{camara_id}"
    data = r.get(key)

    if data is None:
        return {"disponible": False}

    resultado = json.loads(data)
    resultado["disponible"] = True
    return resultado