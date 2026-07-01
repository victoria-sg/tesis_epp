from datetime import datetime
from sqlalchemy.orm import Session
from app.models.recuperacion_password import RecuperacionPassword


def create(
    db: Session, id_usuario: int, token_hash: str, fecha_expiracion: datetime
) -> RecuperacionPassword:
    registro = RecuperacionPassword(
        id_usuario=id_usuario,
        token_hash=token_hash,
        fecha_expiracion=fecha_expiracion,
        usado=False,
        fecha_creacion=datetime.utcnow(),
    )
    db.add(registro)
    db.commit()
    db.refresh(registro)
    return registro


def get_by_token_hash(db: Session, token_hash: str) -> RecuperacionPassword | None:
    return (
        db.query(RecuperacionPassword)
        .filter(RecuperacionPassword.token_hash == token_hash)
        .first()
    )


def marcar_usado(db: Session, registro: RecuperacionPassword) -> None:
    registro.usado = True
    db.commit()


def invalidar_anteriores(db: Session, id_usuario: int) -> None:
    """Invalida cualquier token previo no usado de este usuario, para que
    solo el último solicitado sea válido."""
    db.query(RecuperacionPassword).filter(
        RecuperacionPassword.id_usuario == id_usuario,
        RecuperacionPassword.usado.is_(False),
    ).update({"usado": True})
    db.commit()
