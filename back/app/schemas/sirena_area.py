from pydantic import BaseModel
from pydantic.config import ConfigDict


class SirenaAreaBase(BaseModel):
    id_zona: int
    codigo_sirena: str
    ip_direccion: str | None = None
    estado_dispositivo: str | None = None


class SirenaAreaCreate(SirenaAreaBase):
    pass


class SirenaAreaUpdate(BaseModel):
    codigo_sirena: str | None = None
    ip_direccion: str | None = None
    estado_dispositivo: str | None = None


class SirenaAreaResponse(SirenaAreaBase):
    id_sirena: int

    model_config = ConfigDict(from_attributes=True)
