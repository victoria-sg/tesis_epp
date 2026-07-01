import { CheckCircle2, Eye, EyeOff, ShieldAlert, ShieldCheck } from "lucide-react";
import { useState } from "react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { useResetPassword } from "../controllers/useResetPassword";

export const ResetPasswordView = () => {
  const {
    formik,
    serverError,
    exito,
    handleSubmit,
    tokenPresente,
    goToLogin,
  } = useResetPassword();
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-[#0a1628] via-[#0f2744] to-[#1a3a5c] px-6 py-10">
      <div className="w-full max-w-md bg-white/95 backdrop-blur-md rounded-3xl shadow-2xl shadow-slate-900/40 ring-1 ring-white/40 p-10 md:p-12">
        <div className="flex flex-col items-center gap-3 mb-6">
          <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-[#8b5cf6] to-[#7c3aed] flex items-center justify-center shadow-lg shadow-purple-500/30">
            <ShieldCheck className="h-8 w-8 text-white" strokeWidth={1.75} />
          </div>
          <div className="text-2xl font-bold text-slate-900 text-center tracking-[-0.01em]">
            Nueva contraseña
          </div>
        </div>

        {!tokenPresente ? (
          <div className="flex flex-col items-center gap-3 py-4 text-center">
            <ShieldAlert className="h-10 w-10 text-amber-500" />
            <div className="text-[14px] text-slate-700">
              Este enlace no es válido. Solicita uno nuevo desde la pantalla
              de inicio de sesión.
            </div>
            <button
              type="button"
              onClick={goToLogin}
              className="text-[13px] text-blue-600 hover:text-blue-700 font-semibold transition-colors"
            >
              Ir a iniciar sesión
            </button>
          </div>
        ) : exito ? (
          <div className="flex flex-col items-center gap-4 py-4 text-center">
            <CheckCircle2 className="h-10 w-10 text-emerald-600" />
            <div className="text-[14px] text-slate-700">
              Tu contraseña fue actualizada correctamente.
            </div>
            <Button
              type="button"
              onClick={goToLogin}
              className="w-full h-12 rounded-md bg-gradient-to-r from-[#7c3aed] to-[#6d28d9] text-white shadow-lg"
              style={{ fontSize: 14, fontWeight: 600 }}
            >
              Iniciar sesión
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block mb-1.5 text-[12px] text-[#1a1a1a] font-semibold">
                Nueva contraseña
              </label>
              <div className="relative">
                <Input
                  type={showPass ? "text" : "password"}
                  placeholder="••••••••••••"
                  name="nueva_contrasena"
                  value={formik.values.nueva_contrasena}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className="pr-10 rounded-md"
                  style={{
                    fontSize: 14,
                    borderColor:
                      formik.touched.nueva_contrasena &&
                      formik.errors.nueva_contrasena
                        ? "#dc2626"
                        : undefined,
                  }}
                  autoFocus
                />
                <button
                  type="button"
                  onClick={() => setShowPass((s) => !s)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6b6b6b] hover:text-blue-500 transition-colors"
                  tabIndex={-1}
                >
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {formik.touched.nueva_contrasena &&
                formik.errors.nueva_contrasena && (
                  <div className="mt-1.5 text-[12px] text-red-600">
                    {formik.errors.nueva_contrasena}
                  </div>
                )}
            </div>

            <div>
              <label className="block mb-1.5 text-[12px] text-[#1a1a1a] font-semibold">
                Confirmar contraseña
              </label>
              <div className="relative">
                <Input
                  type={showConfirm ? "text" : "password"}
                  placeholder="••••••••••••"
                  name="confirmar_contrasena"
                  value={formik.values.confirmar_contrasena}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className="pr-10 rounded-md"
                  style={{
                    fontSize: 14,
                    borderColor:
                      formik.touched.confirmar_contrasena &&
                      formik.errors.confirmar_contrasena
                        ? "#dc2626"
                        : undefined,
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm((s) => !s)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6b6b6b] hover:text-blue-500 transition-colors"
                  tabIndex={-1}
                >
                  {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {formik.touched.confirmar_contrasena &&
                formik.errors.confirmar_contrasena && (
                  <div className="mt-1.5 text-[12px] text-red-600">
                    {formik.errors.confirmar_contrasena}
                  </div>
                )}
            </div>

            <div className="text-[11px] text-[#6b6b6b] -mt-1">
              Mínimo 8 caracteres, con mayúscula, minúscula, número y
              carácter especial.
            </div>

            {serverError && (
              <div className="text-[12px] text-red-600 text-center">
                {serverError}
              </div>
            )}

            <Button
              type="submit"
              disabled={!formik.isValid || formik.isSubmitting}
              className="w-full h-12 rounded-md bg-gradient-to-r from-[#7c3aed] to-[#6d28d9] text-white shadow-lg disabled:bg-[#d4d4d4] disabled:text-[#9a9a9a] disabled:shadow-none transition-all"
              style={{ fontSize: 14, fontWeight: 600, letterSpacing: "0.02em" }}
            >
              {formik.isSubmitting ? "Guardando..." : "Guardar nueva contraseña"}
            </Button>
          </form>
        )}
      </div>
    </div>
  );
};
