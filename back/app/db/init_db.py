from datetime import datetime
from sqlalchemy.orm import Session
from app.db.base import Base
from app.db.session import engine
from app.core.security import hash_password
from app.models import (
    Rol,
    TipoEPP,
    Zona,
    Camara,
    Usuario,
    SirenaArea,
    Permiso,
    PermisoRol,
    RequeridoZona,
    Alerta,
    ResolucionAlerta,
    HistorialSirena,
    ConteoZona,
)
from app.models.usuario import Usuario
from app.models.permiso import Permiso
from app.models.permiso_rol import PermisoRol
from app.models.tipo import TipoEPP
from app.models.zona import Zona
from app.models.camara import Camara
from app.models.sirena_area import SirenaArea
from app.models.alerta import Alerta
from app.models.resolucion_alerta import ResolucionAlerta
from app.models.historial_sirena import HistorialSirena
from app.models.conteo_zona import ConteoZona


def create_tables():
    Base.metadata.create_all(bind=engine)


def seed_data(db: Session):
    # ─── Roles ────────────────────────────────────────────────────────────────
    roles = [
        Rol(
            id_rol=1,
            nombre_rol="Administrador",
            descripcion="Administrador del sistema",
        ),
        Rol(
            id_rol=2,
            nombre_rol="Supervisor de Turno",
            descripcion="Supervisa operación en planta",
        ),
        Rol(
            id_rol=3,
            nombre_rol="Encargado SSO",
            descripcion="Encargado de Seguridad y Salud en el Trabajo",
        ),
    ]
    for r in roles:
        existing = db.query(Rol).filter(Rol.id_rol == r.id_rol).first()
        if not existing:
            db.add(r)
    db.commit()

    # ─── Permisos ─────────────────────────────────────────────────────────────
    permisos_data = [
        (1, "GESTIONAR_USUARIOS"),
        (2, "GESTIONAR_ZONAS"),
        (3, "GESTIONAR_CAMARAS"),
        (4, "GESTIONAR_ALERTAS"),
        (5, "VER_DASHBOARD"),
        (6, "EXPORTAR_REPORTES"),
        (7, "JUSTIFICAR_ALERTA"),
        (8, "VER_ZONAS"),
    ]
    permisos = []
    for pid, desc in permisos_data:
        existing = db.query(Permiso).filter(Permiso.id_permiso == pid).first()
        if not existing:
            p = Permiso(id_permiso=pid, descripcion=desc)
            db.add(p)
            permisos.append(p)
        else:
            permisos.append(existing)
    db.commit()

    # ─── PermisoRol: Admin tiene todos ────────────────────────────────────────
    admin_permisos = [1, 2, 3, 4, 5, 6, 7, 8]
    for pid in admin_permisos:
        existing = (
            db.query(PermisoRol)
            .filter(PermisoRol.id_rol == 1, PermisoRol.id_permiso == pid)
            .first()
        )
        if not existing:
            db.add(PermisoRol(id_rol=1, id_permiso=pid))

    # Supervisor
    supervisor_permisos = [4, 5, 7, 8]
    for pid in supervisor_permisos:
        existing = (
            db.query(PermisoRol)
            .filter(PermisoRol.id_rol == 2, PermisoRol.id_permiso == pid)
            .first()
        )
        if not existing:
            db.add(PermisoRol(id_rol=2, id_permiso=pid))

    # SSO
    sso_permisos = [5, 6, 8]
    for pid in sso_permisos:
        existing = (
            db.query(PermisoRol)
            .filter(PermisoRol.id_rol == 3, PermisoRol.id_permiso == pid)
            .first()
        )
        if not existing:
            db.add(PermisoRol(id_rol=3, id_permiso=pid))
    db.commit()

    # ─── Usuario Admin ───────────────────────────────────────────────────────
    admin_exists = db.query(Usuario).filter(Usuario.correo == "admin@epp.com").first()
    if not admin_exists:
        db.add(
            Usuario(
                id_rol=1,
                nombre="Admin",
                apelido="Sistema",
                correo="admin@epp.com",
                contrasena=hash_password("admin123"),
                fecha_creacion=datetime.utcnow(),
            )
        )
        db.commit()

    # ─── Zonas demo ───────────────────────────────────────────────────────────
    zonas_data = [
        (1, "Zona A - Fundición", "Alto", 50, 30),
        (2, "Zona B - Trituración", "Medio", 80, 60),
        (3, "Zona C - Almacén", "Bajo", 120, 90),
    ]
    for zid, nombre, riesgo, capacidad, tolerancia in zonas_data:
        existing = db.query(Zona).filter(Zona.id_zona == zid).first()
        if not existing:
            db.add(
                Zona(
                    id_zona=zid,
                    nombre_zona=nombre,
                    nivel_riesgo=riesgo,
                    capacidad_max=capacidad,
                    tiempo_toleracia_segundo=tolerancia,
                )
            )
    db.commit()

    # ─── Cámaras demo ─────────────────────────────────────────────────────────
    camaras_data = [
        (1, 1, "CAM-A01", "192.168.1.10", "conectado"),
        (2, 1, "CAM-A02", "192.168.1.11", "conectado"),
        (3, 2, "CAM-B01", "192.168.2.10", "desconectado"),
        (4, 3, "CAM-C01", "192.168.3.10", "conectado"),
    ]
    for cid, zid, codigo, ip, estado in camaras_data:
        existing = db.query(Camara).filter(Camara.id_camara == cid).first()
        if not existing:
            db.add(
                Camara(
                    id_camara=cid,
                    id_zona=zid,
                    codigo_camara=codigo,
                    ip_direccion=ip,
                    estado_conexion=estado,
                    ultima_conexion=datetime.utcnow(),
                )
            )
    db.commit()

    # ─── Sirenas demo ─────────────────────────────────────────────────────────
    sirenas_data = [
        (1, 1, "SIR-A01", "192.168.10.1", "activo"),
        (2, 2, "SIR-B01", "192.168.10.2", "activo"),
        (3, 3, "SIR-C01", "192.168.10.3", "inactivo"),
    ]
    for sid, zid, codigo, ip, estado in sirenas_data:
        existing = db.query(SirenaArea).filter(SirenaArea.id_sirena == sid).first()
        if not existing:
            db.add(
                SirenaArea(
                    id_sirena=sid,
                    id_zona=zid,
                    codigo_sirena=codigo,
                    ip_direccion=ip,
                    estado_dispositivo=estado,
                )
            )
    db.commit()

    # ─── Tipos EPP demo ───────────────────────────────────────────────────────
    tipos_epp_data = [
        (1, 1, "Casco de seguridad", "Protección craneal"),
        (2, 1, "Lentes de protección", "Protección ocular"),
        (3, 2, "Guantes industriales", "Protección de manos"),
        (4, 2, "Botas con punta de acero", "Protección de pies"),
        (5, 3, "Chaleco reflectante", "Visibilidad y protección"),
    ]
    for tid, rid, nombre, desc in tipos_epp_data:
        existing = db.query(TipoEPP).filter(TipoEPP.id_tipo_epp == tid).first()
        if not existing:
            db.add(
                TipoEPP(
                    id_tipo_epp=tid, id_rol=rid, nombre_epp=nombre, descripcion=desc
                )
            )
    db.commit()


def init_db():
    create_tables()
    from app.db.session import SessionLocal

    db = SessionLocal()
    try:
        seed_data(db)
    finally:
        db.close()
