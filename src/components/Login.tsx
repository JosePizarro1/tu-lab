"use client";

import React, { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { 
  IconUserCheck, 
  IconChevronRight,
  IconEye,
  IconEyeOff,
  IconStethoscope,
  IconLock,
  IconInfoCircle
} from '@tabler/icons-react';

import Swal from 'sweetalert2';
import { database } from '../services/db';

interface LoginProps {
  onLoginSuccess: () => void;
}

const Login: React.FC<LoginProps> = ({ onLoginSuccess }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const formRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (formRef.current) {
      gsap.fromTo(formRef.current, 
        { autoAlpha: 0, y: 15, scale: 0.99 },
        { autoAlpha: 1, y: 0, scale: 1, duration: 0.5, ease: "power2.out" }
      );
    }
  }, []);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    Swal.fire({
      title: 'Portal Médico',
      text: 'Verificando credenciales...',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });

    try {
      const usuario = await database.login(username, password);
      
      if (usuario) {
        sessionStorage.setItem('usuario', JSON.stringify(usuario));
        Swal.fire({
          title: 'Acceso Concedido',
          text: `Bienvenido(a), Dr(a). ${usuario.nombre}`,
          icon: 'success',
          timer: 1400,
          showConfirmButton: false
        }).then(() => {
          onLoginSuccess();
        });
      } else {
        Swal.close();
        setErrorMsg('Credenciales incorrectas. Verifique su usuario y contraseña.');
      }
    } catch (err) {
      Swal.close();
      setErrorMsg('Error de conexión con el servidor.');
    }
  };

  return (
    <main className="relative min-h-screen w-full bg-slate-50/50 px-3.5 sm:px-6 pt-28 sm:pt-32 pb-16 sm:pb-20 font-plex select-none flex items-center justify-center">
      {/* Resplandor ambiental de fondo */}
      <div 
        aria-hidden="true" 
        className="pointer-events-none absolute inset-0" 
        style={{ 
          background: 'radial-gradient(circle at 20% 20%, rgba(255, 90, 95, 0.06), transparent 25rem), radial-gradient(circle at 80% 80%, rgba(30, 58, 76, 0.06), transparent 30rem)' 
        }}
      ></div>

      <div 
        ref={formRef}
        className="relative w-full max-w-4xl bg-white rounded-2xl sm:rounded-3xl shadow-xl sm:shadow-2xl border border-slate-200/90 overflow-hidden grid grid-cols-1 lg:grid-cols-12"
      >
        
        {/* Panel Izquierdo con Imagen Médica (visible en desktop) */}
        <section className="hidden lg:flex lg:col-span-5 relative bg-[#1E3A4C] p-8 flex-col justify-between text-white overflow-hidden">
          {/* Imagen Médica de Fondo con Overlay */}
          <img 
            src="https://images.pexels.com/photos/5327585/pexels-photo-5327585.jpeg?auto=compress&cs=tinysrgb&w=1000&q=80" 
            alt="Médico especialista" 
            className="absolute inset-0 h-full w-full object-cover opacity-35" 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#1E3A4C] via-[#1E3A4C]/80 to-[#1E3A4C]/40"></div>
          
          <div className="relative z-10 space-y-2">
            <div className="inline-flex items-center gap-2 border border-white/20 bg-white/10 px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-widest text-white backdrop-blur-md">
              <span className="w-2 h-2 bg-[#FF5A5F] rounded-full animate-pulse"></span>
              <span>UNIDOSLAB</span>
            </div>
          </div>

          <div className="relative z-10 space-y-2 my-auto py-6">
            <div className="w-12 h-12 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center text-[#FF5A5F] mb-3 backdrop-blur-md">
              <IconStethoscope className="w-6 h-6" />
            </div>
            <h2 className="font-jakarta text-2xl font-extrabold text-white leading-tight">
              Portal Médico
            </h2>
            <p className="text-xs text-slate-300 font-medium leading-relaxed">
              Acceso exclusivo para profesionales y especialistas de la salud.
            </p>
          </div>

          <div className="relative z-10 border-t border-white/15 pt-3 flex items-center justify-between text-[10px] font-bold uppercase tracking-widest text-white/60">
            <span>Tacna, Perú</span>
            <span>Unidos Por Tu Salud</span>
          </div>
        </section>

        {/* Panel Derecho: Formulario Directo y Conciso */}
        <section className="lg:col-span-7 p-6 sm:p-10 flex flex-col justify-between">
          <div>
            {/* Header del Formulario */}
            <header className="mb-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-red-50 border border-red-100 rounded-full mb-2.5">
                <span className="w-1.5 h-1.5 bg-[#FF5A5F] rounded-full"></span>
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#FF5A5F]">
                  Acceso Profesional
                </span>
              </div>
              <h1 className="font-jakarta text-2xl sm:text-3xl font-extrabold text-[#1E3A4C] tracking-tight">
                Soy Médico
              </h1>
              <p className="text-slate-500 mt-1 text-xs font-medium">
                Ingresa con tu usuario asignado o número de colegiatura.
              </p>
            </header>

            {/* Formulario */}
            <form className="space-y-4" onSubmit={handleLoginSubmit}>
              {errorMsg && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs font-semibold flex items-center gap-2">
                  <IconInfoCircle className="w-4 h-4 shrink-0 text-[#FF5A5F]" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {/* Input: Usuario */}
              <div className="group relative">
                <label htmlFor="medic-username" className="text-[10px] uppercase tracking-wider text-slate-500 font-bold mb-1 block group-focus-within:text-[#FF5A5F] transition-colors">
                  Usuario / C.M.P. *
                </label>
                <div className="relative">
                  <input 
                    id="medic-username"
                    type="text" 
                    value={username} 
                    onChange={(e) => setUsername(e.target.value)} 
                    className="w-full pl-3.5 pr-10 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-bold text-xs sm:text-sm focus:outline-none focus:border-[#FF5A5F] focus:bg-white focus:ring-4 focus:ring-red-500/10 transition-all"
                    placeholder="Ingrese su usuario o CMP..." 
                    required
                  />
                  <IconUserCheck className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-[#FF5A5F] transition-colors pointer-events-none" />
                </div>
              </div>

              {/* Input: Contraseña */}
              <div className="group relative">
                <label htmlFor="medic-password" className="text-[10px] uppercase tracking-wider text-slate-500 font-bold mb-1 block group-focus-within:text-[#FF5A5F] transition-colors">
                  Contraseña *
                </label>
                <div className="relative">
                  <input 
                    id="medic-password"
                    type={showPassword ? "text" : "password"}
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)} 
                    className="w-full pl-3.5 pr-10 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-bold text-xs sm:text-sm focus:outline-none focus:border-[#FF5A5F] focus:bg-white focus:ring-4 focus:ring-red-500/10 transition-all"
                    placeholder="••••••••" 
                    required
                  />
                  <button 
                    type="button" 
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-[#FF5A5F] transition-colors cursor-pointer p-1"
                    title={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                  >
                    {showPassword ? <IconEyeOff className="w-4 h-4" /> : <IconEye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Botón de Ingreso */}
              <div className="pt-2">
                <button 
                  type="submit" 
                  className="w-full bg-[#FF5A5F] hover:bg-[#ff4146] text-white py-3.5 px-6 rounded-xl font-extrabold uppercase tracking-wider text-xs shadow-md shadow-red-500/20 flex items-center justify-center gap-2 cursor-pointer transition-all duration-200 hover:scale-[1.01]"
                >
                  <span>Ingresar al Portal</span>
                  <IconChevronRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          </div>

          {/* Footer de Seguridad y Ayuda */}
          <footer className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between gap-2 text-xs">
            <div className="flex items-center gap-1.5 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
              <IconLock className="w-3.5 h-3.5 text-emerald-500" />
              <span>Acceso Seguro</span>
            </div>
            <a 
              href="https://api.whatsapp.com/send/?phone=51952920616&text=Hola%20UNIDOSLAB,%20necesito%20soporte%20para%20el%20portal%20m%C3%A9dico" 
              target="_blank"
              rel="noopener noreferrer"
              className="text-[11px] font-extrabold uppercase tracking-wider text-[#FF5A5F] hover:underline"
            >
              Soporte / Ayuda
            </a>
          </footer>
        </section>

      </div>
    </main>
  );
};

export default Login;

