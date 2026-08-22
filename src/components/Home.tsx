"use client";

import React, { useEffect, useRef } from 'react';
import {
  IconFlask,
  IconMicroscope,
  IconTestPipe,
  IconDna,
  IconCheck,
  IconClock,
  IconMapPin,
  IconArrowRight,
  IconFileCertificate,
  IconSend,
  IconPlus,
  IconSparkles,
  IconShieldCheck,
  IconBuildingHospital,
  IconUsers,
  IconAward,
  IconNavigation,
  IconCar,
  IconStethoscope,
  IconDeviceDesktopAnalytics,
  IconHome,
  IconCalendarEvent,
  IconPhoneCall,
  IconBrandFacebook,
  IconBrandInstagram
} from '@tabler/icons-react';
import WhatsAppIcon from './icons/WhatsAppIcon';
import gsap from 'gsap';
import { motion, AnimatePresence } from 'framer-motion';

import dynamic from 'next/dynamic';

const SedesMap = dynamic(() => import('./SedesMap'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full min-h-[440px] lg:min-h-[500px] bg-slate-100 rounded-3xl flex items-center justify-center text-slate-400 font-bold text-xs uppercase tracking-wider">
      Cargando Mapa Interactivo...
    </div>
  )
});

interface HomeProps {
  setActiveTab: (tab: string) => void;
}

const Home: React.FC<HomeProps> = ({ setActiveTab }) => {
  const heroRef = useRef<HTMLElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const sedesSectionRef = useRef<HTMLElement>(null);

  const [yearsCount, setYearsCount] = React.useState(0);
  const [examsCount, setExamsCount] = React.useState(0);
  const [showCards, setShowCards] = React.useState(false);
  const [mapVisible, setMapVisible] = React.useState(false);
  const [selectedSedeIndex, setSelectedSedeIndex] = React.useState<number>(0);

  const sedesData = [
    {
      id: 'leguia',
      number: '01',
      name: 'Sede Central (Av. Leguía)',
      address: 'AV. Leguía N° 778-C, Tacna',
      reference: 'Cerca a Esquina de Movimiento',
      badge: 'Atención desde 7:45 AM',
      schedule: '7:45 AM - 1:00 PM · 3:00 PM - 8:00 PM',
      scheduleFull: 'Lunes a Sábado: 7:45 AM – 1:00 PM | 3:00 PM – 8:00 PM',
      lat: -18.008048,
      lng: -70.249415,
      mapsExternalUrl: 'https://maps.app.goo.gl/Xy6PZvvMXs5e2469A'
    },
    {
      id: 'melendez',
      number: '02',
      name: 'Sucursal Patricio Meléndez',
      address: 'Av. Patricio Meléndez N° 382, Edificio María Auxiliadora Of. 303',
      reference: 'Edificio María Auxiliadora / Oficina 303 (Centro de Tacna)',
      badge: 'Atención desde 8:00 AM',
      schedule: '8:00 AM - 1:00 PM · 3:00 PM - 8:00 PM',
      scheduleFull: 'Lunes a Sábado: 8:00 AM – 1:00 PM | 3:00 PM – 8:00 PM',
      lat: -18.0093833,
      lng: -70.2483362,
      mapsExternalUrl: 'https://maps.app.goo.gl/NRSWec9rQhypSx9t9'
    }
  ];

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 30) {
        setShowCards(true);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    if (window.scrollY > 30) setShowCards(true);

    // Observer para cargar Leaflet solo cuando el usuario se acerca a la sección Sedes
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setMapVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: '300px' }
    );

    if (sedesSectionRef.current) {
      observer.observe(sedesSectionRef.current);
    }

    // Animación de conteo desde 0 para Años (5) y Exámenes (5,125)
    const duration = 1800; // ms
    const startTime = performance.now();

    const animateCounters = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Easing suave (easeOutExpo)
      const easeOut = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);

      setYearsCount(Math.floor(easeOut * 6));
      setExamsCount(Math.floor(easeOut * 5125));

      if (progress < 1) {
        requestAnimationFrame(animateCounters);
      } else {
        setYearsCount(6);
        setExamsCount(5125);
      }
    };

    requestAnimationFrame(animateCounters);

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (showCards && cardsRef.current) {
      gsap.fromTo(cardsRef.current.children,
        { autoAlpha: 0, y: 35 },
        { autoAlpha: 1, y: 0, stagger: 0.08, duration: 0.7, ease: 'power2.out' }
      );
    }
  }, [showCards]);

  const featureCards = [
    {
      title: 'Servicio de Análisis Clínicos',
      description: 'Ofrecemos todo tipo de análisis clínicos, para el apoyo del diagnóstico médico.',
      icon: <IconFlask className="w-12 h-12 text-white stroke-[1.5]" />,
      action: () => setActiveTab('servicios')
    },
    {
      title: 'Análisis de pruebas toxicológicas',
      description: 'Utiliza para determinar si una persona ha sido expuesta a drogas legales o ilegales.',
      icon: <IconMicroscope className="w-12 h-12 text-white stroke-[1.5]" />,
      action: () => setActiveTab('servicios')
    },
    {
      title: 'Examen PSA',
      description: 'Ayuda a diagnosticar y hacerle seguimiento al cáncer de próstata en los hombres.',
      icon: <IconTestPipe className="w-12 h-12 text-white stroke-[1.5]" />,
      action: () => setActiveTab('servicios')
    },
    {
      title: 'Atención a domicilio',
      description: 'Llámanos o escríbenos por WhatsApp y te atendemos en la comodidad de tu casa o en tu trabajo.',
      icon: <IconDna className="w-12 h-12 text-white stroke-[1.5]" />,
      action: () => window.open('https://api.whatsapp.com/send/?phone=51952920616&text=Hola%20UNIDOSLAB,%20deseo%20atenci%C3%B3n%20a%20domicilio%20en%20Tacna', '_blank')
    }
  ];

  return (
    <div className="w-full min-h-screen bg-slate-50/40 pb-16 font-plex relative overflow-hidden">

      {/* Elementos ambientales de fondo: Formas orgánicas y marcas de agua de iconos médicos decorativos */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
        {/* Curvas y formas orgánicas suaves de fondo (estilo referencia) */}
        <svg className="absolute -top-10 -left-20 w-[600px] h-[600px] text-sky-100/40" viewBox="0 0 200 200" fill="currentColor">
          <path d="M45.7,-58.5C58.9,-48.7,69.1,-35.1,73.4,-19.7C77.7,-4.3,76.1,12.9,68.9,27.7C61.7,42.4,48.9,54.7,34.1,62.8C19.3,70.9,2.5,74.8,-13.7,72.4C-29.9,69.9,-45.5,61.1,-56.9,48.1C-68.3,35.1,-75.5,17.6,-74.8,0.4C-74.1,-16.7,-65.5,-33.5,-53.4,-43.5C-41.2,-53.5,-25.6,-56.8,-9.9,-58.1C5.7,-59.5,32.6,-68.3,45.7,-58.5Z" transform="translate(100 100)" />
        </svg>

        <svg className="absolute top-[35%] -right-24 w-[650px] h-[650px] text-red-50/50" viewBox="0 0 200 200" fill="currentColor">
          <path d="M42.3,-58.2C54.4,-50.7,63.6,-38.3,68.9,-24.2C74.2,-10.1,75.6,5.7,71.2,20C66.8,34.3,56.6,47.1,43.4,56.4C30.2,65.7,14.1,71.5,-2.1,74.4C-18.3,77.3,-34.6,77.3,-46.9,68.6C-59.2,59.9,-67.5,42.5,-71.4,24.9C-75.3,7.3,-74.8,-10.5,-68.1,-25.4C-61.4,-40.3,-48.5,-52.3,-34.5,-59.1C-20.5,-65.9,-5.4,-67.5,8.8,-66.3C23,-65.1,30.2,-65.7,42.3,-58.2Z" transform="translate(100 100)" />
        </svg>

        {/* Halos difuminados suaves */}
        <div className="absolute top-[18%] -left-32 w-[520px] h-[520px] rounded-full bg-gradient-to-tr from-red-500/10 via-rose-300/8 to-transparent blur-[130px]"></div>
        <div className="absolute top-[42%] -right-32 w-[580px] h-[580px] rounded-full bg-gradient-to-bl from-sky-400/12 via-blue-200/8 to-transparent blur-[140px]"></div>
        <div className="absolute top-[70%] left-[10%] w-[620px] h-[620px] rounded-full bg-gradient-to-tr from-red-400/8 via-rose-100/6 to-transparent blur-[150px]"></div>

        {/* Iconos gigantes decorativos como marcas de agua sutiles */}
        <IconMicroscope className="absolute top-[28%] right-[8%] w-64 h-64 text-slate-400/8 stroke-[0.8] rotate-12" />
        <IconDna className="absolute top-[48%] left-[3%] w-72 h-72 text-red-500/7 stroke-[0.8] -rotate-12" />
        <IconFlask className="absolute top-[72%] right-[5%] w-60 h-60 text-sky-500/8 stroke-[0.8] rotate-6" />
        <IconPlus className="absolute top-[15%] left-[8%] w-24 h-24 text-red-400/10 stroke-[2] rotate-45" />
        <IconPlus className="absolute top-[42%] right-[15%] w-16 h-16 text-slate-400/10 stroke-[2] rotate-12" />
        <IconPlus className="absolute top-[82%] left-[12%] w-20 h-20 text-sky-400/10 stroke-[2] -rotate-12" />
        <IconSparkles className="absolute top-[62%] left-[22%] w-16 h-16 text-amber-400/12 stroke-[1.5]" />
      </div>

      {/* 1. HERO SECTION PRINCIPAL (Fiel al Rediseño del Mockup y CSS Oficial) */}
      <section
        ref={heroRef}
        id="inicio"
        className="relative w-full bg-[linear-gradient(120deg,#f8fbfd_0%,#eef6fa_48%,#e2f0f6_100%)] min-h-[760px] pt-[86px] pb-[60px] overflow-hidden z-10"
      >
        {/* ELEMENTOS AMBIENTALES DE FONDO (Fiel a .hero:before y .hero:after del CSS) */}
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
          {/* Círculo geométrico a la derecha (.hero:before) */}
          <div className="absolute top-[55px] -right-[190px] w-[430px] h-[430px] rounded-full border-[80px] border-[#12354a]/[0.055]"></div>
          {/* Matriz de puntos a la izquierda (.hero:after) */}
          <div className="absolute bottom-[70px] left-[5%] w-[160px] h-[160px] opacity-50 bg-[radial-gradient(#b9ceda_1.5px,transparent_1.5px)] bg-[size:16px_16px]"></div>
        </div>

        <div className="w-[min(1180px,100%-48px)] mx-auto relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-[1.02fr_0.98fr] gap-[40px] lg:gap-[72px] items-center">

            {/* Columna Izquierda: Contenido (.hero-copy) */}
            <div className="pb-6 lg:pb-[68px] flex flex-col items-start text-left">

              {/* Eyebrow badge */}
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="inline-flex items-center gap-[9px] text-[12px] font-[800] uppercase tracking-[0.14em] text-[#e54550] mb-[17px]"
              >
                <span className="w-[7px] h-[7px] rounded-full bg-[#fb5962] shadow-[0_0_0_5px_#fff0f1] shrink-0"></span>
                <span>UNIDOSLAB · Laboratorio Clínico</span>
              </motion.p>

              {/* Titular contundente (H1) */}
              <motion.h1
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="font-manrope text-[clamp(42px,5.2vw,74px)] font-[800] text-[#09283c] leading-[1.02] tracking-[-0.035em] max-w-[680px] mb-[25px]"
              >
                Resultados precisos.<br />
                <span className="text-[#fb5962] font-[800]">Atención que te acompaña.</span>
              </motion.h1>

              {/* Bajada (.hero-lead) */}
              <motion.p
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="font-manrope text-[16px] sm:text-[18px] text-[#60788a] leading-[1.72] max-w-[600px] mb-[31px]"
              >
                Diagnóstico confiable, atención profesional y resultados digitales para cuidar tu salud con tranquilidad.
              </motion.p>

              {/* Botones de acción (.hero-actions) */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.25 }}
                className="flex flex-wrap items-center gap-[13px] w-full sm:w-auto"
              >
                <a
                  href="https://api.whatsapp.com/send/?phone=51952920616&text=Hola%20UNIDOSLAB,%20deseo%20agendar%20una%20atenci%C3%B3n"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="min-h-[48px] px-[22px] bg-[#fb5962] hover:bg-[#e54550] text-white font-manrope font-[800] text-[13px] rounded-[13px] shadow-[0_11px_24px_rgba(251,89,98,0.23)] hover:shadow-[0_14px_28px_rgba(229,69,80,0.28)] transition-all hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-[10px] cursor-pointer"
                >
                  <WhatsAppIcon className="w-[19px] h-[19px]" />
                  <span>Agendar atención</span>
                </a>

                <button
                  type="button"
                  onClick={() => setActiveTab('servicios')}
                  className="min-h-[48px] px-[22px] bg-white hover:bg-slate-50 border border-[#dce6ec] hover:border-[#b9cad4] text-[#09283c] font-manrope font-[800] text-[13px] rounded-[13px] shadow-none hover:shadow-[0_10px_24px_rgba(23,55,74,0.08)] transition-all hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-[10px] cursor-pointer"
                >
                  <span>Conocer servicios</span>
                  <IconArrowRight className="w-[18px] h-[18px]" />
                </button>
              </motion.div>

              {/* Métricas de prueba animadas y 100% responsive (.hero-proof) */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.35 }}
                className="border-t border-[#12354a]/[0.13] pt-[25px] mt-[36px] sm:mt-[42px] grid grid-cols-3 divide-x divide-[#12354a]/[0.13] w-full max-w-[560px]"
              >
                <motion.div
                  whileHover={{ y: -2 }}
                  className="pr-2.5 sm:pr-6 flex flex-col gap-[3px] group cursor-default transition-all"
                >
                  <strong className="font-manrope text-[15px] sm:text-[18px] font-[800] text-[#09283c] group-hover:text-[#fb5962] transition-colors leading-tight">
                    +6 años
                  </strong>
                  <span className="font-manrope text-[11px] sm:text-[12px] text-[#60788a] leading-tight">
                    de experiencia
                  </span>
                </motion.div>

                <motion.div
                  whileHover={{ y: -2 }}
                  className="px-2.5 sm:px-6 flex flex-col gap-[3px] group cursor-default transition-all"
                >
                  <strong className="font-manrope text-[15px] sm:text-[18px] font-[800] text-[#09283c] group-hover:text-[#fb5962] transition-colors leading-tight">
                    2 sedes
                  </strong>
                  <span className="font-manrope text-[11px] sm:text-[12px] text-[#60788a] leading-tight">
                    en Tacna
                  </span>
                </motion.div>

                <motion.div
                  whileHover={{ y: -2 }}
                  className="pl-2.5 sm:pl-6 flex flex-col gap-[3px] group cursor-default transition-all"
                >
                  <strong className="font-manrope text-[15px] sm:text-[18px] font-[800] text-[#09283c] group-hover:text-[#fb5962] transition-colors leading-tight">
                    Digital
                  </strong>
                  <span className="font-manrope text-[11px] sm:text-[12px] text-[#60788a] leading-tight">
                    resultados en línea
                  </span>
                </motion.div>
              </motion.div>
            </div>

            {/* Columna Derecha: Especialista Médico & Floating Cards (.hero-visual) */}
            <div className="relative flex justify-center items-end min-h-[460px] lg:min-h-[545px]">

              {/* Fondo orgánico rotado detrás de la foto (.hero-visual:before) */}
              <div className="absolute inset-[30px_10px_10px_30px] lg:inset-[48px_0_14px_48px] rounded-[48%_48%_36%_36%] bg-gradient-to-br from-[#12354a]/[0.11] to-[#12354a]/[0.02] rotate-3 pointer-events-none"></div>

              {/* Contenedor de la foto (.hero-image-wrap) */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.7, ease: "easeOut" }}
                className="w-[94%] sm:w-[86%] h-[400px] sm:h-[460px] lg:h-[515px] bg-[#eef5f9] border-[8px] sm:border-[12px] border-white rounded-[28px_28px_90px_28px] sm:rounded-[42px_42px_130px_42px] shadow-[0_18px_50px_rgba(23,55,74,0.09)] relative overflow-hidden z-10"
              >
                <img
                  src="/hero-unidoslab.webp"
                  alt="Profesional de salud de UNIDOSLAB"
                  width={400}
                  height={515}
                  loading="eager"
                  fetchPriority="high"
                  decoding="async"
                  className="w-full h-full object-cover object-top"
                />
                {/* Degradado inferior (.hero-image-wrap:after) */}
                <div className="absolute inset-x-0 bottom-0 h-[32%] bg-gradient-to-t from-[#09283c]/[0.06] to-transparent pointer-events-none"></div>
              </motion.div>

              {/* Floating Card Superior (.fc-top) con animación continua de levitación */}
              <motion.div
                initial={{ opacity: 0, x: 25 }}
                animate={{ opacity: 1, x: 0, y: [0, -6, 0] }}
                transition={{
                  opacity: { duration: 0.6, delay: 0.3 },
                  x: { duration: 0.6, delay: 0.3 },
                  y: { duration: 3.8, repeat: Infinity, ease: "easeInOut" }
                }}
                whileHover={{ scale: 1.04 }}
                className="absolute top-[55px] sm:top-[90px] right-0 bg-white/95 backdrop-blur-[12px] border border-[#dce6ec] rounded-[15px] shadow-[0_15px_30px_rgba(23,55,74,0.12)] min-w-[170px] sm:min-w-[210px] p-[10px_12px] sm:p-[14px_17px] flex items-center gap-[11px] z-20 cursor-default"
              >
                <div className="w-[22px] h-[22px] text-[#fb5962] shrink-0 flex items-center justify-center">
                  <IconShieldCheck className="w-[22px] h-[22px] stroke-[1.8]" />
                </div>
                <div className="flex flex-col">
                  <strong className="font-manrope text-[11px] sm:text-[12px] font-[800] text-[#09283c] leading-tight">Procesos confiables</strong>
                  <span className="font-manrope text-[9px] sm:text-[11px] text-[#60788a] leading-tight mt-0.5">Control y precisión</span>
                </div>
              </motion.div>

              {/* Floating Card Inferior (.fc-bottom) con animación continua de levitación */}
              <motion.div
                initial={{ opacity: 0, x: -25 }}
                animate={{ opacity: 1, x: 0, y: [0, 6, 0] }}
                transition={{
                  opacity: { duration: 0.6, delay: 0.45 },
                  x: { duration: 0.6, delay: 0.45 },
                  y: { duration: 4.2, repeat: Infinity, ease: "easeInOut", delay: 0.5 }
                }}
                whileHover={{ scale: 1.04 }}
                className="absolute bottom-[25px] sm:bottom-[60px] left-0 bg-white/95 backdrop-blur-[12px] border border-[#dce6ec] rounded-[15px] shadow-[0_15px_30px_rgba(23,55,74,0.12)] min-w-[170px] sm:min-w-[210px] p-[10px_12px] sm:p-[14px_17px] flex items-center gap-[11px] z-20 cursor-default"
              >
                <div className="w-[22px] h-[22px] text-[#fb5962] shrink-0 flex items-center justify-center">
                  <IconClock className="w-[22px] h-[22px] stroke-[1.8]" />
                </div>
                <div className="flex flex-col">
                  <strong className="font-manrope text-[11px] sm:text-[12px] font-[800] text-[#09283c] leading-tight">Atención cercana</strong>
                  <span className="font-manrope text-[9px] sm:text-[11px] text-[#60788a] leading-tight mt-0.5">En sede y domicilio</span>
                </div>
              </motion.div>

            </div>
          </div>
        </div>
      </section>

      {/* QUICK ACTIONS BAR (.quick-actions del CSS Oficial) */}
      <div className="w-[min(1180px,100%-48px)] mx-auto border border-[#dce6ec] bg-white rounded-[20px] shadow-[0_16px_40px_rgba(23,55,74,0.09)] grid grid-cols-1 md:grid-cols-3 -mt-[14px] relative z-20 overflow-hidden mb-6 sm:mb-8">

        {/* Acción 1: Ver resultados */}
        <button
          type="button"
          onClick={() => setActiveTab('resultados')}
          className="border-b md:border-b-0 md:border-r border-[#dce6ec] p-[18px_20px] sm:p-[21px_25px] grid grid-cols-[auto_1fr_auto] items-center gap-[14px] text-left hover:bg-[#f5f8fb] transition-colors group cursor-pointer"
        >
          <div className="text-[#fb5962] flex items-center justify-center">
            <IconShieldCheck className="w-[22px] h-[22px] stroke-[1.8]" />
          </div>
          <div className="flex flex-col gap-[3px]">
            <strong className="font-manrope text-[13px] font-[800] text-[#09283c] group-hover:text-[#fb5962] transition-colors">Ver resultados</strong>
            <span className="font-manrope text-[11px] text-[#60788a]">Consulta segura en línea</span>
          </div>
          <IconArrowRight className="w-[18px] h-[18px] text-[#9aadb9] group-hover:text-[#fb5962] group-hover:translate-x-1 transition-all" />
        </button>

        {/* Acción 2: Agendar atención */}
        <a
          href="https://api.whatsapp.com/send/?phone=51952920616&text=Hola%20UNIDOSLAB,%20deseo%20agendar%20una%20atenci%C3%B3n"
          target="_blank"
          rel="noopener noreferrer"
          className="border-b md:border-b-0 md:border-r border-[#dce6ec] p-[18px_20px] sm:p-[21px_25px] grid grid-cols-[auto_1fr_auto] items-center gap-[14px] text-left hover:bg-[#f5f8fb] transition-colors group cursor-pointer"
        >
          <div className="text-[#fb5962] flex items-center justify-center">
            <WhatsAppIcon className="w-[21px] h-[21px]" />
          </div>
          <div className="flex flex-col gap-[3px]">
            <strong className="font-manrope text-[13px] font-[800] text-[#09283c] group-hover:text-[#fb5962] transition-colors">Agendar atención</strong>
            <span className="font-manrope text-[11px] text-[#60788a]">Coordina por WhatsApp</span>
          </div>
          <IconArrowRight className="w-[18px] h-[18px] text-[#9aadb9] group-hover:text-[#fb5962] group-hover:translate-x-1 transition-all" />
        </a>

        {/* Acción 3: Encontrar una sede */}
        <button
          type="button"
          onClick={() => {
            const el = document.getElementById('sedes');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }}
          className="p-[18px_20px] sm:p-[21px_25px] grid grid-cols-[auto_1fr_auto] items-center gap-[14px] text-left hover:bg-[#f5f8fb] transition-colors group cursor-pointer"
        >
          <div className="text-[#fb5962] flex items-center justify-center">
            <IconMapPin className="w-[22px] h-[22px] stroke-[1.8]" />
          </div>
          <div className="flex flex-col gap-[3px]">
            <strong className="font-manrope text-[13px] font-[800] text-[#09283c] group-hover:text-[#fb5962] transition-colors">Encontrar una sede</strong>
            <span className="font-manrope text-[11px] text-[#60788a]">Dos ubicaciones en Tacna</span>
          </div>
          <IconArrowRight className="w-[18px] h-[18px] text-[#9aadb9] group-hover:text-[#fb5962] group-hover:translate-x-1 transition-all" />
        </button>

      </div>

      {/* 2. SECCIÓN: SERVICIOS DE SALUD (Fiel al Rediseño Oficial) */}
      <section id="servicios" className="bg-white pt-[80px] sm:pt-[108px] pb-[70px] sm:pb-[100px] scroll-mt-[86px]">
        <div className="w-[min(1180px,100%-48px)] mx-auto">

          {/* Encabezado Split */}
          <div className="grid grid-cols-1 lg:grid-cols-[1.3fr_0.7fr] gap-[20px] lg:gap-[60px] items-end mb-[44px] sm:mb-[48px]">
            <div>
              <p className="inline-flex items-center gap-[9px] text-[12px] font-[800] uppercase tracking-[0.14em] text-[#e54550] mb-[17px]">
                <span className="w-[7px] h-[7px] rounded-full bg-[#fb5962] shadow-[0_0_0_5px_#fff0f1] shrink-0"></span>
                <span>Servicios de salud</span>
              </p>
              <h2 className="font-manrope text-[clamp(30px,3.8vw,54px)] font-[800] text-[#09283c] leading-[1.08] tracking-[-0.035em] max-w-[720px]">
                Una atención integral, pensada alrededor de ti.
              </h2>
            </div>
            <p className="font-manrope text-[15px] sm:text-[16px] text-[#60788a] leading-[1.72] max-w-[420px] mb-0 lg:mb-[21px]">
              Encuentra el servicio que necesitas y recibe orientación profesional en cada etapa de tu atención.
            </p>
          </div>

          {/* Grid de 3 Tarjetas de Servicios */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-[22px]">

            {/* Tarjeta 1: Exámenes y análisis clínicos */}
            <article className="border border-[#dce6ec] bg-white rounded-[20px] hover:shadow-[0_18px_50px_rgba(23,55,74,0.09)] hover:border-[#f7c7ca] hover:-translate-y-1.5 transition-all duration-200 overflow-hidden flex flex-col group">
              <div className="aspect-[1.7] bg-[#f5f8fb] overflow-hidden">
                <img
                  src="/analisis-clinicos.webp"
                  alt="Exámenes y análisis clínicos UNIDOSLAB"
                  width={360}
                  height={212}
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div className="p-[29px_27px_27px] relative flex-1 flex flex-col justify-between">
                {/* Icon Box */}
                <span className="w-[48px] h-[48px] bg-[#fff0f1] text-[#fb5962] border-[6px] border-white rounded-full flex items-center justify-center absolute -top-[26px] left-[27px] shadow-xs">
                  <IconFlask className="w-[22px] h-[22px] stroke-[1.8]" />
                </span>
                <div>
                  <h3 className="font-manrope text-[20px] font-[800] text-[#09283c] tracking-[-0.035em] mt-[13px] mb-[11px] group-hover:text-[#fb5962] transition-colors">
                    Exámenes y análisis clínicos
                  </h3>
                  <p className="font-manrope text-[14px] text-[#60788a] leading-[1.72] mb-[18px]">
                    Pruebas confiables con procesos estandarizados y entrega digital de resultados.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveTab('servicios')}
                  className="font-manrope text-[13px] font-[800] text-[#e54550] hover:text-[#fb5962] flex items-center gap-[8px] cursor-pointer mt-auto"
                >
                  <span>Ver servicios disponibles</span>
                  <IconArrowRight className="w-[17px] h-[17px] group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </article>

            {/* Tarjeta 2: Ecografías */}
            <article className="border border-[#dce6ec] bg-white rounded-[20px] hover:shadow-[0_18px_50px_rgba(23,55,74,0.09)] hover:border-[#f7c7ca] hover:-translate-y-1.5 transition-all duration-200 overflow-hidden flex flex-col group">
              <div className="aspect-[1.7] bg-[#f5f8fb] overflow-hidden">
                <img
                  src="/ecografias.webp"
                  alt="Ecografías especializadas UNIDOSLAB"
                  width={360}
                  height={212}
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div className="p-[29px_27px_27px] relative flex-1 flex flex-col justify-between">
                <span className="w-[48px] h-[48px] bg-[#fff0f1] text-[#fb5962] border-[6px] border-white rounded-full flex items-center justify-center absolute -top-[26px] left-[27px] shadow-xs">
                  <IconDeviceDesktopAnalytics className="w-[22px] h-[22px] stroke-[1.8]" />
                </span>
                <div>
                  <h3 className="font-manrope text-[20px] font-[800] text-[#09283c] tracking-[-0.035em] mt-[13px] mb-[11px] group-hover:text-[#fb5962] transition-colors">
                    Ecografías
                  </h3>
                  <p className="font-manrope text-[14px] text-[#60788a] leading-[1.72] mb-[18px]">
                    Estudios ecográficos realizados por profesionales, con atención clara y precisa.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveTab('servicios')}
                  className="font-manrope text-[13px] font-[800] text-[#e54550] hover:text-[#fb5962] flex items-center gap-[8px] cursor-pointer mt-auto"
                >
                  <span>Ver servicios disponibles</span>
                  <IconArrowRight className="w-[17px] h-[17px] group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </article>

            {/* Tarjeta 3: Consultas médicas */}
            <article className="border border-[#dce6ec] bg-white rounded-[20px] hover:shadow-[0_18px_50px_rgba(23,55,74,0.09)] hover:border-[#f7c7ca] hover:-translate-y-1.5 transition-all duration-200 overflow-hidden flex flex-col group">
              <div className="aspect-[1.7] bg-[#f5f8fb] overflow-hidden">
                <img
                  src="/consultas-medicas.webp"
                  alt="Consultas médicas presenciales y especializadas"
                  width={360}
                  height={212}
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div className="p-[29px_27px_27px] relative flex-1 flex flex-col justify-between">
                <span className="w-[48px] h-[48px] bg-[#fff0f1] text-[#fb5962] border-[6px] border-white rounded-full flex items-center justify-center absolute -top-[26px] left-[27px] shadow-xs">
                  <IconStethoscope className="w-[22px] h-[22px] stroke-[1.8]" />
                </span>
                <div>
                  <h3 className="font-manrope text-[20px] font-[800] text-[#09283c] tracking-[-0.035em] mt-[13px] mb-[11px] group-hover:text-[#fb5962] transition-colors">
                    Consultas médicas
                  </h3>
                  <p className="font-manrope text-[14px] text-[#60788a] leading-[1.72] mb-[18px]">
                    Evaluación personalizada y orientación oportuna para el cuidado de tu salud.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveTab('servicios')}
                  className="font-manrope text-[13px] font-[800] text-[#e54550] hover:text-[#fb5962] flex items-center gap-[8px] cursor-pointer mt-auto"
                >
                  <span>Ver servicios disponibles</span>
                  <IconArrowRight className="w-[17px] h-[17px] group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </article>

          </div>

          {/* Banner Horizontal Destacado: Atención a Domicilio (.home-feature) */}
          <article className="bg-[linear-gradient(115deg,#fff7f7,#fff)] border border-[#f5ced1] rounded-[24px] grid grid-cols-1 lg:grid-cols-[1fr_1.08fr] min-h-[400px] mt-[24px] overflow-hidden">
            <div className="p-[30px_22px] sm:p-[50px_48px] flex flex-col justify-center items-start">
              <p className="inline-flex items-center gap-[9px] text-[12px] font-[800] uppercase tracking-[0.14em] text-[#e54550] mb-[17px]">
                <span className="w-[7px] h-[7px] rounded-full bg-[#fb5962] shadow-[0_0_0_5px_#fff0f1] shrink-0"></span>
                <span>Más comodidad</span>
              </p>
              <h3 className="font-manrope text-[24px] sm:text-[34px] font-[800] text-[#09283c] leading-[1.17] tracking-[-0.035em] max-w-[540px] mb-[17px]">
                Atención a domicilio con la misma calidad de nuestras sedes.
              </h3>
              <p className="font-manrope text-[14px] sm:text-[15px] text-[#60788a] leading-[1.72] max-w-[540px] mb-[22px]">
                Realizamos la toma de muestras en tu hogar con personal capacitado, protocolos seguros y atención puntual.
              </p>
              <div className="flex flex-wrap gap-[10px_22px] mb-[28px]">
                <span className="font-manrope text-[12px] font-[700] text-[#12354a] flex items-center gap-[7px]">
                  <IconCheck className="w-[17px] h-[17px] text-[#fb5962] stroke-[2.5]" />
                  <span>Personal capacitado</span>
                </span>
                <span className="font-manrope text-[12px] font-[700] text-[#12354a] flex items-center gap-[7px]">
                  <IconCheck className="w-[17px] h-[17px] text-[#fb5962] stroke-[2.5]" />
                  <span>Coordinación rápida</span>
                </span>
                <span className="font-manrope text-[12px] font-[700] text-[#12354a] flex items-center gap-[7px]">
                  <IconCheck className="w-[17px] h-[17px] text-[#fb5962] stroke-[2.5]" />
                  <span>Cobertura en Tacna</span>
                </span>
              </div>
              <a
                href="https://api.whatsapp.com/send/?phone=51952920616&text=Hola%20UNIDOSLAB,%20deseo%20agendar%20una%20atenci%C3%B3n%20a%20domicilio"
                target="_blank"
                rel="noopener noreferrer"
                className="min-h-[48px] px-[22px] bg-[#fb5962] hover:bg-[#e54550] text-white font-manrope font-[800] text-[13px] rounded-[13px] shadow-[0_11px_24px_rgba(251,89,98,0.23)] hover:shadow-[0_14px_28px_rgba(229,69,80,0.28)] transition-all hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-[10px] cursor-pointer"
              >
                <WhatsAppIcon className="w-[19px] h-[19px]" />
                <span>Solicitar atención</span>
              </a>
            </div>
            <div className="order-first lg:order-last h-[240px] sm:h-[320px] lg:h-full overflow-hidden">
              <img
                src="/atencion-domicilio.webp"
                alt="Toma de muestra a domicilio UNIDOSLAB"
                width={480}
                height={320}
                loading="lazy"
                decoding="async"
                className="w-full h-full object-cover"
              />
            </div>
          </article>

        </div>
      </section>

      {/* 3. SECCIÓN: CONFIANZA CLÍNICA / POR QUÉ ELEGIRNOS (.trust-section Fiel al Rediseño) */}
      <section id="confianza" className="bg-[#09283c] py-[82px] sm:py-[108px] text-white relative overflow-hidden scroll-mt-[86px]">
        {/* Anillo decorativo ambiental superior derecho */}
        <div aria-hidden="true" className="pointer-events-none absolute top-[-250px] -right-[260px] w-[560px] h-[560px] rounded-full border-[90px] border-white/[0.024]"></div>

        <div className="w-[min(1180px,100%-48px)] mx-auto relative z-10 grid grid-cols-1 lg:grid-cols-[0.92fr_1.08fr] gap-[50px] lg:gap-[82px] items-center">

          {/* Columna Izquierda: Fotografía con sello de calidad (.trust-photo) */}
          <div className="relative h-[360px] sm:h-[480px] lg:h-[610px]">
            <img
              src="/analisis-clinicos.webp"
              alt="Proceso de análisis clínico UNIDOSLAB"
              width={520}
              height={610}
              loading="lazy"
              decoding="async"
              className="w-full h-full object-cover rounded-[30px_90px_30px_30px] shadow-[0_18px_50px_rgba(0,0,0,0.35)]"
            />
            {/* Quality Seal flotante (.quality-seal) con animación de levitación */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              animate={{ y: [0, -6, 0] }}
              transition={{
                opacity: { duration: 0.6 },
                scale: { duration: 0.6 },
                y: { duration: 4, repeat: Infinity, ease: "easeInOut" }
              }}
              whileHover={{ scale: 1.05 }}
              className="absolute bottom-[15px] sm:bottom-[35px] right-[10px] sm:-right-[30px] bg-white text-[#12354a] rounded-[16px] p-[16px_20px] sm:p-[18px_22px] flex items-center gap-[12px] shadow-[0_18px_50px_rgba(0,0,0,0.25)] z-10 cursor-default"
            >
              <div className="w-[28px] h-[28px] text-[#fb5962] flex items-center justify-center shrink-0">
                <IconShieldCheck className="w-[28px] h-[28px] stroke-[1.8]" />
              </div>
              <div className="flex flex-col">
                <strong className="font-manrope text-[12px] sm:text-[13px] font-[800] text-[#09283c] leading-tight">Control de calidad</strong>
                <span className="font-manrope text-[10px] sm:text-[11px] text-[#60788a] leading-tight mt-0.5">en cada proceso</span>
              </div>
            </motion.div>
          </div>

          {/* Columna Derecha: Contenido y Pilares (.trust-copy) */}
          <div className="flex flex-col items-start text-left">
            <p className="inline-flex items-center gap-[9px] text-[12px] font-[800] uppercase tracking-[0.14em] text-[#ff9da3] mb-[17px]">
              <span className="w-[7px] h-[7px] rounded-full bg-[#fb5962] shadow-[0_0_0_5px_rgba(251,89,98,0.13)] shrink-0"></span>
              <span>Experiencia y precisión</span>
            </p>

            <h2 className="font-manrope text-[clamp(30px,3.8vw,54px)] font-[800] text-white leading-[1.08] tracking-[-0.035em] mb-[20px]">
              Confianza clínica que se demuestra en cada resultado.
            </h2>

            <p className="font-manrope text-[15px] sm:text-[16px] text-[#b9cad3] leading-[1.72] max-w-[620px] mb-[33px]">
              Más de seis años acompañando a familias, profesionales e instituciones de Tacna con diagnóstico oportuno y atención humana.
            </p>

            {/* Lista de Razones (.reason-list) */}
            <div className="grid gap-[23px] w-full mb-[34px]">
              {/* Razón 1 */}
              <div className="grid grid-cols-[50px_1fr] gap-[16px] items-start">
                <span className="w-[50px] h-[50px] bg-white/[0.07] border border-white/[0.12] rounded-[15px] text-[#ff7b83] flex items-center justify-center shrink-0">
                  <IconShieldCheck className="w-[24px] h-[24px] stroke-[1.8]" />
                </span>
                <div>
                  <h3 className="font-manrope text-[16px] font-[800] text-white mb-[4px]">Procesos estandarizados</h3>
                  <p className="font-manrope text-[13px] text-[#b9cad3] leading-[1.55]">Verificación continua para entregar resultados consistentes y confiables.</p>
                </div>
              </div>

              {/* Razón 2 */}
              <div className="grid grid-cols-[50px_1fr] gap-[16px] items-start">
                <span className="w-[50px] h-[50px] bg-white/[0.07] border border-white/[0.12] rounded-[15px] text-[#ff7b83] flex items-center justify-center shrink-0">
                  <IconUsers className="w-[24px] h-[24px] stroke-[1.8]" />
                </span>
                <div>
                  <h3 className="font-manrope text-[16px] font-[800] text-white mb-[4px]">Equipo profesional</h3>
                  <p className="font-manrope text-[13px] text-[#b9cad3] leading-[1.55]">Atención clara, respetuosa y orientada a resolver tus dudas.</p>
                </div>
              </div>

              {/* Razón 3 */}
              <div className="grid grid-cols-[50px_1fr] gap-[16px] items-start">
                <span className="w-[50px] h-[50px] bg-white/[0.07] border border-white/[0.12] rounded-[15px] text-[#ff7b83] flex items-center justify-center shrink-0">
                  <IconDeviceDesktopAnalytics className="w-[24px] h-[24px] stroke-[1.8]" />
                </span>
                <div>
                  <h3 className="font-manrope text-[16px] font-[800] text-white mb-[4px]">Acceso digital</h3>
                  <p className="font-manrope text-[13px] text-[#b9cad3] leading-[1.55]">Consulta tus resultados de forma privada desde cualquier dispositivo.</p>
                </div>
              </div>
            </div>

            {/* Fila de Estadísticas (.stat-row) */}
            <div className="border-t border-white/[0.14] grid grid-cols-2 gap-[20px] w-full pt-[24px]">
              <div className="flex flex-col gap-[3px]">
                <strong className="font-manrope text-[28px] sm:text-[31px] font-[800] text-white">+6</strong>
                <span className="font-manrope text-[12px] text-[#aebfca]">años de experiencia</span>
              </div>
              <div className="flex flex-col gap-[3px]">
                <strong className="font-manrope text-[28px] sm:text-[31px] font-[800] text-white">5,125+</strong>
                <span className="font-manrope text-[12px] text-[#aebfca]">pacientes atendidos</span>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 4. SECCIÓN: CÓMO FUNCIONA / PROCESO EN 3 PASOS (.process-section Fiel al Rediseño) */}
      <section id="proceso" className="bg-white py-[82px] sm:py-[108px] scroll-mt-[86px]">
        <div className="w-[min(1180px,100%-48px)] mx-auto">

          {/* Encabezado Centrado */}
          <div className="text-center max-w-[790px] mx-auto mb-[48px] sm:mb-[60px]">
            <p className="inline-flex items-center justify-center gap-[9px] text-[12px] font-[800] uppercase tracking-[0.14em] text-[#e54550] mb-[17px]">
              <span className="w-[7px] h-[7px] rounded-full bg-[#fb5962] shadow-[0_0_0_5px_#fff0f1] shrink-0"></span>
              <span>Cómo funciona</span>
            </p>
            <h2 className="font-manrope text-[clamp(30px,3.8vw,54px)] font-[800] text-[#09283c] leading-[1.08] tracking-[-0.035em] mb-[20px]">
              Tu atención, clara de principio a fin.
            </h2>
            <p className="font-manrope text-[15px] sm:text-[16px] text-[#60788a] leading-[1.72] max-w-[650px] mx-auto">
              Un proceso sencillo para que dediques menos tiempo a coordinar y más tiempo a cuidar tu salud.
            </p>
          </div>

          {/* Lista de 3 Pasos (.process-list) */}
          <ol className="grid grid-cols-1 md:grid-cols-3 border-y border-[#dce6ec] list-none p-0 m-0">
            {/* Paso 01 */}
            <li className="p-[30px_20px] sm:p-[35px_30px] min-h-[220px] sm:min-h-[270px] relative border-b md:border-b-0 md:border-r border-[#dce6ec]">
              <span className="font-manrope text-[13px] font-[800] text-[#ccd7de] absolute top-[22px] right-[25px]">01</span>
              <div className="w-[58px] h-[58px] bg-[#fff0f1] text-[#fb5962] rounded-[17px] flex items-center justify-center mb-[31px]">
                <IconCalendarEvent className="w-[26px] h-[26px] stroke-[1.8]" />
              </div>
              <h3 className="font-manrope text-[19px] font-[800] text-[#09283c] mb-[10px]">Elige tu servicio</h3>
              <p className="font-manrope text-[13px] text-[#60788a] leading-[1.6]">Consulta por análisis, ecografías o atención médica.</p>
            </li>

            {/* Paso 02 */}
            <li className="p-[30px_20px] sm:p-[35px_30px] min-h-[220px] sm:min-h-[270px] relative border-b md:border-b-0 md:border-r border-[#dce6ec]">
              <span className="font-manrope text-[13px] font-[800] text-[#ccd7de] absolute top-[22px] right-[25px]">02</span>
              <div className="w-[58px] h-[58px] bg-[#fff0f1] text-[#fb5962] rounded-[17px] flex items-center justify-center mb-[31px]">
                <IconMapPin className="w-[26px] h-[26px] stroke-[1.8]" />
              </div>
              <h3 className="font-manrope text-[19px] font-[800] text-[#09283c] mb-[10px]">Visítanos o recibe atención</h3>
              <p className="font-manrope text-[13px] text-[#60788a] leading-[1.6]">Acude a una sede o coordina la toma en tu domicilio.</p>
            </li>

            {/* Paso 03 */}
            <li className="p-[30px_20px] sm:p-[35px_30px] min-h-[220px] sm:min-h-[270px] relative">
              <span className="font-manrope text-[13px] font-[800] text-[#ccd7de] absolute top-[22px] right-[25px]">03</span>
              <div className="w-[58px] h-[58px] bg-[#fff0f1] text-[#fb5962] rounded-[17px] flex items-center justify-center mb-[31px]">
                <IconShieldCheck className="w-[26px] h-[26px] stroke-[1.8]" />
              </div>
              <h3 className="font-manrope text-[19px] font-[800] text-[#09283c] mb-[10px]">Consulta tus resultados</h3>
              <p className="font-manrope text-[13px] text-[#60788a] leading-[1.6]">Accede a tu información de forma privada y continúa tu atención.</p>
            </li>
          </ol>

          {/* Enlace Inferior a WhatsApp */}
          <div className="text-center mt-[32px]">
            <a
              href="https://api.whatsapp.com/send/?phone=51952920616&text=Hola%20UNIDOSLAB,%20deseo%20orientaci%C3%B3n%20sobre%20sus%20servicios"
              target="_blank"
              rel="noopener noreferrer"
              className="font-manrope text-[13px] font-[800] text-[#e54550] hover:text-[#fb5962] inline-flex items-center gap-[8px] group transition-colors"
            >
              <span>¿No sabes qué servicio necesitas? Escríbenos</span>
              <IconArrowRight className="w-[18px] h-[18px] group-hover:translate-x-1 transition-transform" />
            </a>
          </div>

        </div>
      </section>

      {/* 5. SECCIÓN: SEDES Y HORARIOS EN TACNA (Diseño Fiel al Rediseño) */}
      <section
        ref={sedesSectionRef}
        id="sedes"
        className="w-[min(1180px,100%-48px)] mx-auto pt-[80px] sm:pt-[108px] pb-[40px] sm:pb-[60px] scroll-mt-[86px] relative z-10"
      >
        {/* Encabezado Centrado de Sedes */}
        <div className="text-center max-w-[790px] mx-auto mb-[44px] sm:mb-[52px]">
          <p className="inline-flex items-center justify-center gap-[9px] text-[12px] font-[800] uppercase tracking-[0.14em] text-[#e54550] mb-[17px]">
            <span className="w-[7px] h-[7px] rounded-full bg-[#fb5962] shadow-[0_0_0_5px_#fff0f1] shrink-0"></span>
            <span>Sedes en Tacna</span>
          </p>
          <h2 className="font-manrope text-[clamp(30px,3.8vw,54px)] font-[800] text-[#09283c] leading-[1.08] tracking-[-0.035em] mb-[18px]">
            Dos ubicaciones pensadas para tu comodidad.
          </h2>
          <p className="font-manrope text-[15px] sm:text-[16px] text-[#60788a] leading-[1.72] max-w-[650px] mx-auto">
            Atención continua, toma de muestras y orientación personalizada en puntos clave de la ciudad.
          </p>
        </div>

        <div className="bg-white rounded-[24px] p-5 sm:p-7 lg:p-8 shadow-[0_16px_40px_rgba(23,55,74,0.08)] border border-[#dce6ec] relative overflow-hidden">

          {/* Grid Principal: Tarjetas de Sedes y Mapa */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-6 items-start lg:items-stretch mb-6 sm:mb-7">

            {/* Columna Izquierda: Selector Mobile + Tarjetas de Sedes en Desktop */}
            <div className="lg:col-span-5 flex flex-col gap-3 lg:justify-between h-auto lg:h-full">

              {/* Selector de Sedes para Mobile (Tabs táctiles compactas) */}
              <div className="lg:hidden flex items-center bg-slate-100/90 p-1 rounded-2xl border border-slate-200/80">
                {sedesData.map((sede, idx) => {
                  const isSelected = selectedSedeIndex === idx;
                  return (
                    <button
                      key={sede.id}
                      type="button"
                      onClick={() => setSelectedSedeIndex(idx)}
                      className={`flex-1 py-2 px-2.5 rounded-xl text-xs font-extrabold transition-all duration-200 cursor-pointer flex items-center justify-center gap-1.5 ${isSelected
                        ? 'bg-white text-[#09283c] shadow-xs border border-slate-200/60'
                        : 'text-slate-500 hover:text-slate-800'
                        }`}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full ${isSelected ? 'bg-[#fb5962]' : 'bg-slate-300'}`}></span>
                      <span className="truncate">{idx === 0 ? 'Sede Leguía' : 'Suc. P. Meléndez'}</span>
                    </button>
                  );
                })}
              </div>

              {/* Lista de Sedes (En Mobile muestra la seleccionada; en Desktop muestra ambas) */}
              <div className="flex flex-col gap-3 lg:gap-4">
                {sedesData.map((sede, idx) => {
                  const isSelected = selectedSedeIndex === idx;

                  return (
                    <motion.div
                      key={sede.id}
                      onClick={() => setSelectedSedeIndex(idx)}
                      whileHover={{ scale: 1.01, transition: { duration: 0.15 } }}
                      whileTap={{ scale: 0.985, transition: { duration: 0.1 } }}
                      className={`w-full rounded-[20px] p-4 sm:p-5 border-2 transition-all duration-200 cursor-pointer flex flex-col justify-between select-none ${isSelected
                        ? 'bg-white text-[#09283c] border-[#fb5962] shadow-[0_12px_32px_rgba(251,89,98,0.12)] ring-4 ring-[#fff0f1]'
                        : 'bg-white text-slate-700 border-[#dce6ec] hover:border-[#b9cad4] hover:shadow-md'
                        } ${!isSelected ? 'hidden lg:flex' : 'flex'
                        }`}
                    >
                      <div>
                        {/* Badge Superior */}
                        <div className="flex items-center justify-between mb-3">
                          {isSelected ? (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#fb5962] text-[10px] font-manrope font-[800] uppercase tracking-widest text-white shadow-xs">
                              <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></span>
                              SEDE ACTIVA
                            </span>
                          ) : (
                            <span className="text-[10px] font-manrope font-[800] uppercase tracking-widest text-slate-400">
                              SEDE 0{idx + 1}
                            </span>
                          )}
                          <span className="text-[10px] font-semibold text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-100/60">
                            Abierto hoy
                          </span>
                        </div>

                        <div className="flex items-start gap-3 sm:gap-4 mb-3">
                          {/* Pin 3D Container (Preservado fielmente) */}
                          <div className={`w-12 h-12 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center shrink-0 p-1 transition-colors ${isSelected ? 'bg-red-50/80 border border-red-100' : 'bg-slate-50 border border-slate-100'
                            }`}>
                            <img
                              src="/pin_sedes.webp"
                              alt={`Pin de ubicación de la ${sede.name}`}
                              width={40}
                              height={40}
                              loading="lazy"
                              decoding="async"
                              className="w-8 h-8 sm:w-10 sm:h-10 object-contain drop-shadow-sm"
                            />
                          </div>

                          {/* Info de la sede */}
                          <div className="flex-1 min-w-0">
                            <h4 className="font-manrope text-[17px] sm:text-[18px] font-[800] leading-snug text-[#09283c]">
                              {sede.name.replace('Sede ', '')}
                            </h4>

                            <p className="text-[12px] sm:text-[12.5px] mt-1 flex items-start gap-1.5 text-slate-600 font-medium">
                              <IconMapPin className="w-3.5 h-3.5 shrink-0 text-[#fb5962] mt-0.5" />
                              <span className="leading-snug">{sede.address}</span>
                            </p>

                            <p className="text-[11px] text-slate-400 mt-1 pl-5">
                              <span className="font-semibold text-slate-500">Ref:</span> {sede.reference}
                            </p>

                            <div className="mt-2.5 pt-2 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between text-xs gap-1">
                              <span className="flex items-center gap-1 font-medium text-slate-500 text-[11px]">
                                <IconClock className="w-3.5 h-3.5 text-[#fb5962]" />
                                <span>Horario:</span>
                              </span>
                              <span className="font-manrope font-[800] text-[#09283c] text-[11px] sm:text-[12px]">
                                {sede.schedule}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Botones de acción inferiores */}
                      <div className="flex items-center gap-2.5 sm:gap-3 mt-2 pt-2.5 border-t border-slate-100">
                        <motion.button
                          type="button"
                          whileTap={{ scale: 0.96 }}
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedSedeIndex(idx);
                          }}
                          className={`flex-1 py-2.5 px-3 rounded-xl font-manrope font-[800] text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer ${isSelected
                            ? 'bg-[#09283c] text-white shadow-xs'
                            : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                            }`}
                        >
                          <span>Ver en mapa</span>
                          <IconMapPin className="w-3.5 h-3.5 text-current opacity-70" />
                        </motion.button>

                        <motion.a
                          href={sede.mapsExternalUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          whileTap={{ scale: 0.96 }}
                          onClick={(e) => e.stopPropagation()}
                          className="flex-1 py-2.5 px-3 rounded-xl font-manrope font-[800] text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer bg-red-50/80 hover:bg-red-100/80 text-[#e54550] border border-red-100/90"
                        >
                          <span>Cómo llegar</span>
                          <IconNavigation className="w-3.5 h-3.5 text-[#fb5962]" />
                        </motion.a>
                      </div>
                    </motion.div>
                  );
                })}
              </div>

            </div>

            {/* Columna Derecha: Mapa Interactivo (7 columnas) */}
            <div className="lg:col-span-7 h-[320px] sm:h-[400px] lg:h-auto min-h-[320px] sm:min-h-[400px] lg:min-h-[480px]">
              {mapVisible ? (
                <SedesMap
                  sedes={sedesData}
                  selectedSedeIndex={selectedSedeIndex}
                  onSelectSede={setSelectedSedeIndex}
                />
              ) : (
                <div className="w-full h-full min-h-[320px] sm:min-h-[400px] bg-slate-100/70 border border-slate-200/80 rounded-[20px] flex items-center justify-center text-slate-400 font-bold text-xs uppercase tracking-wider">
                  <span>Cargando Mapa...</span>
                </div>
              )}
            </div>

          </div>

          {/* Barra de Horario General Oficial (.schedule-bar Fiel al Rediseño) */}
          <div className="border border-[#dce6ec] bg-[#f5f8fb] rounded-[18px] flex flex-col sm:flex-row items-center justify-between gap-[16px] sm:gap-[24px] p-[18px_20px] sm:p-[20px_24px] mt-[16px]">
            <div className="flex items-center gap-[13px] text-left w-full sm:w-auto">
              <div className="w-[42px] h-[42px] rounded-full bg-[#fff0f1] text-[#fb5962] flex items-center justify-center shrink-0">
                <IconClock className="w-[22px] h-[22px] stroke-[1.8]" />
              </div>
              <div className="flex flex-col gap-[2px]">
                <strong className="font-manrope text-[13px] font-[800] text-[#09283c]">Horario general</strong>
                <span className="font-manrope text-[12px] text-[#60788a]">Lunes a sábado · 8:00 a. m. – 1:00 p. m. · 3:00 p. m. – 8:00 p. m.</span>
              </div>
            </div>

            <a
              href="tel:51952920616"
              className="w-full sm:w-auto min-h-[44px] px-[20px] bg-white hover:bg-slate-50 border border-[#dce6ec] hover:border-[#b9cad4] text-[#09283c] font-manrope font-[800] text-[13px] rounded-[13px] transition-all hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-[9px] cursor-pointer shrink-0 shadow-2xs"
            >
              <IconPhoneCall className="w-[17px] h-[17px] text-[#fb5962]" />
              <span>952 920 616</span>
            </a>
          </div>

        </div>
      </section>

      {/* 6. BANNER CTA FINAL (.cta-section Fiel al Rediseño) */}
      <section className="w-[min(1180px,100%-48px)] mx-auto mb-[80px] sm:mb-[108px] relative z-20">
        <div className="bg-[#09283c] rounded-[26px] p-[38px_28px] sm:p-[48px_52px] text-white flex flex-col lg:flex-row items-center justify-between gap-[32px] shadow-[0_20px_50px_rgba(9,40,60,0.18)]">
          <div className="flex flex-col items-start text-left max-w-[660px]">
            <p className="inline-flex items-center gap-[9px] text-[12px] font-[800] uppercase tracking-[0.14em] text-[#ff9da3] mb-[15px]">
              <span className="w-[7px] h-[7px] rounded-full bg-[#fb5962] shadow-[0_0_0_5px_rgba(251,89,98,0.13)] shrink-0"></span>
              <span>Estamos para ayudarte</span>
            </p>
            <h2 className="font-manrope text-[clamp(24px,3vw,38px)] font-[800] text-white leading-[1.15] tracking-[-0.035em] mb-[13px]">
              ¿Tienes dudas sobre qué examen necesitas o cómo prepararte?
            </h2>
            <p className="font-manrope text-[14px] sm:text-[15px] text-[#b9cad3] leading-[1.65]">
              Escríbenos por WhatsApp y te orientamos con los requisitos, costos y horarios disponibles.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-[12px] w-full lg:w-auto shrink-0">
            <a
              href="https://api.whatsapp.com/send/?phone=51952920616&text=Hola%20UNIDOSLAB,%20deseo%20orientaci%C3%B3n%20sobre%20un%20examen"
              target="_blank"
              rel="noopener noreferrer"
              className="min-h-[48px] px-[22px] bg-white hover:bg-slate-100 text-[#09283c] font-manrope font-[800] text-[13px] rounded-[13px] shadow-sm transition-all hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-[10px] cursor-pointer"
            >
              <WhatsAppIcon className="w-[19px] h-[19px] text-[#25D366]" />
              <span>Hablar por WhatsApp</span>
            </a>

            <a
              href="tel:51952920616"
              className="min-h-[48px] px-[22px] bg-transparent hover:bg-white/[0.08] border border-white/[0.22] hover:border-white/40 text-white font-manrope font-[800] text-[13px] rounded-[13px] transition-all hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-[10px] cursor-pointer"
            >
              <IconPhoneCall className="w-[18px] h-[18px]" />
              <span>Llamar ahora</span>
            </a>
          </div>
        </div>
      </section>

    </div>
  );
};

export default Home;
