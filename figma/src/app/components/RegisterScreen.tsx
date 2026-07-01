import { useState } from "react";
import { Eye, EyeOff, ArrowLeft, ShieldCheck } from "lucide-react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { ImageWithFallback } from "./figma/ImageWithFallback";

const backgroundImg =
  "https://images.unsplash.com/photo-1662447176130-60356c625453?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1920";

interface Props {
  onRegister: () => void;
  onBackToLogin: () => void;
}

export function RegisterScreen({ onRegister, onBackToLogin }: Props) {
  const [formData, setFormData] = useState({
    nombre: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [showPass, setShowPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);
  const [touched, setTouched] = useState({
    nombre: false,
    email: false,
    password: false,
    confirmPassword: false,
  });

  const nombreValid = formData.nombre.length >= 3;
  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email);
  const passwordValid = formData.password.length >= 8;
  const confirmPasswordValid = formData.password === formData.confirmPassword && formData.confirmPassword.length > 0;
  const formValid = nombreValid && emailValid && passwordValid && confirmPasswordValid;

  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      {/* Fullscreen background image */}
      <ImageWithFallback
        src={backgroundImg}
        alt="Fondo EPP Monitor"
        className="absolute inset-0 w-full h-full object-cover"
      />

      {/* Content layer */}
      <div className="relative z-10 min-h-screen flex flex-col lg:flex-row items-center justify-between gap-10 px-6 py-10 md:px-16 lg:px-24">
        {/* Branding */}
        <div className="text-black max-w-xl text-center ml-36">
          <div className="flex flex-col items-center gap-5">
            <div className="h-32 w-32 rounded-3xl bg-white/70 backdrop-blur-md ring-2 ring-black/20 flex items-center justify-center shadow-2xl">
              <ShieldCheck className="h-20 w-20 text-black" strokeWidth={1.75} />
            </div>
            <div style={{ fontSize: 48, fontWeight: 800, letterSpacing: "0.02em", color: "#000" }}>EPP MONITOR</div>
          </div>

          <div className="mt-8" style={{ fontSize: 24, lineHeight: 1.5, color: "#000", fontWeight: 600 }}>
            Sistema de Monitoreo de
            <br />
            Equipos de Protección Personal
          </div>

          <div className="mt-10" style={{ fontSize: 16, letterSpacing: "0.02em", color: "#000", fontWeight: 500 }}>
            Seguridad pública, protección siempre
          </div>
        </div>

        {/* Floating card */}
        <div className="w-full max-w-xl bg-white/95 backdrop-blur-md rounded-3xl shadow-2xl shadow-slate-900/40 ring-1 ring-white/40 p-12 md:p-16">
          <button
            onClick={onBackToLogin}
            className="flex items-center gap-2 text-[#6b6b6b] hover:text-[#3b82f6] transition-colors mb-6"
            style={{ fontSize: 13 }}
          >
            <ArrowLeft size={16} />
            Volver al inicio
          </button>

          <div className="text-center" style={{ fontSize: 32, fontWeight: 700, color: "#000", letterSpacing: "-0.01em" }}>
            Crear Cuenta
          </div>
          <div className="mt-2 text-center" style={{ fontSize: 14, color: "#6b6b6b" }}>
            Complete los datos para registrarse
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (formValid) onRegister();
            }}
            className="space-y-5 mt-8"
          >
            <div>
              <label className="block mb-1.5" style={{ fontSize: 12, color: "#1a1a1a", fontWeight: 600 }}>
                Nombre completo
              </label>
              <Input
                type="text"
                placeholder="Juan Pérez"
                value={formData.nombre}
                onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                onBlur={() => setTouched((t) => ({ ...t, nombre: true }))}
                className="h-12 rounded-md border-[1.5px] border-[#d4d4d4] bg-white focus-visible:border-[#3b82f6] focus-visible:ring-blue-500/10"
                style={{ fontSize: 14 }}
              />
              {touched.nombre && !nombreValid && (
                <div className="mt-1.5" style={{ fontSize: 12, color: "#cc0000" }}>Mínimo 3 caracteres</div>
              )}
            </div>

            <div>
              <label className="block mb-1.5" style={{ fontSize: 12, color: "#1a1a1a", fontWeight: 600 }}>
                Correo electrónico
              </label>
              <Input
                type="email"
                placeholder="usuario@empresa.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                onBlur={() => setTouched((t) => ({ ...t, email: true }))}
                className="h-12 rounded-md border-[1.5px] border-[#d4d4d4] bg-white focus-visible:border-[#3b82f6] focus-visible:ring-blue-500/10"
                style={{ fontSize: 14 }}
              />
              {touched.email && !emailValid && (
                <div className="mt-1.5" style={{ fontSize: 12, color: "#cc0000" }}>Correo no válido</div>
              )}
            </div>

            <div>
              <label className="block mb-1.5" style={{ fontSize: 12, color: "#1a1a1a", fontWeight: 600 }}>
                Contraseña
              </label>
              <div className="relative">
                <Input
                  type={showPass ? "text" : "password"}
                  placeholder="••••••••••••"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  onBlur={() => setTouched((t) => ({ ...t, password: true }))}
                  className="h-12 pr-10 rounded-md border-[1.5px] border-[#d4d4d4] bg-white focus-visible:border-[#3b82f6] focus-visible:ring-blue-500/10"
                  style={{ fontSize: 14 }}
                />
                <button
                  type="button"
                  onClick={() => setShowPass((s) => !s)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6b6b6b] hover:text-[#3b82f6]"
                  tabIndex={-1}
                >
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {touched.password && !passwordValid && (
                <div className="mt-1.5" style={{ fontSize: 12, color: "#cc0000" }}>Mínimo 8 caracteres</div>
              )}
            </div>

            <div>
              <label className="block mb-1.5" style={{ fontSize: 12, color: "#1a1a1a", fontWeight: 600 }}>
                Confirmar contraseña
              </label>
              <div className="relative">
                <Input
                  type={showConfirmPass ? "text" : "password"}
                  placeholder="••••••••••••"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  onBlur={() => setTouched((t) => ({ ...t, confirmPassword: true }))}
                  className="h-12 pr-10 rounded-md border-[1.5px] border-[#d4d4d4] bg-white focus-visible:border-[#3b82f6] focus-visible:ring-blue-500/10"
                  style={{ fontSize: 14 }}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPass((s) => !s)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6b6b6b] hover:text-[#3b82f6]"
                  tabIndex={-1}
                >
                  {showConfirmPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {touched.confirmPassword && !confirmPasswordValid && (
                <div className="mt-1.5" style={{ fontSize: 12, color: "#cc0000" }}>Las contraseñas no coinciden</div>
              )}
            </div>

            <Button
              type="submit"
              disabled={!formValid}
              className="w-full h-12 rounded-md bg-gradient-to-r from-[#3b82f6] to-[#2563eb] hover:from-[#2563eb] hover:to-[#1e40af] text-white disabled:bg-[#d4d4d4] disabled:text-[#9a9a9a] shadow-lg shadow-blue-500/30 disabled:shadow-none transition-all"
              style={{ fontSize: 14, fontWeight: 600, letterSpacing: "0.02em" }}
            >
              Crear Cuenta
            </Button>

            <div className="text-center pt-2" style={{ fontSize: 13, color: "#6b6b6b" }}>
              ¿Ya tienes cuenta?{" "}
              <button type="button" onClick={onBackToLogin} className="text-[#3b82f6] hover:underline" style={{ fontWeight: 600 }}>
                Inicia sesión
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
