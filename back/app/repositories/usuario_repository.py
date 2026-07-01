from sqlalchemy.orm import Session
from app.models.usuario import Usuario


def get_by_id(db: Session, user_id: int) -> Usuario | None:
    return db.query(Usuario).filter(Usuario.id_usuario == user_id).first()


def get_by_correo(db: Session, correo: str) -> Usuario | None:
    return db.query(Usuario).filter(Usuario.correo == correo).first()


def create(db: Session, usuario: Usuario) -> Usuario:
    db.add(usuario)
    db.commit()
    db.refresh(usuario)
    return usuario


def update(db: Session, usuario: Usuario, data: dict) -> Usuario:
    for key, value in data.items():
        setattr(usuario, key, value)
    db.commit()
    db.refresh(usuario)
    return usuario


def delete(db: Session, usuario: Usuario) -> None:
    db.delete(usuario)
    db.commit()


def get_all(db: Session, skip: int = 0, limit: int = 100) -> list[Usuario]:
    return db.query(Usuario).offset(skip).limit(limit).all()
