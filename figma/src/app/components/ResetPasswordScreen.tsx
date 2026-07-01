import { useState } from "react";
import { ArrowLeft, Mail, ShieldCheck } from "lucide-react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { ImageWithFallback } from "./figma/ImageWithFallback";

const backgroundImg =
  "https://images.unsplash.com/photo-1662447176130-60356c625453?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1920";

interface Props {
  onReset: () => void;
  onBackToLogin: () => void;
}

export function ResetPasswordScreen({ onReset, onBackToLogin }: Props) {
  const [email, setEmail] = useState("");
  const [touched, setTouched] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (emailValid) {
      setEmailSent(true);
      setTimeout(() => {
        onReset();
      }, 2000);
    }
  };

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

          {!emailSent ? (
            <>
              <div className="text-center" style={{ fontSize: 32, fontWeight: 700, color: "#000", letterSpacing: "-0.01em" }}>
                Restablecer Contraseña
              </div>
              <div className="mt-2 text-center" style={{ fontSize: 14, color: "#6b6b6b" }}>
                Ingrese su correo para recibir instrucciones
              </div>

              <form onSubmit={handleSubmit} className="space-y-5 mt-8">
                <div>
                  <label className="block mb-1.5" style={{ fontSize: 12, color: "#1a1a1a", fontWeight: 600 }}>
                    Correo electrónico
                  </label>
                  <Input
                    type="email"
                    placeholder="usuario@empresa.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onBlur={() => setTouched(true)}
                    className="h-12 rounded-md border-[1.5px] border-[#d4d4d4] bg-white focus-visible:border-[#3b82f6] focus-visible:ring-blue-500/10"
                    style={{ fontSize: 14 }}
                  />
                  {touched && !emailValid && (
                    <div className="mt-1.5" style={{ fontSize: 12, color: "#cc0000" }}>Correo no válido</div>
                  )}
                </div>

                <Button
                  type="submit"
                  disabled={!emailValid}
                  className="w-full h-12 rounded-md bg-gradient-to-r from-[#3b82f6] to-[#2563eb] hover:from-[#2563eb] hover:to-[#1e40af] text-white disabled:bg-[#d4d4d4] disabled:text-[#9a9a9a] shadow-lg shadow-blue-500/30 disabled:shadow-none transition-all"
                  style={{ fontSize: 14, fontWeight: 600, letterSpacing: "0.02em" }}
                >
                  Enviar Instrucciones
                </Button>

                <div className="text-center pt-2" style={{ fontSize: 13, color: "#6b6b6b" }}>
                  ¿Recordaste tu contraseña?{" "}
                  <button type="button" onClick={onBackToLogin} className="text-[#3b82f6] hover:underline" style={{ fontWeight: 600 }}>
                    Inicia sesión
                  </button>
                </div>
              </form>
            </>
          ) : (
            <div className="text-center py-8">
              <div className="h-16 w-16 mx-auto rounded-full bg-gradient-to-br from-[#10b981] to-[#059669] flex items-center justify-center shadow-xl shadow-green-500/30 mb-6">
                <Mail size={28} className="text-white" />
              </div>
              <div style={{ fontSize: 28, fontWeight: 700, color: "#000", letterSpacing: "-0.01em" }}>
                Correo Enviado
              </div>
              <div className="mt-3" style={{ fontSize: 14, color: "#6b6b6b", lineHeight: 1.6 }}>
                Hemos enviado las instrucciones para restablecer tu contraseña a <span className="font-semibold text-[#3b82f6]">{email}</span>
              </div>
              <div className="mt-6" style={{ fontSize: 13, color: "#6b6b6b" }}>
                Revisa tu bandeja de entrada y sigue los pasos indicados
              </div>
              <Button
                onClick={onBackToLogin}
                className="w-full h-12 rounded-md bg-gradient-to-r from-[#3b82f6] to-[#2563eb] hover:from-[#2563eb] hover:to-[#1e40af] text-white shadow-lg shadow-blue-500/30 transition-all mt-8"
                style={{ fontSize: 14, fontWeight: 600, letterSpacing: "0.02em" }}
              >
                Volver al Inicio
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
