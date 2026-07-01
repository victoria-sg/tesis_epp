from fastapi import APIRouter, Depends, status, Query
from sqlalchemy.orm import Session
from app.core.dependencies import get_db, get_current_user, require_permission
from app.models.usuario import Usuario
from app.models.alerta import Alerta
from app.schemas.alerta import (
    AlertaCreate,
    AlertaUpdate,
    AlertaResponse,
    AlertaReporteResponse,
    AlertaCapturaRequest,
)
from app.services import alerta_service
from datetime import datetime, date

router = APIRouter(prefix="/alertas", tags=["Alertas"])


@router.get("/", response_model=list[AlertaResponse])
def list_alertas(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=500),
    db: Session = Depends(get_db),
    _: Usuario = Depends(get_current_user),
):
    return alerta_service.get_all(db, skip=skip, limit=limit)


@router.get("/stats")
def stats_alertas(
    db: Session = Depends(get_db),
    _: Usuario = Depends(get_current_user),
):
    """Estadísticas básicas accesibles para todos los roles."""
    hoy = date.today()
    alertas_hoy = (
        db.query(Alerta)
        .filter(Alerta.fecha_hora_deteccion >= datetime(hoy.year, hoy.month, hoy.day))
        .count()
    )
    pendientes = (
        db.query(Alerta)
        .filter(Alerta.estado_alerta == "Pendiente")
        .count()
    )
    return {"alertas_hoy": alertas_hoy, "pendientes": pendientes}


@router.get("/reporte", response_model=list[AlertaReporteResponse])
def reporte_alertas(
    skip: int = Query(0, ge=0),
    limit: int = Query(500, ge=1, le=2000),
    db: Session = Depends(get_db),
    _: Usuario = Depends(require_permission("EXPORTAR_REPORTES")),
):
    return alerta_service.get_reporte(db, skip=skip, limit=limit)


@router.post("/captura", response_model=AlertaResponse, status_code=status.HTTP_201_CREATED)
def capturar_incidencia(
    data: AlertaCapturaRequest,
    db: Session = Depends(get_db),
    _: Usuario = Depends(get_current_user),
):
    return alerta_service.crear_desde_captura(db, data)


@router.get("/{id_alerta}", response_model=AlertaResponse)
def get_alerta(
    id_alerta: int,
    db: Session = Depends(get_db),
    _: Usuario = Depends(get_current_user),
):
    return alerta_service.get_by_id(db, id_alerta)


@router.post("/", response_model=AlertaResponse, status_code=status.HTTP_201_CREATED)
def create_alerta(
    data: AlertaCreate,
    db: Session = Depends(get_db),
    _: Usuario = Depends(get_current_user),
):
    return alerta_service.create(db, data)


@router.put("/{id_alerta}", response_model=AlertaResponse)
def update_alerta(
    id_alerta: int,
    data: AlertaUpdate,
    db: Session = Depends(get_db),
    _: Usuario = Depends(get_current_user),
):
    return alerta_service.update(db, id_alerta, data)


@router.delete("/{id_alerta}", status_code=status.HTTP_204_NO_CONTENT)
def delete_alerta(
    id_alerta: int,
    db: Session = Depends(get_db),
    _: Usuario = Depends(get_current_user),
):
    alerta_service.delete(db, id_alerta)