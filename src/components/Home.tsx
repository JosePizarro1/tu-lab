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
  IconHome
} from '@tabler/icons-react';
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
      name: 'Sede Av. Leguía',
      address: 'Av. Leguía, Tacna (Frente a consultorios médicos)',
      badge: 'Abierto Lunes a Sábado',
      schedule: '7:00 AM – 7:00 PM',
      lat: -18.008048,
      lng: -70.249415,
      mapsExternalUrl: 'https://maps.app.goo.gl/Xy6PZvvMXs5e2469A'
    },
    {
      id: 'melendez',
      number: '02',
      name: 'Sede Patricio Meléndez',
      address: 'Calle Patricio Meléndez, Tacna Centro',
      badge: 'Abierto Lunes a Sábado',
      schedule: '7:00 AM – 7:00 PM',
      lat: -18.0125,
      lng: -70.2520,
      mapsExternalUrl: 'https://maps.app.goo.gl/YY4MkEoko7847tmb9'
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

      {/* 1. HERO SECTION PRINCIPAL (Diseño Limpio, Luminoso y Moderno en Blanco/Slate) */}
      <section
        ref={heroRef}
        className="relative min-h-[620px] lg:min-h-[700px] w-full bg-gradient-to-b from-slate-50/90 via-white to-slate-50/50 overflow-hidden pt-28 sm:pt-36 pb-28 md:pb-36 px-4 md:px-8 text-slate-800 relative z-10"
      >
        {/* CAPA DE FONDO: Detalles sutiles y Cruz Médica de cristal */}
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
          
          {/* Halos de luz y gradientes de fondo limpios */}
          <div className="absolute top-1/4 -left-32 w-[520px] h-[520px] rounded-full bg-gradient-to-tr from-red-500/5 via-rose-300/4 to-transparent blur-[140px]"></div>
          <div className="absolute top-1/3 -right-32 w-[600px] h-[600px] rounded-full bg-gradient-to-bl from-sky-400/8 via-slate-200/20 to-transparent blur-[150px]"></div>

          {/* Cruz Médica suave en el fondo central */}
          <div className="absolute top-[15%] left-[45%] -translate-x-1/2 opacity-30 pointer-events-none">
            <svg className="w-48 h-48 text-slate-200" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
              <path d="M9 3h6v6h6v6h-6v6H9v-6H3V9h6V3z" />
            </svg>
          </div>
        </div>

        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-20">

          {/* Columna Izquierda: Titular y CTA */}
          <div className="lg:col-span-7 space-y-6">

            {/* Badge superior */}
            <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-white text-[#1E3A4C] text-[11px] sm:text-xs font-extrabold uppercase tracking-widest shadow-sm border border-slate-200/90">
              <span className="w-2.5 h-2.5 rounded-full bg-[#FF5A5F] shrink-0"></span>
              <span>Laboratorio Clínico Tacna · Perú</span>
            </div>

            {/* Titular contundente */}
            <div>
              <h1 className="font-jakarta text-4xl sm:text-5xl md:text-6xl font-extrabold leading-[1.12] tracking-tight">
                <span className="block text-[#1E3A4C]">Tu Salud Es</span>
                <span className="block text-[#1E3A4C]">
                  Nuestra Prioridad<span className="text-[#FF5A5F]">.</span>
                </span>
              </h1>
              {/* Barra corta de acento rojo coral */}
              <span className="w-14 h-1 bg-[#FF5A5F] rounded-full mt-3 block"></span>
            </div>

            {/* Bajada */}
            <p className="text-slate-500 text-sm sm:text-base md:text-lg max-w-xl font-normal leading-relaxed">
              Tecnología diagnóstica automatizada de alta precisión, calidez humana y entrega digital inmediata de tus análisis clínicos.
            </p>

            {/* Botones de acción */}
            <motion.div
              variants={{
                hidden: { opacity: 0, y: 12 },
                visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 320, damping: 26, mass: 0.8 } }
              }}
              className="flex flex-wrap items-center gap-4 pt-2"
            >
              <motion.button
                onClick={() => setActiveTab('servicios')}
                whileHover={{ scale: 1.025, transition: { duration: 0.15, ease: [0.16, 1, 0.3, 1] } }}
                whileTap={{ scale: 0.97, transition: { duration: 0.08 } }}
                className="group px-7 py-3.5 bg-[#FF5A5F] hover:bg-[#E84A4F] text-white font-extrabold text-xs uppercase tracking-wider rounded-full shadow-lg shadow-red-500/25 transition-colors cursor-pointer flex items-center gap-3"
              >
                <span>Ver Servicios</span>
                <span className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center group-hover:translate-x-1 transition-transform">
                  <IconArrowRight className="w-3.5 h-3.5 text-white" />
                </span>
              </motion.button>

              <motion.a
                href="https://api.whatsapp.com/send/?phone=51952920616&text=Hola%20UNIDOSLAB,%20deseo%20mayor%20informaci%C3%B3n%20sobre%20an%C3%A1lisis%20cl%C3%ADnicos"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.02, backgroundColor: "rgba(255, 255, 255, 1)", transition: { duration: 0.15 } }}
                whileTap={{ scale: 0.97, transition: { duration: 0.08 } }}
                className="px-7 py-3.5 bg-white text-[#1E3A4C] hover:text-[#25D366] border border-slate-200/90 font-bold text-xs uppercase tracking-wider rounded-full shadow-xs flex items-center gap-2 cursor-pointer transition-all"
              >
                <IconSend className="w-4 h-4 text-[#25D366]" />
                <span>Escríbenos por WhatsApp</span>
              </motion.a>
            </motion.div>
          </div>

          {/* Columna Derecha: Especialistas Médicos & Marco Squircle Limpio */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 280, damping: 26, delay: 0.12 }}
            className="lg:col-span-5 relative flex justify-center lg:justify-end"
          >

            {/* Matriz de puntos decorativos detrás de los doctores */}
            <div className="absolute -top-6 -right-6 w-32 h-32 opacity-20 grid grid-cols-6 gap-2 pointer-events-none">
              {Array.from({ length: 36 }).map((_, i) => (
                <span key={i} className="w-1.5 h-1.5 rounded-full bg-slate-400 block"></span>
              ))}
            </div>

            {/* Imagen del especialista con marco squircle blanco suave */}
            <div className="relative z-10 rounded-[38px] p-2.5 bg-white/80 border-2 border-white shadow-2xl shadow-slate-200/60 backdrop-blur-md max-w-sm sm:max-w-md w-full">
              <div className="rounded-[30px] overflow-hidden bg-gradient-to-b from-slate-100/80 via-slate-50 to-slate-100/60 flex items-end justify-center pt-4">
                <img
                  src="/home_chica.webp"
                  alt="Especialista en análisis clínicos y diagnóstico UNIDOSLAB Tacna"
                  width={400}
                  height={500}
                  loading="eager"
                  fetchPriority="high"
                  className="w-full h-[370px] sm:h-[430px] object-contain object-bottom drop-shadow-xl"
                />
              </div>
            </div>

            {/* Barra lateral flotante de redes sociales (Estilo Blanco Píldora del Mockup) */}
            <motion.div
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.3, type: "spring", stiffness: 350, damping: 25 }}
              className="hidden xl:flex absolute -right-5 top-1/2 -translate-y-1/2 flex-col gap-3.5 bg-white text-slate-600 p-2.5 rounded-2xl shadow-xl shadow-slate-300/40 border border-slate-100 z-20"
            >
              <motion.a
                whileHover={{ scale: 1.15, transition: { type: "spring", stiffness: 400, damping: 15 } }}
                whileTap={{ scale: 0.92 }}
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer"
                className="w-7 h-7 rounded-xl hover:bg-red-50 text-[#FF5A5F] flex items-center justify-center transition-colors text-xs font-bold"
              >
                f
              </motion.a>
              <motion.a
                whileHover={{ scale: 1.15, transition: { type: "spring", stiffness: 400, damping: 15 } }}
                whileTap={{ scale: 0.92 }}
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="w-7 h-7 rounded-xl hover:bg-red-50 text-[#FF5A5F] flex items-center justify-center transition-colors text-xs font-bold"
              >
                ig
              </motion.a>
              <motion.a
                whileHover={{ scale: 1.15, transition: { type: "spring", stiffness: 400, damping: 15 } }}
                whileTap={{ scale: 0.92 }}
                href="https://api.whatsapp.com/send/?phone=51952920616"
                target="_blank"
                rel="noreferrer"
                className="w-7 h-7 rounded-xl hover:bg-emerald-50 text-[#25D366] flex items-center justify-center transition-colors text-xs font-bold"
              >
                wa
              </motion.a>
            </motion.div>

          </motion.div>
        </div>
      </section>

      {/* 2. SECCIÓN: SERVICIOS PARA CUIDAR TU SALUD (Diseño Limpio Fiel al Mockup) */}
      <section className="max-w-7xl mx-auto px-4 md:px-6 -mt-10 md:-mt-14 relative z-30 mb-8">
        <div className="bg-white/90 backdrop-blur-md rounded-3xl p-6 sm:p-8 lg:p-10 shadow-2xl shadow-slate-900/5 border border-slate-200/80">
          
          {/* Cabecera de la Sección de Servicios */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div>
              <h3 className="font-jakarta text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#1E3A4C] tracking-tight">
                Servicios para cuidar tu salud
              </h3>
              <p className="text-slate-500 text-xs sm:text-sm mt-1 font-medium">
                Atención profesional, resultados confiables y soluciones cerca de ti.
              </p>
            </div>

            <motion.button
              onClick={() => setActiveTab('servicios')}
              whileHover={{ scale: 1.03, transition: { duration: 0.15 } }}
              whileTap={{ scale: 0.97 }}
              className="self-start sm:self-auto px-6 py-2.5 bg-[#FF5A5F] hover:bg-[#E84A4F] text-white font-extrabold text-xs uppercase tracking-wider rounded-full shadow-md shadow-red-500/20 flex items-center gap-1.5 transition-all cursor-pointer shrink-0"
            >
              <span>VER SERVICIOS</span>
              <span className="font-bold text-sm">›</span>
            </motion.button>
          </div>

          {/* 3 Tarjetas Blancas de Servicios Principales */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-6">
            
            {/* Tarjeta 1: Exámenes y análisis clínicos */}
            <motion.div
              whileHover={{ y: -4, transition: { type: "spring", stiffness: 400, damping: 20 } }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setActiveTab('servicios')}
              className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/90 shadow-md shadow-slate-200/40 hover:shadow-xl hover:border-slate-300 transition-all flex items-start gap-4 cursor-pointer group"
            >
              <div className="w-14 h-14 rounded-full bg-red-50 text-[#FF5A5F] flex items-center justify-center shrink-0 border border-red-100 group-hover:scale-105 group-hover:bg-red-100/60 transition-all">
                <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M7 3h10" />
                  <path d="M9 3v13a4 4 0 0 0 8 0v-13" />
                  <path d="M6 8h4" />
                  <path d="M14 8h4" />
                  <path d="M9 13h6" />
                </svg>
              </div>
              <div className="min-w-0">
                <h4 className="font-jakarta text-base font-extrabold text-[#1E3A4C] leading-snug group-hover:text-[#FF5A5F] transition-colors">
                  Exámenes y análisis clínicos
                </h4>
                <p className="text-xs text-slate-500 mt-1.5 leading-relaxed font-medium">
                  Pruebas de laboratorio confiables en sede o a domicilio.
                </p>
              </div>
            </motion.div>

            {/* Tarjeta 2: Ecografías */}
            <motion.div
              whileHover={{ y: -4, transition: { type: "spring", stiffness: 400, damping: 20 } }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setActiveTab('servicios')}
              className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/90 shadow-md shadow-slate-200/40 hover:shadow-xl hover:border-slate-300 transition-all flex items-start gap-4 cursor-pointer group"
            >
              <div className="w-14 h-14 rounded-full bg-red-50 text-[#FF5A5F] flex items-center justify-center shrink-0 border border-red-100 group-hover:scale-105 group-hover:bg-red-100/60 transition-all">
                <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="4" width="18" height="12" rx="2" />
                  <path d="M7 11c2-3 4 3 6 0 1-1.5 2-1.5 4 0" />
                  <path d="M12 16v4" />
                  <path d="M8 20h8" />
                </svg>
              </div>
              <div className="min-w-0">
                <h4 className="font-jakarta text-base font-extrabold text-[#1E3A4C] leading-snug group-hover:text-[#FF5A5F] transition-colors">
                  Ecografías
                </h4>
                <p className="text-xs text-slate-500 mt-1.5 leading-relaxed font-medium">
                  Estudios ecográficos con atención profesional y precisa.
                </p>
              </div>
            </motion.div>

            {/* Tarjeta 3: Consultas médicas */}
            <motion.div
              whileHover={{ y: -4, transition: { type: "spring", stiffness: 400, damping: 20 } }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setActiveTab('servicios')}
              className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/90 shadow-md shadow-slate-200/40 hover:shadow-xl hover:border-slate-300 transition-all flex items-start gap-4 cursor-pointer group"
            >
              <div className="w-14 h-14 rounded-full bg-red-50 text-[#FF5A5F] flex items-center justify-center shrink-0 border border-red-100 group-hover:scale-105 group-hover:bg-red-100/60 transition-all">
                <IconStethoscope className="w-7 h-7" />
              </div>
              <div className="min-w-0">
                <h4 className="font-jakarta text-base font-extrabold text-[#1E3A4C] leading-snug group-hover:text-[#FF5A5F] transition-colors">
                  Consultas médicas
                </h4>
                <p className="text-xs text-slate-500 mt-1.5 leading-relaxed font-medium">
                  Atención médica personalizada y oportuna.
                </p>
              </div>
            </motion.div>

          </div>

          {/* Banner Inferior: Atención a Domicilio */}
          <div className="bg-red-50/50 border border-red-100/80 rounded-2xl py-3 px-4 sm:px-6 flex items-center justify-center gap-3 text-center">
            <IconHome className="w-5 h-5 text-[#FF5A5F] shrink-0" />
            <p className="text-xs sm:text-sm font-bold text-[#1E3A4C]">
              También atendemos a domicilio: <span className="font-medium text-slate-600">toma de muestras en la comodidad de tu hogar.</span>
            </p>
          </div>

        </div>
      </section>

      {/* 3. SECCIÓN: ¿POR QUÉ CONFIAR TU DIAGNÓSTICO EN UNIDOSLAB? (Diseño Limpio, Blanco y Moderno) */}
      <section className="max-w-7xl mx-auto px-4 md:px-6 py-16 sm:py-20 relative z-20">
        <div className="relative rounded-[36px] bg-white p-8 sm:p-12 lg:p-14 shadow-2xl shadow-slate-900/5 border border-slate-200/80 overflow-hidden">
          
          {/* Fondo sutil con Cruz Médica y Micropuntos */}
          <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
            {/* Cruz Médica suave en el centro */}
            <div className="absolute top-8 left-[45%] -translate-x-1/2 opacity-25">
              <svg className="w-44 h-44 text-slate-200" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
                <path d="M9 3h6v6h6v6h-6v6H9v-6H3V9h6V3z" />
              </svg>
            </div>

            {/* Retícula de Micropuntos en Fondo Derecho */}
            <div className="absolute top-12 right-12 w-28 h-28 opacity-25 grid grid-cols-5 gap-2.5">
              {Array.from({ length: 25 }).map((_, i) => (
                <span key={i} className="w-1.5 h-1.5 rounded-full bg-slate-400 block"></span>
              ))}
            </div>

            {/* Retícula de Micropuntos en Fondo Inferior Izquierdo */}
            <div className="absolute bottom-10 left-10 w-24 h-24 opacity-25 grid grid-cols-4 gap-2.5">
              {Array.from({ length: 16 }).map((_, i) => (
                <span key={i} className="w-1.5 h-1.5 rounded-full bg-slate-400 block"></span>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center relative z-10">

            {/* Columna Izquierda: Información de Confianza & Estadísticas (7 Columnas) */}
            <div className="lg:col-span-7 space-y-6">

              {/* Titular contundente */}
              <div>
                <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-red-50 border border-red-100 text-[#FF5A5F] text-[11px] font-extrabold uppercase tracking-widest mb-3">
                  <span className="w-2 h-2 rounded-full bg-[#FF5A5F]"></span>
                  <span>Experiencia y Precisión</span>
                </div>
                <h2 className="font-jakarta text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#1E3A4C] leading-[1.12] tracking-tight">
                  ¿Por qué confiar tu<br />
                  diagnóstico en<br />
                  <span className="text-[#FF5A5F]">UNIDOSLAB</span>?
                </h2>
                <div className="w-14 h-1 bg-[#FF5A5F] rounded-full mt-3"></div>
              </div>

              <p className="text-slate-500 text-sm sm:text-base leading-relaxed font-normal max-w-xl">
                Más de 6 años brindando resultados certeros, diagnóstico oportuno y atención médica personalizada a las familias e instituciones de Tacna.
              </p>

              {/* 2 Grandes Cápsulas de Estadísticas en Blanco con Sombra y Acento Coral */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">

                {/* Cápsula 1: +6 Años de Trayectoria Clínica */}
                <motion.div
                  whileHover={{ y: -3, transition: { type: "spring", stiffness: 400, damping: 20 } }}
                  whileTap={{ scale: 0.98, transition: { duration: 0.08 } }}
                  className="bg-white p-5 sm:p-6 rounded-3xl shadow-lg shadow-slate-200/50 border border-slate-200/80 flex items-center gap-4 cursor-default transition-all"
                >
                  <div className="w-13 h-13 rounded-2xl bg-[#FF5A5F] text-white flex items-center justify-center shrink-0 shadow-md shadow-red-500/25">
                    <IconAward className="w-7 h-7" />
                  </div>
                  <div>
                    <div className="flex items-baseline">
                      <span className="text-[#FF5A5F] text-2xl font-extrabold mr-0.5">+</span>
                      <span className="font-jakarta text-3xl sm:text-4xl font-extrabold text-[#1E3A4C] tracking-tight">
                        {yearsCount}
                      </span>
                    </div>
                    <span className="text-xs font-bold text-slate-500 block leading-tight mt-0.5">
                      Años de Trayectoria Clínica
                    </span>
                    <div className="w-8 h-0.5 bg-[#FF5A5F] rounded-full mt-2"></div>
                  </div>
                </motion.div>

                {/* Cápsula 2: Pacientes atendidos */}
                <motion.div
                  whileHover={{ y: -3, transition: { type: "spring", stiffness: 400, damping: 20 } }}
                  whileTap={{ scale: 0.98, transition: { duration: 0.08 } }}
                  className="bg-white p-5 sm:p-6 rounded-3xl shadow-lg shadow-slate-200/50 border border-slate-200/80 flex items-center gap-4 cursor-default transition-all"
                >
                  <div className="w-13 h-13 rounded-2xl bg-[#FF5A5F] text-white flex items-center justify-center shrink-0 shadow-md shadow-red-500/25">
                    <IconUsers className="w-7 h-7" />
                  </div>
                  <div>
                    <div className="flex items-baseline">
                      <span className="font-jakarta text-3xl sm:text-4xl font-extrabold text-[#1E3A4C] tracking-tight">
                        {examsCount.toLocaleString('es-PE')}
                      </span>
                      <span className="text-[#FF5A5F] text-2xl font-extrabold ml-0.5">+</span>
                    </div>
                    <span className="text-xs font-bold text-slate-500 block leading-tight mt-0.5">
                      Pacientes atendidos en Tacna
                    </span>
                    <div className="w-8 h-0.5 bg-[#FF5A5F] rounded-full mt-2"></div>
                  </div>
                </motion.div>

              </div>
            </div>

            {/* Columna Derecha: Marco Squircle Blanco Limpio & Badge Flotante (5 Columnas) */}
            <div className="lg:col-span-5 relative flex justify-center">

              {/* Marco Squircle Blanco */}
              <div className="relative rounded-[40px] p-2 bg-slate-100/80 border-2 border-slate-200/80 shadow-xl max-w-sm sm:max-w-md w-full">
                <div className="rounded-[32px] overflow-hidden bg-slate-100 relative">
                  <img
                    src="https://images.pexels.com/photos/3735709/pexels-photo-3735709.jpeg?auto=compress&cs=tinysrgb&w=1200"
                    alt="Laboratorio de análisis clínicos y reactivos - UNIDOSLAB Tacna"
                    className="w-full h-[360px] sm:h-[430px] object-cover object-center"
                  />
                </div>

                {/* Badge Flotante de Garantía */}
                <motion.div
                  initial={{ y: 8, opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2, type: "spring", stiffness: 350, damping: 25 }}
                  className="absolute bottom-5 left-5 right-5 bg-white/95 backdrop-blur-md p-4 rounded-2xl shadow-xl shadow-slate-900/10 border border-slate-200/70 flex items-center gap-3.5 text-slate-800"
                >
                  <div className="w-10 h-10 rounded-xl bg-red-50 text-[#FF5A5F] flex items-center justify-center shrink-0 shadow-xs border border-red-100">
                    <IconShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-extrabold text-[#1E3A4C]">Control de Calidad Acreditado</h4>
                    <p className="text-[11px] font-medium text-slate-500 leading-snug">Validación continua de reactivos en Tacna para resultados confiables.</p>
                  </div>
                </motion.div>
              </div>

            </div>

          </div>
        </div>
      </section>

      {/* 4. SECCIÓN: ¿CÓMO FUNCIONA? TU ATENCIÓN EN 3 SIMPLES PASOS (Diseño Fiel al Mockup) */}
      <section className="relative py-20 lg:py-24 overflow-hidden">
        {/* Decoración de cruces médicas suaves y micropuntos */}
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
          <div className="absolute top-12 left-10 opacity-20">
            <svg className="w-24 h-24 text-slate-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
              <path d="M9 3h6v6h6v6h-6v6H9v-6H3V9h6V3z" />
            </svg>
          </div>
          <div className="absolute top-16 right-10 opacity-20">
            <svg className="w-24 h-24 text-slate-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
              <path d="M9 3h6v6h6v6h-6v6H9v-6H3V9h6V3z" />
            </svg>
          </div>
          <div className="absolute top-36 left-12 w-20 h-20 opacity-20 grid grid-cols-4 gap-2">
            {Array.from({ length: 16 }).map((_, i) => (
              <span key={i} className="w-1.5 h-1.5 rounded-full bg-slate-400 block"></span>
            ))}
          </div>
          <div className="absolute top-40 right-16 w-20 h-20 opacity-20 grid grid-cols-4 gap-2">
            {Array.from({ length: 16 }).map((_, i) => (
              <span key={i} className="w-1.5 h-1.5 rounded-full bg-slate-400 block"></span>
            ))}
          </div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-6 text-center">
          {/* Cabecera */}
          <span className="text-[11px] font-extrabold text-[#FF5A5F] uppercase tracking-[0.2em] block mb-2">
            ¿CÓMO FUNCIONA?
          </span>
          <h2 className="font-jakarta text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#1E3A4C] tracking-tight">
            Tu atención en 3 simples pasos<span className="text-[#FF5A5F]">.</span>
          </h2>
          <p className="text-slate-500 text-xs sm:text-sm mt-3 max-w-xl mx-auto font-normal leading-relaxed">
            Elige el servicio que necesitas, recibe atención profesional y continúa cuidando tu salud con nosotros.
          </p>

          {/* 3 Tarjetas con Conector Lineal */}
          <div className="relative grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 mt-14 max-w-5xl mx-auto items-stretch">
            
            {/* Línea conectora entre tarjetas (Solo Desktop) */}
            <div className="hidden md:block absolute top-1/2 left-[15%] right-[15%] h-[1.5px] bg-[#FF5A5F]/30 -translate-y-6 z-0"></div>

            {/* Paso 1: Elige tu servicio */}
            <motion.div
              whileHover={{ y: -6, transition: { type: "spring", stiffness: 400, damping: 20 } }}
              className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xl shadow-slate-200/40 relative z-10 flex flex-col items-center text-center transition-all group"
            >
              {/* Badge Número */}
              <div className="absolute top-4 left-4 w-7 h-7 rounded-full bg-red-50 border border-red-100 flex items-center justify-center text-[#FF5A5F] text-xs font-extrabold">
                01
              </div>

              {/* Icono Circular Line-art */}
              <div className="w-20 h-20 rounded-full bg-red-50/70 border border-red-100 flex items-center justify-center p-4 mb-5 group-hover:scale-105 group-hover:bg-red-100/60 transition-all">
                <svg className="w-10 h-10 text-[#FF5A5F]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2" />
                  <rect x="9" y="3" width="6" height="4" rx="1" />
                  <path d="M9 12h6" />
                  <path d="M9 16h6" />
                  <path d="M9 9h6" />
                </svg>
              </div>

              <h3 className="font-jakarta text-lg font-extrabold text-[#1E3A4C] tracking-tight mb-2 group-hover:text-[#FF5A5F] transition-colors">
                Elige tu servicio
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed font-medium">
                Selecciona análisis clínicos, ecografías o consultas médicas.
              </p>
            </motion.div>

            {/* Paso 2: Atiéndete en sede o domicilio */}
            <motion.div
              whileHover={{ y: -6, transition: { type: "spring", stiffness: 400, damping: 20 } }}
              className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xl shadow-slate-200/40 relative z-10 flex flex-col items-center text-center transition-all group"
            >
              {/* Badge Número */}
              <div className="absolute top-4 left-4 w-7 h-7 rounded-full bg-red-50 border border-red-100 flex items-center justify-center text-[#FF5A5F] text-xs font-extrabold">
                02
              </div>

              {/* Icono Circular Line-art */}
              <div className="w-20 h-20 rounded-full bg-red-50/70 border border-red-100 flex items-center justify-center p-4 mb-5 group-hover:scale-105 group-hover:bg-red-100/60 transition-all">
                <svg className="w-10 h-10 text-[#FF5A5F]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 21h18" />
                  <path d="M5 21V9l7-5 7 5v12" />
                  <path d="M12 9v6" />
                  <path d="M9 12h6" />
                </svg>
              </div>

              <h3 className="font-jakarta text-lg font-extrabold text-[#1E3A4C] tracking-tight mb-2 group-hover:text-[#FF5A5F] transition-colors">
                Atiéndete en sede o domicilio
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed font-medium">
                Visítanos en nuestras sedes o solicita la toma de muestras en casa.
              </p>
            </motion.div>

            {/* Paso 3: Recibe tus resultados */}
            <motion.div
              whileHover={{ y: -6, transition: { type: "spring", stiffness: 400, damping: 20 } }}
              className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xl shadow-slate-200/40 relative z-10 flex flex-col items-center text-center transition-all group"
            >
              {/* Badge Número */}
              <div className="absolute top-4 left-4 w-7 h-7 rounded-full bg-red-50 border border-red-100 flex items-center justify-center text-[#FF5A5F] text-xs font-extrabold">
                03
              </div>

              {/* Icono Circular Line-art */}
              <div className="w-20 h-20 rounded-full bg-red-50/70 border border-red-100 flex items-center justify-center p-4 mb-5 group-hover:scale-105 group-hover:bg-red-100/60 transition-all">
                <svg className="w-10 h-10 text-[#FF5A5F]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="3" width="20" height="14" rx="2" />
                  <path d="M8 21h8" />
                  <path d="M12 17v4" />
                  <path d="M12 7v4" />
                  <path d="M10 9h4" />
                </svg>
              </div>

              <h3 className="font-jakarta text-lg font-extrabold text-[#1E3A4C] tracking-tight mb-2 group-hover:text-[#FF5A5F] transition-colors">
                Recibe tus resultados
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed font-medium">
                Consulta tus resultados en línea y continúa tu atención.
              </p>
            </motion.div>

          </div>
        </div>
      </section>

      {/* 5. SECCIÓN: SEDES Y HORARIOS EN TACNA (Diseño fiel al mockup) */}
      <section 
        ref={sedesSectionRef}
        id="sedes" 
        className="max-w-7xl mx-auto px-4 md:px-6 pt-16 pb-16 scroll-mt-24 relative z-10 font-plex"
      >
        <div className="bg-white rounded-3xl p-6 sm:p-8 lg:p-10 shadow-2xl shadow-slate-900/5 border border-slate-200/80 relative overflow-hidden">
          
          {/* Header Superior y Barra de Referencias */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start mb-8 pb-6 border-b border-slate-100">
            {/* Título y subtítulo */}
            <div className="lg:col-span-5">
              <div className="inline-flex items-center gap-2 text-[11px] font-extrabold uppercase tracking-widest text-[#1E3A4C] mb-2">
                <span className="w-2 h-2 rounded-full bg-[#E52320]"></span>
                <span>Atención Presencial en Tacna</span>
              </div>
              <h3 className="font-jakarta text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#1E3A4C] tracking-tight">
                Nuestras Sedes
              </h3>
              <p className="text-slate-500 text-xs sm:text-sm mt-1 font-medium">
                Selecciona una sede a la izquierda para enfocarlo en el mapa.
              </p>
            </div>

            {/* Widget Superior: Ubícanos en Tacna + Puntos de Referencia */}
            <div className="lg:col-span-7 bg-slate-50/80 border border-slate-200/80 rounded-2xl p-3.5 sm:p-4">
              <div className="flex items-center gap-2.5 mb-3">
                <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center text-[#FF5A5F] shrink-0">
                  <IconMapPin className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[#1E3A4C]">Ubícanos en Tacna</h4>
                  <p className="text-[11px] text-slate-500">Explora nuestras sedes y referencias cercanas.</p>
                </div>
              </div>

              {/* Cards de Referencias 3D: Responsive (Vertical en Mobile, Horizontal en Desktop) */}
              <div className="grid grid-cols-3 gap-2 sm:gap-2.5">
                {/* Catedral */}
                <div className="flex flex-col sm:flex-row items-center justify-between sm:justify-start gap-1 sm:gap-2.5 bg-white rounded-xl p-2 sm:p-2.5 border border-slate-200/90 shadow-xs hover:border-slate-300 transition-all text-center sm:text-left">
                  {/* Nombre en Mobile */}
                  <p className="sm:hidden text-[10px] font-bold text-[#1E3A4C] leading-tight line-clamp-1 w-full">
                    Catedral
                  </p>
                  {/* Imagen 3D */}
                  <div className="my-1 sm:my-0 flex items-center justify-center h-10 sm:h-9 w-auto shrink-0">
                    <img 
                      src="/catedral_3d_tacna.webp" 
                      alt="Referencia de ubicación Catedral de Tacna" 
                      width={48}
                      height={48}
                      loading="lazy"
                      className="h-full w-auto max-w-[48px] sm:max-w-[36px] object-contain drop-shadow-sm" 
                    />
                  </div>
                  {/* Info Desktop (Horizontal) */}
                  <div className="hidden sm:block min-w-0 flex-1">
                    <p className="text-[11px] font-bold text-[#1E3A4C] truncate">Catedral de Tacna</p>
                    <p className="text-[10px] text-slate-400 font-medium">A 6 min</p>
                  </div>
                  {/* Minutos Mobile */}
                  <span className="sm:hidden inline-block text-[9.5px] text-slate-400 font-semibold bg-slate-50 px-2 py-0.5 rounded-full border border-slate-100">
                    A 6 min
                  </span>
                </div>

                {/* Mercado 2 de Mayo */}
                <div className="flex flex-col sm:flex-row items-center justify-between sm:justify-start gap-1 sm:gap-2.5 bg-white rounded-xl p-2 sm:p-2.5 border border-slate-200/90 shadow-xs hover:border-slate-300 transition-all text-center sm:text-left">
                  {/* Nombre en Mobile */}
                  <p className="sm:hidden text-[10px] font-bold text-[#1E3A4C] leading-tight line-clamp-1 w-full">
                    Mercado
                  </p>
                  {/* Imagen 3D */}
                  <div className="my-1 sm:my-0 flex items-center justify-center h-10 sm:h-9 w-auto shrink-0">
                    <img 
                      src="/2_de_mayo.webp" 
                      alt="Referencia Mercado 2 de Mayo" 
                      width={48}
                      height={48}
                      loading="lazy"
                      className="h-full w-auto max-w-[48px] sm:max-w-[36px] object-contain drop-shadow-sm" 
                    />
                  </div>
                  {/* Info Desktop (Horizontal) */}
                  <div className="hidden sm:block min-w-0 flex-1">
                    <p className="text-[11px] font-bold text-[#1E3A4C] truncate">Mercado 2 de Mayo</p>
                    <p className="text-[10px] text-slate-400 font-medium">A 4 min</p>
                  </div>
                  {/* Minutos Mobile */}
                  <span className="sm:hidden inline-block text-[9.5px] text-slate-400 font-semibold bg-slate-50 px-2 py-0.5 rounded-full border border-slate-100">
                    A 4 min
                  </span>
                </div>

                {/* Plaza Zela */}
                <div className="flex flex-col sm:flex-row items-center justify-between sm:justify-start gap-1 sm:gap-2.5 bg-white rounded-xl p-2 sm:p-2.5 border border-slate-200/90 shadow-xs hover:border-slate-300 transition-all text-center sm:text-left">
                  {/* Nombre en Mobile */}
                  <p className="sm:hidden text-[10px] font-bold text-[#1E3A4C] leading-tight line-clamp-1 w-full">
                    Plaza Zela
                  </p>
                  {/* Imagen 3D */}
                  <div className="my-1 sm:my-0 flex items-center justify-center h-10 sm:h-9 w-auto shrink-0">
                    <img 
                      src="/catedral_3d_tacna.webp" 
                      alt="Referencia céntrica Plaza Zela" 
                      width={48}
                      height={48}
                      loading="lazy"
                      className="h-full w-auto max-w-[48px] sm:max-w-[36px] object-contain opacity-85 drop-shadow-sm" 
                    />
                  </div>
                  {/* Info Desktop (Horizontal) */}
                  <div className="hidden sm:block min-w-0 flex-1">
                    <p className="text-[11px] font-bold text-[#1E3A4C] truncate">Plaza Zela</p>
                    <p className="text-[10px] text-slate-400 font-medium">A 8 min</p>
                  </div>
                  {/* Minutos Mobile */}
                  <span className="sm:hidden inline-block text-[9.5px] text-slate-400 font-semibold bg-slate-50 px-2 py-0.5 rounded-full border border-slate-100">
                    A 8 min
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Grid Principal: Tarjetas de Sedes y Mapa */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch mb-8">

            {/* Columna Izquierda: Carrusel Snap en Mobile / Lista Vertical en Desktop */}
            <div className="lg:col-span-5 flex flex-col gap-3">
              <div className="flex flex-row lg:flex-col gap-3.5 sm:gap-4 overflow-x-auto lg:overflow-x-visible pb-3 pt-1 lg:pb-0 lg:pt-0 snap-x snap-mandatory scrollbar-none -mx-3 px-3 sm:mx-0 sm:px-0">
                {sedesData.map((sede, idx) => {
                  const isSelected = selectedSedeIndex === idx;
                  return (
                    <motion.div
                      key={sede.id}
                      onClick={() => setSelectedSedeIndex(idx)}
                      whileTap={{ scale: 0.985, transition: { duration: 0.1 } }}
                      className={`w-[88vw] max-w-[340px] sm:w-auto sm:min-w-[340px] lg:min-w-0 snap-center rounded-2xl sm:rounded-3xl p-4 sm:p-5 lg:p-6 border-2 transition-colors duration-200 cursor-pointer flex flex-col justify-between shrink-0 select-none ${
                        isSelected
                          ? 'bg-white text-slate-800 border-[#FF5A5F]/70 shadow-lg shadow-red-500/10 ring-4 ring-red-50/70'
                          : 'bg-white text-slate-700 border-slate-200/80 hover:border-slate-300 shadow-xs'
                      }`}
                    >
                      <div>
                        {/* Badge Superior */}
                        <div className="flex items-center justify-between mb-2.5">
                          {isSelected ? (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#FF5A5F] text-[9.5px] font-extrabold uppercase tracking-widest text-white shadow-xs">
                              <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></span>
                              SEDE ACTIVA
                            </span>
                          ) : (
                            <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400">
                              SEDE 0{idx + 1}
                            </span>
                          )}
                          <span className="text-[10px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100/60">
                            Abierto hoy
                          </span>
                        </div>

                        <div className="flex items-start gap-3 sm:gap-4 mb-2.5">
                          {/* Pin 3D Container */}
                          <div className={`w-12 h-12 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center shrink-0 p-1 transition-colors ${
                            isSelected ? 'bg-red-50/80 border border-red-100' : 'bg-slate-50 border border-slate-100'
                          }`}>
                            <img 
                              src="/pin_sedes.webp" 
                              alt={`Pin de ubicación de la ${sede.name}`} 
                              width={36}
                              height={36}
                              loading="lazy"
                              className="w-8 h-8 sm:w-9 sm:h-9 object-contain drop-shadow-sm"
                            />
                          </div>

                          {/* Info de la sede */}
                          <div className="flex-1 min-w-0">
                            <h4 className="font-jakarta text-base sm:text-lg lg:text-xl font-extrabold leading-snug text-[#1E3A4C] truncate">
                              {sede.name.replace('Sede ', '')}
                            </h4>
                            
                            <p className="text-[11px] sm:text-xs mt-1 flex items-center gap-1 text-slate-500">
                              <IconMapPin className="w-3.5 h-3.5 shrink-0 opacity-70 text-slate-400" />
                              <span className="truncate">{sede.address}</span>
                            </p>

                            <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] sm:text-xs text-slate-600">
                              <span className="flex items-center gap-1 font-medium text-slate-500">
                                <IconClock className="w-3 h-3 opacity-70" />
                                Horario:
                              </span>
                              <span className="font-extrabold text-[#1E3A4C]">
                                {sede.schedule}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Botones de acción inferiores con micro-interacción spring */}
                      <div className="flex items-center gap-2 sm:gap-3 mt-2.5 pt-2.5 border-t border-slate-100">
                        <motion.button
                          type="button"
                          whileTap={{ scale: 0.96 }}
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedSedeIndex(idx);
                          }}
                          className={`flex-1 py-2 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                            isSelected
                              ? 'bg-slate-900 text-white shadow-xs'
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
                          className="flex-1 py-2 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer bg-red-50/70 hover:bg-red-100/70 text-[#FF5A5F] border border-red-100/80"
                        >
                          <span>Cómo llegar</span>
                          <IconNavigation className="w-3.5 h-3.5 text-[#FF5A5F]" />
                        </motion.a>
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              {/* Paginación Táctil Emil Kowalski con FLIP (layoutId) */}
              <div className="lg:hidden flex items-center justify-center gap-2 w-full py-1">
                {sedesData.map((sede, dotIdx) => {
                  const isActive = selectedSedeIndex === dotIdx;
                  return (
                    <button
                      key={sede.id}
                      type="button"
                      onClick={() => setSelectedSedeIndex(dotIdx)}
                      aria-label={`Ver ${sede.name}`}
                      className="relative py-2 px-1 flex items-center justify-center cursor-pointer"
                    >
                      <span className={`block h-2 rounded-full transition-all duration-200 ${
                        isActive ? 'w-7 bg-[#FF5A5F]' : 'w-2 bg-slate-200 hover:bg-slate-300'
                      }`} />
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Columna Derecha: Mapa Interactivo (7 columnas) */}
            <div className="lg:col-span-7 h-[440px] lg:h-auto min-h-[440px]">
              {mapVisible ? (
                <SedesMap
                  sedes={sedesData}
                  selectedSedeIndex={selectedSedeIndex}
                  onSelectSede={setSelectedSedeIndex}
                />
              ) : (
                <div className="w-full h-full min-h-[440px] bg-slate-100/70 border border-slate-200/80 rounded-3xl flex items-center justify-center text-slate-400 font-bold text-xs uppercase tracking-wider">
                  <span>Cargando Mapa...</span>
                </div>
              )}
            </div>

          </div>

          {/* Fila Inferior: 3 Badges de Resumen */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 border-t border-slate-100">
            {/* Item 1 */}
            <div className="flex items-center gap-3.5 p-3 rounded-2xl bg-slate-50/60 border border-slate-100">
              <div className="w-11 h-11 rounded-full bg-[#FF5A5F] text-white flex items-center justify-center shrink-0 shadow-md shadow-red-500/25">
                <IconMapPin className="w-5 h-5" />
              </div>
              <div>
                <h5 className="text-xs font-bold text-[#1E3A4C]">2 sedes en Tacna</h5>
                <p className="text-[11px] text-slate-500 font-medium leading-tight">Ubicaciones estratégicas para estar más cerca de ti.</p>
              </div>
            </div>

            {/* Item 2 */}
            <div className="flex items-center gap-3.5 p-3 rounded-2xl bg-slate-50/60 border border-slate-100">
              <div className="w-11 h-11 rounded-full bg-[#FF5A5F] text-white flex items-center justify-center shrink-0 shadow-md shadow-red-500/25">
                <IconUsers className="w-5 h-5" />
              </div>
              <div>
                <h5 className="text-xs font-bold text-[#1E3A4C]">Atención presencial</h5>
                <p className="text-[11px] text-slate-500 font-medium leading-tight">Te atendemos con calidez, tecnología y bioseguridad.</p>
              </div>
            </div>

            {/* Item 3 */}
            <div className="flex items-center gap-3.5 p-3 rounded-2xl bg-slate-50/60 border border-slate-100">
              <div className="w-11 h-11 rounded-full bg-[#FF5A5F] text-white flex items-center justify-center shrink-0 shadow-md shadow-red-500/25">
                <IconCar className="w-5 h-5" />
              </div>
              <div>
                <h5 className="text-xs font-bold text-[#1E3A4C]">Rutas rápidas</h5>
                <p className="text-[11px] text-slate-500 font-medium leading-tight">Encuentra la mejor ruta desde tu ubicación con un solo clic.</p>
              </div>
            </div>
          </div>

        </div>
      </section>

    </div>
  );
};

export default Home;
