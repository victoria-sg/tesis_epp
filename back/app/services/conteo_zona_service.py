from fastapi import HTTPException, status
from sqlalchemy.orm import Session
from app.repositories import conteo_zona_repository
from app.schemas.conteo_zona import ConteoZonaCreate, ConteoZonaResponse


def get_all(db: Session, skip: int = 0, limit: int = 100) -> list[ConteoZonaResponse]:
    conteos = conteo_zona_repository.get_all(db, skip=skip, limit=limit)
    return [ConteoZonaResponse.model_validate(c) for c in conteos]


def get_by_id(db: Session, id_conteo: int) -> ConteoZonaResponse:
    conteo = conteo_zona_repository.get_by_id(db, id_conteo)
    if not conteo:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Conteo no encontrado"
        )
    return ConteoZonaResponse.model_validate(conteo)


def get_by_camara(db: Session, id_camara: int) -> list[ConteoZonaResponse]:
    conteos = conteo_zona_repository.get_by_camara(db, id_camara)
    return [ConteoZonaResponse.model_validate(c) for c in conteos]


def create(db: Session, data: ConteoZonaCreate) -> ConteoZonaResponse:
    from app.models.conteo_zona import ConteoZona

    conteo = ConteoZona(**data.model_dump())
    conteo = conteo_zona_repository.create(db, conteo)
    return ConteoZonaResponse.model_validate(conteo)


def delete(db: Session, id_conteo: int) -> None:
    conteo = conteo_zona_repository.get_by_id(db, id_conteo)
    if not conteo:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Conteo no encontrado"
        )
    conteo_zona_repository.delete(db, conteo)
