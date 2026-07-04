"use client";

import React, { useEffect, useRef } from 'react';
import ServiceCard from './ServiceCard';
import { 
  IconMicroscope, 
  IconDna, 
  IconActivity, 
  IconDroplets, 
  IconBiohazard, 
  IconFlask 
} from '@tabler/icons-react';
import gsap from 'gsap';

const Services: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      gsap.fromTo(containerRef.current.querySelectorAll('.animate-service'), 
        { autoAlpha: 0, y: 30 },
        { autoAlpha: 1, y: 0, stagger: 0.1, duration: 0.8, ease: 'power3.out' }
      );
    }
  }, []);

  const servicesData = [
    {
      title: 'Inmunología',
      description: 'Pruebas hormonales, marcadores tumorales e infecciosos con alta sensibilidad.',
      icon: <IconMicroscope className="w-7 h-7" />
    },
    {
      title: 'Bioquímica Clínica',
      description: 'Perfiles metabólicos, renales, hepáticos y lípidos automatizados.',
      icon: <IconFlask className="w-7 h-7" />
    },
    {
      title: 'Hematología',
      description: 'Hemogramas completos y estudios especiales de coagulación.',
      icon: <IconDroplets className="w-7 h-7" />
    },
    {
      title: 'Microbiología',
      description: 'Cultivos bacterianos, identificación y antibiogramas rápidos.',
      icon: <IconBiohazard className="w-7 h-7" />
    },
    {
      title: 'Biología Molecular',
      description: 'Detección por PCR de patógenos virales y estudios genéticos.',
      icon: <IconDna className="w-7 h-7" />
    },
    {
      title: 'Ecografías y Diagnóstico',
      description: 'Imágenes ecográficas en 3D/4D con tecnología avanzada.',
      icon: <IconActivity className="w-7 h-7" />
    }
  ];

  return (
    <div ref={containerRef} className="max-w-7xl mx-auto px-4 md:px-6 py-10 md:py-20 font-plex">
      <header className="mb-10 md:mb-16 text-center animate-service">
        <h2 className="font-jakarta text-3xl md:text-5xl font-extrabold text-slate-900 tracking-tight leading-none mb-4">
          Nuestros Servicios
        </h2>
        <p className="text-slate-500 text-sm md:text-lg font-medium max-w-2xl mx-auto leading-relaxed">
          Contamos con una amplia cartera de análisis y pruebas de diagnóstico con alta precisión.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-10">
        {servicesData.map((service, index) => (
          <div key={index} className="animate-service">
            <ServiceCard 
              title={service.title} 
              description={service.description} 
              icon={service.icon} 
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Services;
