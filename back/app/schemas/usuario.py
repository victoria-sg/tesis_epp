import re
from pydantic import BaseModel, EmailStr, field_validator
from pydantic.config import ConfigDict
from datetime import datetime


_CEDULA_REGEX = re.compile(r"^\d{10}$")


class UsuarioBase(BaseModel):
    nombre: str
    apelido: str
    correo: EmailStr
    id_rol: int
    cedula: str

    @field_validator("cedula")
    @classmethod
    def validar_cedula(cls, v: str) -> str:
        if not _CEDULA_REGEX.match(v):
            raise ValueError("La cédula debe tener exactamente 10 dígitos numéricos")
        return v


class UsuarioCreate(UsuarioBase):
    pass


class UsuarioUpdate(BaseModel):
    nombre: str | None = None
    apelido: str | None = None
    correo: EmailStr | None = None
    id_rol: int | None = None
    cedula: str | None = None

    @field_validator("cedula")
    @classmethod
    def validar_cedula(cls, v: str | None) -> str | None:
        if v is not None and v != "" and not _CEDULA_REGEX.match(v):
            raise ValueError("La cédula debe tener exactamente 10 dígitos numéricos")
        return v if v else None


class UsuarioResponse(BaseModel):
    id_usuario: int
    id_rol: int
    rol_nombre: str
    nombre: str
    apelido: str
    correo: str
    cedula: str | None = None
    fecha_creacion: datetime | None = None

    model_config = ConfigDict(from_attributes=True)