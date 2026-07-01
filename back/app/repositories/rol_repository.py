from sqlalchemy.orm import Session
from app.models.rol import Rol


def get_by_id(db: Session, id_rol: int) -> Rol | None:
    return db.query(Rol).filter(Rol.id_rol == id_rol).first()


def get_all(db: Session, skip: int = 0, limit: int = 100) -> list[Rol]:
    return db.query(Rol).offset(skip).limit(limit).all()


def create(db: Session, rol: Rol) -> Rol:
    db.add(rol)
    db.commit()
    db.refresh(rol)
    return rol


def update(db: Session, rol: Rol, data: dict) -> Rol:
    for key, value in data.items():
        setattr(rol, key, value)
    db.commit()
    db.refresh(rol)
    return rol


def delete(db: Session, rol: Rol) -> None:
    db.delete(rol)
    db.commit()
