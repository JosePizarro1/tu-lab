"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  IconLayoutDashboard, 
  IconUsers, 
  IconClipboardList, 
  IconFlask, 
  IconBuilding, 
  IconPower,
  IconShieldCheck,
  IconStethoscope,
  IconHeadset,
  IconUserCheck
} from '@tabler/icons-react';
import { Usuario } from '@/services/db';
import { UserRole, ROLES, hasPermission } from '@/types/roles';

interface SidebarProps {
  onLogout: () => void;
  usuario?: Usuario | null;
  rolUsuario?: UserRole | string;
}

export const Sidebar: React.FC<SidebarProps> = ({ onLogout, usuario, rolUsuario }) => {
  const pathname = usePathname();
  const currentRole = usuario?.rol || rolUsuario;

  const menuItems = [
    { label: 'Resumen General', path: '/dashboard', icon: IconLayoutDashboard },
    { label: 'Pacientes', path: '/dashboard/pacientes', icon: IconUsers },
    { label: 'Resultados Clínicos', path: '/dashboard/resultados', icon: IconClipboardList },
    { label: 'Inventario / Reactivos', path: '/dashboard/inventario', icon: IconFlask },
    { label: 'Sedes', path: '/dashboard/sedes', icon: IconBuilding },
    { label: 'Usuarios y Accesos', path: '/dashboard/usuarios', icon: IconUserCheck },
  ];

  const visibleMenuItems = menuItems.filter((item) => hasPermission(currentRole, item.path));

  const getRoleBadge = (rol?: string) => {
    switch (rol) {
      case ROLES.ADMIN:
        return { label: 'Administrador', icon: IconShieldCheck, color: 'text-indigo-600 bg-indigo-50 border-indigo-100' };
      case ROLES.DOCTOR:
        return { label: 'Médico / Analista', icon: IconStethoscope, color: 'text-emerald-600 bg-emerald-50 border-emerald-100' };
      case ROLES.RECEPCIONISTA:
        return { label: 'Recepción', icon: IconHeadset, color: 'text-amber-600 bg-amber-50 border-amber-100' };
      default:
        return { label: rol || 'Personal', icon: IconUsers, color: 'text-slate-600 bg-slate-50 border-slate-200' };
    }
  };

  const roleInfo = getRoleBadge(usuario?.rol);
  const RoleIcon = roleInfo.icon;
  const initialLetter = usuario?.nombre ? usuario.nombre.charAt(0).toUpperCase() : 'U';

  return (
    <>
      {/* Sidebar Desktop */}
      <aside className="w-64 bg-white border-r border-slate-200/80 hidden md:flex flex-col justify-between h-screen sticky top-0 z-40 shadow-xs">
        <div>
          {/* Logo & Header */}
          <div className="h-16 flex items-center px-6 border-b border-slate-100">
            <Link href="/dashboard" className="flex items-center gap-2.5">
              <img 
                src="/logo-unidoslab-opt.webp" 
                alt="UNIDOSLAB" 
                width={132}
                height={42}
                decoding="async"
                className="h-8 w-auto object-contain" 
              />
            </Link>
          </div>

          {/* Navigation Links */}
          <div className="p-4 space-y-1.5">
            <p className="px-3 pb-2 text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
              Menú Principal
            </p>
            {visibleMenuItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.path;

              return (
                <Link
                  key={item.path}
                  href={item.path}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-[#fb5962] text-white shadow-md shadow-rose-500/20 font-bold translate-x-1'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-[#fff0f1]/70 hover:translate-x-0.5'
                  }`}
                >
                  <Icon className={`w-4 h-4 stroke-[2] ${isActive ? 'text-white' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Footer / User Profile Card */}
        <div className="p-4 border-t border-slate-100 bg-slate-50/50 space-y-2">
          {/* User Card */}
          <div className="bg-white border border-slate-200/70 rounded-2xl p-3 shadow-2xs flex items-center justify-between gap-2.5">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-9 h-9 rounded-xl bg-[#fb5962] text-white flex items-center justify-center font-extrabold text-sm shadow-xs shrink-0">
                {initialLetter}
              </div>
              <div className="min-w-0">
                <p className="font-bold text-xs text-slate-800 truncate leading-tight">
                  {usuario?.nombre || 'Usuario Activo'}
                </p>
                <div className="flex items-center gap-1 mt-0.5">
                  <RoleIcon className="w-3 h-3 text-slate-400 shrink-0" />
                  <span className="text-[10px] font-semibold text-slate-500 truncate">
                    {roleInfo.label}
                  </span>
                </div>
              </div>
            </div>

            <button
              onClick={onLogout}
              className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer shrink-0"
              title="Cerrar Sesión"
            >
              <IconPower className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Bottom Nav Bar for Mobile */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-slate-200 px-2 py-2 flex justify-around items-center z-50 shadow-lg">
        {visibleMenuItems.slice(0, 4).map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.path;

          return (
            <Link
              key={item.path}
              href={item.path}
              className={`flex flex-col items-center gap-1 p-2 rounded-xl text-[10px] font-bold transition-colors ${
                isActive ? 'text-[#fb5962]' : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              <div className={`p-1.5 rounded-lg ${isActive ? 'bg-[#fff0f1] text-[#fb5962]' : ''}`}>
                <Icon className="w-4 h-4" />
              </div>
              <span className="truncate max-w-[64px]">{item.label.split(' ')[0]}</span>
            </Link>
          );
        })}
      </nav>
    </>
  );
};
