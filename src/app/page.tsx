"use client";

import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import Header from '../components/Header';
import Home from '../components/Home';

// Dynamic imports para reducir el bundle inicial en mobile y desktop
const Services = dynamic(() => import('../components/Services'), { ssr: false });
const Terminos = dynamic(() => import('../components/Terminos'), { ssr: false });
const Privacidad = dynamic(() => import('../components/Privacidad'), { ssr: false });
import {
  IconMapPin,
  IconClock,
  IconPhone,
  IconPhoneCall,
  IconShieldCheck,
  IconMicroscope,
  IconBrandFacebook,
  IconBrandInstagram,
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
import WhatsAppIcon from '../components/icons/WhatsAppIcon';

export default function Page() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<string>('inicio');
  const [dni, setDni] = useState<string>('');

  const renderContent = () => {
    switch (activeTab) {
      case 'inicio':
        return <Home setActiveTab={setActiveTab} />;

      case 'servicios':
        return <Services setActiveTab={setActiveTab} />;

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
                  src="https://images.pexels.com/photos/8442574/pexels-photo-8442574.jpeg?auto=compress&cs=tinysrgb&w=800&q=75"
                  alt="Técnica de laboratorio trabajando en microscopio"
                  loading="lazy"
                  decoding="async"
                  width={600}
                  height={560}
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
        <WhatsAppIcon className="w-7 h-7 shrink-0" />
        <span className="max-w-0 overflow-hidden whitespace-nowrap group-hover:max-w-[120px] transition-all duration-300 ease-in-out text-xs font-bold uppercase tracking-wider group-hover:pl-2.5 group-hover:pr-1.5 opacity-0 group-hover:opacity-100">
          WhatsApp
        </span>
      </a>

      {/* Footer - Diseño Oficial con Tipografía Manrope e Iconos */}
      <footer className="w-full bg-[#ffffff] text-[#60788a] pt-[56px] sm:pt-[72px] pb-[38px] border-t border-[#dce6ec] font-manrope relative z-20">
        <div className="w-[min(1180px,100%-40px)] sm:w-[min(1180px,100%-48px)] mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1.1fr_1.2fr] gap-[36px] md:gap-[32px] lg:gap-[48px] mb-[40px] sm:mb-[48px]">

          {/* Columna 1: Branding & Redes Sociales */}
          <div className="flex flex-col items-center sm:items-start text-center sm:text-left gap-3.5 sm:gap-4">
            <div
              className="cursor-pointer flex justify-center sm:justify-start"
              onClick={() => { setActiveTab('inicio'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
            >
              <img
                src="/logo-unidoslab-opt.webp"
                alt="UNIDOSLAB - Laboratorio Clínico"
                width={170}
                height={52}
                loading="lazy"
                decoding="async"
                className="h-[46px] sm:h-[50px] w-auto object-contain"
              />
            </div>
            <p className="font-manrope text-[13px] text-[#60788a] leading-[1.65] max-w-sm sm:max-w-xs mx-auto sm:mx-0">
              Laboratorio clínico en Tacna con más de 6 años de experiencia en diagnóstico preciso y atención humana.
            </p>

            {/* Redes Sociales con estilo oficial */}
            <div className="flex items-center justify-center sm:justify-start gap-[10px] pt-1">
              <a
                href="https://www.facebook.com/UNIIDOSLAB.Laboratorio.Clinico/"
                target="_blank"
                rel="noopener noreferrer"
                title="Facebook UNIDOSLAB"
                className="w-[38px] h-[38px] rounded-[11px] bg-white border border-[#dce6ec] text-[#09283c] hover:text-[#fb5962] hover:border-[#f7c7ca] flex items-center justify-center transition-all shadow-xs hover:-translate-y-0.5"
              >
                <IconBrandFacebook className="w-[19px] h-[19px]" />
              </a>
              <a
                href="https://www.instagram.com/uniilab_laboratorio_clinico"
                target="_blank"
                rel="noopener noreferrer"
                title="Instagram UNIDOSLAB"
                className="w-[38px] h-[38px] rounded-[11px] bg-white border border-[#dce6ec] text-[#09283c] hover:text-[#fb5962] hover:border-[#f7c7ca] flex items-center justify-center transition-all shadow-xs hover:-translate-y-0.5"
              >
                <IconBrandInstagram className="w-[19px] h-[19px]" />
              </a>
              <a
                href="https://wa.me/51952920616"
                target="_blank"
                rel="noopener noreferrer"
                title="WhatsApp UNIDOSLAB"
                className="w-[38px] h-[38px] rounded-[11px] bg-white border border-[#dce6ec] text-[#09283c] hover:text-[#25D366] hover:border-[#25D366]/40 flex items-center justify-center transition-all shadow-xs hover:-translate-y-0.5"
              >
                <WhatsAppIcon className="w-[19px] h-[19px]" />
              </a>
            </div>
          </div>

          {/* Columna 2: Explorar / Servicios */}
          <div className="flex flex-col items-center sm:items-start text-center sm:text-left">
            <h4 className="font-manrope font-[800] text-[13px] uppercase tracking-[0.12em] text-[#09283c] mb-[14px] sm:mb-[18px]">
              Explorar
            </h4>
            <ul className="flex flex-col items-center sm:items-start space-y-[10px] sm:space-y-[11px] text-[13px] font-manrope font-[600] w-full">
              <li>
                <button
                  type="button"
                  onClick={() => { setActiveTab('inicio'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  className="text-[#60788a] hover:text-[#fb5962] transition-colors cursor-pointer flex items-center justify-center sm:justify-start gap-1.5"
                >
                  <span>Inicio</span>
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => { setActiveTab('servicios'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  className="text-[#60788a] hover:text-[#fb5962] transition-colors cursor-pointer flex items-center justify-center sm:justify-start gap-1.5"
                >
                  <span>Servicios de salud</span>
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => {
                    if (activeTab !== 'inicio') {
                      setActiveTab('inicio');
                      setTimeout(() => {
                        const el = document.getElementById('proceso');
                        if (el) el.scrollIntoView({ behavior: 'smooth' });
                      }, 100);
                    } else {
                      const el = document.getElementById('proceso');
                      if (el) el.scrollIntoView({ behavior: 'smooth' });
                    }
                  }}
                  className="text-[#60788a] hover:text-[#fb5962] transition-colors cursor-pointer flex items-center justify-center sm:justify-start gap-1.5"
                >
                  <span>Cómo funciona</span>
                </button>
              </li>
              <li>
                <button
                  type="button"
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
                  className="text-[#60788a] hover:text-[#fb5962] transition-colors cursor-pointer flex items-center justify-center sm:justify-start gap-1.5"
                >
                  <span>Nuestras sedes</span>
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => { setActiveTab('resultados'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  className="text-[#60788a] hover:text-[#fb5962] transition-colors cursor-pointer flex items-center justify-center sm:justify-start gap-1.5"
                >
                  <span>Resultados en línea</span>
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => router.push('/login')}
                  className="text-[#60788a] hover:text-[#fb5962] transition-colors cursor-pointer flex items-center justify-center sm:justify-start gap-1.5"
                >
                  <span>Soy médico</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Columna 3: Sedes & Horarios */}
          <div className="flex flex-col items-center sm:items-start text-center sm:text-left">
            <h4 className="font-manrope font-[800] text-[13px] uppercase tracking-[0.12em] text-[#09283c] mb-[14px] sm:mb-[18px]">
              Sedes en Tacna
            </h4>
            <div className="space-y-[14px] text-[13px] font-manrope w-full flex flex-col items-center sm:items-start">
              <div className="flex flex-col items-center sm:items-start">
                <p className="font-[800] text-[#09283c] flex items-center justify-center sm:justify-start gap-1.5">
                  <IconMapPin className="w-4 h-4 text-[#fb5962] shrink-0" />
                  <span>Sede Av. Leguía:</span>
                </p>
                <p className="text-[12px] text-[#60788a] mt-0.5 sm:pl-5">Av. Leguía N° 778-C</p>
              </div>

              <div className="flex flex-col items-center sm:items-start">
                <p className="font-[800] text-[#09283c] flex items-center justify-center sm:justify-start gap-1.5">
                  <IconMapPin className="w-4 h-4 text-[#fb5962] shrink-0" />
                  <span>Sede Patricio Meléndez:</span>
                </p>
                <p className="text-[12px] text-[#60788a] mt-0.5 sm:pl-5">Calle Patricio Meléndez N° 382 Of. 303</p>
              </div>

              <div className="pt-3 border-t border-[#dce6ec] w-full max-w-xs sm:max-w-none flex flex-col items-center sm:items-start">
                <p className="font-[800] text-[#09283c] flex items-center justify-center sm:justify-start gap-1.5 text-[12px]">
                  <IconClock className="w-4 h-4 text-[#fb5962] shrink-0" />
                  <span>Horario de atención:</span>
                </p>
                <p className="text-[12px] text-[#60788a] mt-0.5 sm:pl-5 leading-relaxed">
                  Lun a Sáb: 8:00 am – 1:00 pm / 3:00 pm – 8:00 pm<br />
                  <span className="text-[11px] text-[#8aa0ae] font-medium">(Sede Leguía desde 7:45 am)</span>
                </p>
              </div>
            </div>
          </div>

          {/* Columna 4: Canales de Atención */}
          <div className="flex flex-col items-center sm:items-start text-center sm:text-left gap-3 w-full max-w-sm sm:max-w-none mx-auto sm:mx-0">
            <h4 className="font-manrope font-[800] text-[13px] uppercase tracking-[0.12em] text-[#09283c] mb-[4px] sm:mb-[6px]">
              Contacto directo
            </h4>

            {/* WhatsApp 24h */}
            <a
              href="https://wa.me/51952920616"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full min-h-[44px] py-2.5 px-3.5 bg-[#25D366]/10 hover:bg-[#25D366]/20 border border-[#25D366]/30 text-[#1EBE5D] font-manrope font-[800] text-[12.5px] rounded-[13px] transition-all flex items-center justify-center sm:justify-start gap-2.5 cursor-pointer shadow-2xs hover:-translate-y-0.5"
            >
              <WhatsAppIcon className="w-[17px] h-[17px] text-[#25D366] shrink-0" />
              <span>952 920 616 (24 Horas)</span>
            </a>

            {/* WhatsApp Citas */}
            <a
              href="https://wa.me/51969940249"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full min-h-[44px] py-2.5 px-3.5 bg-white hover:bg-slate-50 border border-[#dce6ec] text-[#09283c] hover:text-[#25D366] font-manrope font-[800] text-[12.5px] rounded-[13px] transition-all flex items-center justify-center sm:justify-start gap-2.5 cursor-pointer shadow-2xs hover:-translate-y-0.5"
            >
              <WhatsAppIcon className="w-[17px] h-[17px] text-[#25D366] shrink-0" />
              <span>969 940 249 (Citas)</span>
            </a>

            {/* Correo Electrónico */}
            <a
              href="mailto:uniilab.laboratorioclinico@outlook.es"
              className="flex items-center justify-center sm:justify-start gap-2 text-[12px] text-[#60788a] hover:text-[#fb5962] transition-colors mt-1 w-full"
            >
              <IconMail className="w-4 h-4 text-[#fb5962] shrink-0" />
              <span className="truncate">uniilab.laboratorioclinico@outlook.es</span>
            </a>
          </div>

        </div>

        {/* Línea Divisoria Inferior y Derechos */}
        <div className="w-[min(1180px,100%-40px)] sm:w-[min(1180px,100%-48px)] mx-auto pt-[24px] border-t border-[#dce6ec] flex flex-col sm:flex-row items-center justify-between gap-3.5 sm:gap-4 text-[12px] text-[#8aa0ae] font-medium text-center sm:text-left">
          <span suppressHydrationWarning>&copy; {new Date().getFullYear()} UNIDOSLAB · Unidos por tu Salud. Tacna, Perú.</span>
          <div className="flex items-center justify-center sm:justify-start gap-4 sm:gap-6">
            <button
              type="button"
              onClick={() => { setActiveTab('terminos'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
              className="hover:text-[#fb5962] transition-colors cursor-pointer"
            >
              Términos de servicio
            </button>
            <span className="text-[#dce6ec]">|</span>
            <button
              type="button"
              onClick={() => { setActiveTab('privacidad'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
              className="hover:text-[#fb5962] transition-colors cursor-pointer"
            >
              Política de privacidad
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
