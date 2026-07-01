from pydantic import BaseModel
from pydantic.config import ConfigDict


class TipoEppBase(BaseModel):
    id_rol: int | None = None
    nombre_epp: str
    descripcion: str | None = None


class TipoEppCreate(TipoEppBase):
    pass


class TipoEppUpdate(BaseModel):
    nombre_epp: str | None = None
    descripcion: str | None = None


class TipoEppResponse(TipoEppBase):
    id_tipo_epp: int

    model_config = ConfigDict(from_attributes=True)
