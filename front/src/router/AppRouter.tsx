import { useState } from "react";
import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
  useNavigate,
} from "react-router-dom";
import { APP_ROUTES } from "../constants/apiRoutesConstants";
import {
  APP_DASHBOARD,
  APP_LOGIN,
  APP_RESET_PASSWORD,
  APP_RESET_PASSWORD_CONFIRM,
  APP_ROOT,
} from "../constants/authRoutesConstants";
import type { Rol } from "../models/auth.model";
import { ROL_LABELS } from "../models/auth.model";
import { ForgotPasswordView } from "../views/ForgotPasswordView";
import { LoginView } from "../views/LoginView";
import { PhoneCameraView } from "../views/PhoneCameraView";
import { ResetPasswordView } from "../views/ResetPasswordView";
import { RoleSelectorView } from "../views/RoleSelectorView";
import { AppLayout } from "../views/admin/AppLayout";
import { CamarasView } from "../views/admin/CamarasView";
import { DashboardView } from "../views/admin/DashboardView";
import { ReportesView } from "../views/admin/ReporteView";
import { RolesView } from "../views/admin/RolesView";
import { SirenasView } from "../views/admin/SirenasView";
import { TiposEPPView } from "../views/admin/TiposEPPView";
import { UsuariosView } from "../views/admin/UsuariosView";
import { ZonasView } from "../views/admin/ZonasView";

// ─── Páginas ──────────────────────────────────────────────────────────────────
const ForgotPasswordPage = () => {
  const navigate = useNavigate();
  return <ForgotPasswordView onBackToLogin={() => navigate(APP_LOGIN)} />;
};

// ─── Componente raíz con estado de sesión ──────────────────────────────────────
const AuthRoutes = () => {
  const [selectedRol, setSelectedRol] = useState<Rol | null>(null);
  const navigate = useNavigate();

  if (!selectedRol) {
    return <RoleSelectorView onSelect={setSelectedRol} />;
  }

  return (
    <LoginView
      selectedRol={selectedRol}
      selectedRolLabel={ROL_LABELS[selectedRol]}
      onGoToReset={() => navigate(APP_RESET_PASSWORD)}
      onChangeRole={() => setSelectedRol(null)}
    />
  );
};

// ─── Router ────────────────────────────────────────────────────────────────────
export const AppRouter = () => {
  const router = createBrowserRouter([
    // ── Auth routes (sin layout) ─────────────────────────────────────────
    {
      path: APP_LOGIN,
      element: <AuthRoutes />,
    },
    {
      path: APP_RESET_PASSWORD,
      element: <ForgotPasswordPage />,
    },
    {
      path: APP_RESET_PASSWORD_CONFIRM,
      element: <ResetPasswordView />,
    },
    {
      path: "/phone-camera/:camaraId",
      element: <PhoneCameraView />,
    },

    // ── Admin / App routes (con AppLayout - sidebar) ──────────────────────
    {
      path: APP_ROOT,
      element: <AppLayout />,
      children: [
        {
          index: true,
          element: <Navigate to={APP_DASHBOARD} replace />,
        },
        {
          path: APP_DASHBOARD.replace("/", ""),
          element: <DashboardView />,
        },
        {
          path: APP_ROUTES.USUARIOS.replace("/", ""),
          element: <UsuariosView />,
        },
        {
          path: APP_ROUTES.ROLES.replace("/", ""),
          element: <RolesView />,
        },
        {
          path: APP_ROUTES.ZONAS.replace("/", ""),
          element: <ZonasView />,
        },
        {
          path: APP_ROUTES.CAMARAS.replace("/", ""),
          element: <CamarasView />,
        },
        {
          path: APP_ROUTES.TIPOS_EPP.replace("/", ""),
          element: <TiposEPPView />,
        },
        {
          path: APP_ROUTES.SIRENAS.replace("/", ""),
          element: <SirenasView />,
        },
        {
          path: APP_ROUTES.REPORTES.replace("/", ""),
          element: <ReportesView />,
        },
      ],
    },

    // ── 404 ──────────────────────────────────────────────────────────────
    {
      path: "*",
      element: <Navigate to={APP_LOGIN} replace />,
    },
  ]);

  return <RouterProvider router={router} />;
};