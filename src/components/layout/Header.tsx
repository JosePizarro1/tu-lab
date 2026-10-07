"use client";

import React, { useState } from 'react';
import { 
  IconBuilding, 
  IconPower, 
  IconChevronDown
} from '@tabler/icons-react';
import { Sede, Usuario } from '@/services/db';

interface HeaderProps {
  sedes: Sede[];
  sedeActivaId: string;
  onSelectSede: (sedeId: string) => void;
  usuario: Usuario | null;
  onLogout: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  sedes,
  sedeActivaId,
  onSelectSede,
  onLogout,
}) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const sedeActivaObj = sedes.find((s) => s.id === sedeActivaId);
  const rawNombre = sedeActivaId === 'ALL' ? 'Todas las Sedes' : (sedeActivaObj?.nombre || sedeActivaId);
  // Limpiar si ya incluye "Sede " para evitar "Sede Sede ..."
  const displaySedeNombre = rawNombre.startsWith('Sede ') ? rawNombre : `Sede ${rawNombre}`;

  return (
    <header className="h-16 bg-white/80 backdrop-blur-md border-b border-slate-200/70 px-4 sm:px-8 flex items-center justify-between sticky top-0 z-30 shadow-2xs">
      {/* Brand Mobile */}
      <div className="flex items-center gap-2 md:hidden">
        <img 
          src="/logo-unidoslab-opt.webp" 
          alt="UNIDOSLAB" 
          width={120}
          height={38}
          decoding="async"
          className="h-7 w-auto object-contain" 
        />
      </div>

      {/* Breadcrumb / Title Info (Desktop) */}
      <div className="hidden md:flex items-center gap-2 text-xs">
        <span className="text-slate-400 font-medium">Portal Clínico</span>
        <span className="text-slate-200 font-bold">/</span>
        <span className="text-slate-900 font-extrabold tracking-tight">UNIDOSLAB LIS</span>
        <span className="ml-2 px-2 py-0.5 bg-[#fff0f1] text-[#fb5962] border border-[#fb5962]/20 rounded-md text-[10px] font-extrabold uppercase">
          v2026
        </span>
      </div>

      {/* Sede Selector + Logout (Right) */}
      <div className="flex items-center gap-3">
        {/* Sede Selector */}
        <div className="relative">
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            className="flex items-center bg-white hover:bg-[#fff0f1]/50 border border-slate-200/80 rounded-xl px-3.5 py-2 gap-2 text-xs font-bold text-slate-800 shadow-2xs transition-all cursor-pointer hover:border-[#fb5962]/30"
          >
            <div className="w-5 h-5 rounded-lg bg-[#fff0f1] text-[#fb5962] flex items-center justify-center">
              <IconBuilding className="w-3.5 h-3.5" />
            </div>
            <span>{displaySedeNombre}</span>
            <IconChevronDown
              className={`w-3.5 h-3.5 text-slate-400 transition-transform ${showDropdown ? 'rotate-180' : ''}`}
            />
          </button>


          {showDropdown && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setShowDropdown(false)}></div>
              <div className="absolute right-0 mt-2 w-52 bg-white border border-slate-200/80 rounded-2xl shadow-xl py-1.5 z-50 animate-in fade-in zoom-in-95 duration-100">
                {/* Opción Todas las Sedes */}
                <button
                  onClick={() => {
                    onSelectSede('ALL');
                    setShowDropdown(false);
                  }}
                  className={`w-full text-left px-4 py-2.5 text-xs font-bold transition-colors flex items-center gap-2.5 cursor-pointer border-b border-slate-100 ${
                    sedeActivaId === 'ALL'
                      ? 'text-[#fb5962] bg-[#fff0f1]'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  <span className={`w-2 h-2 rounded-full ${sedeActivaId === 'ALL' ? 'bg-[#fb5962]' : 'bg-slate-300'}`}></span>
                  Todas las Sedes
                </button>

                {/* Lista de Sedes registradas */}
                {sedes.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => {
                      onSelectSede(s.id);
                      setShowDropdown(false);
                    }}
                    className={`w-full text-left px-4 py-2.5 text-xs font-bold transition-colors flex items-center gap-2.5 cursor-pointer ${
                      sedeActivaId === s.id
                        ? 'text-[#fb5962] bg-[#fff0f1]'
                        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                    }`}
                  >
                    <span className={`w-2 h-2 rounded-full ${sedeActivaId === s.id ? 'bg-[#fb5962]' : 'bg-slate-300'}`}></span>
                    {s.nombre}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Mobile Logout */}
        <button
          onClick={onLogout}
          className="p-2 bg-rose-50 text-rose-600 hover:bg-rose-100 rounded-xl cursor-pointer md:hidden border border-rose-100"
          title="Cerrar Sesión"
        >
          <IconPower className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
};
