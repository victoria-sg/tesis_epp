from fastapi import APIRouter, Depends, status, Query
from sqlalchemy.orm import Session
from app.core.dependencies import get_db, get_current_user
from app.models.usuario import Usuario
from app.schemas.zona import ZonaCreate, ZonaUpdate, ZonaResponse
from app.services import zona_service

router = APIRouter(prefix="/zonas", tags=["Zonas"])


@router.get("/", response_model=list[ZonaResponse])
def list_zonas(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=500),
    db: Session = Depends(get_db),
    _: Usuario = Depends(get_current_user),
):
    return zona_service.get_all(db, skip=skip, limit=limit)


@router.get("/{id_zona}", response_model=ZonaResponse)
def get_zona(
    id_zona: int,
    db: Session = Depends(get_db),
    _: Usuario = Depends(get_current_user),
):
    return zona_service.get_by_id(db, id_zona)


@router.post("/", response_model=ZonaResponse, status_code=status.HTTP_201_CREATED)
def create_zona(
    data: ZonaCreate,
    db: Session = Depends(get_db),
    _: Usuario = Depends(get_current_user),
):
    return zona_service.create(db, data)


@router.put("/{id_zona}", response_model=ZonaResponse)
def update_zona(
    id_zona: int,
    data: ZonaUpdate,
    db: Session = Depends(get_db),
    _: Usuario = Depends(get_current_user),
):
    return zona_service.update(db, id_zona, data)


@router.delete("/{id_zona}", status_code=status.HTTP_204_NO_CONTENT)
def delete_zona(
    id_zona: int,
    db: Session = Depends(get_db),
    _: Usuario = Depends(get_current_user),
):
    zona_service.delete(db, id_zona)
