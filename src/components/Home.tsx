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
  IconCar
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

  const [yearsCount, setYearsCount] = React.useState(0);
  const [examsCount, setExamsCount] = React.useState(0);
  const [showCards, setShowCards] = React.useState(false);
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

      {/* 1. HERO SECTION PRINCIPAL (Fondo 3D Esculpido con Ondas Fluidas & Líneas Senoidales) */}
      <section
        ref={heroRef}
        className="relative min-h-[620px] lg:min-h-[700px] w-full bg-gradient-to-br from-[#0A1A27] via-[#0E2A3E] to-[#12436D] overflow-hidden pt-28 sm:pt-36 pb-28 md:pb-36 px-4 md:px-8 text-white relative z-10"
      >
        {/* CAPA DE FONDO 1: Olas Esculpidas 3D & Curvas Fluidas Orgánicas */}
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-0 overflow-hidden">

          {/* Ola Curva Superior Izquierda (Esculpida con borde de luz cian) */}
          <svg
            className="absolute -top-20 -left-20 w-[680px] h-[680px] text-[#0A2234] opacity-90 transition-transform"
            viewBox="0 0 600 600"
            fill="none"
          >
            <path
              d="M0,0 L600,0 C540,180 480,340 320,440 C180,520 60,560 0,600 Z"
              fill="url(#wave-gradient-1)"
            />
            <path
              d="M0,0 C380,140 460,320 320,440 C180,520 60,560 0,600"
              stroke="url(#wave-glow-1)"
              strokeWidth="2.5"
              strokeOpacity="0.4"
            />
            <defs>
              <linearGradient id="wave-gradient-1" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#081A26" stopOpacity="0.95" />
                <stop offset="60%" stopColor="#0E314B" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#13456C" stopOpacity="0.4" />
              </linearGradient>
              <linearGradient id="wave-glow-1" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#38BDF8" />
                <stop offset="100%" stopColor="#60A5FA" />
              </linearGradient>
            </defs>
          </svg>

          {/* Malla de Líneas Senoidales (Flujo Diagnóstico / ECG Digital) */}
          <svg
            className="absolute top-[20%] left-[25%] w-[800px] h-[500px] opacity-25"
            viewBox="0 0 800 500"
            fill="none"
          >
            <path d="M0,250 C150,150 250,350 400,220 C550,90 650,280 800,200" stroke="#38BDF8" strokeWidth="1.2" />
            <path d="M0,265 C150,165 250,365 400,235 C550,105 650,295 800,215" stroke="#38BDF8" strokeWidth="1" strokeDasharray="4 4" />
            <path d="M0,280 C150,180 250,380 400,250 C550,120 650,310 800,230" stroke="#60A5FA" strokeWidth="1.5" />
            <path d="M0,295 C150,195 250,395 400,265 C550,135 650,325 800,245" stroke="#38BDF8" strokeWidth="0.8" />
            <path d="M0,310 C150,210 250,410 400,280 C550,150 650,340 800,260" stroke="#93C5FD" strokeWidth="1" />
          </svg>

          {/* Gran Ola Inferior Dinámica que abraza la base del Hero */}
          <svg
            className="absolute -bottom-2 left-0 right-0 w-full h-44 text-slate-50/40"
            viewBox="0 0 1440 180"
            preserveAspectRatio="none"
            fill="none"
          >
            <path
              d="M0,60 C320,160 680,20 1080,110 C1260,150 1380,130 1440,120 L1440,180 L0,180 Z"
              fill="url(#wave-bottom-gradient)"
            />
            <path
              d="M0,60 C320,160 680,20 1080,110 C1260,150 1380,130 1440,120"
              stroke="#38BDF8"
              strokeWidth="2"
              strokeOpacity="0.3"
            />
            <defs>
              <linearGradient id="wave-bottom-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#0B1F2E" stopOpacity="0.7" />
                <stop offset="50%" stopColor="#0E334E" stopOpacity="0.5" />
                <stop offset="100%" stopColor="#0284C7" stopOpacity="0.3" />
              </linearGradient>
            </defs>
          </svg>

          {/* Cruz Médica de Cristal en el fondo superior central */}
          <div className="absolute top-[18%] left-[45%] -translate-x-1/2 opacity-15 pointer-events-none">
            <svg className="w-36 h-36 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
              <path d="M9 3h6v6h6v6h-6v6H9v-6H3V9h6V3z" />
            </svg>
          </div>

          {/* Halo de luz suave en el centro */}
          <div className="absolute top-1/4 right-1/4 w-[480px] h-[480px] rounded-full bg-sky-400/20 blur-[130px]"></div>
        </div>

        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-20">

          {/* Columna Izquierda: Titular y CTA (Staggered Children con resortes Emil Kowalski) */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: { staggerChildren: 0.08, delayChildren: 0.05 }
              }
            }}
            className="lg:col-span-7 space-y-6"
          >

            {/* Badge superior (Color Sólido de Alto Contraste - Cero Translucidez) */}
            <motion.div
              variants={{
                hidden: { opacity: 0, y: 12 },
                visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 350, damping: 25, mass: 0.7 } }
              }}
              className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-white text-[#1E3A4C] text-[11px] sm:text-xs font-extrabold uppercase tracking-widest shadow-md shadow-slate-950/25 border border-white"
            >
              <span className="w-2.5 h-2.5 rounded-full bg-[#FF5A5F] shrink-0"></span>
              <span>Laboratorio Clínico Tacna · Perú</span>
            </motion.div>

            {/* Titular contundente con acento de punto y barrita de diseño */}
            <motion.div
              variants={{
                hidden: { opacity: 0, y: 14 },
                visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 28, mass: 0.8 } }
              }}
            >
              <h1 className="font-jakarta text-4xl sm:text-5xl md:text-6xl font-extrabold leading-[1.12] tracking-tight">
                <span className="block text-white">Tu Salud Es</span>
                <span className="block text-white">
                  Nuestra Prioridad<span className="text-[#FF5A5F]">.</span>
                </span>
              </h1>
              {/* Barra corta de acento rojo coral */}
              <span className="w-14 h-1 bg-[#FF5A5F] rounded-full mt-3 block"></span>
            </motion.div>

            {/* Bajada */}
            <motion.p
              variants={{
                hidden: { opacity: 0, y: 12 },
                visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 28, mass: 0.8 } }
              }}
              className="text-sky-100/90 text-sm sm:text-base md:text-lg max-w-xl font-normal leading-relaxed"
            >
              Tecnología diagnóstica automatizada de alta precisión, calidez humana y entrega digital inmediata de tus análisis clínicos.
            </motion.p>

            {/* Botones de acción con respuesta táctil física instantánea (80ms tap) */}
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
                className="group px-7 py-3.5 bg-[#FF5A5F] hover:bg-[#E84A4F] text-white font-extrabold text-xs uppercase tracking-wider rounded-full shadow-lg shadow-red-500/35 transition-colors cursor-pointer flex items-center gap-3"
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
                whileHover={{ scale: 1.02, backgroundColor: "rgba(255, 255, 255, 0.18)", transition: { duration: 0.15 } }}
                whileTap={{ scale: 0.97, transition: { duration: 0.08 } }}
                className="px-7 py-3.5 bg-white/10 text-white border border-white/25 font-bold text-xs uppercase tracking-wider rounded-full backdrop-blur-md flex items-center gap-2 cursor-pointer transition-colors"
              >
                <span>Escríbenos por WhatsApp</span>
              </motion.a>
            </motion.div>
          </motion.div>

          {/* Columna Derecha: Especialistas Médicos & Marco Squircle 3D */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 280, damping: 26, delay: 0.12 }}
            className="lg:col-span-5 relative flex justify-center lg:justify-end"
          >

            {/* Matriz de puntos decorativos detrás de los doctores */}
            <div className="absolute -top-6 -right-6 w-32 h-32 opacity-25 grid grid-cols-6 gap-2 pointer-events-none">
              {Array.from({ length: 36 }).map((_, i) => (
                <span key={i} className="w-1.5 h-1.5 rounded-full bg-white block"></span>
              ))}
            </div>

            {/* Imagen del especialista con marco squircle de cristal */}
            <div className="relative z-10 rounded-[38px] p-2 bg-gradient-to-b from-white/30 via-white/10 to-white/5 border-2 border-white/35 shadow-2xl backdrop-blur-md max-w-sm sm:max-w-md w-full">
              <div className="rounded-[30px] overflow-hidden bg-gradient-to-b from-sky-300/20 via-[#0E2C44]/40 to-[#091825]/90 flex items-end justify-center pt-4">
                <img
                  src="/home_chica.png"
                  alt="Especialista UNIDOSLAB Tacna"
                  className="w-full h-[370px] sm:h-[430px] object-contain object-bottom drop-shadow-2xl"
                />
              </div>
            </div>

            {/* Barra lateral flotante de redes sociales */}
            <motion.div
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.3, type: "spring", stiffness: 350, damping: 25 }}
              className="hidden xl:flex absolute -right-6 top-1/2 -translate-y-1/2 flex-col gap-3 bg-[#FF5A5F] text-white p-2.5 rounded-2xl shadow-xl z-20"
            >
              <motion.a
                whileHover={{ scale: 1.15, rotate: 2, transition: { type: "spring", stiffness: 400, damping: 15 } }}
                whileTap={{ scale: 0.92 }}
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-xl hover:bg-white/20 flex items-center justify-center transition-colors text-xs font-bold"
              >
                f
              </motion.a>
              <motion.a
                whileHover={{ scale: 1.15, rotate: 2, transition: { type: "spring", stiffness: 400, damping: 15 } }}
                whileTap={{ scale: 0.92 }}
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-xl hover:bg-white/20 flex items-center justify-center transition-colors text-xs font-bold"
              >
                ig
              </motion.a>
              <motion.a
                whileHover={{ scale: 1.15, rotate: 2, transition: { type: "spring", stiffness: 400, damping: 15 } }}
                whileTap={{ scale: 0.92 }}
                href="https://api.whatsapp.com/send/?phone=51952920616"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-xl hover:bg-white/20 flex items-center justify-center transition-colors text-xs font-bold"
              >
                wa
              </motion.a>
            </motion.div>

          </motion.div>
        </div>
      </section>

      {/* 2. BARRA FLOTANTE INFERIOR DE 3 DESTACADOS (Superpuesta en la base del Hero) */}
      <section className="max-w-6xl mx-auto px-4 md:px-6 -mt-16 md:-mt-20 relative z-30">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 280, damping: 26 }}
          className="bg-white rounded-3xl p-6 sm:p-8 shadow-2xl shadow-slate-900/10 border border-slate-100 grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 divide-y md:divide-y-0 md:divide-x divide-slate-100"
        >

          {/* Destacado 1 */}
          <motion.div
            whileHover={{ y: -2, transition: { duration: 0.15 } }}
            className="flex items-center gap-4 pt-4 md:pt-0 group cursor-default"
          >
            <motion.div
              whileHover={{ scale: 1.08, transition: { type: "spring", stiffness: 400, damping: 15 } }}
              className="w-14 h-14 rounded-full bg-[#FF5A5F] text-white flex items-center justify-center shadow-lg shadow-red-500/25 shrink-0"
            >
              <IconTestPipe className="w-7 h-7" />
            </motion.div>
            <div>
              <h3 className="font-jakarta text-base font-bold text-[#1E3A4C] leading-snug group-hover:text-[#FF5A5F] transition-colors">
                Toma de Muestras
              </h3>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Muestreo indoloro en sede o a domicilio con máxima bioseguridad.
              </p>
              <div className="w-8 h-0.5 bg-[#FF5A5F]/70 rounded-full mt-2"></div>
            </div>
          </motion.div>

          {/* Destacado 2 */}
          <motion.div
            whileHover={{ y: -2, transition: { duration: 0.15 } }}
            className="flex items-center gap-4 pt-4 md:pt-0 md:pl-6 group cursor-default"
          >
            <motion.div
              whileHover={{ scale: 1.08, transition: { type: "spring", stiffness: 400, damping: 15 } }}
              className="w-14 h-14 rounded-full bg-[#FF5A5F] text-white flex items-center justify-center shadow-lg shadow-red-500/25 shrink-0"
            >
              <IconFileCertificate className="w-7 h-7" />
            </motion.div>
            <div>
              <h3 className="font-jakarta text-base font-bold text-[#1E3A4C] leading-snug group-hover:text-[#FF5A5F] transition-colors">
                Resultados en Línea
              </h3>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Consulta y descarga rápida  desde cualquier dispositivo.
              </p>
              <div className="w-8 h-0.5 bg-[#FF5A5F]/70 rounded-full mt-2"></div>
            </div>
          </motion.div>

          {/* Destacado 3 */}
          <motion.div
            whileHover={{ y: -2, transition: { duration: 0.15 } }}
            className="flex items-center gap-4 pt-4 md:pt-0 md:pl-6 group cursor-default"
          >
            <motion.div
              whileHover={{ scale: 1.08, transition: { type: "spring", stiffness: 400, damping: 15 } }}
              className="w-14 h-14 rounded-full bg-[#FF5A5F] text-white flex items-center justify-center shadow-lg shadow-red-500/25 shrink-0"
            >
              <IconShieldCheck className="w-7 h-7" />
            </motion.div>
            <div>
              <h3 className="font-jakarta text-base font-bold text-[#1E3A4C] leading-snug group-hover:text-[#FF5A5F] transition-colors">
                Doble Control de Calidad
              </h3>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Certificación y validación por bioquímicos colegiados en Tacna.
              </p>
              <div className="w-8 h-0.5 bg-[#FF5A5F]/70 rounded-full mt-2"></div>
            </div>
          </motion.div>

        </motion.div>
      </section>

      {/* 3. SECCIÓN: ¿POR QUÉ CONFIAR TU DIAGNÓSTICO EN UNIDOSLAB? (Diseño Esculpido Fiel a la Referencia) */}
      <section className="max-w-7xl mx-auto px-4 md:px-6 py-16 md:py-24 relative z-10">
        <div className="bg-gradient-to-br from-[#FFFFFF] via-[#F3F8FC] to-[#E5F0F8] border border-slate-200/80 rounded-[44px] p-6 sm:p-10 md:p-14 shadow-2xl shadow-slate-900/10 relative overflow-hidden">

          {/* CAPA DE ONDAS ESCULPIDAS Y DECORACIÓN DE FONDO */}
          <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-0 overflow-hidden">

            {/* Onda Azul Hielo Superior Derecha */}
            <svg
              className="absolute -top-12 right-0 w-[620px] h-[520px] opacity-40"
              viewBox="0 0 600 500"
              fill="none"
            >
              <path
                d="M600,0 L180,0 C220,120 320,240 450,280 C540,310 580,380 600,420 Z"
                fill="url(#ice-wave-top)"
              />
              <defs>
                <linearGradient id="ice-wave-top" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#BAE6FD" stopOpacity="0.7" />
                  <stop offset="100%" stopColor="#38BDF8" stopOpacity="0.2" />
                </linearGradient>
              </defs>
            </svg>

            {/* Gran Onda Azul Marino Inferior Derecha (Da contraste por detrás del marco fotográfico) */}
            <svg
              className="absolute -bottom-6 -right-12 w-[680px] h-[480px] opacity-90"
              viewBox="0 0 650 450"
              fill="none"
            >
              <path
                d="M650,450 L200,450 C260,340 380,260 520,220 C600,190 640,120 650,80 Z"
                fill="url(#navy-wave-bottom)"
              />
              <defs>
                <linearGradient id="navy-wave-bottom" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#0B1E2D" stopOpacity="0.95" />
                  <stop offset="60%" stopColor="#0E2C44" stopOpacity="0.9" />
                  <stop offset="100%" stopColor="#163E5D" stopOpacity="0.8" />
                </linearGradient>
              </defs>
            </svg>

            {/* Cruz Médica de Contorno en Fondo Superior Derecho */}
            <div className="absolute top-8 right-12 opacity-30 pointer-events-none">
              <svg className="w-28 h-28 text-sky-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
                <path d="M9 3h6v6h6v6h-6v6H9v-6H3V9h6V3z" />
              </svg>
            </div>

            {/* Retícula de Micropuntos en Fondo Derecho */}
            <div className="absolute top-36 right-8 w-24 h-24 opacity-30 grid grid-cols-4 gap-2.5 pointer-events-none">
              {Array.from({ length: 16 }).map((_, i) => (
                <span key={i} className="w-1.5 h-1.5 rounded-full bg-sky-500 block"></span>
              ))}
            </div>

          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center relative z-10">

            {/* Columna Izquierda: Información, Checklist Clínico & Estadísticas (7 Columnas) */}
            <div className="lg:col-span-7 space-y-6">

              {/* Titular contundente */}
              <div>
                <h2 className="font-jakarta text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#1E3A4C] leading-[1.12] tracking-tight">
                  ¿Por qué confiar tu<br />
                  diagnóstico en<br />
                  <span className="text-[#FF5A5F]">UNIDOSLAB</span>?
                </h2>
                <div className="w-14 h-1 bg-[#FF5A5F] rounded-full mt-3"></div>
              </div>

              <p className="text-slate-600 text-sm sm:text-base leading-relaxed font-normal max-w-xl">
                Análisis clínicos especializados con tecnología automatizada de alta precisión y la calidez humana que tú y tu familia merecen.
              </p>

              {/* Checklist de Beneficios Clínicos de Alta Confianza */}
              <div className="space-y-3.5 pt-1">

                {/* Beneficio 1 */}
                <div className="flex items-start gap-3.5">
                  <div className="w-7 h-7 rounded-lg bg-red-500/10 text-[#FF5A5F] flex items-center justify-center shrink-0 mt-0.5 shadow-xs border border-red-500/20">
                    <IconCheck className="w-4 h-4 stroke-[3]" />
                  </div>
                  <div>
                    <h4 className="font-jakarta text-sm font-bold text-[#1E3A4C]">
                      Doble Validación & Control de Calidad Estricto
                    </h4>
                    <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
                      Cada análisis es procesado en equipos automatizados y certificado por bioquímicos colegiados.
                    </p>
                  </div>
                </div>

                {/* Beneficio 2 */}
                <div className="flex items-start gap-3.5">
                  <div className="w-7 h-7 rounded-lg bg-sky-500/10 text-sky-600 flex items-center justify-center shrink-0 mt-0.5 shadow-xs border border-sky-500/20">
                    <IconCheck className="w-4 h-4 stroke-[3]" />
                  </div>
                  <div>
                    <h4 className="font-jakarta text-sm font-bold text-[#1E3A4C]">
                      Entrega Digital Inmediata 24/7
                    </h4>
                    <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
                      Consulta y descarga tus resultados en tiempo real ingresando tu DNI desde cualquier dispositivo.
                    </p>
                  </div>
                </div>

                {/* Beneficio 3 */}
                <div className="flex items-start gap-3.5">
                  <div className="w-7 h-7 rounded-lg bg-emerald-500/10 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5 shadow-xs border border-emerald-500/20">
                    <IconCheck className="w-4 h-4 stroke-[3]" />
                  </div>
                  <div>
                    <h4 className="font-jakarta text-sm font-bold text-[#1E3A4C]">
                      2 Sedes Céntricas en Tacna & Atención a Domicilio
                    </h4>
                    <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
                      Atención ágil en Av. Leguía y Patricio Meléndez, o toma de muestras en la comodidad de tu hogar.
                    </p>
                  </div>
                </div>

              </div>

              {/* 2 Cápsulas de Estadísticas en Azul Marino Flotante */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3">

                {/* Cápsula 1: +6 Años de Trayectoria Clínica */}
                <motion.div
                  whileHover={{ y: -3, transition: { type: "spring", stiffness: 400, damping: 20 } }}
                  whileTap={{ scale: 0.98, transition: { duration: 0.08 } }}
                  className="bg-[#1E3A4C] text-white p-4 sm:p-5 rounded-3xl shadow-xl shadow-slate-900/15 border border-slate-700/30 flex items-center gap-4 cursor-default"
                >
                  <div className="w-12 h-12 rounded-full bg-[#FF5A5F] text-white flex items-center justify-center shrink-0 shadow-md shadow-red-500/30">
                    <IconAward className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="flex items-baseline">
                      <span className="text-[#FF5A5F] text-2xl font-extrabold mr-0.5">+</span>
                      <span className="font-jakarta text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                        {yearsCount}
                      </span>
                    </div>
                    <span className="text-[11px] font-bold text-slate-300 block leading-tight">
                      Años de Trayectoria Clínica
                    </span>
                    <div className="w-8 h-0.5 bg-[#FF5A5F] rounded-full mt-1.5"></div>
                  </div>
                </motion.div>

                {/* Cápsula 2: Pacientes atendidos */}
                <motion.div
                  whileHover={{ y: -3, transition: { type: "spring", stiffness: 400, damping: 20 } }}
                  whileTap={{ scale: 0.98, transition: { duration: 0.08 } }}
                  className="bg-[#1E3A4C] text-white p-4 sm:p-5 rounded-3xl shadow-xl shadow-slate-900/15 border border-slate-700/30 flex items-center gap-4 cursor-default"
                >
                  <div className="w-12 h-12 rounded-full bg-[#FF5A5F] text-white flex items-center justify-center shrink-0 shadow-md shadow-red-500/30">
                    <IconUsers className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="flex items-baseline">
                      <span className="font-jakarta text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                        {examsCount.toLocaleString('es-PE')}
                      </span>
                      <span className="text-[#FF5A5F] text-2xl font-extrabold ml-0.5">+</span>
                    </div>
                    <span className="text-[11px] font-bold text-slate-300 block leading-tight">
                      Pacientes atendidos
                    </span>
                    <div className="w-8 h-0.5 bg-[#FF5A5F] rounded-full mt-1.5"></div>
                  </div>
                </motion.div>

              </div>
            </div>

            {/* Columna Derecha: Marco Squircle con Borde Azul Marino Grueso & Badge Flotante (5 Columnas) */}
            <div className="lg:col-span-5 relative flex justify-center">

              {/* Marco Squircle con Borde Marino Fuerte a juego con la referencia */}
              <div className="relative rounded-[44px] p-2.5 bg-[#1E3A4C] border-4 border-[#16364D] shadow-2xl max-w-sm sm:max-w-md w-full">
                <div className="rounded-[34px] overflow-hidden bg-slate-950 relative">
                  <img
                    src="https://images.pexels.com/photos/3735709/pexels-photo-3735709.jpeg?auto=compress&cs=tinysrgb&w=1200"
                    alt="Laboratorio de análisis clínicos y reactivos - UNIDOSLAB Tacna"
                    className="w-full h-[380px] sm:h-[460px] object-cover object-center"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent"></div>
                </div>

                {/* Badge Flotante de Garantía */}
                <motion.div
                  initial={{ y: 8, opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2, type: "spring", stiffness: 350, damping: 25 }}
                  className="absolute bottom-5 left-5 right-5 bg-white/95 backdrop-blur-md p-4 rounded-2xl shadow-xl border border-white flex items-center gap-3.5 text-slate-800"
                >
                  <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 shadow-xs border border-emerald-100">
                    <IconShieldCheck className="w-6 h-6" />
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

      {/* 4. SECCIÓN: ¿CÓMO TRABAJAMOS? RECIBE TUS RESULTADOS EN 3 PASOS */}
      <section className="relative py-24 border-y border-slate-200/60 overflow-hidden bg-gradient-to-b from-white/60 via-slate-50/80 to-white/60 backdrop-blur-md">
        {/* Fondo de mapa con patrón de micropuntos clínicos */}
        <div
          className="absolute inset-0 pointer-events-none opacity-40"
          style={{
            backgroundImage: 'radial-gradient(#94a3b8 1.4px, transparent 1.4px)',
            backgroundSize: '24px 24px'
          }}
        ></div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 text-center">
          <span className="text-xs font-bold text-[#E52320] uppercase tracking-widest block mb-2">
            ¿Cómo trabajamos?
          </span>
          <h2 className="font-jakarta text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#1E3A4C] tracking-tight">
            Recibe Tus Resultados En 3 Simples Pasos.
          </h2>
          <p className="text-xs text-slate-400 mt-2 font-medium tracking-wider uppercase">
            Laboratorio Análisis Clínico Tacna - Perú
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mt-16 max-w-5xl mx-auto">
            {/* Paso 1 */}
            <div className="flex flex-col items-center text-center group">
              <div className="w-24 h-24 rounded-3xl bg-white shadow-lg shadow-slate-200/70 border border-slate-100 flex items-center justify-center p-4 mb-5 transition-all duration-300 group-hover:scale-110 group-hover:shadow-xl group-hover:border-[#E52320]/30">
                <img
                  src="/step-1.svg"
                  alt="Análisis Clínico"
                  className="w-16 h-16 object-contain"
                />
              </div>
              <h3 className="font-jakarta text-xl font-extrabold text-[#1E3A4C] tracking-tight mb-2 group-hover:text-[#E52320] transition-colors">
                Análisis
              </h3>
              <p className="text-xs text-slate-500 max-w-xs leading-relaxed font-medium">
                Toma de muestra en cualquiera de nuestras sedes o servicio a domicilio seguro.
              </p>
            </div>

            {/* Paso 2 */}
            <div className="flex flex-col items-center text-center group">
              <div className="w-24 h-24 rounded-3xl bg-white shadow-lg shadow-slate-200/70 border border-slate-100 flex items-center justify-center p-4 mb-5 transition-all duration-300 group-hover:scale-110 group-hover:shadow-xl group-hover:border-[#E52320]/30">
                <img
                  src="/step-2.svg"
                  alt="Preparamos sus análisis"
                  className="w-16 h-16 object-contain"
                />
              </div>
              <h3 className="font-jakarta text-xl font-extrabold text-[#1E3A4C] tracking-tight mb-2 group-hover:text-[#E52320] transition-colors">
                Preparamos sus análisis
              </h3>
              <p className="text-xs text-slate-500 max-w-xs leading-relaxed font-medium">
                Procesamiento automatizado con doble verificación y altos estándares de calidad.
              </p>
            </div>

            {/* Paso 3 */}
            <div className="flex flex-col items-center text-center group">
              <div className="w-24 h-24 rounded-3xl bg-white shadow-lg shadow-slate-200/70 border border-slate-100 flex items-center justify-center p-4 mb-5 transition-all duration-300 group-hover:scale-110 group-hover:shadow-xl group-hover:border-[#E52320]/30">
                <img
                  src="/step-3.svg"
                  alt="Enviamos tus resultados"
                  className="w-16 h-16 object-contain"
                />
              </div>
              <h3 className="font-jakarta text-xl font-extrabold text-[#1E3A4C] tracking-tight mb-2 group-hover:text-[#E52320] transition-colors">
                Enviamos tus resultados
              </h3>
              <p className="text-xs text-slate-500 max-w-xs leading-relaxed font-medium">
                Consulta y descarga rápida de tus resultados en línea mediante tu documento.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. SECCIÓN: SEDES Y HORARIOS EN TACNA (Diseño fiel al mockup) */}
      <section id="sedes" className="max-w-7xl mx-auto px-4 md:px-6 pt-16 pb-16 scroll-mt-24 relative z-10 font-plex">
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
                      src="/catedral_3d_tacna.png" 
                      alt="Catedral de Tacna" 
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
                      src="/2_de_mayo.png" 
                      alt="Mercado 2 de Mayo" 
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
                      src="/catedral_3d_tacna.png" 
                      alt="Plaza Zela" 
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

            {/* Columna Izquierda: Tarjetas de Sedes (5 columnas) */}
            <div className="lg:col-span-5 flex flex-col gap-4">
              {sedesData.map((sede, idx) => {
                const isSelected = selectedSedeIndex === idx;
                return (
                  <div
                    key={sede.id}
                    onClick={() => setSelectedSedeIndex(idx)}
                    className={`rounded-2xl p-5 border-2 transition-all duration-300 cursor-pointer flex flex-col justify-between ${
                      isSelected
                        ? 'bg-[#0F1F2C] text-white border-[#0F1F2C] shadow-xl shadow-slate-900/15'
                        : 'bg-white text-slate-700 border-slate-200/80 hover:border-slate-300 hover:shadow-md'
                    }`}
                  >
                    <div>
                      {/* Badge Superior */}
                      {isSelected ? (
                        <div className="inline-block mb-3 px-2.5 py-0.5 rounded-full bg-[#E52320] text-[9px] font-extrabold uppercase tracking-widest text-white">
                          SEDE ACTIVA
                        </div>
                      ) : (
                        <div className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 mb-2">
                          SEDE
                        </div>
                      )}

                      <div className="flex items-start gap-4 mb-3">
                        {/* Pin 3D Container */}
                        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 p-1.5 ${
                          isSelected ? 'bg-white/10' : 'bg-slate-50 border border-slate-100'
                        }`}>
                          <img 
                            src="/pin_sedes.png" 
                            alt={sede.name} 
                            className="w-10 h-10 object-contain drop-shadow-md"
                          />
                        </div>

                        {/* Info de la sede */}
                        <div className="flex-1 min-w-0">
                          <h4 className={`font-jakarta text-lg sm:text-xl font-extrabold leading-snug ${
                            isSelected ? 'text-white' : 'text-[#1E3A4C]'
                          }`}>
                            {sede.name.replace('Sede ', '')}
                          </h4>
                          
                          <p className={`text-xs mt-1.5 flex items-center gap-1.5 ${
                            isSelected ? 'text-slate-300' : 'text-slate-500'
                          }`}>
                            <IconMapPin className="w-3.5 h-3.5 shrink-0 opacity-70" />
                            <span className="truncate">{sede.address}</span>
                          </p>

                          <div className={`mt-2 pt-2 border-t flex items-center justify-between text-xs ${
                            isSelected ? 'border-white/10 text-slate-300' : 'border-slate-100 text-slate-600'
                          }`}>
                            <span className="flex items-center gap-1 font-medium">
                              <IconClock className="w-3.5 h-3.5 opacity-70" />
                              Horario General:
                            </span>
                            <span className={`font-bold ${isSelected ? 'text-white' : 'text-[#1E3A4C]'}`}>
                              {sede.schedule}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Botones de acción inferiores */}
                    <div className="flex items-center gap-3 mt-3 pt-3 border-t border-dashed border-slate-200/30">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedSedeIndex(idx);
                        }}
                        className={`flex-1 py-2 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-white text-[#0F1F2C] hover:bg-slate-100 shadow-sm'
                            : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                        }`}
                      >
                        <span>Ver en mapa</span>
                        <IconMapPin className="w-3.5 h-3.5" />
                      </button>

                      <a
                        href={sede.mapsExternalUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className={`flex-1 py-2 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                          isSelected
                            ? 'text-red-400 hover:text-red-300'
                            : 'text-[#E52320] hover:text-red-700'
                        }`}
                      >
                        <span>Cómo llegar</span>
                        <IconNavigation className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Columna Derecha: Mapa Interactivo (7 columnas) */}
            <div className="lg:col-span-7 h-[440px] lg:h-auto min-h-[440px]">
              <SedesMap
                sedes={sedesData}
                selectedSedeIndex={selectedSedeIndex}
                onSelectSede={setSelectedSedeIndex}
              />
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
