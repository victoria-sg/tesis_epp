from pydantic import BaseModel
from pydantic.config import ConfigDict
from datetime import datetime


class CamaraBase(BaseModel):
    id_zona: int
    codigo_camara: str
    tipo_fuente: str = "hikvision"
    ip_direccion: str | None = None
    estado_conexion: str | None = None


class CamaraCreate(CamaraBase):
    pass


class CamaraUpdate(BaseModel):
    id_zona: int | None = None
    codigo_camara: str | None = None
    tipo_fuente: str | None = None
    ip_direccion: str | None = None
    estado_conexion: str | None = None


class CamaraResponse(CamaraBase):
    id_camara: int
    zona_nombre: str | None = None
    ultima_conexion: datetime | None = None

    model_config = ConfigDict(from_attributes=True)