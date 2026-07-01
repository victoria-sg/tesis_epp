from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    ENV: str = "development"
    DATABASE_URL: str
    SECRET_KEY: str
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    REFRESH_TOKEN_EXPIRE_DAYS: int = 7

    # ─── Recuperación de contraseña ───────────────────────────────────────
    FRONTEND_URL: str = "http://localhost:5173"
    RESET_TOKEN_EXPIRE_MINUTES: int = 30

    # ─── SMTP (envío de correos) ───────────────────────────────────────────
    SMTP_HOST: str = "smtp.gmail.com"
    SMTP_PORT: int = 587
    SMTP_USER: str = ""
    SMTP_PASSWORD: str = ""
    SMTP_FROM: str = ""

    # ─── Video Streaming ───────────────────────────────────────────────
    HIKVISION_USER: str = "admin"
    HIKVISION_PASS: str = ""
    RTSP_PORT: int = 554

    # ─── Redis / Celery ────────────────────────────────────────────────
    REDIS_URL: str = "redis://redis:6379/0"

    # ─── Procesamiento IA ──────────────────────────────────────────────
    MODEL_PATH: str = "./models/yolov8_epp.pt"
    PROCESSING_DELAY_MINUTES: int = 2
    DETECTION_CONFIDENCE: float = 0.5

    # ─── ngrok ────────────────────────────────────────────────────────
    NGROK_AUTHTOKEN: str = ""

    # ─── Límites del sistema ───────────────────────────────────────────
    MAX_STREAMS: int = 20
    STREAM_FPS: int = 15
    JPEG_QUALITY: int = 60
    
    class Config:
        env_file = ".env"


settings = Settings()
