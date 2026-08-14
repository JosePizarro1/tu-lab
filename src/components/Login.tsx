"use client";

import React, { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { animate } from 'animejs';
import { 
  IconUserCheck, 
  IconChevronRight,
  IconEye,
  IconEyeOff,
  IconShieldCheck,
  IconStethoscope,
  IconLock,
  IconInfoCircle,
  IconKey
} from '@tabler/icons-react';

import Swal from 'sweetalert2';
import { database } from '../services/db';

interface LoginProps {
  onLoginSuccess: () => void;
}

const Login: React.FC<LoginProps> = ({ onLoginSuccess }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('admin');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const formRef = useRef<HTMLDivElement>(null);
  const leftContentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Entrance animations
    if (formRef.current) {
      gsap.fromTo(formRef.current, 
        { autoAlpha: 0, y: 20, scale: 0.98 },
        { autoAlpha: 1, y: 0, scale: 1, duration: 0.8, ease: "power3.out" }
      );
    }

    if (leftContentRef.current) {
      const elements = leftContentRef.current.querySelectorAll('.animate-entry');
      gsap.fromTo(elements, 
        { autoAlpha: 0, y: 15 },
        { autoAlpha: 1, y: 0, stagger: 0.1, duration: 0.8, ease: "power2.out" }
      );
    }
  }, []);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    Swal.fire({
      title: 'Portal Médico',
      text: 'Verificando credenciales del profesional...',
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
        setErrorMsg('Credenciales incorrectas. Para pruebas use: admin / admin');
      }
    } catch (err) {
      Swal.close();
      setErrorMsg('Error de conexión con el servidor de autenticación.');
    }
  };

  return (
    <main className="relative min-h-[calc(100vh-120px)] w-full bg-slate-50/60 px-4 sm:px-6 lg:px-8 py-10 lg:py-14 font-plex select-none flex items-center justify-center">
      {/* Background ambient glow */}
      <div 
        aria-hidden="true" 
        className="pointer-events-none absolute inset-0" 
        style={{ background: 'radial-gradient(circle at 20% 20%, rgba(229, 35, 32, 0.05), transparent 30rem), radial-gradient(circle at 80% 80%, rgba(30, 58, 76, 0.06), transparent 35rem)' }}
      ></div>

      <div className="relative w-full max-w-6xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        
        {/* Sección Izquierda: Tarjeta Ilustrativa con Marcos Redondeados */}
        <section 
          ref={leftContentRef}
          className="lg:col-span-6 relative overflow-hidden rounded-3xl bg-slate-900 shadow-2xl border border-slate-100 flex flex-col justify-between p-8 sm:p-12 text-white min-h-[460px] lg:min-h-[580px]"
        >
          {/* Imagen clínica de fondo con overlay */}
          <img 
            src="https://images.pexels.com/photos/4021775/pexels-photo-4021775.jpeg?auto=compress&cs=tinysrgb&w=1200&q=80" 
            alt="Médico examinando resultados clínicos" 
            className="absolute inset-0 h-full w-full object-cover" 
          />
          <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/80 to-slate-950/40"></div>
          
          {/* Encabezado superior */}
          <div className="relative z-10 flex items-center justify-between gap-4">
            <div className="animate-entry inline-flex items-center gap-2 border border-white/20 bg-white/10 px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-[0.2em] text-white/90 backdrop-blur-md">
              <span className="w-2 h-2 bg-[#E52320] rounded-full animate-ping"></span>
              Acceso Exclusivo Médicos
            </div>
            <div className="animate-entry flex h-10 w-10 items-center justify-center rounded-2xl border border-white/20 bg-white/10 text-white backdrop-blur-md">
              <IconStethoscope className="text-xl text-red-400" />
            </div>
          </div>

          {/* Mensaje central */}
          <div className="relative z-10 my-8">
            <p className="animate-entry mb-2 text-[10px] font-bold uppercase tracking-[0.2em] text-red-400">
              Red de Laboratorios UNIDOSLAB
            </p>
            <h1 className="animate-entry font-jakarta text-3xl sm:text-4xl font-extrabold leading-tight tracking-tight text-white">
              Portal Especializado para Médicos & Clínicas
            </h1>
            <p className="animate-entry mt-4 text-xs sm:text-sm leading-relaxed text-slate-300 font-medium max-w-md">
              Accede en tiempo real a los informes de tus pacientes, historial analítico y validaciones de patología clínica con la mayor seguridad.
            </p>

            {/* Chips de características con bordes redondeados */}
            <div className="animate-entry mt-6 flex flex-wrap gap-2 text-[10px] font-bold uppercase tracking-wider text-white/90">
              <span className="inline-flex items-center gap-1.5 border border-white/15 bg-white/10 px-3.5 py-2 rounded-full backdrop-blur-md">
                <IconShieldCheck className="text-sm text-emerald-400" />
                Cifrado Médica SSL
              </span>
              <span className="inline-flex items-center gap-1.5 border border-white/15 bg-white/10 px-3.5 py-2 rounded-full backdrop-blur-md">
                <IconUserCheck className="text-sm text-sky-400" />
                Validación C.M.P.
              </span>
            </div>
          </div>

          {/* Pie de la tarjeta izquierda */}
          <div className="relative z-10 border-t border-white/15 pt-4 flex items-center justify-between text-[10px] font-bold uppercase tracking-[0.2em] text-white/60">
            <span>UNIDOSLAB Tacna</span>
            <span>Unidos Por Tu Salud</span>
          </div>
        </section>

        {/* Sección Derecha: Formulario de Login con Marcos Redondeados */}
        <section className="lg:col-span-6 flex items-center justify-center">
          <div 
            ref={formRef}
            className="w-full bg-white rounded-3xl p-8 sm:p-12 shadow-2xl border border-slate-200/80 relative z-10 flex flex-col justify-between"
          >
            <div>
              <header className="mb-8">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-red-50 border border-red-100 rounded-full mb-4">
                  <span className="w-1.5 h-1.5 bg-[#E52320] rounded-full"></span>
                  <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#E52320]">
                    Ingreso Profesional
                  </span>
                </div>
                <h2 className="font-jakarta text-3xl sm:text-4xl font-extrabold text-[#1E3A4C] tracking-tight leading-tight">
                  Soy Médico
                </h2>
                <p className="text-slate-500 mt-2 text-xs font-medium leading-relaxed">
                  Ingresa con tu usuario asignado o número de colegiatura médica para consultar los resultados.
                </p>
              </header>

              {/* Formulario */}
              <form className="space-y-6" onSubmit={handleLoginSubmit}>
                {errorMsg && (
                  <div className="p-4 bg-red-50 border border-red-100 rounded-2xl text-red-600 text-xs font-semibold flex items-center gap-2">
                    <IconInfoCircle className="w-4 h-4 shrink-0" />
                    <span>{errorMsg}</span>
                  </div>
                )}
                {successMsg && (
                  <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-2xl text-emerald-700 text-xs font-semibold flex items-center gap-2">
                    <IconShieldCheck className="w-4 h-4 shrink-0 text-emerald-600" />
                    <span>{successMsg}</span>
                  </div>
                )}

                {/* Input: Usuario / CMP */}
                <div className="group relative">
                  <label htmlFor="medic-username" className="text-[10px] uppercase tracking-[0.2em] text-slate-400 font-bold mb-2 block group-focus-within:text-[#E52320] transition-colors">
                    Código C.M.P. / Usuario *
                  </label>
                  <div className="relative">
                    <input 
                      id="medic-username"
                      type="text" 
                      value={username} 
                      onChange={(e) => setUsername(e.target.value)} 
                      className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-slate-800 font-bold text-sm focus:outline-none focus:border-[#E52320] focus:bg-white focus:ring-4 focus:ring-red-500/10 transition-all duration-300"
                      placeholder="Ej: admin / CMP-8849" 
                      required
                    />
                    <IconUserCheck className="absolute right-4 top-4 w-5 h-5 text-slate-300 group-focus-within:text-[#E52320] transition-colors" />
                  </div>
                </div>

                {/* Input: Contraseña */}
                <div className="group relative">
                  <label htmlFor="medic-password" className="text-[10px] uppercase tracking-[0.2em] text-slate-400 font-bold mb-2 block group-focus-within:text-[#E52320] transition-colors">
                    Contraseña *
                  </label>
                  <div className="relative">
                    <input 
                      id="medic-password"
                      type={showPassword ? "text" : "password"}
                      value={password} 
                      onChange={(e) => setPassword(e.target.value)} 
                      className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-slate-800 font-bold text-sm focus:outline-none focus:border-[#E52320] focus:bg-white focus:ring-4 focus:ring-red-500/10 transition-all duration-300"
                      placeholder="••••••••" 
                      required
                    />
                    <button 
                      type="button" 
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-4 text-slate-400 hover:text-[#E52320] transition-colors cursor-pointer"
                      title={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                    >
                      {showPassword ? <IconEyeOff className="w-5 h-5" /> : <IconEye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                {/* Caja Informativa Demo */}
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl text-xs text-slate-600 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <IconKey className="w-4 h-4 text-[#E52320] shrink-0" />
                    <span>Acceso de prueba: <strong className="text-slate-800">admin / admin</strong></span>
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-red-600 bg-red-50 border border-red-100 px-2 py-0.5 rounded-full shrink-0">
                    Demo
                  </span>
                </div>

                {/* Botón de Ingreso con Marcos Redondeados */}
                <div className="pt-2">
                  <button 
                    type="submit" 
                    className="w-full bg-[#E52320] hover:bg-red-700 text-white py-4.5 px-8 rounded-full font-extrabold uppercase tracking-[0.2em] text-xs shadow-lg shadow-red-500/20 flex items-center justify-center gap-3 cursor-pointer group transition-all duration-300 transform hover:scale-[1.02]"
                  >
                    <span>Ingresar al Portal Médico</span>
                    <IconChevronRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                  </button>
                </div>
              </form>
            </div>

            {/* Pie del Formulario */}
            <footer className="mt-8 pt-6 border-t border-slate-100 flex items-center justify-between gap-2 text-xs">
              <div className="flex items-center gap-1.5 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                <IconLock className="w-3.5 h-3.5 text-emerald-500" />
                Acceso Protegido
              </div>
              <a 
                href="https://api.whatsapp.com/send/?phone=51952920616&text=Hola%20UNIDOSLAB,%20necesito%20soporte%20para%20el%20portal%20m%C3%A9dico" 
                target="_blank"
                rel="noopener noreferrer"
                className="text-[11px] font-extrabold uppercase tracking-wider text-[#E52320] hover:underline"
              >
                Soporte TI / Ayuda
              </a>
            </footer>
          </div>
        </section>

      </div>
    </main>
  );
};

export default Login;

