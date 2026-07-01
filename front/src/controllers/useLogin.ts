import { useFormik } from "formik";
import { useCallback, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { APP_DASHBOARD } from "../constants/authRoutesConstants";
import {
  REFRESH_TOKEN_KEY,
  TOKEN_KEY,
  USER_KEY,
} from "../constants/authStorageConstants";
import type { LoggedUser, Rol } from "../models/auth.model";
import { ROL_LABELS, ROL_MAP } from "../models/auth.model";
import { login as loginService } from "../services/auth.service";
import { login as loginAction } from "../store/authSlice";
import type { LoginFormValues } from "../validators/login.schema";
import { loginSchema } from "../validators/login.schema";

interface Props {
  selectedRol: Rol;
  onGoToReset: () => void;
  onChangeRole: () => void;
}

export const useLogin = ({ selectedRol, onGoToReset, onChangeRole }: Props) => {
  const [serverError, setServerError] = useState<string | null>(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const formik = useFormik<LoginFormValues>({
    initialValues: { correo: "", contrasena: "" },
    validationSchema: loginSchema,
    validateOnBlur: true,
    validateOnChange: false,
    onSubmit: async (values) => {
      setServerError(null);
      try {
        const response = await loginService({
          correo: values.correo,
          contrasena: values.contrasena,
        });

        const { usuario, access_token, refresh_token } = response;
        const mappedRol = ROL_MAP[usuario.rol];

        if (!mappedRol) {
          setServerError(
            "Esta cuenta tiene un rol no válido. Contacta a un administrador.",
          );
          return;
        }

        if (mappedRol !== selectedRol) {
          setServerError(
            `Esta cuenta corresponde al perfil "${ROL_LABELS[mappedRol]}", no a "${ROL_LABELS[selectedRol]}". Vuelve a la pantalla anterior y selecciona el perfil correcto.`,
          );
          return;
        }

        const user: LoggedUser = {
          id_usuario: usuario.id_usuario,
          nombre: usuario.nombre,
          apelido: usuario.apelido,
          correo: usuario.correo,
          rol: mappedRol,
          rolLabel: ROL_LABELS[mappedRol],
          permisos: usuario.permisos,
        };

        localStorage.setItem(TOKEN_KEY, access_token);
        localStorage.setItem(REFRESH_TOKEN_KEY, refresh_token);
        localStorage.setItem(USER_KEY, JSON.stringify(user));
        dispatch(loginAction({ user, token: access_token }));
        navigate(APP_DASHBOARD);
      } catch {
        setServerError("Credenciales incorrectas. Intenta de nuevo.");
      }
    },
  });

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      formik.submitForm();
    },
    [formik],
  );

  return { formik, serverError, handleSubmit, onGoToReset, onChangeRole };
};