from fastapi import APIRouter, Depends, status, Query
from sqlalchemy.orm import Session
from app.core.dependencies import get_db, get_current_user
from app.models.usuario import Usuario
from app.schemas.sirena_area import (
    SirenaAreaCreate,
    SirenaAreaUpdate,
    SirenaAreaResponse,
)
from app.services import sirena_area_service

router = APIRouter(prefix="/sirenas", tags=["Sirenas"])


@router.get("/", response_model=list[SirenaAreaResponse])
def list_sirenas(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=500),
    id_zona: int | None = Query(None),
    db: Session = Depends(get_db),
    _: Usuario = Depends(get_current_user),
):
    if id_zona:
        return sirena_area_service.get_by_zona(db, id_zona)
    return sirena_area_service.get_all(db, skip=skip, limit=limit)


@router.get("/{id_sirena}", response_model=SirenaAreaResponse)
def get_sirena(
    id_sirena: int,
    db: Session = Depends(get_db),
    _: Usuario = Depends(get_current_user),
):
    return sirena_area_service.get_by_id(db, id_sirena)


@router.post(
    "/", response_model=SirenaAreaResponse, status_code=status.HTTP_201_CREATED
)
def create_sirena(
    data: SirenaAreaCreate,
    db: Session = Depends(get_db),
    _: Usuario = Depends(get_current_user),
):
    return sirena_area_service.create(db, data)


@router.put("/{id_sirena}", response_model=SirenaAreaResponse)
def update_sirena(
    id_sirena: int,
    data: SirenaAreaUpdate,
    db: Session = Depends(get_db),
    _: Usuario = Depends(get_current_user),
):
    return sirena_area_service.update(db, id_sirena, data)


@router.delete("/{id_sirena}", status_code=status.HTTP_204_NO_CONTENT)
def delete_sirena(
    id_sirena: int,
    db: Session = Depends(get_db),
    _: Usuario = Depends(get_current_user),
):
    sirena_area_service.delete(db, id_sirena)
