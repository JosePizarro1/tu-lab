"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Swal from 'sweetalert2';
import Dashboard from '../../components/Dashboard';
import { Usuario } from '../../services/db';

export default function DashboardPage() {
  const router = useRouter();
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const raw = sessionStorage.getItem('usuario');
    if (raw) {
      setUsuario(JSON.parse(raw));
    } else {
      router.push('/');
    }
    setLoading(false);
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
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        sessionStorage.removeItem('isLoggedIn');
        sessionStorage.removeItem('usuario');
        router.push('/');
      }
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center font-plex">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-cerulean border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-500 text-sm">Cargando panel médico...</p>
        </div>
      </div>
    );
  }

  if (!usuario) {
    return null;
  }

  return <Dashboard usuario={usuario} onLogout={handleLogout} />;
}
