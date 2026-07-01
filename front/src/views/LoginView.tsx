import { ChevronLeft, Eye, EyeOff, ShieldCheck } from "lucide-react";
import { useState } from "react";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { useLogin } from "../controllers/useLogin";
import type { Rol } from "../models/auth.model";
import { ROLE_STYLES } from "../models/auth.model";

const backgroundImg =
  "https://images.unsplash.com/photo-1662447176130-60356c625453?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1920";

interface Props {
  selectedRol: Rol;
  selectedRolLabel: string;
  onGoToReset: () => void;
  onChangeRole: () => void;
}

export const LoginView = ({
  selectedRol,
  selectedRolLabel,
  onGoToReset,
  onChangeRole,
}: Props) => {
  const [showPass, setShowPass] = useState(false);

  const { formik, serverError, handleSubmit } = useLogin({
    selectedRol,
    onGoToReset,
    onChangeRole,
  });

  const style = ROLE_STYLES[selectedRol];
  const accentGradient = style.gradient;

  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      <ImageWithFallback
        src={backgroundImg}
        alt="Fondo EPP Monitor"
        className="absolute inset-0 w-full h-full object-cover"
      />

      <div className="relative z-10 min-h-screen flex flex-col lg:flex-row items-center justify-between gap-10 px-6 py-10 md:px-16 lg:px-24">
        {/* Branding */}
        <div className="text-black max-w-xl text-center lg:ml-36">
          <div className="flex flex-col items-center gap-5">
            <div className="h-32 w-32 rounded-3xl bg-white/70 backdrop-blur-md ring-2 ring-black/20 flex items-center justify-center shadow-2xl">
              <ShieldCheck
                className="h-20 w-20 text-black"
                strokeWidth={1.75}
              />
            </div>
            <div className="text-[48px] font-extrabold tracking-[0.02em] text-black leading-tight">
              EPP MONITOR
            </div>
          </div>
          <div className="mt-8 text-2xl leading-[1.5] text-black font-semibold">
            Sistema de Monitoreo de
            <br />
            Equipos de Protección Personal
          </div>
          <div className="mt-10 text-base tracking-[0.02em] text-black font-medium">
            Seguridad pública, protección siempre
          </div>
        </div>

        {/* Login card */}
        <div className="w-full max-w-xl bg-white/95 backdrop-blur-md rounded-3xl shadow-2xl shadow-slate-900/40 ring-1 ring-white/40 p-12 md:p-16">
          {/* Role badge */}
          <div className="flex items-center justify-between mb-6">
            <button
              type="button"
              onClick={onChangeRole}
              className="flex items-center gap-1 text-gray-400 hover:text-gray-700 transition-colors text-[13px]"
            >
              <ChevronLeft size={16} /> Cambiar rol
            </button>
            <div
              className={`flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r ${accentGradient} text-white shadow-lg`}
            >
              <span className="h-1.5 w-1.5 rounded-full bg-white/80 animate-pulse" />
              <span className="text-[12px] font-bold tracking-[0.04em]">
                {selectedRolLabel}
              </span>
            </div>
          </div>

          <div className="text-center mb-6 mt-2 text-2xl font-bold text-slate-900 tracking-[-0.01em]">
            Iniciar Sesión
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
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

            {/* Password */}
            <div>
              <label className="block mb-1.5 text-[12px] text-[#1a1a1a] font-semibold">
                Contraseña
              </label>
              <div className="relative">
                <Input
                  type={showPass ? "text" : "password"}
                  placeholder="••••••••••••"
                  name="contrasena"
                  value={formik.values.contrasena}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className="pr-10 rounded-md"
                  style={{
                    fontSize: 14,
                    borderColor:
                      formik.touched.contrasena && formik.errors.contrasena
                        ? "#dc2626"
                        : undefined,
                  }}
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
              {formik.touched.contrasena && formik.errors.contrasena && (
                <div className="mt-1.5 text-[12px] text-red-600">
                  {formik.errors.contrasena}
                </div>
              )}
              <div className="mt-1.5 text-[11px] text-slate-400">
                Demo: admin@epp.com / admin123
              </div>
            </div>

            {serverError && (
              <div className="text-[12px] text-red-600 text-center">
                {serverError}
              </div>
            )}

            <div className="flex justify-end">
              <button
                type="button"
                onClick={onGoToReset}
                className="hover:text-blue-500 transition-colors text-[13px] text-[#6b6b6b]"
              >
                ¿Olvidaste tu contraseña?
              </button>
            </div>

            <Button
              type="submit"
              disabled={!formik.isValid || formik.isSubmitting}
              className={`w-full h-12 rounded-md bg-gradient-to-r ${accentGradient} text-white shadow-lg disabled:bg-[#d4d4d4] disabled:text-[#9a9a9a] disabled:shadow-none transition-all`}
              style={{ fontSize: 14, fontWeight: 600, letterSpacing: "0.02em" }}
            >
              {formik.isSubmitting ? "Ingresando..." : "Ingresar"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};
