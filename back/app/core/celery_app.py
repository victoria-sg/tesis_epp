from celery import Celery
from app.core.config import settings

celery_app = Celery(
    "epp_tasks",
    broker=settings.REDIS_URL,
    backend=settings.REDIS_URL,
)

celery_app.conf.update(
    task_serializer="json",
    accept_content=["json"],
    result_serializer="json",
    timezone="America/Guayaquil",
    enable_utc=True,
    task_max_retries=3,
    task_default_retry_delay=30,
    imports=["app.tasks.process_tasks"],
)