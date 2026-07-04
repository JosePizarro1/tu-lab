import React, { useEffect, useRef } from 'react';
import { IconChevronDown, IconMicroscope, IconFileCheck, IconActivity } from '@tabler/icons-react';
import gsap from 'gsap';

interface HomeProps {
  setActiveTab: (tab: string) => void;
}

const Home: React.FC<HomeProps> = ({ setActiveTab }) => {
  const heroRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Intro animations
    if (heroRef.current) {
      gsap.fromTo(heroRef.current.querySelectorAll('.animate-fade-up'), 
        { autoAlpha: 0, y: 30 },
        { autoAlpha: 1, y: 0, stagger: 0.15, duration: 1, ease: 'power3.out' }
      );
    }

    if (cardsRef.current) {
      gsap.fromTo(cardsRef.current.children, 
        { autoAlpha: 0, y: 40 },
        { autoAlpha: 1, y: 0, stagger: 0.1, duration: 0.8, ease: 'power2.out', delay: 0.4 }
      );
    }
  }, []);

  const cardsData = [
    {
      title: 'Exámenes',
      icon: <IconMicroscope className="w-8 h-8 text-cerulean" />,
      bgImage: 'https://images.unsplash.com/photo-1579154769741-6296df2a41cd?auto=format&fit=crop&w=600&q=80',
      action: () => setActiveTab('servicios'),
      description: 'Catálogo de análisis clínicos y pruebas de laboratorio especializadas.'
    },
    {
      title: 'Ver resultados',
      icon: <IconFileCheck className="w-8 h-8 text-cerulean" />,
      bgImage: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=600&q=80',
      action: () => setActiveTab('resultados'),
      description: 'Acceda a sus resultados de laboratorio en línea de manera segura y rápida.'
    },
    {
      title: 'Ecografías',
      icon: <IconActivity className="w-8 h-8 text-cerulean" />,
      bgImage: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=600&q=80',
      action: () => setActiveTab('servicios'),
      description: 'Servicios de diagnóstico por imágenes y ecografías de alta definición.'
    }
  ];

  return (
    <div className="w-full min-h-screen bg-slate-50/50 pb-20 font-plex">
      
      {/* Hero Section */}
      <section 
        ref={heroRef}
        className="relative h-[65vh] w-full flex items-center overflow-hidden bg-slate-900"
      >
        {/* Background Image with Gradient Overlay */}
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=2000&q=90" 
            alt="Clinical Laboratory" 
            className="w-full h-full object-cover object-center opacity-40 scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-900/60 to-transparent"></div>
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-6 w-full flex flex-col items-start gap-4">
          <div className="animate-fade-up inline-flex items-center gap-2 px-3 py-1 bg-azure-mist/10 border border-white/10 rounded-full mb-2">
            <span className="w-1.5 h-1.5 bg-cerulean rounded-full animate-pulse"></span>
            <span className="text-[10px] font-bold uppercase tracking-widest text-azure-mist">Tecnología de Vanguardia</span>
          </div>
          <h2 className="animate-fade-up font-jakarta text-5xl md:text-7xl font-extrabold text-white tracking-tight leading-none">
            Siéntete seguro
          </h2>
          <p className="animate-fade-up text-slate-300 max-w-lg text-lg font-medium mt-2 leading-relaxed">
            Resultados precisos y diagnósticos confiables con el respaldo de nuestro staff de profesionales de primer nivel.
          </p>
        </div>
      </section>

      {/* Cards Overlapping Container */}
      <section className="max-w-7xl mx-auto px-6 -mt-24 relative z-20">
        <div 
          ref={cardsRef}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {cardsData.map((card, idx) => (
            <div 
              key={idx}
              onClick={card.action}
              className="group relative h-72 rounded-2xl overflow-hidden glass-panel shadow-[0_20px_40px_-15px_rgba(0,0,0,0.06)] border border-slate-100 hover:border-cerulean/30 hover:shadow-[0_30px_60px_-10px_rgba(0,123,167,0.15)] transition-all duration-500 cursor-pointer flex flex-col justify-between p-8"
            >
              {/* Card Hover Background Image */}
              <div className="absolute inset-0 z-0 opacity-0 group-hover:opacity-10 transition-opacity duration-500">
                <img 
                  src={card.bgImage} 
                  alt={card.title} 
                  className="w-full h-full object-cover filter grayscale"
                />
              </div>

              {/* Card Header */}
              <div className="relative z-10 flex justify-between items-start">
                <div className="p-3 bg-slate-50 border border-slate-100 group-hover:bg-azure-mist group-hover:border-lab-border rounded-xl transition-colors duration-300">
                  {card.icon}
                </div>
                <div className="text-slate-400 group-hover:text-cerulean transition-colors duration-300">
                  <IconChevronDown className="w-5 h-5 -rotate-90 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>

              {/* Card Footer / Labels */}
              <div className="relative z-10">
                <h3 className="font-jakarta text-2xl font-bold text-slate-800 group-hover:text-cerulean transition-colors duration-300 mb-2">
                  {card.title}
                </h3>
                <p className="text-sm text-slate-500 leading-relaxed">
                  {card.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;
