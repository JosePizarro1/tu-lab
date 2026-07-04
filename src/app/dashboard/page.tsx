"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Swal from 'sweetalert2';
import Dashboard from '../../components/Dashboard';

export default function DashboardPage() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    // Comprobar la sesión en el navegador
    const userSession = sessionStorage.getItem('isLoggedIn');
    if (userSession === 'true') {
      setIsAuthenticated(true);
    } else {
      // Redirigir al inicio/login si no está autenticado
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

  if (!isAuthenticated) {
    return null; // Evitar flashes de UI no autorizada
  }

  return <Dashboard onLogout={handleLogout} />;
}
