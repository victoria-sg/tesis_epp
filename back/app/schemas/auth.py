from pydantic import BaseModel, EmailStr, Field, field_validator
from pydantic.config import ConfigDict
from app.core.security import MENSAJE_PASSWORD_DEBIL, es_password_segura


class LoginRequest(BaseModel):
    correo: EmailStr
    contrasena: str

    model_config = ConfigDict(
        json_schema_extra={
            "example": {
                "correo": "admin@epp.com",
                "contrasena": "admin123",
            }
        }
    )


class RefreshRequest(BaseModel):
    refresh_token: str


class UsuarioEnToken(BaseModel):
    id_usuario: int
    nombre: str
    apelido: str
    correo: str
    rol: str
    permisos: list[str]

    model_config = ConfigDict(from_attributes=True)


class LoginResponse(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"
    usuario: UsuarioEnToken


class RefreshResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"


class SolicitarRecuperacionRequest(BaseModel):
    correo: EmailStr


class RestablecerPasswordRequest(BaseModel):
    token: str
    nueva_contrasena: str

    @field_validator("nueva_contrasena")
    @classmethod
    def validar_password_segura(cls, v: str) -> str:
        if not es_password_segura(v):
            raise ValueError(MENSAJE_PASSWORD_DEBIL)
        return v


class MensajeResponse(BaseModel):
    mensaje: str
