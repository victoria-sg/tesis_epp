# 🏭 EPP Monitor — Frontend

Aplicación web para el monitoreo de **Equipos de Protección Personal (EPP)** en una planta de reciclaje. Panel de control en tiempo real con detección de incumplimientos, gestión de alertas, analytics y administración de tablas maestras/paramétricas vía CRUD.

---

## 📋 Tecnologías Utilizadas

| Tecnología           | Versión  | Propósito                                |
| -------------------- | -------- | ---------------------------------------- |
| **React**            | ^19.2.6  | Librería de interfaz de usuario          |
| **TypeScript**       | ~6.0.2   | Tipado estático                          |
| **Vite**             | ^8.0.12  | Bundler y dev server                     |
| **Tailwind CSS**     | ^4.3.0   | Estilos utilitarios                      |
| **Redux Toolkit**    | ^2.12.0  | Estado global (autenticación)            |
| **React Redux**      | ^9.3.0   | Conexión React ↔ Redux                   |
| **React Router DOM** | ^7.17.0  | Enrutamiento SPA                         |
| **Formik**           | ^2.4.9   | Manejo de formularios                    |
| **Yup**              | ^1.7.1   | Validación de esquemas                   |
| **Axios**            | ^1.17.0  | Cliente HTTP                             |
| **Lucide React**     | ^1.17.0  | Iconografía                              |

---

## 🗂️ Estructura del Proyecto

```
front/
├── index.html                          # Entry point HTML
├── vite.config.ts                      # Configuración de Vite + Tailwind
├── package.json
├── pnpm-lock.yaml
├── public/
└── src/
    ├── main.tsx                        # Punto de entrada React + Providers
    ├── index.css                       # Tailwind v4 + tema
    ├── components/
    │   ├── ui/                         # Componentes base
    │   │   ├── button.tsx
    │   │   └── input.tsx
    │   ├── figma/
    │   │   └── ImageWithFallback.tsx
    │   └── crud/                       # Componentes reutilizables CRUD
    │       ├── PageHeader.tsx
    │       ├── CustomTable.tsx
    │       ├── CustomPagination.tsx
    │       ├── CustomInput.tsx
    │       ├── CustomSelect.tsx
    │       ├── CustomModal.tsx
    │       ├── StatusBadge.tsx
    │       ├── SearchBar.tsx
    │       ├── ActionButtons.tsx
    │       └── ConfirmDialog.tsx
    ├── constants/
    │   ├── authRoutesConstants.ts
    │   ├── apiRoutesConstants.ts
    │   ├── authServiceConstants.ts
    │   └── authStorageConstants.ts
    ├── models/
    │   ├── auth.model.ts
    │   ├── usuario.model.ts
    │   ├── rol.model.ts
    │   ├── zona.model.ts
    │   ├── camara.model.ts
    │   ├── tipo.model.ts
    │   └── sirena.model.ts
    ├── services/
    │   ├── api.ts
    │   ├── auth.service.ts
    │   ├── crud.service.ts
    │   ├── usuario.service.ts
    │   ├── rol.service.ts
    │   ├── zona.service.ts
    │   ├── camara.service.ts
    │   ├── tipo.service.ts
    │   └── sirena.service.ts
    ├── hooks/
    │   ├── useCrud.ts
    │   └── useCrudForm.ts
    ├── controllers/
    │   ├── useLogin.ts
    │   └── useRoleSelector.ts
    ├── validators/
    │   ├── login.schema.ts
    │   ├── usuario.schema.ts
    │   ├── rol.schema.ts
    │   ├── zona.schema.ts
    │   ├── camara.schema.ts
    │   ├── tipo.schema.ts
    │   └── sirena.schema.ts
    ├── store/
    │   ├── index.ts
    │   └── authSlice.ts
    ├── views/
    │   ├── LoginView.tsx
    │   ├── RoleSelectorView.tsx
    │   └── admin/
    │       ├── AppLayout.tsx
    │       ├── DashboardView.tsx
    │       ├── UsuariosView.tsx
    │       ├── RolesView.tsx
    │       ├── ZonasView.tsx
    │       ├── CamarasView.tsx
    │       ├── TiposEPPView.tsx
    │       └── SirenasView.tsx
    └── router/
        └── AppRouter.tsx
```

---

## 🚀 Instalación

### Requisitos

- **Node.js** >= 20
- **pnpm** >= 8 (recomendado)

### Pasos

```bash
# 1. Clonar el repositorio
git clone <repo-url>
cd front

# 2. Instalar dependencias
pnpm install

# 3. Crear archivo de variables de entorno
echo "VITE_API_BASE_URL=http://127.0.0.1:8000" > .env

# 4. Iniciar servidor de desarrollo
pnpm dev
```

### Comandos disponibles

| Comando        | Descripción                                     |
| -------------- | ----------------------------------------------- |
| pnpm dev       | Inicia servidor de desarrollo con HMR           |
| pnpm build     | Compila TypeScript + Vite build para producción |
| pnpm preview   | Previsualiza el build de producción localmente  |
| pnpm lint      | Ejecuta ESLint                                  |

---

## 🧠 Arquitectura

### Capas del Frontend

| Capa           | Carpeta        | Responsabilidad                               |
| -------------- | -------------- | --------------------------------------------- |
| Model          | models/        | Interfaces TypeScript y datos estáticos       |
| View           | views/         | Componentes de presentación                   |
| Controller     | controllers/   | Hooks con lógica de negocio (Formik, API)     |
| Hook           | hooks/         | Hooks genéricos reutilizables (CRUD)          |
| Service        | services/      | Comunicación HTTP con el backend              |
| Store          | store/         | Estado global con Redux Toolkit               |
| Validator      | validators/    | Esquemas Yup para validación de formularios   |
| Component      | components/    | Componentes de UI reutilizables               |
| Constants      | constants/     | Constantes centralizadas                      |

### Flujo de datos (Autenticación)

View → Controller (useLogin) → Service (auth.service) → API (Axios) → Backend
← Response → Redux Store → Router (/dashboard)

### Flujo de datos (CRUD)

View → Hook (useCrud) → Service → API (Axios) → Backend
← Response → Componentes crud/ (CustomTable, Pagination, etc.)

---

## 🔐 Flujo de Autenticación

1. /login → RoleSelector → LoginView → POST /auth/login
2. Backend responde con token + usuario
3. Redux loginAction + localStorage
4. Router navega a /dashboard

### Credenciales de prueba

admin@epp.com / admin123 (Rol: Administrador)

---

## 🧭 Rutas de la Aplicación

| Ruta                    | Acceso    | Descripción                      |
| ----------------------- | --------- | -------------------------------- |
| /login                  | Público   | Inicio de sesión                 |
| /reset-password         | Público   | Recuperar contraseña             |
| /                       | Protegido | Redirige a /dashboard            |
| /dashboard              | Protegido | Dashboard con KPIs               |
| /admin/usuarios         | Protegido | CRUD Usuarios                    |
| /admin/roles            | Protegido | CRUD Roles                       |
| /admin/zonas            | Protegido | CRUD Zonas                       |
| /admin/camaras          | Protegido | CRUD Cámaras                     |
| /admin/tipos-epp        | Protegido | CRUD Tipos de EPP                |
| /admin/sirenas          | Protegido | CRUD Sirenas                     |

---

## 🎨 Layout (AppLayout)

Basado en el diseño de Figma. Sidebar con logo EPP MONITOR, badge del rol, navegación contextual según el rol (admin: todos los CRUDs), indicador de sesión, usuario al pie y botón de cerrar sesión. Header con buscador e indicador "Sistema en línea".
