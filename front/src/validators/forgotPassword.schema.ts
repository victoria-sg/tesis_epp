import * as Yup from "yup";

export const forgotPasswordSchema = Yup.object({
  correo: Yup.string()
    .email("Correo no válido")
    .required("El correo es obligatorio"),
});

export type ForgotPasswordFormValues = Yup.InferType<
  typeof forgotPasswordSchema
>;
