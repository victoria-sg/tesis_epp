from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from app.core.dependencies import get_db, get_current_user, require_permission
from app.models.usuario import Usuario
from app.schemas.usuario import UsuarioCreate, UsuarioUpdate, UsuarioResponse
from app.services import usuario_service

router = APIRouter(prefix="/usuarios", tags=["Usuarios"])

GESTIONAR_USUARIOS = "GESTIONAR_USUARIOS"


@router.get("/", response_model=list[UsuarioResponse])
def list_usuarios(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=500),
    db: Session = Depends(get_db),
    _: Usuario = Depends(get_current_user),
):
    return usuario_service.get_all(db, skip=skip, limit=limit)


@router.get("/{id_usuario}", response_model=UsuarioResponse)
def get_usuario(
    id_usuario: int,
    db: Session = Depends(get_db),
    _: Usuario = Depends(get_current_user),
):
    return usuario_service.get_by_id(db, id_usuario)


@router.post("/", response_model=UsuarioResponse, status_code=status.HTTP_201_CREATED)
def create_usuario(
    data: UsuarioCreate,
    db: Session = Depends(get_db),
    _: Usuario = Depends(require_permission(GESTIONAR_USUARIOS)),
):
    return usuario_service.create(db, data)


@router.put("/{id_usuario}", response_model=UsuarioResponse)
def update_usuario(
    id_usuario: int,
    data: UsuarioUpdate,
    db: Session = Depends(get_db),
    _: Usuario = Depends(require_permission(GESTIONAR_USUARIOS)),
):
    return usuario_service.update(db, id_usuario, data)


@router.delete("/{id_usuario}", status_code=status.HTTP_204_NO_CONTENT)
def delete_usuario(
    id_usuario: int,
    db: Session = Depends(get_db),
    _: Usuario = Depends(require_permission(GESTIONAR_USUARIOS)),
):
    usuario_service.delete(db, id_usuario)
