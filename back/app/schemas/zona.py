from pydantic import BaseModel
from pydantic.config import ConfigDict


class ZonaBase(BaseModel):
    nombre_zona: str
    nivel_riesgo: str | None = None
    capacidad_max: int | None = None
    tiempo_toleracia_segundo: int | None = None


class ZonaCreate(ZonaBase):
    pass


class ZonaUpdate(BaseModel):
    nombre_zona: str | None = None
    nivel_riesgo: str | None = None
    capacidad_max: int | None = None
    tiempo_toleracia_segundo: int | None = None


class ZonaResponse(ZonaBase):
    id_zona: int

    model_config = ConfigDict(from_attributes=True)
