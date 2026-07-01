from fastapi import HTTPException, status
from sqlalchemy.orm import Session
from datetime import datetime
from app.models.resolucion_alerta import ResolucionAlerta
from app.models.alerta import Alerta
from app.repositories import resolucion_alerta_repository
from app.schemas.resolucion_alerta import (
    ResolucionAlertaCreate,
    ResolucionAlertaResponse,
    ResolverAlertaRequest,
)


def get_all(
    db: Session, skip: int = 0, limit: int = 100
) -> list[ResolucionAlertaResponse]:
    resoluciones = resolucion_alerta_repository.get_all(db, skip=skip, limit=limit)
    return [ResolucionAlertaResponse.model_validate(r) for r in resoluciones]


def get_by_id(db: Session, id_resolucion: int) -> ResolucionAlertaResponse:
    resolucion = resolucion_alerta_repository.get_by_id(db, id_resolucion)
    if not resolucion:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Resolución no encontrada"
        )
    return ResolucionAlertaResponse.model_validate(resolucion)


def get_by_alerta(db: Session, id_alerta: int) -> list[ResolucionAlertaResponse]:
    resoluciones = resolucion_alerta_repository.get_by_alerta(db, id_alerta)
    return [ResolucionAlertaResponse.model_validate(r) for r in resoluciones]


def resolver_alerta(
    db: Session,
    id_alerta: int,
    id_usuario: int,
    data: ResolverAlertaRequest,
) -> ResolucionAlertaResponse:
    """Marca una alerta como Resuelta y crea la resolución con el comentario."""
    alerta = db.query(Alerta).filter(Alerta.id_alerta == id_alerta).first()
    if not alerta:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Alerta no encontrada",
        )
    if alerta.estado_alerta == "Resuelta":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="La alerta ya fue resuelta",
        )

    # Crear la resolución
    resolucion = ResolucionAlerta(
        id_alerta=id_alerta,
        id_usuario=id_usuario,
        comentario=data.comentario,
        fecha_hora_resolucion=datetime.utcnow(),
    )
    db.add(resolucion)

    # Actualizar estado de la alerta
    alerta.estado_alerta = "Resuelta"
    db.commit()
    db.refresh(resolucion)

    return ResolucionAlertaResponse.model_validate(resolucion)


def create(db: Session, data: ResolucionAlertaCreate) -> ResolucionAlertaResponse:
    resolucion = ResolucionAlerta(
        id_alerta=data.id_alerta,
        id_usuario=data.id_usuario,
        comentario=data.comentario,
        fecha_hora_resolucion=datetime.utcnow(),
    )
    resolucion = resolucion_alerta_repository.create(db, resolucion)
    return ResolucionAlertaResponse.model_validate(resolucion)


def delete(db: Session, id_resolucion: int) -> None:
    resolucion = resolucion_alerta_repository.get_by_id(db, id_resolucion)
    if not resolucion:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Resolución no encontrada"
        )
    resolucion_alerta_repository.delete(db, resolucion)