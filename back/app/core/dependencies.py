from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session
from app.db.session import SessionLocal
from app.core.security import decode_token
from app.repositories.usuario_repository import get_by_id as usuario_get_by_id
from app.repositories.permiso_repository import get_permisos_by_rol
from app.models.usuario import Usuario

bearer_scheme = HTTPBearer()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(bearer_scheme),
    db: Session = Depends(get_db),
) -> Usuario:
    payload = decode_token(credentials.credentials)
    if not payload or payload.get("type") != "access":
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token inválido",
        )
    user = usuario_get_by_id(db, int(payload["sub"]))
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Usuario no encontrado",
        )
    return user


def require_permission(permiso_codigo: str):
    """Dependencia factory: exige que el usuario autenticado tenga el
    permiso indicado (según EPP_P_PERMISO_ROL), no solo un token válido.

    Antes de esto, cualquier usuario autenticado (sin importar su rol)
    podía crear, editar o eliminar usuarios — incluyendo asignarse a sí
    mismo el rol de Administrador.
    """

    def dependency(
        user: Usuario = Depends(get_current_user),
        db: Session = Depends(get_db),
    ) -> Usuario:
        permisos = get_permisos_by_rol(db, user.id_rol)
        if permiso_codigo not in permisos:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="No tienes permisos para realizar esta acción",
            )
        return user

    return dependency
