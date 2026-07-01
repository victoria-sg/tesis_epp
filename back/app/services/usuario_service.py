import logging
from datetime import datetime
from fastapi import HTTPException, status
from sqlalchemy.orm import Session
from app.models.usuario import Usuario
from app.repositories import rol_repository, usuario_repository
from app.schemas.usuario import UsuarioCreate, UsuarioUpdate, UsuarioResponse
from app.core.security import hash_password, generar_password_inicial
from app.core.mail import EnvioCorreoError, enviar_correo_bienvenida

logger = logging.getLogger(__name__)

NOMBRE_ROL_ADMINISTRADOR = "administrador"


def _validar_rol_permitido(db: Session, id_rol: int) -> None:
    """Impide asignar el rol de Administrador y rechaza ids de rol inexistentes."""
    rol = rol_repository.get_by_id(db, id_rol)
    if not rol:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="El rol seleccionado no existe",
        )
    if rol.nombre_rol.strip().lower() == NOMBRE_ROL_ADMINISTRADOR:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="No está permitido asignar el rol de Administrador a otro usuario",
        )


def get_all(db: Session, skip: int = 0, limit: int = 100) -> list[UsuarioResponse]:
    usuarios = usuario_repository.get_all(db, skip=skip, limit=limit)
    return [UsuarioResponse.model_validate(u) for u in usuarios]


def get_by_id(db: Session, id_usuario: int) -> UsuarioResponse:
    usuario = usuario_repository.get_by_id(db, id_usuario)
    if not usuario:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Usuario no encontrado"
        )
    return UsuarioResponse.model_validate(usuario)


def create(db: Session, data: UsuarioCreate) -> UsuarioResponse:
    existing = usuario_repository.get_by_correo(db, data.correo)
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="El correo ya está registrado",
        )
    _validar_rol_permitido(db, data.id_rol)

    # Generar contraseña automática: cédula + inicial nombre + inicial apellido + @
    password_plano = generar_password_inicial(data.cedula, data.nombre, data.apelido)

    usuario = Usuario(
        id_rol=data.id_rol,
        nombre=data.nombre,
        apelido=data.apelido,
        correo=data.correo,
        cedula=data.cedula,
        contrasena=hash_password(password_plano),
        fecha_creacion=datetime.utcnow(),
    )
    usuario = usuario_repository.create(db, usuario)

    # Enviar correo de bienvenida con las credenciales
    try:
        enviar_correo_bienvenida(data.correo, data.nombre, password_plano)
    except EnvioCorreoError as exc:
        logger.warning("No se pudo enviar el correo de bienvenida: %s", exc)

    return UsuarioResponse.model_validate(usuario)


def update(db: Session, id_usuario: int, data: UsuarioUpdate) -> UsuarioResponse:
    usuario = usuario_repository.get_by_id(db, id_usuario)
    if not usuario:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Usuario no encontrado"
        )

    cambios = data.model_dump(exclude_unset=True)

    if "id_rol" in cambios:
        _validar_rol_permitido(db, cambios["id_rol"])

    if "contrasena" in cambios:
        cambios["contrasena"] = hash_password(cambios["contrasena"])

    usuario = usuario_repository.update(db, usuario, cambios)
    return UsuarioResponse.model_validate(usuario)


def delete(db: Session, id_usuario: int) -> None:
    usuario = usuario_repository.get_by_id(db, id_usuario)
    if not usuario:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Usuario no encontrado"
        )
    usuario_repository.delete(db, usuario)