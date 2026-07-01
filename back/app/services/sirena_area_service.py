from fastapi import HTTPException, status
from sqlalchemy.orm import Session
from app.repositories import sirena_area_repository
from app.schemas.sirena_area import (
    SirenaAreaCreate,
    SirenaAreaUpdate,
    SirenaAreaResponse,
)


def get_all(db: Session, skip: int = 0, limit: int = 100) -> list[SirenaAreaResponse]:
    sirenas = sirena_area_repository.get_all(db, skip=skip, limit=limit)
    return [SirenaAreaResponse.model_validate(s) for s in sirenas]


def get_by_id(db: Session, id_sirena: int) -> SirenaAreaResponse:
    sirena = sirena_area_repository.get_by_id(db, id_sirena)
    if not sirena:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Sirena no encontrada"
        )
    return SirenaAreaResponse.model_validate(sirena)


def get_by_zona(db: Session, id_zona: int) -> list[SirenaAreaResponse]:
    sirenas = sirena_area_repository.get_by_zona(db, id_zona)
    return [SirenaAreaResponse.model_validate(s) for s in sirenas]


def create(db: Session, data: SirenaAreaCreate) -> SirenaAreaResponse:
    from app.models.sirena_area import SirenaArea

    sirena = SirenaArea(**data.model_dump())
    sirena = sirena_area_repository.create(db, sirena)
    return SirenaAreaResponse.model_validate(sirena)


def update(db: Session, id_sirena: int, data: SirenaAreaUpdate) -> SirenaAreaResponse:
    sirena = sirena_area_repository.get_by_id(db, id_sirena)
    if not sirena:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Sirena no encontrada"
        )
    update_data = data.model_dump(exclude_unset=True)
    sirena = sirena_area_repository.update(db, sirena, update_data)
    return SirenaAreaResponse.model_validate(sirena)


def delete(db: Session, id_sirena: int) -> None:
    sirena = sirena_area_repository.get_by_id(db, id_sirena)
    if not sirena:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Sirena no encontrada"
        )
    sirena_area_repository.delete(db, sirena)
