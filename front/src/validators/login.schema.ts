import * as Yup from "yup";

export const loginSchema = Yup.object({
  correo: Yup.string()
    .email("Correo no válido")
    .required("El correo es obligatorio"),
  contrasena: Yup.string()
    .min(8, "Mínimo 8 caracteres")
    .required("La contraseña es obligatoria"),
});

export type LoginFormValues = Yup.InferType<typeof loginSchema>;
