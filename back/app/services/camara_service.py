from fastapi import HTTPException, status
from sqlalchemy.orm import Session, joinedload
from app.models.camara import Camara
from app.repositories import camara_repository
from app.schemas.camara import CamaraCreate, CamaraUpdate, CamaraResponse
from datetime import datetime


def _to_response(camara: Camara) -> CamaraResponse:
    """Convierte un objeto Camara a CamaraResponse incluyendo zona_nombre."""
    data = CamaraResponse.model_validate(camara)
    data.zona_nombre = camara.zona.nombre_zona if camara.zona else None
    return data


def _get_all_con_zona(db: Session, skip: int = 0, limit: int = 100) -> list[Camara]:
    """Carga las cámaras con su zona en una sola consulta (evita N+1)."""
    return (
        db.query(Camara)
        .options(joinedload(Camara.zona))
        .offset(skip)
        .limit(limit)
        .all()
    )


def _get_by_id_con_zona(db: Session, id_camara: int) -> Camara | None:
    return (
        db.query(Camara)
        .options(joinedload(Camara.zona))
        .filter(Camara.id_camara == id_camara)
        .first()
    )


def get_all(db: Session, skip: int = 0, limit: int = 100) -> list[CamaraResponse]:
    camaras = _get_all_con_zona(db, skip=skip, limit=limit)
    return [_to_response(c) for c in camaras]


def get_by_id(db: Session, id_camara: int) -> CamaraResponse:
    camara = _get_by_id_con_zona(db, id_camara)
    if not camara:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Cámara no encontrada"
        )
    return _to_response(camara)


def get_by_zona(db: Session, id_zona: int) -> list[CamaraResponse]:
    camaras = camara_repository.get_by_zona(db, id_zona)
    return [_to_response(c) for c in camaras]


def create(db: Session, data: CamaraCreate) -> CamaraResponse:
    camara = Camara(**data.model_dump(), ultima_conexion=datetime.utcnow())
    camara = camara_repository.create(db, camara)
    camara = _get_by_id_con_zona(db, camara.id_camara)
    return _to_response(camara)


def update(db: Session, id_camara: int, data: CamaraUpdate) -> CamaraResponse:
    camara = camara_repository.get_by_id(db, id_camara)
    if not camara:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Cámara no encontrada"
        )
    update_data = data.model_dump(exclude_unset=True)
    camara_repository.update(db, camara, update_data)
    camara = _get_by_id_con_zona(db, id_camara)
    return _to_response(camara)


def delete(db: Session, id_camara: int) -> None:
    from app.models.alerta import Alerta

    camara = camara_repository.get_by_id(db, id_camara)
    if not camara:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Cámara no encontrada"
        )

    # Eliminar alertas y sus resoluciones asociadas antes de eliminar la cámara
    alertas = db.query(Alerta).filter(Alerta.id_camara == id_camara).all()
    for alerta in alertas:
        if alerta.resolucion:
            db.delete(alerta.resolucion)
        db.delete(alerta)
    db.flush()

    camara_repository.delete(db, camara)