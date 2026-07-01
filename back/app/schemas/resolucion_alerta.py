from pydantic import BaseModel
from pydantic.config import ConfigDict
from datetime import datetime, time


class ResolucionAlertaBase(BaseModel):
    id_alerta: int
    id_usuario: int
    comentario: str | None = None


class ResolucionAlertaCreate(ResolucionAlertaBase):
    pass


class ResolucionAlertaResponse(ResolucionAlertaBase):
    id_resolucion: int
    fecha_hora_resolucion: datetime | None = None
    tiempo_resolucion: time | None = None

    model_config = ConfigDict(from_attributes=True)


class ResolverAlertaRequest(BaseModel):
    """Recibido desde el módulo de reportes para marcar una alerta como resuelta."""
    comentario: str