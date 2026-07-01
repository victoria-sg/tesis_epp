import { ArrowLeft, MailCheck, ShieldCheck } from "lucide-react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { useForgotPassword } from "../controllers/useForgotPassword";

interface Props {
  onBackToLogin: () => void;
}

export const ForgotPasswordView = ({ onBackToLogin }: Props) => {
  const { formik, enviado, serverError, handleSubmit } = useForgotPassword();

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-[#0a1628] via-[#0f2744] to-[#1a3a5c] px-6 py-10">
      <div className="w-full max-w-md bg-white/95 backdrop-blur-md rounded-3xl shadow-2xl shadow-slate-900/40 ring-1 ring-white/40 p-10 md:p-12">
        <div className="flex flex-col items-center gap-3 mb-6">
          <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-[#8b5cf6] to-[#7c3aed] flex items-center justify-center shadow-lg shadow-purple-500/30">
            <ShieldCheck className="h-8 w-8 text-white" strokeWidth={1.75} />
          </div>
          <div className="text-2xl font-bold text-slate-900 text-center tracking-[-0.01em]">
            Recuperar contraseña
          </div>
          <div className="text-[13px] text-[#6b6b6b] text-center">
            Ingresa tu correo y te enviaremos un enlace para definir una
            contraseña nueva.
          </div>
        </div>

        {enviado ? (
          <div className="flex flex-col items-center gap-4 py-4 text-center">
            <MailCheck className="h-10 w-10 text-emerald-600" />
            <div className="text-[14px] text-slate-700">
              Te enviamos un enlace de recuperación a tu correo. Revisa tu
              bandeja de entrada (y la carpeta de spam) en los próximos
              minutos.
            </div>
            <button
              type="button"
              onClick={onBackToLogin}
              className="text-[13px] text-blue-600 hover:text-blue-700 font-semibold transition-colors"
            >
              Volver a iniciar sesión
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block mb-1.5 text-[12px] text-[#1a1a1a] font-semibold">
                Correo electrónico
              </label>
              <Input
                type="email"
                placeholder="tucorreo@empresa.com"
                name="correo"
                value={formik.values.correo}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="rounded-md"
                style={{
                  fontSize: 14,
                  borderColor:
                    formik.touched.correo && formik.errors.correo
                      ? "#dc2626"
                      : undefined,
                }}
                autoFocus
              />
              {formik.touched.correo && formik.errors.correo && (
                <div className="mt-1.5 text-[12px] text-red-600">
                  {formik.errors.correo}
                </div>
              )}
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
              {formik.isSubmitting ? "Enviando..." : "Enviar enlace"}
            </Button>

            <button
              type="button"
              onClick={onBackToLogin}
              className="w-full flex items-center justify-center gap-1.5 text-[13px] text-[#6b6b6b] hover:text-blue-500 transition-colors"
            >
              <ArrowLeft size={14} /> Volver a iniciar sesión
            </button>
          </form>
        )}
      </div>
    </div>
  );
};