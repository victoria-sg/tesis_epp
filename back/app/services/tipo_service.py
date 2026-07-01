from fastapi import HTTPException, status
from sqlalchemy.orm import Session
from app.repositories import tipo_repository
from app.schemas.tipo import TipoEppCreate, TipoEppUpdate, TipoEppResponse


def get_all(db: Session, skip: int = 0, limit: int = 100) -> list[TipoEppResponse]:
    tipos = tipo_repository.get_all(db, skip=skip, limit=limit)
    return [TipoEppResponse.model_validate(t) for t in tipos]


def get_by_id(db: Session, id_tipo_epp: int) -> TipoEppResponse:
    tipo = tipo_repository.get_by_id(db, id_tipo_epp)
    if not tipo:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Tipo EPP no encontrado"
        )
    return TipoEppResponse.model_validate(tipo)


def create(db: Session, data: TipoEppCreate) -> TipoEppResponse:
    from app.models.tipo import TipoEPP

    tipo = TipoEPP(**data.model_dump())
    tipo = tipo_repository.create(db, tipo)
    return TipoEppResponse.model_validate(tipo)


def update(db: Session, id_tipo_epp: int, data: TipoEppUpdate) -> TipoEppResponse:
    tipo = tipo_repository.get_by_id(db, id_tipo_epp)
    if not tipo:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Tipo EPP no encontrado"
        )
    update_data = data.model_dump(exclude_unset=True)
    tipo = tipo_repository.update(db, tipo, update_data)
    return TipoEppResponse.model_validate(tipo)


def delete(db: Session, id_tipo_epp: int) -> None:
    tipo = tipo_repository.get_by_id(db, id_tipo_epp)
    if not tipo:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Tipo EPP no encontrado"
        )
    tipo_repository.delete(db, tipo)
