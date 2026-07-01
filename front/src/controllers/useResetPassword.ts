import { useFormik } from "formik";
import { useCallback, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { APP_LOGIN } from "../constants/authRoutesConstants";
import { restablecerPassword } from "../services/auth.service";
import {
  resetPasswordSchema,
  type ResetPasswordFormValues,
} from "../validators/resetPassword.schema";

export const useResetPassword = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token") ?? "";
  const navigate = useNavigate();

  const [serverError, setServerError] = useState<string | null>(null);
  const [exito, setExito] = useState(false);

  const formik = useFormik<ResetPasswordFormValues>({
    initialValues: { nueva_contrasena: "", confirmar_contrasena: "" },
    validationSchema: resetPasswordSchema,
    validateOnBlur: true,
    validateOnChange: false,
    onSubmit: async (values) => {
      setServerError(null);
      try {
        await restablecerPassword({
          token,
          nueva_contrasena: values.nueva_contrasena,
        });
        setExito(true);
      } catch {
        setServerError(
          "El enlace es inválido o ha expirado. Solicita uno nuevo.",
        );
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

  const goToLogin = useCallback(() => navigate(APP_LOGIN), [navigate]);

  return {
    formik,
    serverError,
    exito,
    handleSubmit,
    tokenPresente: token.length > 0,
    goToLogin,
  };
};
