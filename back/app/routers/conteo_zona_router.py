from fastapi import APIRouter, Depends, status, Query
from sqlalchemy.orm import Session
from app.core.dependencies import get_db, get_current_user
from app.models.usuario import Usuario
from app.schemas.conteo_zona import ConteoZonaCreate, ConteoZonaResponse
from app.services import conteo_zona_service

router = APIRouter(prefix="/conteos", tags=["Conteo de Zona"])


@router.get("/", response_model=list[ConteoZonaResponse])
def list_conteos(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=500),
    id_camara: int | None = Query(None),
    db: Session = Depends(get_db),
    _: Usuario = Depends(get_current_user),
):
    if id_camara:
        return conteo_zona_service.get_by_camara(db, id_camara)
    return conteo_zona_service.get_all(db, skip=skip, limit=limit)


@router.get("/{id_conteo}", response_model=ConteoZonaResponse)
def get_conteo(
    id_conteo: int,
    db: Session = Depends(get_db),
    _: Usuario = Depends(get_current_user),
):
    return conteo_zona_service.get_by_id(db, id_conteo)


@router.post(
    "/", response_model=ConteoZonaResponse, status_code=status.HTTP_201_CREATED
)
def create_conteo(
    data: ConteoZonaCreate,
    db: Session = Depends(get_db),
    _: Usuario = Depends(get_current_user),
):
    return conteo_zona_service.create(db, data)


@router.delete("/{id_conteo}", status_code=status.HTTP_204_NO_CONTENT)
def delete_conteo(
    id_conteo: int,
    db: Session = Depends(get_db),
    _: Usuario = Depends(get_current_user),
):
    conteo_zona_service.delete(db, id_conteo)
