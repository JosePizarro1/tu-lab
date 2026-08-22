"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Swal from 'sweetalert2';
import Header from '../components/Header';
import Home from '../components/Home';
import Login from '../components/Login';
import Services from '../components/Services';
import Sedes from '../components/Sedes';
import Terminos from '../components/Terminos';
import Privacidad from '../components/Privacidad';
import {
  IconMapPin,
  IconClock,
  IconPhone,
  IconShieldCheck,
  IconMicroscope,
  IconBrandFacebook,
  IconBrandInstagram,
  IconBrandWhatsapp,
  IconMail,
  IconHexagon,
  IconLock,
  IconDeviceDesktop,
  IconArrowRight,
  IconFileCheck,
  IconRefresh,
  IconFileDownload,
  IconChevronRight,
  IconHome
} from '@tabler/icons-react';

export default function Page() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<string>('inicio');
  const [dni, setDni] = useState<string>('');
  const [isPageReady, setIsPageReady] = useState<boolean>(false);

  useEffect(() => {
    // Breve animación de montaje para asegurar renderizado fluido
    const timer = setTimeout(() => setIsPageReady(true), 400);
    return () => clearTimeout(timer);
  }, []);

  const renderContent = () => {
    switch (activeTab) {
      case 'inicio':
        return <Home setActiveTab={setActiveTab} />;

      case 'soy_medico':
        return <Login onLoginSuccess={() => {
          sessionStorage.setItem('isLoggedIn', 'true');
          router.push('/dashboard');
        }} />;

      case 'servicios':
        return <Services />;

      case 'sedes':
        return <Home setActiveTab={setActiveTab} />;

      case 'terminos':
        return <Terminos onBack={() => { setActiveTab('inicio'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} />;

      case 'privacidad':
        return <Privacidad onBack={() => { setActiveTab('inicio'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} />;

      case 'resultados':
        return (
          <main className="relative overflow-hidden px-4 sm:px-8 pt-28 sm:pt-32 pb-16 min-h-[calc(100vh-80px)] font-plex select-none" id="resultados">
            <div aria-hidden="true" className="pointer-events-none absolute inset-0" style={{ background: 'radial-gradient(circle at 80% 8%, rgba(229, 35, 32, 0.06), transparent 24rem)' }}></div>

            <div className="relative mx-auto grid w-full max-w-[1180px] items-stretch gap-6 lg:min-h-[560px] lg:grid-cols-[1.04fr_.96fr] lg:gap-8">
              {/* Panel Izquierdo: Imagen Clínica Redondeada */}
              <section className="relative min-h-[360px] overflow-hidden rounded-3xl bg-slate-900 shadow-xl lg:min-h-0 border border-slate-100">
                <img
                  src="https://images.pexels.com/photos/8442574/pexels-photo-8442574.jpeg?auto=compress&cs=tinysrgb&w=1200&q=80"
                  alt="Técnica de laboratorio trabajando en microscopio"
                  className="absolute inset-0 h-full w-full object-cover"
                />
                <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-r from-slate-950/95 via-slate-900/80 to-slate-900/40"></div>
                <div aria-hidden="true" className="absolute inset-0 opacity-20" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,.12) 1px, transparent 1px),linear-gradient(90deg, rgba(255,255,255,.12) 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>

                <div className="relative flex h-full min-h-[360px] flex-col justify-between p-8 text-white sm:p-10 lg:min-h-0">
                  <div className="flex items-center justify-between gap-4">
                    <div className="inline-flex items-center gap-2 border border-white/20 bg-white/10 px-3.5 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-[0.2em] text-white/90 backdrop-blur-md">
                      <span className="w-1.5 h-1.5 bg-[#E52320] rounded-full animate-pulse"></span>
                      Consulta segura
                    </div>
                    <div className="flex h-10 w-10 items-center justify-center border border-white/20 bg-white/10 text-white/90 backdrop-blur-md rounded-full">
                      <IconShieldCheck className="text-xl" />
                    </div>
                  </div>

                  <div className="max-w-[460px] my-8">
                    <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.2em] text-red-400">
                      Portal de Pacientes UNIDOSLAB
                    </p>
                    <h1 className="font-jakarta text-3xl font-extrabold leading-[1.1] tracking-tight text-white sm:text-4xl">
                      Tus resultados, claros y disponibles cuando los necesites.
                    </h1>
                    <p className="mt-5 max-w-[390px] text-xs leading-relaxed text-white/75 font-medium">
                      Consulta tus análisis clínicos de forma privada y segura ingresando tu número de documento.
                    </p>
                    <div className="mt-8 flex flex-wrap items-center gap-3 text-[10px] font-bold uppercase tracking-wider text-white/75">
                      <span className="inline-flex items-center gap-2 border border-white/15 bg-white/10 px-3.5 py-2 rounded-full backdrop-blur-md">
                        <IconLock className="text-sm text-emerald-400" />
                        Acceso protegido
                      </span>
                      <span className="inline-flex items-center gap-2 border border-white/15 bg-white/10 px-3.5 py-2 rounded-full backdrop-blur-md">
                        <IconDeviceDesktop className="text-sm text-sky-300" />
                        Desde cualquier dispositivo
                      </span>
                    </div>
                  </div>

                  <div className="flex items-end justify-between gap-4 border-t border-white/15 pt-5 text-[10px] font-bold uppercase tracking-[0.2em] text-white/55">
                    <span>UNIDOSLAB</span>
                    <span>Unidos por tu salud</span>
                  </div>
                </div>
              </section>

              {/* Panel Derecho: Formulario de Consulta */}
              <section aria-labelledby="results-heading" className="glass-panel relative flex flex-col justify-center p-8 sm:p-12 lg:p-14 shadow-xl rounded-3xl border border-slate-200/80 bg-white">
                <header className="mb-8">
                  <div className="inline-flex items-center gap-2 px-3.5 py-1 bg-red-50 border border-red-100 rounded-full mb-4">
                    <span className="w-1.5 h-1.5 bg-[#E52320] rounded-full"></span>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-[#E52320]">Consulta de Resultados</span>
                  </div>
                  <h2 id="results-heading" className="font-jakarta text-3xl font-extrabold text-[#1E3A4C] tracking-tight leading-tight">Consulte sus Resultados</h2>
                  <p className="text-slate-500 mt-2 text-xs font-medium leading-relaxed">Ingrese su número de documento de identidad para verificar sus exámenes.</p>
                </header>

                <form className="space-y-8" onSubmit={(e) => { e.preventDefault(); }}>
                  <div className="group relative">
                    <label htmlFor="document-number" className="text-[10px] uppercase tracking-[0.2em] text-slate-400 font-bold mb-2 block group-focus-within:text-[#E52320] transition-colors">
                      Número de Documento (DNI / C.E.)
                    </label>
                    <div className="relative">
                      <input
                        id="document-number"
                        type="text"
                        value={dni}
                        onChange={(e) => setDni(e.target.value.replace(/\D/g, ''))}
                        maxLength={12}
                        placeholder="Ingrese DNI..."
                        className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-slate-800 font-bold text-sm focus:outline-none focus:border-[#E52320] focus:bg-white focus:ring-4 focus:ring-red-500/10 transition-all duration-300"
                      />
                    </div>
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      className="w-full bg-[#E52320] hover:bg-red-700 text-white py-4.5 px-8 rounded-full font-extrabold uppercase tracking-[0.2em] text-xs shadow-lg shadow-red-500/20 flex items-center justify-center gap-3 cursor-pointer group transition-all duration-300 transform hover:scale-[1.02]"
                    >
                      <span>Buscar Resultados</span>
                      <IconArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                    </button>
                  </div>
                </form>

                <footer className="mt-10 pt-6 border-t border-slate-100 flex items-center justify-center gap-2 text-[11px] font-bold uppercase tracking-widest text-slate-400">
                  <IconLock className="text-sm text-emerald-500" />
                  Tus datos se consultan de forma privada
                </footer>
              </section>
            </div>
          </main>
        );

      default:
        return <Home setActiveTab={setActiveTab} />;
    }
  };



  return (
    <div className="min-h-screen bg-slate-50/30 flex flex-col justify-between relative">

      {/* Loader Clínico Inicial Elegante de UNIDOSLAB */}
      <div
        className={`fixed inset-0 z-50 bg-white flex flex-col items-center justify-center transition-opacity duration-300 pointer-events-none ${isPageReady ? 'opacity-0 invisible' : 'opacity-100'
          }`}
      >
        <div className="flex flex-col items-center gap-5">
          <div className="relative flex items-center justify-center">
            {/* Anillo de pulso médico coral */}
            <div className="absolute w-28 h-28 rounded-full bg-red-100/70 animate-ping"></div>
            <div className="w-24 h-24 rounded-3xl bg-white shadow-xl shadow-red-500/10 border border-slate-100 flex items-center justify-center p-3 relative z-10">
              <img
                src="/icon-unidoslab.webp"
                alt="UNIDOSLAB"
                width={56}
                height={56}
                className="w-14 h-14 object-contain animate-pulse"
              />
            </div>
          </div>
          <div className="text-center">
            <h3 className="font-jakarta text-sm font-extrabold tracking-widest text-[#1E3A4C] uppercase">
              UNIDOSLAB
            </h3>
            <p className="text-[11px] text-[#FF5A5F] font-bold tracking-wider mt-0.5">
              Unidos por tu Salud
            </p>
          </div>
        </div>
      </div>

      <div>
        <Header activeTab={activeTab} setActiveTab={setActiveTab} />
        <main>
          {renderContent()}
        </main>
      </div>

      {/* Botón flotante de WhatsApp con expansión al pasar el cursor (hover) */}
      <a
        href="https://api.whatsapp.com/send/?phone=51952920616&text=Hola%20UNIDOSLAB,%20deseo%20mayor%20informaci%C3%B3n"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Contacto por WhatsApp"
        className="fixed bottom-6 right-6 z-50 flex items-center bg-[#25D366] hover:bg-[#20ba5a] text-white p-3.5 rounded-full shadow-xl shadow-emerald-600/30 transition-all duration-300 hover:scale-105 group overflow-hidden"
      >
        <IconBrandWhatsapp className="w-7 h-7 shrink-0" />
        <span className="max-w-0 overflow-hidden whitespace-nowrap group-hover:max-w-[120px] transition-all duration-300 ease-in-out text-xs font-bold uppercase tracking-wider group-hover:pl-2.5 group-hover:pr-1.5 opacity-0 group-hover:opacity-100">
          WhatsApp
        </span>
      </a>

      {/* Footer - Diseño Limpio Fiel a la Referencia */}
      <footer className="w-full bg-white text-slate-600 pt-16 pb-10 border-t-2 border-[#FF5A5F]/20 font-plex relative z-20">
        <div className="max-w-7xl mx-auto px-4 md:px-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8 mb-14">

          {/* Columna 1: Branding & Info (4 Cols) */}
          <div className="lg:col-span-4 flex flex-col items-center sm:items-start gap-4">
            <div className="flex items-center gap-3">
              <img
                src="/logo-unidoslab.webp"
                alt="UNIDOSLAB - Unidos por tu Salud"
                width={180}
                height={45}
                loading="lazy"
                className="h-11 w-auto object-contain cursor-pointer"
                onClick={() => setActiveTab('inicio')}
              />
            </div>
            <p className="text-xs text-slate-500 leading-relaxed max-w-xs mt-1 text-center sm:text-left font-medium">
              Laboratorio clínico en Tacna con atención profesional, resultados confiables y calidez humana.
            </p>
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-700 mt-2">
              <IconHome className="w-4 h-4 text-[#FF5A5F] shrink-0" />
              <span>Atención en sede y a domicilio.</span>
            </div>
          </div>

          {/* Columna 2: EXPLORAR (2.5 Cols) */}
          <div className="lg:col-span-2 sm:col-span-1 flex flex-col items-center sm:items-start">
            <h4 className="text-xs font-extrabold uppercase tracking-widest text-[#1E3A4C] mb-5">EXPLORAR</h4>
            <ul className="space-y-3 text-xs w-full">
              <li>
                <button
                  onClick={() => { setActiveTab('inicio'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  className="w-full flex items-center justify-between text-slate-600 hover:text-[#FF5A5F] font-medium transition-colors cursor-pointer group"
                >
                  <span>Inicio</span>
                  <IconChevronRight className="w-3.5 h-3.5 text-[#FF5A5F] transition-transform group-hover:translate-x-0.5" />
                </button>
              </li>
              <li>
                <button
                  onClick={() => { setActiveTab('servicios'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  className="w-full flex items-center justify-between text-slate-600 hover:text-[#FF5A5F] font-medium transition-colors cursor-pointer group"
                >
                  <span>Servicios</span>
                  <IconChevronRight className="w-3.5 h-3.5 text-[#FF5A5F] transition-transform group-hover:translate-x-0.5" />
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    if (activeTab !== 'inicio') {
                      setActiveTab('inicio');
                      setTimeout(() => {
                        window.scrollTo({ top: 900, behavior: 'smooth' });
                      }, 100);
                    } else {
                      window.scrollTo({ top: 900, behavior: 'smooth' });
                    }
                  }}
                  className="w-full flex items-center justify-between text-slate-600 hover:text-[#FF5A5F] font-medium transition-colors cursor-pointer group"
                >
                  <span>¿Cómo funciona?</span>
                  <IconChevronRight className="w-3.5 h-3.5 text-[#FF5A5F] transition-transform group-hover:translate-x-0.5" />
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    if (activeTab !== 'inicio') {
                      setActiveTab('inicio');
                      setTimeout(() => {
                        const el = document.getElementById('sedes');
                        if (el) el.scrollIntoView({ behavior: 'smooth' });
                      }, 100);
                    } else {
                      const el = document.getElementById('sedes');
                      if (el) el.scrollIntoView({ behavior: 'smooth' });
                    }
                  }}
                  className="w-full flex items-center justify-between text-slate-600 hover:text-[#FF5A5F] font-medium transition-colors cursor-pointer group"
                >
                  <span>Nuestras sedes</span>
                  <IconChevronRight className="w-3.5 h-3.5 text-[#FF5A5F] transition-transform group-hover:translate-x-0.5" />
                </button>
              </li>
              <li>
                <a
                  href="https://api.whatsapp.com/send/?phone=51952920616&text=Hola%20UNIDOSLAB,%20deseo%20contactarme"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-between text-slate-600 hover:text-[#FF5A5F] font-medium transition-colors cursor-pointer group"
                >
                  <span>Contacto</span>
                  <IconChevronRight className="w-3.5 h-3.5 text-[#FF5A5F] transition-transform group-hover:translate-x-0.5" />
                </a>
              </li>
            </ul>
          </div>

          {/* Columna 3: ATENCIÓN (2.5 Cols) */}
          <div className="lg:col-span-3 sm:col-span-1 flex flex-col items-center sm:items-start">
            <h4 className="text-xs font-extrabold uppercase tracking-widest text-[#1E3A4C] mb-5">ATENCIÓN</h4>
            <ul className="space-y-3 text-xs w-full">
              <li>
                <button
                  onClick={() => { setActiveTab('resultados'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  className="w-full flex items-center justify-between text-slate-600 hover:text-[#FF5A5F] font-medium transition-colors cursor-pointer group"
                >
                  <span>Resultados en línea</span>
                  <IconChevronRight className="w-3.5 h-3.5 text-[#FF5A5F] transition-transform group-hover:translate-x-0.5" />
                </button>
              </li>
              <li>
                <button
                  onClick={() => { setActiveTab('soy_medico'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  className="w-full flex items-center justify-between text-slate-600 hover:text-[#FF5A5F] font-medium transition-colors cursor-pointer group"
                >
                  <span>Soy Médico</span>
                  <IconChevronRight className="w-3.5 h-3.5 text-[#FF5A5F] transition-transform group-hover:translate-x-0.5" />
                </button>
              </li>
              <li>
                <a
                  href="https://api.whatsapp.com/send/?phone=51952920616&text=Hola%20UNIDOSLAB,%20deseo%20solicitar%20toma%20de%20muestras%20a%20domicilio"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-between text-slate-600 hover:text-[#FF5A5F] font-medium transition-colors cursor-pointer group"
                >
                  <span>Toma de muestras a domicilio</span>
                  <IconChevronRight className="w-3.5 h-3.5 text-[#FF5A5F] transition-transform group-hover:translate-x-0.5" />
                </a>
              </li>
              <li>
                <a
                  href="https://api.whatsapp.com/send/?phone=51952920616&text=Hola%20UNIDOSLAB,%20deseo%20agendar%20una%20atenci%C3%B3n"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-between text-slate-600 hover:text-[#FF5A5F] font-medium transition-colors cursor-pointer group"
                >
                  <span>Agendar atención</span>
                  <IconChevronRight className="w-3.5 h-3.5 text-[#FF5A5F] transition-transform group-hover:translate-x-0.5" />
                </a>
              </li>
            </ul>
          </div>

          {/* Columna 4: CONTACTO & REDES (3.5 Cols) */}
          <div className="lg:col-span-3 flex flex-col items-center sm:items-start gap-3">
            <h4 className="text-xs font-extrabold uppercase tracking-widest text-[#1E3A4C] mb-1">CONTACTO</h4>

            {/* Correo Electrónico */}
            <a
              href="mailto:uniilab.laboratorioclinico@outlook.es"
              className="flex items-center gap-2 text-xs text-slate-600 hover:text-[#FF5A5F] transition-colors"
            >
              <div className="w-6 h-6 rounded-lg bg-red-50 border border-red-100 flex items-center justify-center text-[#FF5A5F] shrink-0">
                <IconMail className="w-3.5 h-3.5" />
              </div>
              <span className="truncate text-[11.5px]">uniilab.laboratorioclinico@outlook.es</span>
            </a>

            {/* Canales WhatsApp */}
            <div className="w-full space-y-2 pt-1">
              <a
                href="https://wa.me/51952920616"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2 px-3 bg-[#25D366]/10 hover:bg-[#25D366]/20 border border-[#25D366]/40 text-[#1EBE5D] font-extrabold text-[11.5px] rounded-xl transition-all flex items-center justify-center sm:justify-start gap-2 cursor-pointer"
              >
                <IconBrandWhatsapp className="w-4 h-4 text-[#25D366]" />
                <span>952 920 616 (24 Horas)</span>
              </a>

              <a
                href="https://wa.me/51969940249"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2 px-3 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 hover:text-[#25D366] font-extrabold text-[11.5px] rounded-xl transition-all flex items-center justify-center sm:justify-start gap-2 cursor-pointer shadow-2xs"
              >
                <IconBrandWhatsapp className="w-4 h-4 text-[#25D366]" />
                <span>969 940 249 </span>
              </a>
            </div>

            {/* Ubicación y Sedes */}
            <div className="text-[11px] text-slate-500 space-y-1 pt-1 text-center sm:text-left">
              <p className="font-bold text-[#1E3A4C] flex items-center gap-1.5 justify-center sm:justify-start">
                <IconMapPin className="w-3.5 h-3.5 text-[#FF5A5F] shrink-0" />
                <span>Tacna, Perú:</span>
              </p>
              <p>• AV. Leguía N° 778-C (Desde 7:45 AM)</p>
              <p>• Patricio Meléndez N° 382 Of. 303</p>
            </div>

            {/* Redes Sociales Cuadradas Blancas con Borde */}
            <div className="flex items-center gap-2.5 pt-1">
              <a
                href="https://www.facebook.com/UNIIDOSLAB.Laboratorio.Clinico/"
                target="_blank"
                rel="noopener noreferrer"
                title="Facebook UNIDOSLAB"
                className="w-9 h-9 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 hover:text-[#1877F2] rounded-xl flex items-center justify-center transition-all shadow-2xs"
              >
                <IconBrandFacebook className="w-4.5 h-4.5" />
              </a>
              <a
                href="https://www.instagram.com/uniilab_laboratorio_clinico"
                target="_blank"
                rel="noopener noreferrer"
                title="Instagram UNIDOSLAB"
                className="w-9 h-9 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 hover:text-[#E4405F] rounded-xl flex items-center justify-center transition-all shadow-2xs"
              >
                <IconBrandInstagram className="w-4.5 h-4.5" />
              </a>
            </div>
          </div>

        </div>

        {/* Línea Divisoria Inferior y Derechos */}
        <div className="max-w-7xl mx-auto px-4 md:px-6 pt-6 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-400 font-medium text-center sm:text-left">
          <span suppressHydrationWarning>&copy; {new Date().getFullYear()} UNIDOSLAB. Todos los derechos reservados.</span>
          <div className="flex justify-center sm:justify-start gap-6">
            <button
              onClick={() => { setActiveTab('terminos'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
              className="hover:text-[#FF5A5F] transition-colors cursor-pointer"
            >
              Términos de servicio
            </button>
            <span className="text-slate-300">|</span>
            <button
              onClick={() => { setActiveTab('privacidad'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
              className="hover:text-[#FF5A5F] transition-colors cursor-pointer"
            >
              Política de privacidad
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
