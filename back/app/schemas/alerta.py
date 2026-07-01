from pydantic import BaseModel
from pydantic.config import ConfigDict
from datetime import datetime


class AlertaBase(BaseModel):
    id_camara: int
    fecha_hora_deteccion: datetime | None = None
    segundos_transcurridos: int | None = None
    estado_alerta: str | None = None
    captura_frame: str | None = None


class AlertaCreate(AlertaBase):
    pass


class AlertaUpdate(BaseModel):
    estado_alerta: str | None = None
    segundos_transcurridos: int | None = None


class AlertaResponse(AlertaBase):
    id_alerta: int

    model_config = ConfigDict(from_attributes=True)


class AlertaReporteResponse(BaseModel):
    id_alerta: int
    fecha_hora_deteccion: datetime | None = None
    segundos_transcurridos: int | None = None
    estado_alerta: str | None = None
    codigo_camara: str
    nombre_zona: str
    captura_frame: str | None = None
    comentario_resolucion: str | None = None
    fecha_hora_resolucion: datetime | None = None
    resuelto_por: str | None = None


class AlertaCapturaRequest(BaseModel):
    id_camara: int
    frame_base64: str
    descripcion: str | None = None