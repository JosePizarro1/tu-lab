"use client";

import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { IconMapPin, IconUsers, IconCar, IconNavigation, IconPlus, IconMinus } from '@tabler/icons-react';

export interface SedeItem {
  id: string;
  number: string;
  name: string;
  address: string;
  badge: string;
  schedule: string;
  lat: number;
  lng: number;
  mapsExternalUrl: string;
}

interface SedesMapProps {
  sedes: SedeItem[];
  selectedSedeIndex: number;
  onSelectSede: (index: number) => void;
}

const SedesMap: React.FC<SedesMapProps> = ({ sedes, selectedSedeIndex, onSelectSede }) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersRef = useRef<L.Marker[]>([]);

  useEffect(() => {
    if (!mapContainerRef.current) return;

    const initialCenter: [number, number] = [
      (sedes[0].lat + sedes[1].lat) / 2,
      (sedes[0].lng + sedes[1].lng) / 2
    ];

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: initialCenter,
        zoom: 16.5,
        minZoom: 11,
        maxZoom: 19,
        zoomControl: false,
        attributionControl: false
      });

      // CartoDB Voyager clean and bright map tiles
      L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
        maxZoom: 19,
        subdomains: 'abcd'
      }).addTo(map);

      mapInstanceRef.current = map;
    }

    const map = mapInstanceRef.current;

    // Función progresiva y suave para calcular tamaño según nivel de zoom
    const getScaleByZoom = (zoom: number) => {
      if (zoom >= 18) return 1.25;
      if (zoom >= 17) return 1.1;
      if (zoom >= 16) return 0.95;
      if (zoom >= 15) return 0.75;
      if (zoom >= 14) return 0.55;
      if (zoom >= 13) return 0.4;
      return 0.28; // Zoom 11-12
    };

    const updateMarkerSizes = () => {
      const zoom = map.getZoom();
      const scale = getScaleByZoom(zoom);

      document.querySelectorAll('.dynamic-sede-marker').forEach((el) => {
        (el as HTMLElement).style.transform = `scale(${scale})`;
      });
      document.querySelectorAll('.dynamic-landmark-marker').forEach((el) => {
        (el as HTMLElement).style.transform = `scale(${scale * 0.95})`;
        if (zoom <= 14) {
          (el as HTMLElement).style.opacity = '0';
          (el as HTMLElement).style.pointerEvents = 'none';
        } else if (zoom === 15) {
          (el as HTMLElement).style.opacity = '0.5';
          (el as HTMLElement).style.pointerEvents = 'auto';
        } else {
          (el as HTMLElement).style.opacity = '1';
          (el as HTMLElement).style.pointerEvents = 'auto';
        }
      });
    };

    map.off('zoomend');
    map.on('zoomend', updateMarkerSizes);

    // Limpiar marcadores anteriores
    markersRef.current.forEach(marker => marker.remove());
    markersRef.current = [];

    const currentScale = getScaleByZoom(map.getZoom());

    // Crear pines de letreros oficiales para cada sede con escalado responsivo al zoom
    sedes.forEach((sede, idx) => {
      const isSelected = selectedSedeIndex === idx;
      const sedeImage = sede.id === 'leguia' || sede.number === '01' 
        ? '/letrero_leguia.webp' 
        : '/letrero_melendez.webp';

      const pinHtml = `
        <div class="dynamic-sede-marker" style="width: 100px; height: 100px; display: flex; flex-direction: column; align-items: center; justify-content: center; position: relative; cursor: pointer; transform: scale(${currentScale}); transform-origin: bottom center; transition: transform 0.25s ease-out; z-index: ${isSelected ? 50 : 20};">
          ${isSelected ? `
            <div style="position: absolute; bottom: 8px; width: 32px; height: 32px; border-radius: 9999px; background-color: rgba(229, 35, 32, 0.45); animation: ping 1.2s cubic-bezier(0, 0, 0.2, 1) infinite; pointer-events: none;"></div>
          ` : ''}
          <img 
            src="${sedeImage}" 
            alt="${sede.name}" 
            style="width: 90px; height: 90px; object-fit: contain; filter: drop-shadow(0 12px 18px rgba(0,0,0,0.35));"
          />
        </div>
      `;

      const customIcon = L.divIcon({
        html: pinHtml,
        className: 'custom-leaflet-marker',
        iconSize: [100, 100],
        iconAnchor: [50, 92]
      });

      const marker = L.marker([sede.lat, sede.lng], { icon: customIcon }).addTo(map);

      // Evento de clic en el pin
      marker.on('click', () => {
        onSelectSede(idx);
      });

      markersRef.current.push(marker);
    });

    // Puntos de Referencia 3D Oficiales de Tacna
    const landmarks = [
      {
        id: 'catedral',
        name: 'Catedral de Tacna',
        lat: -18.0150,
        lng: -70.2522,
        image: '/catedral_3d_tacna.webp'
      },
      {
        id: 'mercado_2_de_mayo',
        name: 'Mercado 2 de Mayo',
        lat: -18.0093013,
        lng: -70.2488438,
        image: '/2_de_mayo.webp'
      }
    ];

    landmarks.forEach((lm) => {
      const landmarkHtml = `
        <div class="dynamic-landmark-marker" style="display: flex; flex-direction: column; align-items: center; cursor: pointer; transform: scale(${currentScale * 0.95}); transform-origin: bottom center; transition: transform 0.25s ease-out, opacity 0.25s ease-out;">
          <div style="margin-bottom: 3px; padding: 2px 8px; border-radius: 9999px; background: rgba(255, 255, 255, 0.95); backdrop-filter: blur(4px); border: 1px solid #cbd5e1; box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);">
            <span style="font-size: 9.5px; font-weight: 800; white-space: nowrap; color: #1e293b;">${lm.name}</span>
          </div>
          <img 
            src="${lm.image}" 
            alt="${lm.name}" 
            style="width: 58px; height: 58px; object-fit: contain; filter: drop-shadow(0 8px 12px rgba(0,0,0,0.2));"
          />
        </div>
      `;

      const landmarkIcon = L.divIcon({
        html: landmarkHtml,
        className: 'custom-landmark-marker',
        iconSize: [120, 90],
        iconAnchor: [60, 78]
      });

      const lmMarker = L.marker([lm.lat, lm.lng], { icon: landmarkIcon }).addTo(map);
      markersRef.current.push(lmMarker);
    });

    // Animar cámara hacia la sede seleccionada
    const targetSede = sedes[selectedSedeIndex];
    if (targetSede) {
      map.flyTo([targetSede.lat, targetSede.lng], 16.5, {
        duration: 1.1,
        easeLinearity: 0.25
      });
    }

  }, [selectedSedeIndex, sedes, onSelectSede]);

  const handleZoomIn = () => {
    if (mapInstanceRef.current) mapInstanceRef.current.zoomIn();
  };

  const handleZoomOut = () => {
    if (mapInstanceRef.current) mapInstanceRef.current.zoomOut();
  };

  const handleRecenter = () => {
    const targetSede = sedes[selectedSedeIndex];
    if (mapInstanceRef.current && targetSede) {
      mapInstanceRef.current.flyTo([targetSede.lat, targetSede.lng], 16.5);
    }
  };

  return (
    <div className="relative w-full h-full min-h-[460px] lg:min-h-[500px] rounded-3xl overflow-hidden shadow-sm border border-slate-200/80 bg-slate-100">
      {/* Contenedor del Mapa Leaflet */}
      <div ref={mapContainerRef} className="w-full h-full absolute inset-0 z-0 bg-slate-100" />

      {/* Controles de Zoom Personalizados (Esquina superior derecha) */}
      <div className="absolute top-4 right-4 z-10 flex flex-col gap-1.5 bg-white/95 backdrop-blur-md rounded-xl p-1 shadow-md border border-slate-200/90">
        <button
          onClick={handleZoomIn}
          title="Acercar mapa"
          className="w-7 h-7 rounded-lg hover:bg-slate-100 text-slate-700 font-bold flex items-center justify-center transition-colors cursor-pointer"
        >
          <IconPlus className="w-4 h-4" />
        </button>
        <div className="h-px bg-slate-200 mx-1"></div>
        <button
          onClick={handleZoomOut}
          title="Alejar mapa"
          className="w-7 h-7 rounded-lg hover:bg-slate-100 text-slate-700 font-bold flex items-center justify-center transition-colors cursor-pointer"
        >
          <IconMinus className="w-4 h-4" />
        </button>
      </div>

      {/* Botón flotante inferior con Icono Oficial 3D de Google Maps */}
      <div className="absolute bottom-4 right-4 z-10">
        <a
          href={sedes[selectedSedeIndex].mapsExternalUrl}
          target="_blank"
          rel="noopener noreferrer"
          title="Abrir ubicación en Google Maps"
          className="w-12 h-12 rounded-2xl bg-white/95 hover:bg-white shadow-xl shadow-slate-900/15 border border-slate-200 flex items-center justify-center transition-all duration-200 hover:scale-105 group cursor-pointer p-2 backdrop-blur-sm"
        >
          <img
            src="/icon_google_maps.webp"
            alt="Google Maps"
            width={28}
            height={28}
            loading="lazy"
            className="w-7 h-7 object-contain transition-transform group-hover:scale-110"
          />
        </a>
      </div>
    </div>
  );
};

export default SedesMap;

