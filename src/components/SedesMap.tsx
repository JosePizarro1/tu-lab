"use client";

import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { IconMapPin, IconClock, IconNavigation } from '@tabler/icons-react';

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

    // Inicializar el mapa centrado en el punto medio de ambas sedes en Tacna
    const initialCenter: [number, number] = [
      (sedes[0].lat + sedes[1].lat) / 2,
      (sedes[0].lng + sedes[1].lng) / 2
    ];

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: initialCenter,
        zoom: 16,
        zoomControl: false,
        attributionControl: false
      });

      // Capa de mapa limpia y moderna (OpenStreetMap CartoDB Voyager / Positron)
      L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
        maxZoom: 19,
        subdomains: 'abcd'
      }).addTo(map);

      // Control de zoom en la esquina superior derecha
      L.control.zoom({ position: 'topright' }).addTo(map);

      mapInstanceRef.current = map;
    }

    const map = mapInstanceRef.current;

    // Limpiar marcadores anteriores
    markersRef.current.forEach(marker => marker.remove());
    markersRef.current = [];

    // Crear pines de letreros oficiales para cada sede (solo imagen con tamaño estricto)
    sedes.forEach((sede, idx) => {
      const isSelected = selectedSedeIndex === idx;
      const sedeImage = sede.id === 'leguia' || sede.number === '01' 
        ? '/letrero_leguia.png' 
        : '/letrero_melendez.png';

      // Icono de solo imagen con efecto de radar y tamaño explícito de 74px
      const pinHtml = `
        <div style="width: 80px; height: 80px; display: flex; flex-direction: column; align-items: center; justify-content: center; position: relative; cursor: pointer; transform: ${isSelected ? 'scale(1.15) translateY(-4px)' : 'scale(0.9)'}; transition: all 0.3s ease;">
          ${isSelected ? `
            <div style="position: absolute; bottom: 8px; width: 28px; height: 28px; border-radius: 9999px; background-color: rgba(255, 90, 95, 0.4); animation: ping 1s cubic-bezier(0, 0, 0.2, 1) infinite; pointer-events: none;"></div>
          ` : ''}
          <img 
            src="${sedeImage}" 
            alt="${sede.name}" 
            style="width: 72px; height: 72px; object-fit: contain; filter: drop-shadow(0 12px 16px rgba(0,0,0,0.35));"
          />
        </div>
      `;

      const customIcon = L.divIcon({
        html: pinHtml,
        className: 'custom-leaflet-marker',
        iconSize: [80, 80],
        iconAnchor: [40, 70]
      });

      const marker = L.marker([sede.lat, sede.lng], { icon: customIcon }).addTo(map);

      // Evento de clic en el pin
      marker.on('click', () => {
        onSelectSede(idx);
      });

      markersRef.current.push(marker);
    });

    // Puntos de Referencia 3D Oficiales de Tacna (Catedral y Mercado 2 de Mayo)
    const landmarks = [
      {
        id: 'catedral',
        name: 'Catedral de Tacna',
        lat: -18.0150,
        lng: -70.2522,
        image: '/catedral_3d_tacna.png'
      },
      {
        id: 'mercado_2_de_mayo',
        name: 'Mercado 2 de Mayo',
        lat: -18.0093013,
        lng: -70.2488438,
        image: '/2_de_mayo.png'
      }
    ];

    landmarks.forEach((lm) => {
      const landmarkHtml = `
        <div style="display: flex; flex-direction: column; align-items: center; cursor: pointer; transition: transform 0.2s ease;">
          <div style="margin-bottom: 3px; padding: 2px 8px; border-radius: 9999px; background: rgba(255, 255, 255, 0.95); backdrop-filter: blur(6px); border: 1px solid #cbd5e1; box-shadow: 0 2px 5px rgba(0, 0, 0, 0.08);">
            <span style="font-size: 9.5px; font-weight: 800; white-space: nowrap; color: #334155; letter-spacing: -0.01em;">${lm.name}</span>
          </div>
          <img 
            src="${lm.image}" 
            alt="${lm.name}" 
            style="width: 48px; height: 48px; object-fit: contain; filter: drop-shadow(0 6px 10px rgba(0,0,0,0.2));"
          />
        </div>
      `;

      const landmarkIcon = L.divIcon({
        html: landmarkHtml,
        className: 'custom-landmark-marker',
        iconSize: [120, 70],
        iconAnchor: [60, 60]
      });

      const lmMarker = L.marker([lm.lat, lm.lng], { icon: landmarkIcon }).addTo(map);
      markersRef.current.push(lmMarker);
    });

    // Animar la cámara hacia la sede seleccionada con suavidad (FlyTo)
    const targetSede = sedes[selectedSedeIndex];
    if (targetSede) {
      map.flyTo([targetSede.lat, targetSede.lng], 16.5, {
        duration: 1.1,
        easeLinearity: 0.25
      });
    }

  }, [selectedSedeIndex, sedes, onSelectSede]);

  return (
    <div className="relative w-full h-full min-h-[440px] lg:min-h-[500px] rounded-3xl overflow-hidden shadow-xl border-2 border-white">
      {/* Contenedor del Mapa Leaflet */}
      <div ref={mapContainerRef} className="w-full h-full absolute inset-0 z-0 bg-slate-100" />

      {/* Botón flotante inferior con Icono Oficial 3D de Google Maps */}
      <div className="absolute bottom-4 right-4 z-10">
        <a
          href={sedes[selectedSedeIndex].mapsExternalUrl}
          target="_blank"
          rel="noopener noreferrer"
          title="Abrir ubicación en Google Maps"
          className="w-13 h-13 rounded-2xl bg-white/95 hover:bg-white shadow-2xl shadow-slate-900/20 border border-slate-200/80 flex items-center justify-center transition-all duration-200 hover:scale-110 group cursor-pointer p-2"
        >
          <img
            src="/icon_google_maps.png"
            alt="Google Maps"
            className="w-8 h-8 object-contain transition-transform group-hover:scale-110"
          />
        </a>
      </div>
    </div>
  );
};

export default SedesMap;
