"use client";

import React, { useState } from 'react';
import Swal from 'sweetalert2';
import { useDashboardContext } from '../layout';
import { database, Sede } from '@/services/db';
import { IconBuilding, IconPlus, IconEdit, IconMapPin, IconPhone } from '@tabler/icons-react';

export default function SedesPage() {
  const { sedes, refreshGlobalData, usuario } = useDashboardContext();
  const [showModal, setShowModal] = useState(false);
  const [editingSede, setEditingSede] = useState<Sede | null>(null);

  const [nombreInput, setNombreInput] = useState('');
  const [direccionInput, setDireccionInput] = useState('');
  const [telefonoInput, setTelefonoInput] = useState('');

  const handleOpenCrearModal = () => {
    setEditingSede(null);
    setNombreInput('');
    setDireccionInput('');
    setTelefonoInput('');
    setShowModal(true);
  };

  const handleOpenEditarModal = (sede: Sede) => {
    setEditingSede(sede);
    setNombreInput(sede.nombre);
    setDireccionInput(sede.direccion || '');
    setTelefonoInput(sede.telefono || '');
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nombreInput.trim()) {
      Swal.fire('Atención', 'El nombre de la sede es obligatorio.', 'warning');
      return;
    }

    if (editingSede) {
      // Editar Sede existente
      const ok = await database.actualizarSede(editingSede.id, {
        nombre: nombreInput,
        direccion: direccionInput,
        telefono: telefonoInput,
      });

      if (ok) {
        Swal.fire('Éxito', 'Sede actualizada correctamente.', 'success');
        setShowModal(false);
        refreshGlobalData();
      } else {
        Swal.fire('Error', 'No se pudo actualizar la sede.', 'error');
      }
    } else {
      // Crear nueva Sede
      const ok = await database.crearSede({
        nombre: nombreInput,
        direccion: direccionInput,
        telefono: telefonoInput,
      });

      if (ok) {
        Swal.fire('Éxito', 'Sede creada correctamente.', 'success');
        setShowModal(false);
        refreshGlobalData();
      } else {
        Swal.fire('Error', 'No se pudo crear la sede.', 'error');
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-xs">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h3 className="font-jakarta text-base font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
              <IconBuilding className="text-cerulean w-5 h-5" /> Administración de Sedes del Laboratorio
            </h3>
            <p className="text-slate-400 text-xs mt-1">Gestión de sedes registradas en la red clínica de UNIDOSLAB</p>
          </div>
          <button
            onClick={handleOpenCrearModal}
            className="px-4 py-2.5 bg-cerulean text-white font-bold uppercase tracking-wider text-[10px] rounded-xl shadow-sm cursor-pointer flex items-center gap-1.5 hover:bg-cerulean/90 transition-colors"
          >
            <IconPlus className="w-4 h-4" /> Nueva Sede
          </button>
        </div>

        {/* Grilla de Sedes */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sedes.map((s) => {
            const queryMap = encodeURIComponent(s.direccion ? `${s.nombre}, ${s.direccion}` : `${s.nombre}, Tacna`);
            const mapsUrl = `https://maps.google.com/maps?q=${queryMap}&t=m&z=15&output=embed`;
            const mapsDirectLink = `https://www.google.com/maps/search/?api=1&query=${queryMap}`;

            return (
              <div 
                key={s.id} 
                className="border border-slate-100 rounded-2xl bg-white hover:border-cerulean/30 hover:shadow-lg transition-all flex flex-col justify-between overflow-hidden"
              >
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="w-10 h-10 bg-sky-50 text-cerulean rounded-xl flex items-center justify-center">
                      <IconBuilding className="w-5 h-5" />
                    </div>
                    <button
                      onClick={() => handleOpenEditarModal(s)}
                      className="p-2 text-slate-400 hover:text-cerulean hover:bg-slate-50 rounded-xl transition-colors cursor-pointer"
                      title="Editar Sede"
                    >
                      <IconEdit className="w-4 h-4" />
                    </button>
                  </div>

                  <h4 className="font-jakarta font-extrabold text-slate-800 text-lg">{s.nombre}</h4>
                  <p className="text-slate-400 text-[10px] font-mono uppercase tracking-wider mt-1">ID: {s.id}</p>

                  <div className="mt-4 space-y-2 text-xs text-slate-600">
                    <div className="flex items-start gap-2">
                      <IconMapPin className="w-4 h-4 text-[#E52320] shrink-0 mt-0.5" />
                      <span className="font-medium">{s.direccion || 'Sin dirección registrada'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <IconPhone className="w-4 h-4 text-slate-400 shrink-0" />
                      <span>{s.telefono || 'Sin teléfono'}</span>
                    </div>
                  </div>
                </div>

                {/* Vista previa Google Maps en vivo */}
                <div className="relative h-36 w-full bg-slate-100 border-t border-b border-slate-100">
                  <iframe 
                    title={`Google Maps ${s.nombre}`}
                    src={mapsUrl}
                    className="absolute inset-0 h-full w-full border-0"
                    loading="lazy"
                  />
                  <a 
                    href={mapsDirectLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="absolute right-3 bottom-3 bg-white/90 hover:bg-white text-slate-800 border border-slate-200 px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider shadow-sm flex items-center gap-1.5 transition-transform hover:scale-105"
                  >
                    <span>Google Maps</span>
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Modal Crear / Editar Sede */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl border border-slate-100">
            <h3 className="font-jakarta text-base font-bold text-slate-800 uppercase tracking-wider mb-6">
              {editingSede ? 'Editar Sede' : 'Registrar Nueva Sede'}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-[10px] uppercase tracking-wider text-slate-400 font-bold mb-2 block">
                  Nombre de Sede *
                </label>
                <input
                  type="text"
                  value={nombreInput}
                  onChange={(e) => setNombreInput(e.target.value)}
                  placeholder="Ej: Sede Tacna / Sede Breña"
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:border-cerulean"
                  required
                />
              </div>

              <div>
                <label className="text-[10px] uppercase tracking-wider text-slate-400 font-bold mb-2 block">
                  Dirección
                </label>
                <input
                  type="text"
                  value={direccionInput}
                  onChange={(e) => setDireccionInput(e.target.value)}
                  placeholder="Av. Bolognesi 123"
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:border-cerulean"
                />
              </div>

              <div>
                <label className="text-[10px] uppercase tracking-wider text-slate-400 font-bold mb-2 block">
                  Teléfono de Contacto
                </label>
                <input
                  type="tel"
                  value={telefonoInput}
                  onChange={(e) => setTelefonoInput(e.target.value)}
                  placeholder="+51 952 920 616"
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:border-cerulean"
                />
              </div>

              <div className="flex gap-2 pt-4 border-t border-slate-100">
                <button
                  type="submit"
                  className="flex-1 py-3 bg-cerulean text-white font-bold uppercase tracking-wider text-xs rounded-xl shadow-md hover:bg-cerulean/90 transition-colors cursor-pointer"
                >
                  {editingSede ? 'Actualizar Sede' : 'Guardar Sede'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="py-3 px-4 border border-slate-200 text-slate-500 rounded-xl text-xs font-semibold hover:bg-slate-50 cursor-pointer"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
