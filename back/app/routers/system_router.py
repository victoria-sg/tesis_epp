import json
import logging
import urllib.request
from fastapi import APIRouter
from app.core.config import settings

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/system", tags=["System"])


@router.get("/public-url")
def get_public_url():
    try:
        req = urllib.request.Request(
            "http://ngrok:4040/api/tunnels",
            headers={"Accept": "application/json"},
        )
        with urllib.request.urlopen(req, timeout=3) as resp:
            data = json.loads(resp.read())
            for tunnel in data.get("tunnels", []):
                public_url = tunnel.get("public_url", "")
                if public_url.startswith("https"):
                    return {"public_url": public_url, "source": "ngrok"}
    except Exception as e:
        logger.warning(f"No se pudo obtener URL de ngrok: {e}")

    return {"public_url": settings.FRONTEND_URL, "source": "config"}