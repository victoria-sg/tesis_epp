from fastapi import APIRouter, Depends, status, Query
from sqlalchemy.orm import Session
from app.core.dependencies import get_db, get_current_user, require_permission
from app.models.usuario import Usuario
from app.schemas.resolucion_alerta import (
    ResolucionAlertaCreate,
    ResolucionAlertaResponse,
    ResolverAlertaRequest,
)
from app.services import resolucion_alerta_service

router = APIRouter(prefix="/resoluciones", tags=["Resolución de Alertas"])


@router.get("/", response_model=list[ResolucionAlertaResponse])
def list_resoluciones(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=500),
    db: Session = Depends(get_db),
    _: Usuario = Depends(get_current_user),
):
    return resolucion_alerta_service.get_all(db, skip=skip, limit=limit)


@router.get("/{id_resolucion}", response_model=ResolucionAlertaResponse)
def get_resolucion(
    id_resolucion: int,
    db: Session = Depends(get_db),
    _: Usuario = Depends(get_current_user),
):
    return resolucion_alerta_service.get_by_id(db, id_resolucion)


@router.post(
    "/alertas/{id_alerta}/resolver",
    response_model=ResolucionAlertaResponse,
    status_code=status.HTTP_201_CREATED,
)
def resolver_alerta(
    id_alerta: int,
    data: ResolverAlertaRequest,
    db: Session = Depends(get_db),
    usuario: Usuario = Depends(require_permission("JUSTIFICAR_ALERTA")),
):
    return resolucion_alerta_service.resolver_alerta(
        db, id_alerta, usuario.id_usuario, data
    )


@router.post(
    "/", response_model=ResolucionAlertaResponse, status_code=status.HTTP_201_CREATED
)
def create_resolucion(
    data: ResolucionAlertaCreate,
    db: Session = Depends(get_db),
    _: Usuario = Depends(get_current_user),
):
    return resolucion_alerta_service.create(db, data)


@router.delete("/{id_resolucion}", status_code=status.HTTP_204_NO_CONTENT)
def delete_resolucion(
    id_resolucion: int,
    db: Session = Depends(get_db),
    _: Usuario = Depends(get_current_user),
):
    resolucion_alerta_service.delete(db, id_resolucion)