# EPP Sistema — Especificaciones de Diseño

> Sistema de gestión de Equipos de Protección Personal (EPP) con detección por cámaras, zonas, incumplimientos y alertas.

---

## Descripción General

El sistema EPP es una aplicación web-móvil diseñada para gestionar y monitorear el cumplimiento del uso de equipos de protección personal en entornos industriales o corporativos. Integra vigilancia por cámaras, detección automática de incumplimientos, generación de alertas y registro de evidencias visuales.

---

## Pantalla de Login

La pantalla de acceso es el punto de entrada único al sistema. Diseño minimalista centrado en la pantalla con fondo blanco y controles en escala de negros.

### Layout

```
┌─────────────────────────────────────────┐
│                                         │
│           [Logo EPP Sistema]            │
│                                         │
│   ┌─────────────────────────────────┐   │
│   │  correo@empresa.com             │   │
│   └─────────────────────────────────┘   │
│   ┌─────────────────────────────────┐   │
│   │  ••••••••••••••                 │   │
│   └─────────────────────────────────┘   │
│                                         │
│   ┌─────────────────────────────────┐   │
│   │         INICIAR SESIÓN          │   │
│   └─────────────────────────────────┘   │
│                                         │
│        ¿Olvidaste tu contraseña?        │
│                                         │
└─────────────────────────────────────────┘
```

### Campos del Formulario

| Campo | Tipo | Validación |
|---|---|---|
| Correo electrónico | `email` | Formato válido, requerido |
| Contraseña | `password` | Mínimo 8 caracteres, requerido |

### Comportamiento

- Validación en tiempo real al perder el foco (`onBlur`).
- Botón **Iniciar Sesión** deshabilitado hasta que ambos campos sean válidos.
- Al autenticar, redirige al Dashboard según `EPP_USARIO.IdRol`.
- Máximo 5 intentos fallidos → bloqueo de 15 minutos con mensaje visible.
- Link **¿Olvidaste tu contraseña?** → recuperación por correo registrado en `EPP_USARIO.correo`.

---

## Arquitectura de la Base de Datos

El esquema sigue las convenciones de prefijo `EPP_` para todas las entidades, con relaciones claras entre empresas, sedes, zonas, cámaras, detecciones e incumplimientos.

---

## Módulos del Sistema

### 1. Gestión Organizacional

| Entidad | Campos Clave | Descripción |
|---|---|---|
| `EPP_EMPRESA` | `IdEmpresa`, `Nombre`, `RUC`, `Correo` | Empresa cliente del sistema |
| `EPP_SEDE` | `IdSede`, `IdCiudad`, `IdEmpresa`, `Nombre`, `Direccion` | Sede física de la empresa |
| `EPP_CIUDAD` | `IdCiudad`, `Nombre` | Ciudad donde se ubica la sede |
| `EPP_ZONA` | `IdZona`, `IdSede`, `Nombre`, `Descripcion`, `estado` | Área específica dentro de una sede |

**Relaciones:**
- Una `EPP_EMPRESA` puede tener múltiples `EPP_SEDE`.
- Cada `EPP_SEDE` pertenece a una `EPP_CIUDAD` y puede tener múltiples `EPP_ZONA`.

---

### 2. Gestión de Usuarios y Roles

| Entidad | Campos Clave | Descripción |
|---|---|---|
| `EPP_ROL` | `IdRol`, `Descripcion` | Define los roles del sistema |
| `EPP_USARIO` | `IdUsuario`, `IdRol`, `IdEmpresa`, `Nombre`, `Apelido`, `correo`, `contraseña`, `telefono`, `FechaCreacion` | Usuarios con rol asignado |

**Notas de diseño:**
- La contraseña debe almacenarse hasheada (bcrypt o argon2). Nunca en texto plano.
- El campo `correo` en `EPP_USARIO` es el identificador de autenticación.
- `FechaCreacion` se asigna automáticamente al registrar el usuario.

---

### 3. Infraestructura de Cámaras

| Entidad | Campos Clave | Descripción |
|---|---|---|
| `EPP_CAMARA` | `IdCamara`, `IdZona`, `nombre`, `ubicacion`, `ip_url`, `estado` | Cámara instalada en una zona |

**Consideraciones técnicas:**
- `ip_url` almacena la URL del stream RTSP o HTTP de la cámara.
- `estado` puede tomar valores: `activo`, `inactivo`, `mantenimiento`.
- Cada cámara está asociada a exactamente una `EPP_ZONA`.

---

### 4. Tipos de Equipo de Protección Personal

| Entidad | Campos Clave | Descripción |
|---|---|---|
| `EPP_TIPO_EQUIPO` | `IdTipoEquipo`, `Descripcion` | Catálogo de EPPs (casco, chaleco, guantes, etc.) |
| `EPP_REQUERIDO_ZONA` | `IdEppRequerido`, `IdZona`, `IdTipoEquipo`, `Obligatorio`, `activo`, `Campo`, `Tipo` | EPPs requeridos por zona |

**Lógica de negocio:**
- `Obligatorio` (boolean) distingue requisitos críticos de los recomendados.
- `activo` permite desactivar un requisito sin eliminarlo históricamente.

---

### 5. Motor de Detección

| Entidad | Campos Clave | Descripción |
|---|---|---|
| `EPP_DETECCION` | `IdDeteccion`, `IdTipoEquipo`, `IdCamara`, `detectado`, `confianza`, `fecha_hora` | Resultado de detección IA por cámara |

**Atributos clave:**
- `detectado` (int): 1 = detectado, 0 = no detectado.
- `confianza` (decimal): nivel de confianza del modelo (0.0–1.0).
- `fecha_hora` (datetime): timestamp con precisión de segundos.

---

### 6. Gestión de Incumplimientos

| Entidad | Campos Clave | Descripción |
|---|---|---|
| `EPP_INCUMPLIMIENTO` | `IdIncumplimiento`, `IdDeteccion`, `IdTipoEquipo`, `detectado`, `confianza`, `fecha_hora` | EPP obligatorio no detectado |
| `EPP_EVIDENCIA` | `IdEvidencia`, `IdIncumplimiento`, `ruta_imagen`, `FechaHora`, `descripcion` | Imagen probatoria del incumplimiento |

**Flujo del proceso:**
1. La cámara genera una `EPP_DETECCION`.
2. Si el EPP es obligatorio y `detectado = 0`, se crea un `EPP_INCUMPLIMIENTO`.
3. Se adjuntan una o más `EPP_EVIDENCIA` (frames del video).

---

### 7. Sistema de Alertas

| Entidad | Campos Clave | Descripción |
|---|---|---|
| `EPP_ALERTA` | `IdAlerta`, `IdIncumplimiento`, `IdTipoEquipo`, `detectado`, `confianza`, `fecha_hora` | Alerta visual por incumplimiento |
| `EPP_ALERTA_SONORA` | `IdAlertaSonora`, `IdAlerta`, `Accion`, `FechaHora`, `Duracion`, `estado` | Alerta auditiva vinculada |

**Estados de alerta:** `pendiente`, `reproducida`, `silenciada`, `expirada`.
- `Duracion` (int): duración en segundos del sonido de alerta.

---

### 8. Reportes

| Entidad | Campos Clave | Descripción |
|---|---|---|
| `EPP_REPORTE` | `IdReporte`, `IdSede`, `Accion`, `FechaHora`, `Duracion`, `estado` | Reporte de actividad por sede |

---

## Especificaciones de Diseño UI/UX

### Sistema de Diseño (Blanco y Negro)

| Token | Valor | Uso |
|---|---|---|
| Color primario | `#000000` (Negro) | CTAs, botones, header, acciones principales |
| Color secundario | `#1a1a1a` | Texto principal, iconos |
| Color superficie | `#ffffff` (Blanco) | Fondo de pantallas, cards, modales |
| Color borde | `#d4d4d4` | Bordes de inputs, separadores, tablas |
| Color fondo general | `#f5f5f5` | Fondo base de la aplicación |
| Texto primario | `#000000` | Títulos, labels principales |
| Texto secundario | `#6b6b6b` | Metadata, hints, placeholders |
| Hover | `#333333` | Estado hover de botones y links |
| Radio base | `0.375rem (6px)` | Cards, inputs, botones |
| Sombra card | `0 2px 8px rgba(0,0,0,0.10)` | Elevación de componentes |

### Tipografía

- **Títulos:** `Inter` o `Satoshi` — peso 700, color `#000000`
- **Cuerpo:** `Inter` — peso 400–500, 16px, color `#1a1a1a`
- **Labels/badges:** 12px, `UPPERCASE`, `letter-spacing: 0.08em`, color `#6b6b6b`
- **Datos numéricos:** `font-variant-numeric: tabular-nums`, `#000000`

### Paleta por Estado de EPP

```
Detectado (✓)          → #000000 + ícono check
No detectado (✗)       → #000000 + ícono X + borde rojo fino
Confianza baja (<0.60) → #6b6b6b + ícono advertencia
Cámara inactiva        → #b0b0b0 + texto muted
Alerta activa          → #000000 + pulsación de borde
```

### Componente: Botón Principal

```css
background: #000000;
color: #ffffff;
border-radius: 6px;
padding: 12px 24px;
font-weight: 600;
font-size: 14px;
letter-spacing: 0.04em;
text-transform: uppercase;
transition: background 150ms ease;

/* Hover */
background: #333333;

/* Disabled */
background: #d4d4d4;
color: #9a9a9a;
cursor: not-allowed;
```

### Componente: Input de Formulario

```css
border: 1.5px solid #d4d4d4;
background: #ffffff;
color: #000000;
border-radius: 6px;
padding: 12px 16px;
font-size: 15px;

/* Focus */
border-color: #000000;
outline: none;
box-shadow: 0 0 0 3px rgba(0,0,0,0.08);

/* Error */
border-color: #cc0000;
```

---

## Componentes UI Principales

### Dashboard de Monitoreo
- KPIs superiores: zonas activas, cámaras en línea, incumplimientos del día, alertas pendientes.
- Feed en tiempo real con timestamp, zona, EPP, barra de confianza y badge de estado.
- Mapa de calor de zonas (blanco → gris → negro según nivel de incumplimiento).
- Sidebar fijo con navegación principal. Una sola región de scroll.

### Vista de Incumplimientos
- Tabla: `Fecha/Hora`, `Zona`, `Cámara`, `EPP Faltante`, `Confianza`, `Estado`, `Evidencia`.
- Filtros por sede, zona, rango de fechas, tipo de EPP.
- Click en fila → drawer lateral con evidencia fotográfica y alerta asociada.

### Gestión de Zonas y EPPs Requeridos
- Lista de zonas con indicador visual de estado (`activo` / `inactivo`).
- Toggles por EPP: Obligatorio / Opcional / Desactivado.
- Guardado con confirmación inline sin recargar la página.

### Módulo de Alertas
- Notificaciones en tiempo real (WebSocket/SSE) con badge en campana.
- Acciones: Silenciar, Marcar como atendida, Ver evidencia.
- `EPP_ALERTA_SONORA` se activa automáticamente con duración configurable.

### Formularios (Empresa, Sede, Usuario)
- Flujo en pasos para reducir carga cognitiva.
- Validación `onBlur` con mensajes de error inline.
- Confirmación con animación de checkmark (no toast para acciones críticas).

---

## Reglas de Negocio

1. Incumplimiento solo si EPP es **Obligatorio** en `EPP_REQUERIDO_ZONA`.
2. Confianza ≥ 0.70 para considerar EPP detectado (umbral configurable).
3. Una `EPP_ALERTA` se genera por cada `EPP_INCUMPLIMIENTO` registrado.
4. Evidencias almacenadas en ruta relativa (`ruta_imagen`) al servidor de archivos.
5. Usuario solo gestiona datos de su empresa asignada (`EPP_USARIO.IdEmpresa`).

---

## Convenciones de Código

### Nombres de Tablas y Campos
- Prefijo `EPP_` en todas las tablas.
- PKs: `IdNombreEntidad` (ej. `IdCamara`, `IdZona`).
- FKs: nombre original del campo de la tabla referenciada.
- Fechas como `DATETIME`. Booleanos como `BOOLEAN`.

### Tipos de Datos

| Tipo | Convención |
|---|---|
| Identificadores (PK/FK) | `INT` auto-incremental |
| Nombres y descripciones | `VARCHAR(255)` |
| Rutas de archivos | `VARCHAR(500)` |
| Nivel de confianza IA | `DECIMAL(5,4)` |
| Timestamps | `DATETIME` UTC |
| Estados | `VARCHAR(20)` |
| Booleanos | `BOOLEAN` |

---

## Notas de Seguridad

- Contraseñas con bcrypt (factor 12) o argon2id. Nunca en texto plano.
- `ip_url` accesible solo a roles admin/supervisor.
- Endpoints de detección validan que la cámara pertenece a la empresa del usuario autenticado.
- Evidencias servidas con URLs firmadas con expiración (no rutas directas).

---

## Stack Tecnológico Sugerido

| Capa | Tecnología |
|---|---|
| Frontend | React + TypeScript |
| Backend | Node.js (Express o Fastify) |
| Base de datos | SQLite (dev) / PostgreSQL (prod) |
| Autenticación | JWT + refresh tokens |
| Streaming cámaras | RTSP → HLS vía FFmpeg |
| IA / Detección | Python microservicio (YOLOv8) |
| Almacenamiento evidencias | AWS S3 o MinIO |
| Tiempo real (alertas) | WebSockets (Socket.IO) o SSE |

---

*Documento generado a partir del diagrama ERD del sistema EPP. Versión inicial — sujeto a revisión durante el desarrollo.*
