import axios from "axios";
import { useFormik } from "formik";
import { useCallback, useState } from "react";
import { solicitarRecuperacion } from "../services/auth.service";
import {
  forgotPasswordSchema,
  type ForgotPasswordFormValues,
} from "../validators/forgotPassword.schema";

export const useForgotPassword = () => {
  const [enviado, setEnviado] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const formik = useFormik<ForgotPasswordFormValues>({
    initialValues: { correo: "" },
    validationSchema: forgotPasswordSchema,
    validateOnBlur: true,
    validateOnChange: false,
    onSubmit: async (values) => {
      setServerError(null);
      try {
        await solicitarRecuperacion({ correo: values.correo });
        setEnviado(true);
      } catch (error) {
        if (axios.isAxiosError(error) && error.response?.status === 404) {
          setServerError("No existe ninguna cuenta registrada con ese correo.");
        } else {
          setServerError(
            "No se pudo enviar el correo. Intenta de nuevo más tarde.",
          );
        }
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

  return { formik, enviado, serverError, handleSubmit };
};