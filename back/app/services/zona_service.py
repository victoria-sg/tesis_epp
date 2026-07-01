from fastapi import HTTPException, status
from sqlalchemy.orm import Session
from app.repositories import zona_repository
from app.schemas.zona import ZonaCreate, ZonaUpdate, ZonaResponse


def get_all(db: Session, skip: int = 0, limit: int = 100) -> list[ZonaResponse]:
    zonas = zona_repository.get_all(db, skip=skip, limit=limit)
    return [ZonaResponse.model_validate(z) for z in zonas]


def get_by_id(db: Session, id_zona: int) -> ZonaResponse:
    zona = zona_repository.get_by_id(db, id_zona)
    if not zona:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Zona no encontrada"
        )
    return ZonaResponse.model_validate(zona)


def create(db: Session, data: ZonaCreate) -> ZonaResponse:
    from app.models.zona import Zona

    zona = Zona(**data.model_dump())
    zona = zona_repository.create(db, zona)
    return ZonaResponse.model_validate(zona)


def update(db: Session, id_zona: int, data: ZonaUpdate) -> ZonaResponse:
    zona = zona_repository.get_by_id(db, id_zona)
    if not zona:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Zona no encontrada"
        )
    update_data = data.model_dump(exclude_unset=True)
    zona = zona_repository.update(db, zona, update_data)
    return ZonaResponse.model_validate(zona)


def delete(db: Session, id_zona: int) -> None:
    zona = zona_repository.get_by_id(db, id_zona)
    if not zona:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Zona no encontrada"
        )
    zona_repository.delete(db, zona)
