from pydantic import BaseModel
from pydantic.config import ConfigDict


class PermisoBase(BaseModel):
    descripcion: str | None = None


class PermisoCreate(PermisoBase):
    pass


class PermisoResponse(PermisoBase):
    id_permiso: int

    model_config = ConfigDict(from_attributes=True)
