"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import Login from '@/components/Login';
import { ROLE_DEFAULT_ROUTES, UserRole } from '@/types/roles';
import { Usuario } from '@/services/db';

export default function LoginPage() {
  const router = useRouter();

  const handleLoginSuccess = (usuario: Usuario) => {
    sessionStorage.setItem('isLoggedIn', 'true');
    const destination = ROLE_DEFAULT_ROUTES[usuario.rol as UserRole] || '/dashboard';
    router.push(destination);
  };

  return <Login onLoginSuccess={handleLoginSuccess} />;
}
