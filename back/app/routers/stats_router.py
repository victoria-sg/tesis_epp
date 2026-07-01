from fastapi import APIRouter, Depends, Query as QueryParam
from sqlalchemy.orm import Session
from app.core.dependencies import get_db, get_current_user
from app.models.usuario import Usuario
from app.models.alerta import Alerta
from app.models.camara import Camara
from app.models.zona import Zona
from datetime import datetime, date, timedelta

router = APIRouter(prefix="/stats", tags=["Estadísticas"])


@router.get("/dashboard")
def dashboard_stats(
    rango: str = QueryParam("7d", description="Rango: 1d, 7d, 30d"),
    db: Session = Depends(get_db),
    _: Usuario = Depends(get_current_user),
):
    hoy = date.today()

    # Determinar días según rango
    if rango == "1d":
        dias = 1
    elif rango == "30d":
        dias = 30
    else:
        dias = 7

    fecha_inicio = hoy - timedelta(days=dias - 1)

    # Alertas por día según rango
    alertas_por_dia = []
    for i in range(dias):
        dia = fecha_inicio + timedelta(days=i)
        inicio = datetime(dia.year, dia.month, dia.day)
        fin = inicio + timedelta(days=1)
        count = db.query(Alerta).filter(
            Alerta.fecha_hora_deteccion >= inicio,
            Alerta.fecha_hora_deteccion < fin,
        ).count()
        alertas_por_dia.append({
            "dia": dia.strftime("%d/%m"),
            "alertas": count,
        })

    # Alertas por hora (últimas 8 horas — para supervisor)
    alertas_por_hora = []
    for i in range(8):
        hora_inicio = datetime.now().replace(minute=0, second=0, microsecond=0) - timedelta(hours=7 - i)
        hora_fin = hora_inicio + timedelta(hours=1)
        count = db.query(Alerta).filter(
            Alerta.fecha_hora_deteccion >= hora_inicio,
            Alerta.fecha_hora_deteccion < hora_fin,
        ).count()
        alertas_por_hora.append({
            "hora": hora_inicio.strftime("%H:00"),
            "alertas": count,
        })

    # Alertas por zona
    zonas = db.query(Zona).all()
    alertas_por_zona = []
    for zona in zonas:
        ids_camaras = [
            c.id_camara
            for c in db.query(Camara).filter(Camara.id_zona == zona.id_zona).all()
        ]
        count = (
            db.query(Alerta).filter(Alerta.id_camara.in_(ids_camaras)).count()
            if ids_camaras else 0
        )
        alertas_por_zona.append({
            "zona": zona.nombre_zona,
            "alertas": count,
            "nivel_riesgo": (zona.nivel_riesgo or "bajo").lower(),
        })

    # Resumen general
    total_alertas = db.query(Alerta).count()
    pendientes = db.query(Alerta).filter(Alerta.estado_alerta == "Pendiente").count()
    resueltas = db.query(Alerta).filter(Alerta.estado_alerta == "Resuelta").count()

    inicio_mes = datetime(hoy.year, hoy.month, 1)
    alertas_mes = db.query(Alerta).filter(Alerta.fecha_hora_deteccion >= inicio_mes).count()

    inicio_semana = hoy - timedelta(days=hoy.weekday())
    inicio_semana_anterior = inicio_semana - timedelta(days=7)
    alertas_semana_actual = db.query(Alerta).filter(
        Alerta.fecha_hora_deteccion >= datetime(inicio_semana.year, inicio_semana.month, inicio_semana.day)
    ).count()
    alertas_semana_anterior = db.query(Alerta).filter(
        Alerta.fecha_hora_deteccion >= datetime(inicio_semana_anterior.year, inicio_semana_anterior.month, inicio_semana_anterior.day),
        Alerta.fecha_hora_deteccion < datetime(inicio_semana.year, inicio_semana.month, inicio_semana.day),
    ).count()

    total_camaras = db.query(Camara).count()
    camaras_activas = db.query(Camara).filter(Camara.estado_conexion == "activo").count()

    ultimas_alertas = db.query(Alerta).order_by(Alerta.fecha_hora_deteccion.desc()).limit(5).all()

    return {
        "alertas_por_dia": alertas_por_dia,
        "alertas_por_hora": alertas_por_hora,
        "alertas_por_zona": alertas_por_zona,
        "resumen": {
            "total": total_alertas,
            "pendientes": pendientes,
            "resueltas": resueltas,
            "mes_actual": alertas_mes,
            "semana_actual": alertas_semana_actual,
            "semana_anterior": alertas_semana_anterior,
        },
        "camaras": {
            "total": total_camaras,
            "activas": camaras_activas,
        },
        "ultimas_alertas": [
            {
                "id": a.id_alerta,
                "camara": a.id_camara,
                "estado": a.estado_alerta,
                "fecha": a.fecha_hora_deteccion.isoformat() if a.fecha_hora_deteccion else None,
            }
            for a in ultimas_alertas
        ],
    }