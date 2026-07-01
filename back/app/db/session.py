from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.core.config import settings
from app.models import *  # noqa: F401,F403 — ensures all models are registered with Base

if settings.ENV == "production":
    engine = create_engine(settings.DATABASE_URL)
else:
    engine = create_engine(
        settings.DATABASE_URL,
        connect_args={"check_same_thread": False},
    )

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
