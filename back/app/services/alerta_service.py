from fastapi import HTTPException, status
from sqlalchemy.orm import Session, joinedload
from datetime import datetime
from app.models.alerta import Alerta
from app.models.camara import Camara
from app.models.resolucion_alerta import ResolucionAlerta
from app.repositories import alerta_repository
from app.schemas.alerta import (
    AlertaCreate,
    AlertaUpdate,
    AlertaResponse,
    AlertaReporteResponse,
    AlertaCapturaRequest,
)


def _to_response(alerta: Alerta) -> AlertaResponse:
    return AlertaResponse.model_validate(alerta)


def get_all(db: Session, skip: int = 0, limit: int = 100) -> list[AlertaResponse]:
    alertas = alerta_repository.get_all(db, skip=skip, limit=limit)
    return [_to_response(a) for a in alertas]


def get_reporte(
    db: Session, skip: int = 0, limit: int = 500
) -> list[AlertaReporteResponse]:
    alertas = (
        db.query(Alerta)
        .options(
            joinedload(Alerta.camara).joinedload(Camara.zona),
            joinedload(Alerta.resolucion).joinedload(ResolucionAlerta.usuario),
        )
        .order_by(Alerta.fecha_hora_deteccion.desc())
        .offset(skip)
        .limit(limit)
        .all()
    )

    filas: list[AlertaReporteResponse] = []
    for a in alertas:
        resolucion = a.resolucion
        usuario_resolutor = resolucion.usuario if resolucion else None
        filas.append(
            AlertaReporteResponse(
                id_alerta=a.id_alerta,
                fecha_hora_deteccion=a.fecha_hora_deteccion,
                segundos_transcurridos=a.segundos_transcurridos,
                estado_alerta=a.estado_alerta,
                codigo_camara=a.camara.codigo_camara if a.camara else "—",
                nombre_zona=(
                    a.camara.zona.nombre_zona
                    if a.camara and a.camara.zona
                    else "—"
                ),
                captura_frame=a.captura_frame,
                comentario_resolucion=resolucion.comentario if resolucion else None,
                fecha_hora_resolucion=(
                    resolucion.fecha_hora_resolucion if resolucion else None
                ),
                resuelto_por=(
                    f"{usuario_resolutor.nombre} {usuario_resolutor.apelido}"
                    if usuario_resolutor
                    else None
                ),
            )
        )
    return filas


def crear_desde_captura(
    db: Session, data: AlertaCapturaRequest
) -> AlertaResponse:
    alerta = Alerta(
        id_camara=data.id_camara,
        fecha_hora_deteccion=datetime.utcnow(),
        segundos_transcurridos=0,
        estado_alerta="Pendiente",
        captura_frame=data.frame_base64,
    )
    alerta = alerta_repository.create(db, alerta)
    return _to_response(alerta)


def get_by_id(db: Session, id_alerta: int) -> AlertaResponse:
    alerta = alerta_repository.get_by_id(db, id_alerta)
    if not alerta:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Alerta no encontrada"
        )
    return _to_response(alerta)


def get_by_camara(db: Session, id_camara: int) -> list[AlertaResponse]:
    alertas = alerta_repository.get_by_camara(db, id_camara)
    return [_to_response(a) for a in alertas]


def create(db: Session, data: AlertaCreate) -> AlertaResponse:
    alerta = Alerta(**data.model_dump())
    alerta = alerta_repository.create(db, alerta)
    return _to_response(alerta)


def update(db: Session, id_alerta: int, data: AlertaUpdate) -> AlertaResponse:
    alerta = alerta_repository.get_by_id(db, id_alerta)
    if not alerta:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Alerta no encontrada"
        )
    update_data = data.model_dump(exclude_unset=True)
    alerta = alerta_repository.update(db, alerta, update_data)
    return _to_response(alerta)


def delete(db: Session, id_alerta: int) -> None:
    alerta = alerta_repository.get_by_id(db, id_alerta)
    if not alerta:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Alerta no encontrada"
        )
    alerta_repository.delete(db, alerta)