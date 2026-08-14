"use client";

import React, { useState } from 'react';
import { 
  IconMapPin, 
  IconClock,
  IconBuildingHospital,
  IconBrandGoogleMaps,
  IconArrowUpRight,
  IconNavigation,
  IconPhone,
  IconCopy,
  IconCheck,
  IconLayersSubtract,
  IconZoomIn,
  IconZoomOut,
} from '@tabler/icons-react';

interface Sede {
  id: string;
  code: string;
  name: string;
  address: string;
  reference: string;
  phone: string;
  mapsUrl: string;
  queryLocation: string;
  schedule: string;
  isMain?: boolean;
}

const Sedes: React.FC = () => {
  const sedesData: Sede[] = [
    {
      id: 'leguia',
      code: 'SEDE 01',
      name: 'Avenida Leguía (Principal)',
      address: 'Av. Leguía N° 1230, Tacna',
      reference: 'A 2 cuadras del Óvalo Túpac Amaru',
      phone: '+51 (052) 24-8890 / 952 920 616',
      mapsUrl: 'https://maps.app.goo.gl/HUAqRFnH5PYh8r1q6',
      queryLocation: 'Av. Leguía 1230, Tacna, Perú',
      schedule: 'Lunes a Sábado: 7:00 AM - 7:00 PM | Domingos: 8:00 AM - 1:00 PM',
      isMain: true,
    },
    {
      id: 'melendez',
      code: 'SEDE 02',
      name: 'Patricio Meléndez',
      address: 'Calle Patricio Meléndez N° 845, Tacna',
      reference: 'Frente al Mercado Central de Tacna',
      phone: '+51 (052) 24-1120 / 952 920 616',
      mapsUrl: 'https://maps.app.goo.gl/YY4MkEoko7847tmb9',
      queryLocation: 'Calle Patricio Meléndez 845, Tacna, Perú',
      schedule: 'Lunes a Sábado: 7:00 AM - 7:00 PM',
    },
    {
      id: 'bolognesi',
      code: 'SEDE 03',
      name: 'Avenida Bolognesi',
      address: 'Av. Francisco Bolognesi N° 620, Tacna',
      reference: 'Cerca al Puesto de Salud Bolognesi',
      phone: '+51 (052) 41-3350 / 952 920 616',
      mapsUrl: 'https://maps.google.com/maps?q=Av.+Bolognesi+620%2C+Tacna%2C+Per%C3%BA',
      queryLocation: 'Av. Francisco Bolognesi 620, Tacna, Perú',
      schedule: 'Lunes a Sábado: 7:00 AM - 8:00 PM',
    },
  ];

  const [selectedSede, setSelectedSede] = useState<Sede>(sedesData[0]);
  const [mapType, setMapType] = useState<'m' | 'k'>('m'); // 'm' = mapa, 'k' = satélite
  const [zoomLevel, setZoomLevel] = useState<number>(16);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const embedUrl = `https://maps.google.com/maps?q=${encodeURIComponent(selectedSede.queryLocation)}&t=${mapType}&z=${zoomLevel}&output=embed`;

  const handleCopyAddress = (sede: Sede) => {
    navigator.clipboard.writeText(`${sede.name} - ${sede.address}`);
    setCopiedId(sede.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <section className="min-h-screen w-full bg-slate-50/70 px-4 sm:px-6 lg:px-8 py-12 lg:py-16 font-plex text-slate-700 select-none">
      <div className="mx-auto max-w-7xl">
        {/* Encabezado */}
        <header className="mb-10 text-center">
          <div className="mb-3 inline-flex items-center gap-2 border border-red-100 bg-red-50/80 px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-[0.2em] text-[#E52320]">
            <span className="w-2 h-2 bg-[#E52320] rounded-full animate-ping"></span>
            Ubicación Interactiva & Red de Atención en Tacna
          </div>
          <h2 className="font-jakarta text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-[#1E3A4C]">
            Nuestras Sedes en Tacna
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-xs sm:text-sm font-medium text-slate-500 leading-relaxed">
            Encuentra tu sede más cercana. Selecciona una ubicación para explorar su mapa interactivo en vivo en Google Maps y consultar su horario general de atención.
          </p>
        </header>

        {/* Visor interactivo principal: Tarjetas a la izquierda + Google Maps gigante a la derecha */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 items-start">
          
          {/* Columna Izquierda: Selector de Sedes (5 cols en escritorio) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="flex items-center justify-between px-1 mb-1">
              <span className="text-xs font-extrabold uppercase tracking-widest text-slate-400">
                Selecciona una sede ({sedesData.length})
              </span>
              <span className="text-[11px] font-bold text-[#E52320]">
                Clic para ver en el mapa
              </span>
            </div>

            {sedesData.map((sede) => {
              const isSelected = selectedSede.id === sede.id;
              return (
                <div
                  key={sede.id}
                  onClick={() => setSelectedSede(sede)}
                  className={`group relative cursor-pointer rounded-3xl p-6 transition-all duration-300 border ${
                    isSelected
                      ? 'bg-white border-[#E52320] shadow-xl ring-2 ring-red-500/10'
                      : 'bg-white/80 hover:bg-white border-slate-200 shadow-sm hover:shadow-md hover:border-slate-300'
                  }`}
                >
                  {/* Badge de Sede Principal o Selección */}
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] font-extrabold uppercase tracking-widest px-3 py-1 rounded-full ${
                        isSelected ? 'bg-[#E52320] text-white' : 'bg-slate-100 text-slate-600'
                      }`}>
                        {sede.code}
                      </span>
                      {sede.isMain && (
                        <span className="text-[10px] font-extrabold uppercase tracking-widest bg-amber-100 text-amber-800 px-2.5 py-0.5 rounded-full border border-amber-200">
                          Sede Central
                        </span>
                      )}
                    </div>

                    <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                      isSelected ? 'bg-red-50 text-[#E52320]' : 'bg-slate-100 text-slate-400 group-hover:bg-slate-200 group-hover:text-slate-600'
                    }`}>
                      <IconBuildingHospital className="text-lg" />
                    </div>
                  </div>

                  <h3 className="font-jakarta text-xl font-extrabold text-[#1E3A4C] group-hover:text-[#E52320] transition-colors">
                    {sede.name}
                  </h3>

                  <div className="mt-2.5 flex items-start gap-2 text-slate-600">
                    <IconMapPin className="mt-0.5 shrink-0 text-base text-[#E52320]" />
                    <div>
                      <p className="text-xs font-semibold leading-relaxed text-slate-800">
                        {sede.address}
                      </p>
                      <p className="text-[11px] font-medium text-slate-400">
                        {sede.reference}
                      </p>
                    </div>
                  </div>

                  {/* Horario de Atención General */}
                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-2 text-xs text-slate-600">
                    <IconClock className="text-sm text-[#E52320] shrink-0" />
                    <span className="text-[11px] font-semibold text-slate-700">
                      {sede.schedule}
                    </span>
                  </div>

                  {/* Acciones Rápidas */}
                  <div className="mt-4 flex items-center justify-between gap-2 pt-2 border-t border-slate-50">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCopyAddress(sede);
                      }}
                      className="inline-flex items-center gap-1.5 text-[11px] font-bold text-slate-500 hover:text-slate-800 transition-colors"
                      title="Copiar dirección"
                    >
                      {copiedId === sede.id ? (
                        <>
                          <IconCheck className="text-emerald-600 text-xs" />
                          <span className="text-emerald-600 font-bold">¡Copiado!</span>
                        </>
                      ) : (
                        <>
                          <IconCopy className="text-xs text-slate-400" />
                          <span>Copiar dirección</span>
                        </>
                      )}
                    </button>

                    <a
                      href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(sede.queryLocation)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="inline-flex items-center gap-1.5 bg-[#E52320] hover:bg-red-700 text-white text-[11px] font-extrabold uppercase tracking-wider px-3.5 py-1.5 rounded-full shadow-sm transition-transform active:scale-95"
                    >
                      <span>Cómo llegar</span>
                      <IconNavigation className="text-xs" />
                    </a>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Columna Derecha: Contenedor Google Maps interactivo en vivo (7 cols en escritorio) */}
          <div className="lg:col-span-7 sticky top-6">
            <div className="bg-white border border-slate-200 shadow-2xl rounded-3xl overflow-hidden flex flex-col">
              
              {/* Barra de control del mapa */}
              <div className="bg-[#1E3A4C] px-6 py-4 text-white flex flex-wrap items-center justify-between gap-3 border-b border-slate-700">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#E52320] text-white shadow-md">
                    <IconBrandGoogleMaps className="text-xl" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-red-400 block">
                      Google Maps en Vivo
                    </span>
                    <h4 className="font-jakarta text-base font-extrabold tracking-wide text-white leading-tight">
                      {selectedSede.name}
                    </h4>
                  </div>
                </div>

                {/* Botones de control de tipo de mapa y zoom */}
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setMapType(mapType === 'm' ? 'k' : 'm')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer ${
                      mapType === 'k'
                        ? 'bg-amber-400 text-slate-900 font-extrabold shadow-sm'
                        : 'bg-white/10 hover:bg-white/20 text-white border border-white/15'
                    }`}
                    title="Alternar vista Satélite / Mapa"
                  >
                    <IconLayersSubtract className="text-sm" />
                    <span>{mapType === 'k' ? 'Satélite' : 'Mapa'}</span>
                  </button>

                  <div className="flex items-center bg-white/10 border border-white/15 rounded-xl p-0.5">
                    <button
                      type="button"
                      onClick={() => setZoomLevel((z) => Math.min(z + 1, 19))}
                      className="p-1.5 hover:bg-white/20 rounded-lg text-white transition-colors cursor-pointer"
                      title="Acercar mapa"
                    >
                      <IconZoomIn className="text-sm" />
                    </button>
                    <span className="px-1 text-[10px] font-mono font-bold text-white/80">{zoomLevel}x</span>
                    <button
                      type="button"
                      onClick={() => setZoomLevel((z) => Math.max(z - 1, 12))}
                      className="p-1.5 hover:bg-white/20 rounded-lg text-white transition-colors cursor-pointer"
                      title="Alejar mapa"
                    >
                      <IconZoomOut className="text-sm" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Viewport iframe del mapa de Google */}
              <div className="relative h-[420px] sm:h-[480px] w-full bg-slate-200">
                <iframe
                  key={`${selectedSede.id}-${mapType}-${zoomLevel}`}
                  title={`Mapa interactivo de Google Maps para ${selectedSede.name}`}
                  src={embedUrl}
                  className="absolute inset-0 h-full w-full border-0"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  allowFullScreen
                />

                {/* Badge superpuesto superior en el mapa */}
                <div className="pointer-events-none absolute left-4 top-4 inline-flex items-center gap-2 border border-slate-200/90 bg-white/95 px-3.5 py-1.5 rounded-full text-[10px] font-extrabold uppercase tracking-[0.15em] text-[#1E3A4C] shadow-md backdrop-blur-md">
                  <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
                  Navegación GPS Activa
                </div>

                {/* Botón flotante para abrir directamente en la app de Google Maps */}
                <a
                  href={selectedSede.mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="absolute right-4 bottom-4 bg-white hover:bg-slate-50 text-[#1E3A4C] border border-slate-200 shadow-xl px-4 py-2.5 rounded-2xl text-xs font-extrabold uppercase tracking-wider flex items-center gap-2 transition-transform hover:scale-105"
                >
                  <IconBrandGoogleMaps className="text-lg text-[#E52320]" />
                  <span>Abrir App Google Maps</span>
                  <IconArrowUpRight className="text-xs text-slate-400" />
                </a>
              </div>

              {/* Ficha detallada de la sede seleccionada en la parte inferior */}
              <div className="bg-slate-50 p-6 border-t border-slate-200 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
                  <div>
                    <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#E52320]">
                      Horario General de Atención
                    </span>
                    <h5 className="font-jakarta text-lg font-extrabold text-[#1E3A4C]">
                      {selectedSede.name}
                    </h5>
                    <p className="text-xs font-medium text-slate-600 mt-0.5">
                      {selectedSede.address} • <span className="text-slate-400">{selectedSede.reference}</span>
                    </p>
                  </div>

                  <a
                    href={`https://api.whatsapp.com/send/?phone=51952920616&text=Hola%20UNIDOSLAB,%20deseo%20mayor%20informaci%C3%B3n%20sobre%20la%20${encodeURIComponent(selectedSede.name)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="shrink-0 bg-[#25D366] hover:bg-[#20ba5a] text-white px-4 py-2.5 rounded-2xl font-extrabold uppercase tracking-wider text-xs shadow-sm flex items-center justify-center gap-2 transition-all"
                  >
                    <IconPhone className="text-base" />
                    <span>Contactar Sede</span>
                  </a>
                </div>

                {/* Horario General únicamente */}
                <div className="bg-white p-4 rounded-2xl border border-slate-200 flex items-start gap-3 text-xs">
                  <IconClock className="text-lg text-[#E52320] shrink-0 mt-0.5" />
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                      Horario General de Atención
                    </span>
                    <span className="font-extrabold text-slate-800 leading-relaxed block text-xs sm:text-sm mt-0.5">
                      {selectedSede.schedule}
                    </span>
                  </div>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default Sedes;




