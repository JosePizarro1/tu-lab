"use client";

import React, { useEffect, useState, createContext, useContext } from 'react';
import { useRouter } from 'next/navigation';
import Swal from 'sweetalert2';
import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';
import { database, Sede, Usuario } from '@/services/db';

interface DashboardContextType {
  usuario: Usuario | null;
  sedeActivaId: string;
  setSedeActivaId: (id: string) => void;
  sedes: Sede[];
  refreshGlobalData: () => Promise<void>;
}

const DashboardContext = createContext<DashboardContextType>({
  usuario: null,
  sedeActivaId: 'SEDE-BRENA',
  setSedeActivaId: () => {},
  sedes: [],
  refreshGlobalData: async () => {},
});

export const useDashboardContext = () => useContext(DashboardContext);

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [sedes, setSedes] = useState<Sede[]>([]);
  const [sedeActivaId, setSedeActivaId] = useState<string>('SEDE-BRENA');

  useEffect(() => {
    const raw = sessionStorage.getItem('usuario');
    if (raw) {
      setUsuario(JSON.parse(raw));
    } else {
      router.push('/');
      return;
    }

    const init = async () => {
      await database.initSeed();
      const listaSedes = await database.getSedes();
      setSedes(listaSedes);
      if (listaSedes.length > 0) {
        setSedeActivaId(listaSedes[0].id);
      }
      setLoading(false);
    };

    init();
  }, [router]);

  const handleLogout = () => {
    Swal.fire({
      title: '¿Cerrar Sesión?',
      text: '¿Está seguro de que desea salir del portal médico?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#0ea5e9',
      cancelButtonColor: '#94a3b8',
      confirmButtonText: 'Sí, salir',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        sessionStorage.removeItem('isLoggedIn');
        sessionStorage.removeItem('usuario');
        fetch('/api/logout', { method: 'POST' }).finally(() => {
          router.push('/');
        });
      }
    });
  };

  const refreshGlobalData = async () => {
    const listaSedes = await database.getSedes();
    setSedes(listaSedes);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center font-sans">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-cerulean border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">Cargando Dashboard Médico...</p>
        </div>
      </div>
    );
  }

  return (
    <DashboardContext.Provider
      value={{
        usuario,
        sedeActivaId,
        setSedeActivaId,
        sedes,
        refreshGlobalData,
      }}
    >
      <div className="min-h-screen bg-slate-50 flex font-sans">
        {/* Sidebar persistente */}
        <Sidebar onLogout={handleLogout} rolUsuario={usuario?.rol} />

        {/* Contenido principal */}
        <div className="flex-1 flex flex-col min-w-0 min-h-screen">
          <Header
            sedes={sedes}
            sedeActivaId={sedeActivaId}
            onSelectSede={setSedeActivaId}
            usuario={usuario}
            onLogout={handleLogout}
          />

          <main className="flex-1 p-4 sm:p-6 pb-24 md:pb-6 overflow-y-auto">
            {children}
          </main>
        </div>
      </div>
    </DashboardContext.Provider>
  );
}
