# 🏭 EPP Monitor — Backend API

API REST para el sistema de monitoreo de **Equipos de Protección Personal (EPP)** en una planta de reciclaje. Construida con FastAPI siguiendo una arquitectura por capas y principios SOLID.

---

## 📋 Tecnologías Utilizadas

| Tecnología            | Versión    | Propósito                              |
| --------------------- | ---------- | -------------------------------------- |
| **Python**            | >= 3.12    | Lenguaje de programación               |
| **FastAPI**           | >= 0.115.0 | Framework web asíncrono                |
| **Uvicorn**           | >= 0.30.0  | Servidor ASGI                          |
| **SQLAlchemy**        | >= 2.0.0   | ORM para base de datos                 |
| **Pydantic**          | >= 2.0.0   | Validación de datos (schemas)          |
| **Pydantic Settings** | >= 2.0.0   | Configuración por variables de entorno |
| **python-jose**       | >= 3.3.0   | JWT (JSON Web Tokens)                  |
| **Passlib**           | >= 1.7.4   | Hashing de contraseñas (bcrypt)        |
| **Alembic**           | >= 1.13.0  | Migraciones de base de datos           |
| **Aiosqlite**         | >= 0.20.0  | Driver SQLite asíncrono (desarrollo)   |
| **Psycopg2**          | >= 2.9.0   | Driver PostgreSQL (producción)         |

---

## 🗂️ Estructura del Proyecto

```
back/
├── .env                          # Variables de entorno
├── .env.example                  # Plantilla de variables
├── requirements.txt              # Dependencias Python
└── app/
    ├── main.py                   # Punto de entrada FastAPI + CORS + routers + startup
    ├── core/                     # Capa de configuración y seguridad
    │   ├── config.py             # Settings con pydantic-settings
    │   ├── security.py           # Hash/verify, JWT create/decode
    │   └── dependencies.py       # get_db, get_current_user
    ├── db/                       # Capa de base de datos
    │   ├── base.py               # DeclarativeBase
    │   ├── session.py            # Engine + SessionLocal (SQLite/PostgreSQL)
    │   └── init_db.py            # create_all() + seed data
    ├── models/                   # Modelos SQLAlchemy (13 tablas)
    │   ├── rol.py, tipo.py, zona.py, camara.py
    │   ├── usuario.py, sirena_area.py, permiso.py
    │   ├── permiso_rol.py, requerido_zona.py, alerta.py
    │   ├── resolucion_alerta.py, historial_sirena.py, conteo_zona.py
    ├── schemas/                  # Schemas Pydantic (11 dominios)
    │   ├── auth.py               # Login, Refresh, Token
    │   ├── usuario.py            # Usuario CRUD
    │   ├── rol.py                # Rol CRUD
    │   ├── zona.py               # Zona CRUD
    │   ├── camara.py             # Cámara CRUD
    │   ├── alerta.py             # Alerta CRUD
    │   ├── sirena_area.py        # Sirena CRUD
    │   ├── tipo.py               # Tipo de EPP CRUD
    │   ├── permiso.py            # Permiso CRUD
    │   ├── resolucion_alerta.py  # Resolución de alertas CRUD
    │   └── conteo_zona.py        # Conteo de zona CRUD
    ├── repositories/             # Acceso a datos (10 dominios)
    │   ├── usuario_repository.py
    │   ├── rol_repository.py
    │   ├── zona_repository.py
    │   ├── camara_repository.py
    │   ├── alerta_repository.py
    │   ├── sirena_area_repository.py
    │   ├── tipo_repository.py
    │   ├── permiso_repository.py
    │   ├── resolucion_alerta_repository.py
    │   └── conteo_zona_repository.py
    ├── services/                 # Lógica de negocio (10 dominios)
    │   ├── auth_service.py       # login(), refresh_token()
    │   ├── usuario_service.py
    │   ├── rol_service.py
    │   ├── zona_service.py
    │   ├── camara_service.py
    │   ├── alerta_service.py
    │   ├── sirena_area_service.py
    │   ├── tipo_service.py
    │   ├── resolucion_alerta_service.py
    │   └── conteo_zona_service.py
    └── routers/                  # Endpoints FastAPI (10 routers)
        ├── auth_router.py        # Autenticación
        ├── usuario_router.py     # Usuarios
        ├── rol_router.py         # Roles
        ├── zona_router.py        # Zonas
        ├── camara_router.py      # Cámaras
        ├── alerta_router.py      # Alertas
        ├── sirena_area_router.py # Sirenas
        ├── tipo_router.py        # Tipos de EPP
        ├── resolucion_alerta_router.py  # Resolución de alertas
        └── conteo_zona_router.py # Conteo de zona
```

---

## 🚀 Instalación

### Requisitos

- **Python** >= 3.12
- **pip** (gestor de paquetes)

### Pasos

```bash
# 1. Clonar el repositorio
git clone <repo-url>
cd back

# 2. Crear entorno virtual
python -m venv venv

# 3. Activar el entorno virtual
# Windows:
.\venv\Scripts\Activate.ps1
# macOS/Linux:
source venv/bin/activate

# 4. Instalar dependencias
pip install -r requirements.txt

# 5. Configurar variables de entorno
# Editar .env (ya incluido para desarrollo):
#   ENV=development
#   DATABASE_URL=sqlite:///./epp_dev.db
#   SECRET_KEY=devsecretkey123456789

# 6. Iniciar servidor
uvicorn app.main:app --reload --port 8000
```

La API estará disponible en `http://127.0.0.1:8000`.

### Documentación interactiva

Una vez iniciado el servidor:

- **Swagger UI**: http://127.0.0.1:8000/docs
- **ReDoc**: http://127.0.0.1:8000/redoc

---

## ⚙️ Configuración por Entorno

| Variable                      | Desarrollo               | Producción                                     |
| ----------------------------- | ------------------------ | ---------------------------------------------- |
| `ENV`                         | `development`            | `production`                                   |
| `DATABASE_URL`                | `sqlite:///./epp_dev.db` | `postgresql://user:pass@localhost:5432/epp_db` |
| `SECRET_KEY`                  | `devsecretkey...`        | Clave secreta real                             |
| `ALGORITHM`                   | `HS256`                  | `HS256`                                        |
| `ACCESS_TOKEN_EXPIRE_MINUTES` | `30`                     | `30`                                           |
| `REFRESH_TOKEN_EXPIRE_DAYS`   | `7`                      | `7`                                            |

---

## 🧠 Arquitectura por Capas

El backend sigue una **arquitectura monolítica por capas** con responsabilidad única:

```
Router (routers/)
  → Service (services/)       ← Lógica de negocio
    → Repository (repositories/)  ← Acceso a datos (SQL)
      → Model (models/)           ← Mapeo ORM
```

| Capa           | Carpeta         | Responsabilidad                           |
| -------------- | --------------- | ----------------------------------------- |
| **Router**     | `routers/`      | Define endpoints HTTP, delega a servicios |
| **Service**    | `services/`     | Lógica de negocio, orquesta repositorios  |
| **Repository** | `repositories/` | Queries SQLAlchemy puras                  |
| **Model**      | `models/`       | Clases ORM (1 por tabla)                  |
| **Schema**     | `schemas/`      | Validación Pydantic de entrada/salida     |
| **Core**       | `core/`         | Configuración, seguridad, dependencias    |

### Reglas

- Un **Router** nunca toca un **Repositorio** directamente
- Un **Service** nunca accede a la base de datos sin pasar por un **Repositorio**
- Un **Repositorio** nunca contiene lógica de negocio
- Los **Schemas** de request y response son independientes entre sí

---

## 🔐 Endpoints de Autenticación

### `POST /auth/login`

Inicia sesión y devuelve tokens JWT + datos del usuario.

**Request:**

```json
{
  "correo": "admin@epp.com",
  "contrasena": "admin123"
}
```

**Response 200:**

```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIs...",
  "refresh_token": "eyJhbGciOiJIUzI1NiIs...",
  "token_type": "bearer",
  "usuario": {
    "id_usuario": 1,
    "nombre": "Admin",
    "apelido": "Sistema",
    "correo": "admin@epp.com",
    "rol": "Administrador",
    "permisos": ["GESTIONAR_USUARIOS", "VER_ZONAS", ...]
  }
}
```

### `POST /auth/refresh`

Renueva el `access_token` usando un `refresh_token` válido.

**Request:**

```json
{
  "refresh_token": "eyJhbGciOiJIUzI1NiIs..."
}
```

**Response 200:**

```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIs...",
  "token_type": "bearer"
}
```

---

## 📋 Endpoints CRUD (protegidos)

Todos los endpoints listados requieren autenticación mediante `Bearer` token. Incluyen paginación básica con `skip` (default 0) y `limit` (default 100, max 500).

### Usuarios — `/usuarios`

| Método | Ruta             | Descripción            |
| ------ | ---------------- | ---------------------- |
| GET    | `/usuarios/`     | Listar usuarios        |
| GET    | `/usuarios/{id}` | Obtener usuario por ID |
| POST   | `/usuarios/`     | Crear usuario          |
| PUT    | `/usuarios/{id}` | Actualizar usuario     |
| DELETE | `/usuarios/{id}` | Eliminar usuario       |

### Roles — `/roles`

| Método | Ruta          | Descripción        |
| ------ | ------------- | ------------------ |
| GET    | `/roles/`     | Listar roles       |
| GET    | `/roles/{id}` | Obtener rol por ID |
| POST   | `/roles/`     | Crear rol          |
| PUT    | `/roles/{id}` | Actualizar rol     |
| DELETE | `/roles/{id}` | Eliminar rol       |

### Zonas — `/zonas`

| Método | Ruta          | Descripción         |
| ------ | ------------- | ------------------- |
| GET    | `/zonas/`     | Listar zonas        |
| GET    | `/zonas/{id}` | Obtener zona por ID |
| POST   | `/zonas/`     | Crear zona          |
| PUT    | `/zonas/{id}` | Actualizar zona     |
| DELETE | `/zonas/{id}` | Eliminar zona       |

### Cámaras — `/camaras`

| Método | Ruta            | Descripción                          |
| ------ | --------------- | ------------------------------------ |
| GET    | `/camaras/`     | Listar cámaras (filtro `?id_zona=N`) |
| GET    | `/camaras/{id}` | Obtener cámara por ID                |
| POST   | `/camaras/`     | Crear cámara                         |
| PUT    | `/camaras/{id}` | Actualizar cámara                    |
| DELETE | `/camaras/{id}` | Eliminar cámara                      |

### Alertas — `/alertas`

| Método | Ruta            | Descripción           |
| ------ | --------------- | --------------------- |
| GET    | `/alertas/`     | Listar alertas        |
| GET    | `/alertas/{id}` | Obtener alerta por ID |
| POST   | `/alertas/`     | Crear alerta          |
| PUT    | `/alertas/{id}` | Actualizar alerta     |
| DELETE | `/alertas/{id}` | Eliminar alerta       |

### Sirenas — `/sirenas`

| Método | Ruta            | Descripción                          |
| ------ | --------------- | ------------------------------------ |
| GET    | `/sirenas/`     | Listar sirenas (filtro `?id_zona=N`) |
| GET    | `/sirenas/{id}` | Obtener sirena por ID                |
| POST   | `/sirenas/`     | Crear sirena                         |
| PUT    | `/sirenas/{id}` | Actualizar sirena                    |
| DELETE | `/sirenas/{id}` | Eliminar sirena                      |

### Tipos de EPP — `/tipos-epp`

| Método | Ruta              | Descripción         |
| ------ | ----------------- | ------------------- |
| GET    | `/tipos-epp/`     | Listar tipos de EPP |
| GET    | `/tipos-epp/{id}` | Obtener tipo por ID |
| POST   | `/tipos-epp/`     | Crear tipo          |
| PUT    | `/tipos-epp/{id}` | Actualizar tipo     |
| DELETE | `/tipos-epp/{id}` | Eliminar tipo       |

### Resolución de Alertas — `/resoluciones`

| Método | Ruta                 | Descripción               |
| ------ | -------------------- | ------------------------- |
| GET    | `/resoluciones/`     | Listar resoluciones       |
| GET    | `/resoluciones/{id}` | Obtener resolución por ID |
| POST   | `/resoluciones/`     | Crear resolución          |
| DELETE | `/resoluciones/{id}` | Eliminar resolución       |

### Conteo de Zona — `/conteos`

| Método | Ruta            | Descripción                            |
| ------ | --------------- | -------------------------------------- |
| GET    | `/conteos/`     | Listar conteos (filtro `?id_camara=N`) |
| GET    | `/conteos/{id}` | Obtener conteo por ID                  |
| POST   | `/conteos/`     | Crear conteo                           |
| DELETE | `/conteos/{id}` | Eliminar conteo                        |

````

---

## 🗄️ Base de Datos

### Modelo de datos (13 tablas)

**Maestras:**

- `EPP_M_ROL` — Roles del sistema (Administrador, Supervisor, SSO)
- `EPP_M_TIPO` — Tipos de EPP (Casco, Lentes, Guantes, etc.)
- `EPP_M_ZONA` — Zonas de la planta
- `EPP_M_CAMARA` — Cámaras IP por zona
- `EPP_M_USUARIO` — Usuarios del sistema
- `EPP_M_SIRENA_AREA` — Sirenas por zona

**Paramétricas:**

- `EPP_P_PERMISO` — Permisos del sistema
- `EPP_P_PERMISO_ROL` — Asignación permiso ↔ rol
- `EPP_P_REQUERIDO_ZONA` — EPP requerido por zona

**Transaccionales:**

- `EPP_T_ALERTA` — Alertas generadas por incumplimiento
- `EPP_T_RESOLUCION_ALERTA` — Resoluciones de alertas
- `EPP_T_HISTORIAL_SIRENA` — Registro de activación de sirenas
- `EPP_T_CONTEO_ZONA` — Conteo de personas con/sin EPP

### Seed inicial

Al iniciar el servidor por primera vez, `init_db()` ejecuta automáticamente:

1. **Creación** de todas las tablas vía `Base.metadata.create_all()`
2. **3 roles**: Administrador, Supervisor de Turno, Encargado SSO
3. **8 permisos**: `GESTIONAR_USUARIOS`, `GESTIONAR_ZONAS`, `GESTIONAR_CAMARAS`, `GESTIONAR_ALERTAS`, `VER_DASHBOARD`, `EXPORTAR_REPORTES`, `JUSTIFICAR_ALERTA`, `VER_ZONAS`
4. **Asignación permisos ↔ roles**: Admin tiene todos, Supervisor tiene 4, SSO tiene 3
5. **1 usuario admin**: `admin@epp.com` / `admin123`
6. **3 zonas demo**: Zona A (Fundición), Zona B (Trituración), Zona C (Almacén)
7. **4 cámaras**: 2 en Zona A, 1 en Zona B, 1 en Zona C
8. **3 sirenas**: 1 por zona
9. **5 tipos de EPP**: Casco, Lentes, Guantes, Botas, Chaleco

---

## 🛠️ Comandos Útiles

```bash
# Iniciar servidor en desarrollo
uvicorn app.main:app --reload --port 8000

# Iniciar servidor en producción
uvicorn app.main:app --host 0.0.0.0 --port 8000

# Probar health check
curl http://127.0.0.1:8000/health

# Probar login
curl -X POST http://127.0.0.1:8000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"correo":"admin@epp.com","contrasena":"admin123"}'
````
