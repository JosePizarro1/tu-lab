"use client";

import React from 'react';
import { 
  IconMapPin, 
  IconFlask, 
  IconVaccine, 
  IconParking, 
  IconEye, 
  IconClock 
} from '@tabler/icons-react';

interface Sede {
  name: string;
  address: string;
  features: {
    laboratorio: boolean;
    vacunas: boolean;
    estacionamiento: boolean;
  };
  status: string;
  image: string;
}

const Sedes: React.FC = () => {
  const sedesData: Sede[] = [
    {
      name: 'Breña',
      address: 'Av. Alfonso Ugarte 1418',
      features: {
        laboratorio: true,
        vacunas: true,
        estacionamiento: false,
      },
      status: 'Cerrado Abre Sábado 7:00 AM',
      image: 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&w=600&q=80',
    },
    {
      name: 'Comas',
      address: 'Av. Universitaria 7381',
      features: {
        laboratorio: true,
        vacunas: false,
        estacionamiento: true,
      },
      status: 'Cerrado Abre Sábado 7:00 AM',
      image: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=600&q=80',
    },
  ];

  return (
    <div className="max-w-5xl mx-auto px-6 py-16 font-plex">
      <header className="mb-12 text-center">
        <h2 className="font-jakarta text-4xl font-extrabold text-slate-900 tracking-tight">Nuestras Sedes</h2>
        <p className="text-slate-500 mt-2 text-base">Encuentre la sede más cercana para su atención y análisis clínicos.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {sedesData.map((sede, idx) => (
          <div 
            key={idx} 
            className="bg-white rounded-3xl border border-slate-100 shadow-[0_15px_30px_-10px_rgba(0,0,0,0.04)] overflow-hidden flex flex-col justify-between hover:shadow-[0_20px_40px_-10px_rgba(0,123,167,0.1)] transition-all duration-300 relative"
          >
            {/* Main content grid */}
            <div className="flex flex-col sm:flex-row justify-between items-stretch flex-1">
              {/* Left Details Panel */}
              <div className="p-6 sm:p-8 flex flex-col justify-between flex-1">
                <div>
                  <h3 className="font-jakarta text-2xl sm:text-3xl font-bold text-emerald-700 mb-4">{sede.name}</h3>
                  
                  {/* Address */}
                  <div className="flex items-start gap-2.5 text-slate-600 mb-6">
                    <IconMapPin className="text-emerald-600 w-5 h-5 shrink-0 mt-0.5" />
                    <span className="text-sm font-medium leading-relaxed">{sede.address}</span>
                  </div>

                  {/* Features */}
                  <div className="space-y-3 mb-6">
                    {sede.features.laboratorio && (
                      <div className="flex items-center gap-3 text-slate-600">
                        <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center shrink-0">
                          <IconFlask className="text-emerald-600 w-4 h-4" />
                        </div>
                        <span className="text-xs font-semibold uppercase tracking-wider">Laboratorio</span>
                      </div>
                    )}
                    {sede.features.vacunas && (
                      <div className="flex items-center gap-3 text-slate-600">
                        <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center shrink-0">
                          <IconVaccine className="text-blue-600 w-4 h-4" />
                        </div>
                        <span className="text-xs font-semibold uppercase tracking-wider">Vacunas</span>
                      </div>
                    )}
                    {sede.features.estacionamiento && (
                      <div className="flex items-center gap-3 text-slate-600">
                        <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center shrink-0">
                          <IconParking className="text-indigo-600 w-4 h-4" />
                        </div>
                        <span className="text-xs font-semibold uppercase tracking-wider">Estacionamiento</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Ver Detalles action */}
                <div className="flex items-center gap-2 text-emerald-600 hover:text-emerald-700 font-bold text-xs uppercase tracking-wider cursor-pointer mt-4">
                  <IconEye className="w-5 h-5" />
                  <span>Ver detalles</span>
                </div>
              </div>

              {/* Right Image Wave/Arc mask container */}
              <div className="relative w-full sm:w-[45%] h-48 sm:h-auto overflow-hidden shrink-0">
                <div 
                  className="absolute inset-0 bg-cover bg-center"
                  style={{ 
                    backgroundImage: `url(${sede.image})`,
                  }}
                ></div>
                {/* Brand Overlay logo representation inside clip */}
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-xs px-2.5 py-1 rounded-md border border-slate-100 flex items-center gap-1">
                  <span className="text-[9px] font-extrabold text-slate-800 tracking-tighter">AQUA<span className="text-cerulean">LAB</span></span>
                </div>
              </div>
            </div>

            {/* Bottom Status strip */}
            <div className="px-6 sm:px-8 py-4 border-t border-slate-50 flex items-center justify-end bg-slate-50/30 gap-2">
              <IconClock className="text-emerald-600 w-4 h-4" />
              <span className="text-[11px] font-bold text-slate-500 tracking-wide">{sede.status}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Sedes;
