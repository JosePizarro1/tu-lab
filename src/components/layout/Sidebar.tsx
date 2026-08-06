"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  IconHexagon, 
  IconLayoutDashboard, 
  IconUsers, 
  IconFlask, 
  IconClipboardList, 
  IconBuilding, 
  IconPower 
} from '@tabler/icons-react';

interface SidebarProps {
  onLogout: () => void;
  rolUsuario?: string;
}

export const Sidebar: React.FC<SidebarProps> = ({ onLogout, rolUsuario }) => {
  const pathname = usePathname();

  const menuItems = [
    { label: 'Resumen General', path: '/dashboard', icon: IconLayoutDashboard },
    { label: 'Pacientes', path: '/dashboard/pacientes', icon: IconUsers },
    { label: 'Resultados Clínicos', path: '/dashboard/resultados', icon: IconClipboardList },
    { label: 'Inventario / Reactivos', path: '/dashboard/inventario', icon: IconFlask },
    { label: 'Sedes', path: '/dashboard/sedes', icon: IconBuilding, adminOnly: true },
    { label: 'Usuarios y Accesos', path: '/dashboard/usuarios', icon: IconUsers, adminOnly: true },
  ];

  return (
    <>
      {/* DESKTOP SIDEBAR */}
      <aside className="hidden md:flex flex-col w-64 bg-white text-slate-800 min-h-screen p-6 border-r border-slate-100 shrink-0 shadow-xs">
        <div className="flex items-center gap-3 mb-8 px-2">
          <IconHexagon className="w-8 h-8 text-cerulean fill-cerulean/20" />
          <span className="font-jakarta font-extrabold text-xl tracking-tight text-slate-800">
            AQUA<span className="text-cerulean">LAB</span>
          </span>
        </div>

        <nav className="flex-1 space-y-1.5">
          {menuItems.map((item) => {
            if (item.adminOnly && rolUsuario !== 'Administrador') return null;
            const isActive = pathname === item.path;
            const Icon = item.icon;

            return (
              <Link
                key={item.path}
                href={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition-all ${
                  isActive
                    ? 'bg-cerulean text-white shadow-md shadow-cerulean/20'
                    : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="pt-6 border-t border-slate-100">
          <button
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold text-rose-500 hover:bg-rose-50 hover:text-rose-600 transition-colors cursor-pointer"
          >
            <IconPower className="w-4 h-4" />
            <span>Cerrar Sesión</span>
          </button>
        </div>
      </aside>

      {/* MOBILE BOTTOM NAVIGATION */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-100 px-4 py-2 flex justify-around items-center z-50 shadow-lg">
        {menuItems.slice(0, 4).map((item) => {
          const isActive = pathname === item.path;
          const Icon = item.icon;
          return (
            <Link
              key={item.path}
              href={item.path}
              className={`flex flex-col items-center py-1.5 px-3 rounded-xl text-[10px] font-bold ${
                isActive ? 'text-cerulean' : 'text-slate-400'
              }`}
            >
              <Icon className="w-5 h-5 mb-1" />
              <span>{item.label.split(' ')[0]}</span>
            </Link>
          );
        })}
      </div>
    </>
  );
};
