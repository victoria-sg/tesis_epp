from pydantic import BaseModel
from pydantic.config import ConfigDict


class RolBase(BaseModel):
    nombre_rol: str
    descripcion: str | None = None


class RolCreate(RolBase):
    pass


class RolUpdate(BaseModel):
    nombre_rol: str | None = None
    descripcion: str | None = None


class RolResponse(RolBase):
    id_rol: int

    model_config = ConfigDict(from_attributes=True)


class RolConPermisosResponse(RolBase):
    id_rol: int
    permisos: list[int] = []

    model_config = ConfigDict(from_attributes=True)


class RolPermisosUpdate(BaseModel):
    permisos: list[int]