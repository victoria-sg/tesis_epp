from sqlalchemy.orm import Session
from app.models.permiso import Permiso
from app.models.permiso_rol import PermisoRol


def get_permisos_by_rol(db: Session, id_rol: int) -> list[str]:
    resultados = (
        db.query(Permiso.descripcion)
        .join(PermisoRol, PermisoRol.id_permiso == Permiso.id_permiso)
        .filter(PermisoRol.id_rol == id_rol)
        .all()
    )
    return [r[0] for r in resultados]


def get_by_id(db: Session, id_permiso: int) -> Permiso | None:
    return db.query(Permiso).filter(Permiso.id_permiso == id_permiso).first()


def get_all(db: Session, skip: int = 0, limit: int = 100) -> list[Permiso]:
    return db.query(Permiso).offset(skip).limit(limit).all()


def create(db: Session, permiso: Permiso) -> Permiso:
    db.add(permiso)
    db.commit()
    db.refresh(permiso)
    return permiso


def delete(db: Session, permiso: Permiso) -> None:
    db.delete(permiso)
    db.commit()
