from fastapi import APIRouter, Depends, status, Query
from sqlalchemy.orm import Session
from app.core.dependencies import get_db, get_current_user, require_permission
from app.models.usuario import Usuario
from app.schemas.rol import (
    RolCreate,
    RolUpdate,
    RolResponse,
    RolConPermisosResponse,
    RolPermisosUpdate,
)
from app.services import rol_service

router = APIRouter(prefix="/roles", tags=["Roles"])


@router.get("/", response_model=list[RolResponse])
def list_roles(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=500),
    db: Session = Depends(get_db),
    _: Usuario = Depends(get_current_user),
):
    return rol_service.get_all(db, skip=skip, limit=limit)


@router.get("/{id_rol}", response_model=RolResponse)
def get_rol(
    id_rol: int,
    db: Session = Depends(get_db),
    _: Usuario = Depends(get_current_user),
):
    return rol_service.get_by_id(db, id_rol)


@router.get("/{id_rol}/permisos", response_model=RolConPermisosResponse)
def get_rol_con_permisos(
    id_rol: int,
    db: Session = Depends(get_db),
    _: Usuario = Depends(require_permission("GESTIONAR_USUARIOS")),
):
    return rol_service.get_con_permisos(db, id_rol)


@router.put("/{id_rol}/permisos", response_model=RolConPermisosResponse)
def actualizar_permisos_rol(
    id_rol: int,
    data: RolPermisosUpdate,
    db: Session = Depends(get_db),
    _: Usuario = Depends(require_permission("GESTIONAR_USUARIOS")),
):
    return rol_service.actualizar_permisos(db, id_rol, data.permisos)


@router.post("/", response_model=RolResponse, status_code=status.HTTP_201_CREATED)
def create_rol(
    data: RolCreate,
    db: Session = Depends(get_db),
    _: Usuario = Depends(get_current_user),
):
    return rol_service.create(db, data)


@router.put("/{id_rol}", response_model=RolResponse)
def update_rol(
    id_rol: int,
    data: RolUpdate,
    db: Session = Depends(get_db),
    _: Usuario = Depends(get_current_user),
):
    return rol_service.update(db, id_rol, data)


@router.delete("/{id_rol}", status_code=status.HTTP_204_NO_CONTENT)
def delete_rol(
    id_rol: int,
    db: Session = Depends(get_db),
    _: Usuario = Depends(get_current_user),
):
    rol_service.delete(db, id_rol)