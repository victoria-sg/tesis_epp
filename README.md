# EPP Monitor

Sistema de monitoreo de Equipos de Proteccion Personal (EPP) en una planta de reciclaje. Detecta incumplimientos de uso de EPP mediante vision por computadora (YOLOv8), genera alertas en tiempo real, activa sirenas y provee un dashboard administrativo con metricas, reportes y gestion de tablas maestras.

---

## Estructura del Proyecto

```
/
  back/     # API REST con FastAPI (submodulo)
  front/    # App web con React + TypeScript (submodulo)
```

Cada submodulo es un repositorio independiente. Ver sus respectivos README para documentacion detallada.

---

## Requisitos

- **Node.js** >= 20 (frontend)
- **pnpm** >= 8 (frontend)
- **Python** >= 3.12 (backend)
- **Git** (con soporte para submodulos)

---

## Instalacion

```bash
# Clonar con submodulos
git clone --recurse-submodules <repo-url>
cd cuadrado

# O si ya se clono sin --recurse-submodules:
git submodule update --init --recursive
```

Luego seguir las instrucciones de instalacion en cada submodulo:

- [Backend](./back/README.md)
- [Frontend](./front/README.md)

---

## Stack Tecnologico

### Backend
- **FastAPI** - Framework web asincrono
- **SQLAlchemy** - ORM
- **YOLOv8** - Deteccion de objetos
- **Celery** - Tareas asincronas
- **JWT** - Autenticacion

### Frontend
- **React 19** - Interfaz de usuario
- **TypeScript** - Tipado estatico
- **Vite** - Bundler
- **Tailwind CSS** - Estilos
- **Redux Toolkit** - Estado global
- **Formik + Yup** - Formularios y validacion

---

## Submodulos

| Submodulo | Ruta  | Descripcion              |
| --------- | ----- | ------------------------ |
| back      | back/ | API REST (FastAPI)       |
| front     | front/| App web (React + Vite)   |

Para actualizar los submodulos a su ultimo commit:

```bash
git submodule update --remote --merge
```
