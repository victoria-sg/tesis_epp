from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.db.init_db import init_db

# ─── Routers ─────────────────────────────────────────────────────────────────
from app.routers.auth_router import router as auth_router
from app.routers.usuario_router import router as usuario_router
from app.routers.rol_router import router as rol_router
from app.routers.zona_router import router as zona_router
from app.routers.camara_router import router as camara_router
from app.routers.alerta_router import router as alerta_router
from app.routers.sirena_area_router import router as sirena_area_router
from app.routers.tipo_router import router as tipo_router
from app.routers.resolucion_alerta_router import router as resolucion_alerta_router
from app.routers.conteo_zona_router import router as conteo_zona_router
from app.routers.stream_router import router as stream_router
from app.routers.system_router import router as system_router
from app.routers.deteccion_router import router as deteccion_router
from app.routers.stats_router import router as stats_router

app = FastAPI(
    title="EPP Monitor API",
    description="Sistema de Monitoreo de Equipos de Protección Personal",
    version="1.0.0",
)

# ─── CORS ─────────────────────────────────────────────────────────────────────
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ─── Routers ─────────────────────────────────────────────────────────────────
app.include_router(auth_router)
app.include_router(usuario_router)
app.include_router(rol_router)
app.include_router(zona_router)
app.include_router(camara_router)
app.include_router(alerta_router)
app.include_router(sirena_area_router)
app.include_router(tipo_router)
app.include_router(resolucion_alerta_router)
app.include_router(conteo_zona_router)
app.include_router(stream_router)
app.include_router(system_router)
app.include_router(deteccion_router)
app.include_router(stats_router)


# ─── Inicialización de base de datos ──────────────────────────────────────────
@app.on_event("startup")
def startup_event():
    init_db()


@app.get("/")
def root():
    return {"message": "EPP Monitor API", "status": "running"}


@app.get("/health")
def health_check():
    return {"status": "healthy"}