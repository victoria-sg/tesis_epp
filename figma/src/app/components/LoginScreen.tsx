import { useState } from "react";
import { Eye, EyeOff, ChevronLeft, ShieldCheck } from "lucide-react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { ImageWithFallback } from "./figma/ImageWithFallback";

const backgroundImg =
  "https://images.unsplash.com/photo-1662447176130-60356c625453?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1920";
import type { LoggedUser } from "./data";

interface Props {
  preselectedUser: LoggedUser;
  onLogin: (user: LoggedUser) => void;
  onGoToReset: () => void;
  onChangeRole: () => void;
}

const ROLE_GRADIENT: Record<LoggedUser["rol"], string> = {
  supervisor: "from-[#2563eb] to-[#1d4ed8]",
  sso: "from-[#f97316] to-[#ea580c]",
  admin: "from-[#7c3aed] to-[#6d28d9]",
};

const ROLE_SHADOW: Record<LoggedUser["rol"], string> = {
  supervisor: "shadow-blue-500/30",
  sso: "shadow-orange-500/30",
  admin: "shadow-purple-500/30",
};

export function LoginScreen({ preselectedUser, onLogin, onGoToReset, onChangeRole }: Props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [touched, setTouched] = useState(false);

  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const passwordValid = password.length >= 8;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (emailValid && passwordValid) onLogin({ ...preselectedUser, correo: email });
  }

  const accentGradient = ROLE_GRADIENT[preselectedUser.rol];
  const accentShadow = ROLE_SHADOW[preselectedUser.rol];

  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      <ImageWithFallback
        src={backgroundImg}
        alt="Fondo EPP Monitor"
        className="absolute inset-0 w-full h-full object-cover"
      />

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
            Sistema de Monitoreo de<br />Equipos de Protección Personal
          </div>
          <div className="mt-10" style={{ fontSize: 16, letterSpacing: "0.02em", color: "#000", fontWeight: 500 }}>
            Seguridad pública, protección siempre
          </div>
        </div>

        {/* Login card */}
        <div className="w-full max-w-xl bg-white/95 backdrop-blur-md rounded-3xl shadow-2xl shadow-slate-900/40 ring-1 ring-white/40 p-12 md:p-16">

          {/* Role badge at top */}
          <div className="flex items-center justify-between mb-6">
            <button
              type="button"
              onClick={onChangeRole}
              className="flex items-center gap-1 text-gray-400 hover:text-gray-700 transition-colors"
              style={{ fontSize: 13 }}
            >
              <ChevronLeft size={16} /> Cambiar rol
            </button>
            <div
              className={`flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r ${accentGradient} text-white shadow-lg ${accentShadow}`}
            >
              <span className="h-1.5 w-1.5 rounded-full bg-white/80 animate-pulse" />
              <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.04em" }}>
                {preselectedUser.rolLabel}
              </span>
            </div>
          </div>

          <div className="text-center mb-6 mt-2" style={{ fontSize: 24, fontWeight: 700, color: "#0f172a", letterSpacing: "-0.01em" }}>
            Iniciar Sesión
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div>
              <label className="block mb-1.5" style={{ fontSize: 12, color: "#1a1a1a", fontWeight: 600 }}>
                Correo electrónico
              </label>
              <Input
                type="email"
                placeholder="tucorreo@empresa.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onBlur={() => setTouched(true)}
                className="h-12 rounded-md border-[1.5px] border-[#d4d4d4] bg-white focus-visible:ring-0"
                style={{
                  fontSize: 14,
                  borderColor: touched && !emailValid ? "#dc2626" : undefined,
                }}
                autoFocus
              />
              {touched && !emailValid && (
                <div className="mt-1.5" style={{ fontSize: 12, color: "#cc0000" }}>Correo no válido</div>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="block mb-1.5" style={{ fontSize: 12, color: "#1a1a1a", fontWeight: 600 }}>
                Contraseña
              </label>
              <div className="relative">
                <Input
                  type={showPass ? "text" : "password"}
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onBlur={() => setTouched(true)}
                  className="h-12 pr-10 rounded-md border-[1.5px] border-[#d4d4d4] bg-white focus-visible:ring-0"
                  style={{
                    fontSize: 14,
                    borderColor: touched && !passwordValid ? "#dc2626" : undefined,
                  }}
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
              {touched && !passwordValid && (
                <div className="mt-1.5" style={{ fontSize: 12, color: "#cc0000" }}>Mínimo 8 caracteres</div>
              )}
              <div className="mt-1.5" style={{ fontSize: 11, color: "#94a3b8" }}>
                Demo: ingresa cualquier contraseña de 8+ caracteres
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="button"
                onClick={onGoToReset}
                className="hover:text-[#3b82f6] transition-colors"
                style={{ fontSize: 13, color: "#6b6b6b" }}
              >
                ¿Olvidaste tu contraseña?
              </button>
            </div>

            <Button
              type="submit"
              disabled={!emailValid || !passwordValid}
              className={`w-full h-12 rounded-md bg-gradient-to-r ${accentGradient} text-white disabled:bg-[#d4d4d4] disabled:text-[#9a9a9a] shadow-lg ${accentShadow} disabled:shadow-none transition-all`}
              style={{ fontSize: 14, fontWeight: 600, letterSpacing: "0.02em" }}
            >
              Ingresar
            </Button>

          </form>
        </div>
      </div>
    </div>
  );
}
