"use client";

import React, { useState } from 'react';
import { IconBuilding, IconPower, IconHexagon, IconChevronDown } from '@tabler/icons-react';
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
  usuario,
  onLogout,
}) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const sedeActiva = sedes.find((s) => s.id === sedeActivaId)?.nombre || sedeActivaId;

  return (
    <header className="h-16 bg-white border-b border-slate-100 px-4 sm:px-6 flex items-center justify-between shadow-xs sticky top-0 z-30">
      {/* Brand Mobile */}
      <div className="flex items-center gap-2 md:hidden">
        <IconHexagon className="w-6 h-6 text-cerulean fill-cerulean/20" />
        <span className="font-jakarta font-extrabold text-base tracking-tight text-slate-800">
          AQUA<span className="text-cerulean">LAB</span>
        </span>
      </div>

      {/* Breadcrumb / Title Info */}
      <div className="hidden md:flex items-center gap-2">
        <span className="text-slate-400 text-xs font-semibold">Hola,</span>
        <span className="text-slate-800 font-bold text-xs">{usuario?.nombre || 'Usuario'}</span>
        <span className="px-2 py-0.5 bg-cerulean/10 text-cerulean text-[10px] font-extrabold rounded-md uppercase">
          {usuario?.rol || 'Personal'}
        </span>
      </div>

      {/* Sede Selector */}
      <div className="flex items-center gap-3">
        <div className="relative">
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            className="flex items-center bg-slate-50 border border-slate-200 hover:bg-slate-100/60 rounded-xl px-3 py-2 gap-2 text-xs font-bold text-slate-700 transition-colors cursor-pointer"
          >
            <IconBuilding className="w-4 h-4 text-cerulean" />
            <span>Sede {sedeActiva}</span>
            <IconChevronDown
              className={`w-3.5 h-3.5 text-slate-400 transition-transform ${showDropdown ? 'rotate-180' : ''}`}
            />
          </button>

          {showDropdown && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setShowDropdown(false)}></div>
              <div className="absolute right-0 mt-2 w-44 bg-white border border-slate-100 rounded-xl shadow-lg py-1.5 z-50">
                {sedes.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => {
                      onSelectSede(s.id);
                      setShowDropdown(false);
                    }}
                    className={`w-full text-left px-4 py-2.5 text-xs font-bold transition-colors flex items-center gap-2 cursor-pointer ${
                      sedeActivaId === s.id
                        ? 'text-cerulean bg-cerulean/5'
                        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-800'
                    }`}
                  >
                    <span className={`w-1.5 h-1.5 rounded-full ${sedeActivaId === s.id ? 'bg-cerulean' : 'bg-transparent'}`}></span>
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
          className="p-2 bg-rose-50 text-rose-500 hover:bg-rose-100 rounded-xl cursor-pointer md:hidden"
          title="Cerrar Sesión"
        >
          <IconPower className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
};
