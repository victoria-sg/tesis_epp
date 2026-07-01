from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from app.core.dependencies import get_db, get_current_user
from app.models.usuario import Usuario
from app.schemas.camara import CamaraCreate, CamaraUpdate, CamaraResponse
from app.services import camara_service

router = APIRouter(prefix="/camaras", tags=["Cámaras"])


@router.get("/", response_model=list[CamaraResponse])
def list_camaras(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=500),
    id_zona: int | None = Query(None),
    db: Session = Depends(get_db),
    _: Usuario = Depends(get_current_user),
):
    if id_zona:
        return camara_service.get_by_zona(db, id_zona)
    return camara_service.get_all(db, skip=skip, limit=limit)


@router.get("/{id_camara}", response_model=CamaraResponse)
def get_camara(
    id_camara: int,
    db: Session = Depends(get_db),
    _: Usuario = Depends(get_current_user),
):
    return camara_service.get_by_id(db, id_camara)


@router.post("/", response_model=CamaraResponse, status_code=status.HTTP_201_CREATED)
def create_camara(
    data: CamaraCreate,
    db: Session = Depends(get_db),
    _: Usuario = Depends(get_current_user),
):
    return camara_service.create(db, data)


@router.put("/{id_camara}", response_model=CamaraResponse)
def update_camara(
    id_camara: int,
    data: CamaraUpdate,
    db: Session = Depends(get_db),
    _: Usuario = Depends(get_current_user),
):
    return camara_service.update(db, id_camara, data)


@router.delete("/{id_camara}", status_code=status.HTTP_204_NO_CONTENT)
def delete_camara(
    id_camara: int,
    db: Session = Depends(get_db),
    _: Usuario = Depends(get_current_user),
):
    camara_service.delete(db, id_camara)
