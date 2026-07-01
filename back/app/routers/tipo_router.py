from fastapi import APIRouter, Depends, status, Query
from sqlalchemy.orm import Session
from app.core.dependencies import get_db, get_current_user
from app.models.usuario import Usuario
from app.schemas.tipo import TipoEppCreate, TipoEppUpdate, TipoEppResponse
from app.services import tipo_service

router = APIRouter(prefix="/tipos-epp", tags=["Tipos de EPP"])


@router.get("/", response_model=list[TipoEppResponse])
def list_tipos(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=500),
    db: Session = Depends(get_db),
    _: Usuario = Depends(get_current_user),
):
    return tipo_service.get_all(db, skip=skip, limit=limit)


@router.get("/{id_tipo_epp}", response_model=TipoEppResponse)
def get_tipo(
    id_tipo_epp: int,
    db: Session = Depends(get_db),
    _: Usuario = Depends(get_current_user),
):
    return tipo_service.get_by_id(db, id_tipo_epp)


@router.post("/", response_model=TipoEppResponse, status_code=status.HTTP_201_CREATED)
def create_tipo(
    data: TipoEppCreate,
    db: Session = Depends(get_db),
    _: Usuario = Depends(get_current_user),
):
    return tipo_service.create(db, data)


@router.put("/{id_tipo_epp}", response_model=TipoEppResponse)
def update_tipo(
    id_tipo_epp: int,
    data: TipoEppUpdate,
    db: Session = Depends(get_db),
    _: Usuario = Depends(get_current_user),
):
    return tipo_service.update(db, id_tipo_epp, data)


@router.delete("/{id_tipo_epp}", status_code=status.HTTP_204_NO_CONTENT)
def delete_tipo(
    id_tipo_epp: int,
    db: Session = Depends(get_db),
    _: Usuario = Depends(get_current_user),
):
    tipo_service.delete(db, id_tipo_epp)
