import * as Yup from "yup";

// ─── Reglas de contraseña segura (deben coincidir con el backend) ────────────
// Mínimo 8 caracteres, una mayúscula, una minúscula, un número y un
// carácter especial. Ver app/core/security.py (es_password_segura) en el back.

export const passwordSeguraSchema = Yup.string()
  .required("La contraseña es obligatoria")
  .min(8, "Mínimo 8 caracteres")
  .matches(/[a-z]/, "Debe incluir al menos una letra minúscula")
  .matches(/[A-Z]/, "Debe incluir al menos una letra mayúscula")
  .matches(/\d/, "Debe incluir al menos un número")
  .matches(/[^A-Za-z0-9]/, "Debe incluir al menos un carácter especial");

export const confirmarPasswordSchema = (ref: string) =>
  Yup.string()
    .required("Confirma la contraseña")
    .oneOf([Yup.ref(ref)], "Las contraseñas no coinciden");
