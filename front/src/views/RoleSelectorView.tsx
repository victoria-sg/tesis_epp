import { ArrowRight, Cog, HardHat, Lock, ShieldCheck } from "lucide-react";
import { useRoleSelector } from "../controllers/useRoleSelector";
import type { Rol } from "../models/auth.model";
import { ROLE_INFO, ROLE_STYLES } from "../models/auth.model";

const ICONS = { HardHat, ShieldCheck, Cog };

interface Props {
  onSelect: (rol: Rol) => void;
}

export const RoleSelectorView = ({ onSelect }: Props) => {
  const { roles, onSelect: handleSelect } = useRoleSelector({ onSelect });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto bg-slate-900/40">
      <div className="relative z-10 w-full max-w-2xl my-auto bg-white rounded-2xl shadow-2xl ring-1 ring-black/10 p-12">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-3 mb-5">
            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-500 to-blue-700 shadow-md flex items-center justify-center">
              <ShieldCheck className="w-8 h-8 text-white" strokeWidth={2} />
            </div>
            <div className="text-left">
              <div className="text-[22px] font-extrabold text-slate-900 tracking-[0.02em] leading-none">
                EPP Monitor
              </div>
              <div className="text-[11px] font-bold text-blue-600 tracking-[0.18em] uppercase mt-1.5">
                Sistema de Gestión
              </div>
            </div>
          </div>

          <h1 className="text-[28px] font-extrabold text-slate-900 tracking-[-0.01em]">
            Bienvenido al sistema
          </h1>
          <p className="text-[15px] text-slate-500 mt-2">
            Selecciona el perfil con el que deseas iniciar sesión
          </p>
        </div>

        {/* Role list */}
        <div className="flex flex-col gap-4">
          {roles.map(({ rol }) => {
            const style = ROLE_STYLES[rol];
            const info = ROLE_INFO[rol];
            const IconComponent = ICONS[style.iconName];

            return (
              <button
                key={rol}
                onClick={() => handleSelect(rol)}
                className={`group flex items-center gap-5 text-left rounded-xl bg-white border border-slate-200 px-5 py-4 transition-all hover:shadow-md ${style.ring}`}
              >
                <div
                  className={`shrink-0 w-14 h-14 rounded-xl bg-gradient-to-br ${style.gradient} flex items-center justify-center shadow-md`}
                >
                  <IconComponent className="w-7 h-7 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-[16px] font-bold text-slate-900 leading-tight">
                    {info.title}
                  </div>
                  <div className="text-[13px] text-slate-500 mt-1 leading-relaxed">
                    {info.subtitle}
                  </div>
                </div>
                <ArrowRight
                  className="shrink-0 w-5 h-5 transition-transform group-hover:translate-x-1"
                  style={{ color: style.hex }}
                />
              </button>
            );
          })}
        </div>

        {/* Footer */}
        <div className="mt-6 flex items-center justify-center gap-2 text-slate-400">
          <Lock className="w-3.5 h-3.5" />
          <span className="text-[11px]">
            Conexión segura · Seguridad que te protege, tecnología que te cuida.
          </span>
        </div>
      </div>
    </div>
  );
};
