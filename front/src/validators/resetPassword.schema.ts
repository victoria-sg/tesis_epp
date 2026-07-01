import * as Yup from "yup";
import { confirmarPasswordSchema, passwordSeguraSchema } from "./password.rules";

export const resetPasswordSchema = Yup.object({
  nueva_contrasena: passwordSeguraSchema,
  confirmar_contrasena: confirmarPasswordSchema("nueva_contrasena"),
});

export type ResetPasswordFormValues = Yup.InferType<
  typeof resetPasswordSchema
>;
