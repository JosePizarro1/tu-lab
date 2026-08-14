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
  IconSend
} from '@tabler/icons-react';
import gsap from 'gsap';

interface HomeProps {
  setActiveTab: (tab: string) => void;
}

const Home: React.FC<HomeProps> = ({ setActiveTab }) => {
  const heroRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  
  const [yearsCount, setYearsCount] = React.useState(0);
  const [examsCount, setExamsCount] = React.useState(0);

  useEffect(() => {
    if (heroRef.current) {
      gsap.fromTo(heroRef.current.querySelectorAll('.animate-fade-up'), 
        { autoAlpha: 0, y: 25 },
        { autoAlpha: 1, y: 0, stagger: 0.12, duration: 0.8, ease: 'power3.out' }
      );
    }

    if (cardsRef.current) {
      gsap.fromTo(cardsRef.current.children, 
        { autoAlpha: 0, y: 35 },
        { autoAlpha: 1, y: 0, stagger: 0.08, duration: 0.7, ease: 'power2.out', delay: 0.3 }
      );
    }

    // Animación de conteo desde 0 para Años (5) y Exámenes (5,125)
    const duration = 1800; // ms
    const startTime = performance.now();

    const animateCounters = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Easing suave (easeOutExpo)
      const easeOut = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);

      setYearsCount(Math.floor(easeOut * 5));
      setExamsCount(Math.floor(easeOut * 5125));

      if (progress < 1) {
        requestAnimationFrame(animateCounters);
      } else {
        setYearsCount(5);
        setExamsCount(5125);
      }
    };

    requestAnimationFrame(animateCounters);
  }, []);

  const featureCards = [
    {
      title: 'Servicio de Análisis Clínicos',
      description: 'Ofrecemos todo tipo de análisis clínicos para el apoyo del diagnóstico médico certero.',
      icon: <IconFlask className="w-10 h-10 text-white" />,
      action: () => setActiveTab('servicios')
    },
    {
      title: 'Análisis y Pruebas Especiales',
      description: 'Perfiles hormonales, marcadores y pruebas de alta sensibilidad diagnóstica.',
      icon: <IconMicroscope className="w-10 h-10 text-white" />,
      action: () => setActiveTab('servicios')
    },
    {
      title: 'Exámenes Preventivos & PSA',
      description: 'Detección oportuna, chequeos preventivos y seguimiento integral de salud.',
      icon: <IconTestPipe className="w-10 h-10 text-white" />,
      action: () => setActiveTab('servicios')
    },
    {
      title: 'Atención a Domicilio',
      description: 'Llámanos o escríbenos por WhatsApp y te atendemos en la comodidad de tu casa o trabajo.',
      icon: <IconDna className="w-10 h-10 text-white" />,
      action: () => window.open('https://api.whatsapp.com/send/?phone=51952920616&text=Hola%20UNIDOSLAB,%20deseo%20atenci%C3%B3n%20a%20domicilio%20en%20Tacna', '_blank')
    }
  ];

  return (
    <div className="w-full min-h-screen bg-white pb-16 font-plex">
      
      {/* 1. HERO SECTION (Estilo Laboratorios Tacna - Espacioso y Limpio) */}
      <section 
        ref={heroRef}
        className="relative min-h-[520px] md:min-h-[600px] lg:min-h-[640px] w-full flex items-center overflow-hidden bg-slate-50 pb-20 md:pb-28"
      >
        {/* Imagen de fondo nítida con científico de laboratorio */}
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.pexels.com/photos/8442574/pexels-photo-8442574.jpeg?auto=compress&cs=tinysrgb&w=1600&q=85" 
            alt="Laboratorio de Análisis Clínicos Tacna" 
            className="w-full h-full object-cover object-[70%_center] md:object-right opacity-95"
          />
          {/* Gradient overlay lateral para legibilidad impecable */}
          <div className="absolute inset-0 bg-gradient-to-r from-white via-white/85 md:via-white/70 to-transparent"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 w-full py-16 md:py-24 flex flex-col items-start gap-5">
          <div className="animate-fade-up flex items-center gap-2 text-xs md:text-sm font-bold text-[#E52320] tracking-wide">
            <span className="w-6 h-[2px] bg-[#E52320]"></span>
            <span>Laboratorio de Análisis Clínicos - Tacna Perú</span>
          </div>

          <h1 className="animate-fade-up font-jakarta text-3xl sm:text-4xl md:text-5xl lg:text-[50px] font-extrabold text-[#1E3A4C] leading-[1.15] max-w-2xl tracking-tight">
            Diagnóstico en análisis clínicos en{' '}
            <span className="text-[#E52320]">forma eficaz, oportuna y de calidad.</span>
          </h1>

          <p className="animate-fade-up text-slate-600 max-w-xl text-sm sm:text-base md:text-lg font-normal leading-relaxed mt-1">
            Estamos comprometidos en un mejoramiento continuo para servir con precisión a nuestros pacientes y médicos de Tacna.
          </p>

          <div className="animate-fade-up mt-4">
            <button
              onClick={() => setActiveTab('resultados')}
              className="px-9 py-4 bg-[#E52320] hover:bg-red-700 text-white font-extrabold text-xs uppercase tracking-widest rounded-full shadow-lg shadow-red-500/25 transition-all transform hover:scale-105 cursor-pointer"
            >
              Acceso a Resultados
            </button>
          </div>
        </div>
      </section>

      {/* 2. 4 TARJETAS OSCURAS DE SERVICIOS (Superpuestas con espacio holgado) */}
      <section className="max-w-7xl mx-auto px-4 md:px-6 -mt-14 md:-mt-20 relative z-20">
        <div 
          ref={cardsRef}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5"
        >
          {featureCards.map((card, idx) => (
            <div 
              key={idx}
              onClick={card.action}
              className="bg-[#2D3139] hover:bg-[#1E3A4C] text-white p-7 rounded-md shadow-xl transition-all duration-300 transform hover:-translate-y-1.5 cursor-pointer flex flex-col items-center text-center group border-t-2 border-transparent hover:border-[#E52320]"
            >
              <div className="mb-5 p-2 transition-transform group-hover:scale-110">
                {card.icon}
              </div>
              <h3 className="font-jakarta text-base font-bold text-white mb-2 leading-snug">
                {card.title}
              </h3>
              <p className="text-xs text-slate-300 font-normal leading-relaxed">
                {card.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* 3. SECCIÓN: ¿POR QUÉ ATENDERSE EN UNIDOSLAB? (Estilo Laboratorios Tacna) */}
      <section className="max-w-7xl mx-auto px-4 md:px-6 py-16 md:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-slate-50 border border-slate-200/80 rounded-3xl p-6 md:p-10 shadow-sm">
          
          {/* Columna Izquierda: Información & Contadores */}
          <div className="lg:col-span-6 space-y-6">
            <div className="flex items-center gap-2 text-xs font-bold text-[#E52320] tracking-wide">
              <span className="w-5 h-[2px] bg-[#E52320]"></span>
              <span>Laboratorio de Análisis Clínico Tacna Perú</span>
            </div>

            <h2 className="font-jakarta text-3xl sm:text-4xl font-extrabold text-[#1E3A4C] leading-tight tracking-tight">
              ¿Por qué atenderse en <br className="hidden sm:block" /> UNIDOSLAB?
            </h2>

            <p className="text-slate-600 text-xs sm:text-sm leading-relaxed font-normal">
              UNIDOSLAB ofrece al público en general y a la comunidad médica de Tacna, un directorio especializado de más de 3,000 análisis clínicos y de diagnóstico con los más altos estándares de calidad.
            </p>

            {/* Contadores con animación interactiva desde 0 */}
            <div className="grid grid-cols-2 gap-6 pt-6 border-t border-slate-200/80">
              <div className="relative bg-white p-5 rounded-2xl border border-slate-100 shadow-xs">
                <div className="flex items-baseline">
                  <span className="text-[#E52320] text-3xl font-extrabold mr-1">+</span>
                  <span className="font-jakarta text-4xl sm:text-5xl font-extrabold text-[#1E3A4C] tracking-tight">
                    {yearsCount}
                  </span>
                </div>
                <span className="text-[10px] sm:text-[11px] font-bold text-slate-500 uppercase tracking-wider block mt-1">
                  Años en el Mercado
                </span>
              </div>

              <div className="relative bg-white p-5 rounded-2xl border border-slate-100 shadow-xs">
                <div className="flex items-baseline">
                  <span className="font-jakarta text-4xl sm:text-5xl font-extrabold text-[#1E3A4C] tracking-tight">
                    {examsCount.toLocaleString('es-PE')}
                  </span>
                  <span className="text-[#E52320] text-3xl font-extrabold ml-1">+</span>
                </div>
                <span className="text-[10px] sm:text-[11px] font-bold text-slate-500 uppercase tracking-wider block mt-1">
                  Exámenes Realizados
                </span>
              </div>
            </div>
          </div>

          {/* Columna Derecha: Fotografía Clínica Nítida (Opción 3) */}
          <div className="lg:col-span-6 relative h-[350px] sm:h-[420px] rounded-2xl overflow-hidden shadow-xl border-2 border-white">
            <img 
              src="https://images.pexels.com/photos/3735709/pexels-photo-3735709.jpeg?auto=compress&cs=tinysrgb&w=1200" 
              alt="Tubos de muestra y centrífuga clínica - UNIDOSLAB" 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 via-transparent to-transparent"></div>
          </div>

        </div>
      </section>

      {/* 4. SECCIÓN: ¿CÓMO TRABAJAMOS? RECIBE TUS RESULTADOS EN 3 PASOS */}
      <section className="relative py-24 border-y border-slate-200/60 overflow-hidden bg-white">
        {/* Fondo de mapa con patrón de micropuntos clínicos */}
        <div 
          className="absolute inset-0 pointer-events-none opacity-50"
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

      {/* 5. SECCIÓN: SEDES Y HORARIOS EN TACNA (Con Mapas Interactivos de Google Maps) */}
      <section id="sedes" className="max-w-7xl mx-auto px-4 md:px-6 pt-16 pb-12 scroll-mt-24">
        <div className="bg-slate-50/80 border border-slate-200/80 rounded-3xl p-6 md:p-10 shadow-sm">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10 border-b border-slate-200/80 pb-6">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-[#E52320] block mb-1">
                Atención Presencial en Tacna
              </span>
              <h3 className="font-jakarta text-2xl md:text-3xl lg:text-4xl font-extrabold text-[#1E3A4C]">
                Nuestras Sedes & Mapas de Ubicación
              </h3>
              <p className="text-slate-500 text-xs md:text-sm mt-1 font-medium">
                Encuentra la sede más cercana a ti con mapa interactivo y rutas en vivo.
              </p>
            </div>

            <button 
              onClick={() => setActiveTab('sedes')}
              className="px-6 py-3 bg-white border border-slate-200 hover:border-[#E52320] text-[#1E3A4C] hover:text-[#E52320] text-xs font-extrabold uppercase tracking-wider rounded-full shadow-xs transition-all flex items-center gap-2 w-fit cursor-pointer group"
            >
              <span>Ver detalle completo de sedes</span>
              <IconArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Sede 01: Av. Leguía */}
            <div className="bg-white rounded-3xl border border-slate-200 shadow-lg overflow-hidden flex flex-col justify-between">
              <div className="p-6 md:p-8 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-extrabold text-[#E52320] uppercase tracking-widest">
                    Sede 01 · Tacna
                  </span>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200/60">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                    Abierto Lunes a Sábado
                  </span>
                </div>

                <h4 className="font-jakarta text-xl font-extrabold text-[#1E3A4C]">
                  Avenida Leguía
                </h4>

                <p className="text-xs text-slate-600 font-medium flex items-center gap-1.5">
                  <IconMapPin className="w-4 h-4 text-[#E52320] shrink-0" />
                  <span>Av. Leguía, Tacna (Frente a consultorios médicos)</span>
                </p>

                <div className="pt-2 space-y-2 text-xs text-slate-600 border-t border-slate-100">
                  <div className="flex justify-between items-center py-1">
                    <span className="font-semibold text-slate-700 flex items-center gap-1.5">
                      <IconClock className="w-3.5 h-3.5 text-slate-400" />
                      Horario General:
                    </span>
                    <span className="font-extrabold text-[#1E3A4C]">7:00 AM – 7:00 PM</span>
                  </div>
                  <div className="flex justify-between items-center py-1">
                    <span className="font-semibold text-slate-700">Toma de Muestras:</span>
                    <span className="text-slate-500">7:00 AM – 1:00 PM</span>
                  </div>
                </div>
              </div>

              {/* Mapa de Google Maps Interactivo en vivo */}
              <div className="relative h-60 w-full bg-slate-100 border-t border-slate-100">
                <iframe 
                  title="Mapa Sede Av. Leguía Tacna"
                  src="https://maps.google.com/maps?q=Av.%20Legu%C3%ADa%2C%20Tacna%2C%20Per%C3%BA&t=m&z=15&output=embed"
                  className="w-full h-full border-0"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
                <a 
                  href="https://maps.app.goo.gl/HUAqRFnH5PYh8r1q6" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="absolute bottom-3 right-3 bg-white/95 hover:bg-white text-[#E52320] px-4 py-2 rounded-full text-xs font-extrabold uppercase tracking-wider shadow-md backdrop-blur-xs flex items-center gap-1.5 transition-transform hover:scale-105"
                >
                  <span>Ver en Google Maps</span>
                  <span>↗</span>
                </a>
              </div>
            </div>

            {/* Sede 02: Patricio Meléndez */}
            <div className="bg-white rounded-3xl border border-slate-200 shadow-lg overflow-hidden flex flex-col justify-between">
              <div className="p-6 md:p-8 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-extrabold text-[#E52320] uppercase tracking-widest">
                    Sede 02 · Tacna
                  </span>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200/60">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                    Abierto Lunes a Sábado
                  </span>
                </div>

                <h4 className="font-jakarta text-xl font-extrabold text-[#1E3A4C]">
                  Calle Patricio Meléndez
                </h4>

                <p className="text-xs text-slate-600 font-medium flex items-center gap-1.5">
                  <IconMapPin className="w-4 h-4 text-[#E52320] shrink-0" />
                  <span>Calle Patricio Meléndez, Tacna Centro</span>
                </p>

                <div className="pt-2 space-y-2 text-xs text-slate-600 border-t border-slate-100">
                  <div className="flex justify-between items-center py-1">
                    <span className="font-semibold text-slate-700 flex items-center gap-1.5">
                      <IconClock className="w-3.5 h-3.5 text-slate-400" />
                      Horario General:
                    </span>
                    <span className="font-extrabold text-[#1E3A4C]">7:00 AM – 7:00 PM</span>
                  </div>
                  <div className="flex justify-between items-center py-1">
                    <span className="font-semibold text-slate-700">Ecografías & Informes:</span>
                    <span className="text-slate-500">8:00 AM – 6:00 PM</span>
                  </div>
                </div>
              </div>

              {/* Mapa de Google Maps Interactivo en vivo */}
              <div className="relative h-60 w-full bg-slate-100 border-t border-slate-100">
                <iframe 
                  title="Mapa Sede Patricio Meléndez Tacna"
                  src="https://maps.google.com/maps?q=Calle%20Patricio%20Mel%C3%A9ndez%2C%20Tacna%2C%20Per%C3%BA&t=m&z=15&output=embed"
                  className="w-full h-full border-0"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
                <a 
                  href="https://maps.app.goo.gl/YY4MkEoko7847tmb9" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="absolute bottom-3 right-3 bg-white/95 hover:bg-white text-[#E52320] px-4 py-2 rounded-full text-xs font-extrabold uppercase tracking-wider shadow-md backdrop-blur-xs flex items-center gap-1.5 transition-transform hover:scale-105"
                >
                  <span>Ver en Google Maps</span>
                  <span>↗</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};

export default Home;
