"use client";

import React, { useState, useEffect } from 'react';
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
  IconUserCheck,
  IconChevronLeft,
  IconChevronRight
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

  // Estado contraído (persiste en localStorage)
  const [collapsed, setCollapsed] = useState<boolean>(false);

  useEffect(() => {
    const saved = localStorage.getItem('sidebar_collapsed');
    if (saved !== null) {
      setCollapsed(saved === 'true');
    }
  }, []);

  const toggleCollapsed = () => {
    setCollapsed((prev) => {
      const next = !prev;
      localStorage.setItem('sidebar_collapsed', String(next));
      return next;
    });
  };

  const menuItems = [
    { label: 'Resumen General', path: '/dashboard', icon: IconLayoutDashboard },
    { label: 'Citas y Agenda', path: '/dashboard/citas', icon: IconClipboardList },
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
      {/* Sidebar Desktop con soporte para contraer/expandir */}
      <aside 
        className={`${
          collapsed ? 'w-20' : 'w-64'
        } bg-white border-r border-slate-200/80 hidden md:flex flex-col justify-between h-screen sticky top-0 z-40 shadow-xs transition-all duration-300 ease-in-out`}
      >
        <div>
          {/* Logo & Botón para Contraer */}
          <div className={`h-16 flex items-center ${collapsed ? 'justify-center px-2' : 'justify-between px-5'} border-b border-slate-100 relative`}>
            {!collapsed ? (
              <Link href="/dashboard" className="flex items-center gap-2.5 overflow-hidden">
                <img 
                  src="/logo-unidoslab-opt.webp" 
                  alt="UNIDOSLAB" 
                  width={132}
                  height={42}
                  decoding="async"
                  className="h-8 w-auto object-contain" 
                />
              </Link>
            ) : (
              <Link href="/dashboard" className="w-10 h-10 rounded-xl bg-[#fff0f1] text-[#fb5962] font-black flex items-center justify-center text-sm shadow-2xs">
                U
              </Link>
            )}

            {/* Botón flotante para contraer/expandir */}
            <button
              onClick={toggleCollapsed}
              className={`p-1.5 rounded-lg border border-slate-200/90 text-slate-400 hover:text-slate-800 hover:bg-slate-50 transition-colors cursor-pointer ${
                collapsed ? 'mt-2' : ''
              }`}
              title={collapsed ? 'Expandir barra lateral' : 'Contraer barra lateral'}
            >
              {collapsed ? (
                <IconChevronRight className="w-4 h-4" />
              ) : (
                <IconChevronLeft className="w-4 h-4" />
              )}
            </button>
          </div>

          {/* Navigation Links */}
          <div className="p-3 space-y-1.5">
            {!collapsed && (
              <p className="px-3 pb-2 text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                Menú Principal
              </p>
            )}
            {visibleMenuItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.path;

              return (
                <Link
                  key={item.path}
                  href={item.path}
                  title={collapsed ? item.label : undefined}
                  className={`flex items-center ${
                    collapsed ? 'justify-center px-0 py-3' : 'gap-3 px-3.5 py-2.5'
                  } rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-[#fb5962] text-white shadow-md shadow-rose-500/20 font-bold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-[#fff0f1]/70'
                  }`}
                >
                  <Icon className={`w-5 h-5 stroke-[2] shrink-0 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                  {!collapsed && <span className="truncate">{item.label}</span>}
                </Link>
              );
            })}
          </div>
        </div>

        {/* Footer / User Profile Card */}
        <div className="p-3 border-t border-slate-100 bg-slate-50/50">
          <div className={`bg-white border border-slate-200/70 rounded-2xl ${collapsed ? 'p-2 justify-center' : 'p-3 justify-between'} shadow-2xs flex items-center gap-2`}>
            <div className="flex items-center gap-2.5 min-w-0">
              <div 
                className="w-9 h-9 rounded-xl bg-[#fb5962] text-white flex items-center justify-center font-extrabold text-sm shadow-xs shrink-0"
                title={collapsed ? `${usuario?.nombre || 'Usuario'} (${roleInfo.label})` : undefined}
              >
                {initialLetter}
              </div>
              {!collapsed && (
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
              )}
            </div>

            {!collapsed && (
              <button
                onClick={onLogout}
                className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer shrink-0"
                title="Cerrar Sesión"
              >
                <IconPower className="w-4 h-4" />
              </button>
            )}
          </div>

          {collapsed && (
            <button
              onClick={onLogout}
              className="mt-2 w-full p-2 flex items-center justify-center text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer"
              title="Cerrar Sesión"
            >
              <IconPower className="w-4 h-4" />
            </button>
          )}
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
