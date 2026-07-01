import logging
from datetime import datetime, timedelta
from sqlalchemy.orm import Session
from app.core.config import settings
from app.core.mail import EnvioCorreoError, enviar_correo_recuperacion
from app.repositories import recuperacion_password_repository as recuperacion_repo
from app.repositories.usuario_repository import get_by_correo, get_by_id
from app.repositories.permiso_repository import get_permisos_by_rol
from app.core.security import (
    verify_password,
    hash_password,
    create_access_token,
    create_refresh_token,
    decode_token,
    generar_token_recuperacion,
    hash_token,
)

logger = logging.getLogger(__name__)


def login(db: Session, correo: str, contrasena: str) -> tuple | None:
    user = get_by_correo(db, correo)
    if not user:
        return None

    if not verify_password(contrasena, user.contrasena):
        return None

    permisos = get_permisos_by_rol(db, user.id_rol)

    access_payload = {
        "sub": str(user.id_usuario),
        "rol": user.id_rol,
        "permisos": permisos,
    }
    access_token = create_access_token(access_payload)
    refresh_token = create_refresh_token({"sub": str(user.id_usuario)})

    usuario_data = {
        "id_usuario": user.id_usuario,
        "nombre": user.nombre,
        "apelido": user.apelido,
        "correo": user.correo,
        "rol": user.rol_nombre,
        "permisos": permisos,
    }

    return access_token, refresh_token, usuario_data


def refresh_token(db: Session, refresh_token_str: str) -> str | None:
    payload = decode_token(refresh_token_str)
    if not payload or payload.get("type") != "refresh":
        return None

    user_id = int(payload["sub"])

    user = get_by_id(db, user_id)
    if not user:
        return None

    permisos = get_permisos_by_rol(db, user.id_rol)

    access_payload = {
        "sub": str(user.id_usuario),
        "rol": user.id_rol,
        "permisos": permisos,
    }
    return create_access_token(access_payload)


def solicitar_recuperacion(db: Session, correo: str) -> bool:
    """Genera y envía un token de recuperación si el correo existe.

    Devuelve True si el correo existe y se envió el enlace, False si no
    existe ninguna cuenta con ese correo (el router usa esto para avisar
    al usuario si escribió mal su correo).
    """
    user = get_by_correo(db, correo)
    if not user:
        return False

    recuperacion_repo.invalidar_anteriores(db, user.id_usuario)

    token_plano, token_hash = generar_token_recuperacion()
    expiracion = datetime.utcnow() + timedelta(
        minutes=settings.RESET_TOKEN_EXPIRE_MINUTES
    )
    recuperacion_repo.create(db, user.id_usuario, token_hash, expiracion)

    try:
        enviar_correo_recuperacion(user.correo, token_plano)
    except EnvioCorreoError as exc:
        logger.warning("No se pudo enviar el correo de recuperación: %s", exc)
        raise

    return True


def restablecer_password(db: Session, token: str, nueva_contrasena: str) -> bool:
    """Valida el token de recuperación y actualiza la contraseña.

    Devuelve False si el token no existe, ya fue usado o expiró.
    """
    registro = recuperacion_repo.get_by_token_hash(db, hash_token(token))
    if not registro or registro.usado or registro.fecha_expiracion < datetime.utcnow():
        return False

    user = get_by_id(db, registro.id_usuario)
    if not user:
        return False

    user.contrasena = hash_password(nueva_contrasena)
    db.commit()
    recuperacion_repo.marcar_usado(db, registro)
    return True