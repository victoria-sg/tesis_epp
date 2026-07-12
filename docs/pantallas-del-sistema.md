# Pantallas del Sistema — EPP Monitor

## Roles del Sistema

| Rol | Descripción |
|---|---|
| **Administrador** | Acceso total a todas las funcionalidades del sistema |
| **Supervisor de Turno** | Supervisa operación en planta — puede ver y justificar alertas |
| **Jefe de Planta (SSO)** | Jefe de Seguridad y Salud en el Trabajo — puede ver y exportar reportes |
| **Cámara Fallback** | Solo puede usar la cámara del teléfono como fuente de video |

---

## Pantallas Públicas (sin autenticación)

### 1. Login (`/login`)
- **Descripción:** Pantalla de inicio de sesión. Primero se selecciona el rol (Admin / Supervisor / SSO) y luego se ingresa correo y contraseña.
- **Permisos requeridos:** Ninguno (público)

### 2. Recuperar Contraseña (`/reset-password`)
- **Descripción:** Formulario para solicitar restablecimiento de contraseña.
- **Permisos requeridos:** Ninguno (público)

### 3. Confirmar Reset (`/reset-password/confirmar`)
- **Descripción:** Pantalla para ingresar el código de recuperación y establecer una nueva contraseña.
- **Permisos requeridos:** Ninguno (público)

### 4. Cámara Telefónica (`/phone-camera/:camaraId`)
- **Descripción:** Vista que permite usar un teléfono como cámara de respaldo (fallback). Se accede mediante un enlace QR.
- **Permisos requeridos:** Ninguno (público, pero requiere `USAR_CAMARA_FALLBACK` en el backend)

---

## Pantallas Autenticadas (requieren sesión)

### 5. Cambio de Contraseña Inicial (`/cambiar-contrasena`)
- **Descripción:** Forzado al primer inicio de sesión. El usuario debe cambiar su contraseña antes de acceder al sistema.
- **Permisos requeridos:** Cualquier usuario autenticado con `primer_inicio_sesion = true`

---

## Módulo: Dashboard

### 6. Dashboard (`/dashboard`)
- **Requiere permiso:** `DASHBOARD_VER`

| Elemento | Admin | Supervisor | Jefe Planta |
|---|---|---|---|
| Tarjetas de resumen (cámaras online, alertas hoy, zonas, sistema) | ✅ Ver | ✅ Ver | ✅ Ver |
| Transmisión en vivo de cámaras | ✅ Ver | ✅ Ver | ✅ Ver |
| Gráficos estadísticos por zona | ✅ Ver | ✅ Ver | ✅ Ver |
| Botón "Reportar incidencia" (en modal de cámara expandida) | ✅ (tiene `ALERTAS_CREAR`) | ❌ | ❌ |
| Filtro de zonas en estadísticas | ✅ Ver | ✅ Ver | ✅ Ver |

**Descripción:** Panel principal con monitoreo en vivo. Muestra tarjetas con:
- Cámaras online / totales
- Alertas de hoy / pendientes
- Zonas activas
- Estado del sistema
- Grid de transmisión en vivo (una miniatura por cámara)
- Estadísticas con gráficos (DashboardCharts) filtrables por zona

Al hacer clic en una cámara se abre un modal a pantalla completa. Si el usuario tiene `ALERTAS_CREAR` (solo Admin), aparece un botón "Reportar incidencia".

---

## Módulo: Usuarios

### 7. Gestión de Usuarios (`/admin/usuarios`)
- **Requiere permiso:** `USUARIOS_VER`

| Acción | Admin | Supervisor | Jefe Planta |
|---|---|---|---|
| Ver lista de usuarios | ✅ (`USUARIOS_VER`) | ❌ | ❌ |
| Crear usuario | ✅ (`USUARIOS_CREAR`) | ❌ | ❌ |
| Editar usuario | ✅ (`USUARIOS_EDITAR`) | ❌ | ❌ |
| Eliminar usuario | ✅ (`USUARIOS_ELIMINAR`) | ❌ | ❌ |
| Buscar usuarios | ✅ | ❌ | ❌ |

**Descripción:** CRUD de usuarios del sistema. Tabla con columnas: #, Nombre (con avatar), Correo, Cédula, Rol, Estado, Acciones (editar/eliminar). Modal de creación/edición con campos: nombre, apellido, correo, cédula, rol (solo al crear). La contraseña se genera automáticamente a partir de la cédula.

> **Nota:** Solo se pueden asignar los roles "Supervisor de Turno" y "Jefe de Planta". El rol "Administrador" no se asigna desde esta pantalla.

---

## Módulo: Roles

### 8. Gestión de Roles (`/admin/roles`)
- **Requiere permiso:** `ROLES_VER`

| Acción | Admin | Supervisor | Jefe Planta |
|---|---|---|---|
| Ver lista de roles | ✅ (`ROLES_VER`) | ❌ | ❌ |
| Crear rol | ✅ (`ROLES_CREAR`) | ❌ | ❌ |
| Editar permisos de rol | ✅ (`ROLES_EDITAR`) | ❌ | ❌ |
| Eliminar rol | ✅ (`ROLES_ELIMINAR`) | ❌ | ❌ |
| Buscar roles | ✅ | ❌ | ❌ |

**Descripción:** CRUD de roles con asignación de permisos. Tabla con columnas: #, Nombre, Descripción, Acciones (editar/eliminar). Al editar un rol se muestra un panel de permisos agrupados por categoría (Usuarios, Roles, Zonas, Cámaras, Alertas, Reportes, Dashboard, Detección, Fallback) con checkboxes para asignar/desasignar permisos individualmente o por grupo.

---

## Módulo: Zonas

### 9. Gestión de Zonas (`/admin/zonas`)
- **Requiere permiso:** `ZONAS_VER`

| Acción | Admin | Supervisor | Jefe Planta |
|---|---|---|---|
| Ver lista de zonas | ✅ (`ZONAS_VER`) | ✅ (`ZONAS_VER`) | ✅ (`ZONAS_VER`) |
| Crear zona | ✅ (`ZONAS_CREAR`) | ❌ | ❌ |
| Editar zona | ✅ (`ZONAS_EDITAR`) | ❌ | ❌ |
| Eliminar zona | ✅ (`ZONAS_ELIMINAR`) | ❌ | ❌ |
| Buscar zonas | ✅ | ✅ | ✅ |

**Descripción:** Administración de zonas de la planta. Muestra:
- Tarjetas de resumen con conteo por nivel de riesgo (Alto / Medio / Bajo)
- Tabla con columnas: #, Nombre (con barra de color según riesgo), Nivel de Riesgo (badge), EPP Requeridos (tags), Acciones

El modal de creación/edición incluye: nombre, nivel de riesgo (o detección automática), tiempo de tolerancia en segundos, y selector de EPP requeridos.

---

## Módulo: Cámaras

### 10. Gestión de Cámaras (`/admin/camaras`)
- **Requiere permiso:** `CAMARAS_VER`

| Acción | Admin | Supervisor | Jefe Planta |
|---|---|---|---|
| Ver lista de cámaras | ✅ (`CAMARAS_VER`) | ✅ (`CAMARAS_VER`) | ✅ (`CAMARAS_VER`) |
| Crear cámara | ✅ (`CAMARAS_CREAR`) | ❌ | ❌ |
| Editar cámara | ✅ (`CAMARAS_EDITAR`) | ❌ | ❌ |
| Eliminar cámara | ✅ (`CAMARAS_ELIMINAR`) | ❌ | ❌ |
| Ver QR de cámara fallback | ✅ | ✅ | ✅ |
| Buscar cámaras | ✅ | ✅ | ✅ |

**Descripción:** Administración de cámaras del sistema. Tabla con columnas: #, Código, Zona, Tipo (Hikvision/EZVIZ/RTSP/Teléfono), Dirección IP, Puerto, Estado (Online/Offline), Acciones.

Soporta:
- Cámaras RTSP tradicionales (Hikvision, EZVIZ, RTSP genérico) con IP, puerto, usuario y contraseña
- Cámaras telefónicas (fallback) que generan un QR para vincular un teléfono
- Las cámaras fallback muestran un botón de QR en la tabla para todos los roles que pueden ver cámaras

---

## Módulo: Tipos de EPP

### 11. Tipos de EPP (`/admin/tipos-epp`)
- **Requiere permiso:** `TIPOS_EPP_VER`

| Acción | Admin | Supervisor | Jefe Planta |
|---|---|---|---|
| Ver lista de tipos de EPP | ✅ (`TIPOS_EPP_VER`) | ✅ (`TIPOS_EPP_VER`) | ✅ (`TIPOS_EPP_VER`) |
| Buscar tipos de EPP | ✅ | ✅ | ✅ |

**Descripción:** Tabla de solo lectura con los tipos de Equipos de Protección Personal configurados. Columnas: #, Nombre, Descripción. No permite crear, editar ni eliminar desde el frontend (solo lectura).

---

## Módulo: Reportes

### 12. Reportes de Alertas (`/admin/reportes`)
- **Requiere permiso:** `REPORTES_VER`

| Acción | Admin | Supervisor | Jefe Planta |
|---|---|---|---|
| Ver alertas | ✅ (`ALERTAS_VER`) | ✅ (`ALERTAS_VER`) | ✅ (`ALERTAS_VER`) |
| Justificar/Resolver alertas | ✅ (`ALERTAS_JUSTIFICAR`) | ✅ (`ALERTAS_JUSTIFICAR`) | ❌ |
| Exportar CSV | ✅ (`REPORTES_EXPORTAR`) | ❌ | ✅ (`REPORTES_EXPORTAR`) |
| Filtros (zona, cámara, estado, búsqueda) | ✅ | ✅ | ✅ |

**Descripción:** Historial de alertas de infracción de EPP. Muestra:
- Tarjetas de resumen: Total alertas, Pendientes, Resueltas
- Tabla con columnas: Captura (thumbnail), Fecha, Zona, Cámara, Duración, Infracción, Estado (Pendiente/Resuelta), Justificación, Resuelto por, Acciones

Para cada alerta:
- **Admin y Supervisor:** Pueden abrir el modal de resolución (requiere comentario) y marcar la alerta como "Resuelta"
- **Jefe de Planta:** Solo visualiza, no puede resolver alertas
- **Admin y Jefe de Planta:** Pueden exportar el reporte a CSV

Al hacer clic en una captura se abre en vista previa expandida con opción de descarga.

---

## Módulo: Detección

### 13. Detección EPP (`/admin/deteccion`)
- **Requiere permiso:** `DETECCION_VER`

| Acción | Admin | Supervisor | Jefe Planta |
|---|---|---|---|
| Ver página de detección | ✅ (`DETECCION_VER`) | ❌ | ❌ |
| Subir imagen para análisis | ✅ | ❌ | ❌ |
| Subir video para análisis | ✅ | ❌ | ❌ |

**Descripción:** Herramienta de prueba del modelo de detección de EPP. Permite subir imágenes o videos para que el modelo YOLO analice si se está usando el equipo de protección correctamente. Tiene dos pestañas: "Imagen" y "Video". Es una funcionalidad temporal para validar el modelo de IA.

---

## Módulo: Notificaciones en tiempo real

### Barra de notificaciones (WebSocket)
- Presente en todas las pantallas del `AppLayout`
- **Descripción:** Campana en el header que muestra alertas en tiempo real vía WebSocket. Al hacer clic se despliega un dropdown con las últimas 10 alertas. Al hacer clic en una alerta redirige a Reportes. Todos los roles autenticados reciben notificaciones.
- **Botón "Limpiar"**: Oculta las notificaciones localmente (visible para todos los roles).

---

## Resumen de Acceso por Rol

| Pantalla | Admin | Supervisor | Jefe Planta | Cámara Fallback |
|---|---|---|---|---|
| Login | ✅ | ✅ | ✅ | ✅ |
| Dashboard | ✅ | ✅ | ✅ | ❌ |
| Usuarios (CRUD) | ✅ | ❌ | ❌ | ❌ |
| Roles (CRUD + permisos) | ✅ | ❌ | ❌ | ❌ |
| Zonas (ver) | ✅ | ✅ | ✅ | ❌ |
| Zonas (crear/editar/eliminar) | ✅ | ❌ | ❌ | ❌ |
| Cámaras (ver) | ✅ | ✅ | ✅ | ❌ |
| Cámaras (crear/editar/eliminar) | ✅ | ❌ | ❌ | ❌ |
| Cámaras (QR fallback) | ✅ | ✅ | ✅ | ❌ |
| Tipos de EPP | ✅ | ✅ | ✅ | ❌ |
| Reportes (ver) | ✅ | ✅ | ✅ | ❌ |
| Reportes (justificar) | ✅ | ✅ | ❌ | ❌ |
| Reportes (exportar CSV) | ✅ | ❌ | ✅ | ❌ |
| Detección EPP | ✅ | ❌ | ❌ | ❌ |
| Cámara telefónica | ❌ | ❌ | ❌ | ✅ |
