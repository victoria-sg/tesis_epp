from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.core.dependencies import get_db
from app.core.mail import EnvioCorreoError
from app.schemas.auth import (
    LoginRequest,
    LoginResponse,
    RefreshRequest,
    RefreshResponse,
    SolicitarRecuperacionRequest,
    RestablecerPasswordRequest,
    MensajeResponse,
)
from app.services.auth_service import (
    login as auth_login,
    refresh_token as auth_refresh,
    solicitar_recuperacion as auth_solicitar_recuperacion,
    restablecer_password as auth_restablecer_password,
)

router = APIRouter(prefix="/auth", tags=["Autenticación"])


@router.post("/login", response_model=LoginResponse)
def login(payload: LoginRequest, db: Session = Depends(get_db)):
    result = auth_login(db, payload.correo, payload.contrasena)
    if not result:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Credenciales inválidas",
        )
    access_token, refresh_token, usuario_data = result
    return LoginResponse(
        access_token=access_token,
        refresh_token=refresh_token,
        usuario=usuario_data,
    )


@router.post("/refresh", response_model=RefreshResponse)
def refresh(payload: RefreshRequest, db: Session = Depends(get_db)):
    new_access = auth_refresh(db, payload.refresh_token)
    if not new_access:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Refresh token inválido o expirado",
        )
    return RefreshResponse(access_token=new_access)


@router.post("/solicitar-recuperacion", response_model=MensajeResponse)
def solicitar_recuperacion(
    payload: SolicitarRecuperacionRequest, db: Session = Depends(get_db)
):
    try:
        existe = auth_solicitar_recuperacion(db, payload.correo)
    except EnvioCorreoError:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="No se pudo enviar el correo. Intenta de nuevo más tarde.",
        )

    if not existe:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No existe ninguna cuenta registrada con ese correo",
        )

    return MensajeResponse(mensaje="Te enviamos un enlace de recuperación a tu correo")


@router.post("/restablecer-password", response_model=MensajeResponse)
def restablecer_password(
    payload: RestablecerPasswordRequest, db: Session = Depends(get_db)
):
    ok = auth_restablecer_password(db, payload.token, payload.nueva_contrasena)
    if not ok:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="El enlace de recuperación es inválido o ha expirado",
        )
    return MensajeResponse(mensaje="Tu contraseña ha sido actualizada correctamente")