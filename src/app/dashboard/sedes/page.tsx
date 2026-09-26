"use client";

import React, { useState } from 'react';
import Swal from 'sweetalert2';
import { useDashboardContext } from '../layout';
import { database, Sede } from '@/services/db';
import { IconBuilding, IconPlus, IconEdit, IconMapPin, IconPhone, IconShieldLock } from '@tabler/icons-react';
import { hasPermission } from '@/types/roles';

export default function SedesPage() {
  const { sedes, refreshGlobalData, usuario } = useDashboardContext();
  const [showModal, setShowModal] = useState(false);
  const [editingSede, setEditingSede] = useState<Sede | null>(null);

  const [nombreInput, setNombreInput] = useState('');
  const [direccionInput, setDireccionInput] = useState('');
  const [telefonoInput, setTelefonoInput] = useState('');

  if (!hasPermission(usuario?.rol, '/dashboard/sedes')) {
    return (
      <div className="bg-white border border-slate-200/80 rounded-3xl p-12 text-center shadow-[0_4px_20px_-4px_rgba(0,0,0,0.03)] font-sans">
        <IconShieldLock className="w-12 h-12 text-amber-500 mx-auto mb-3" />
        <h3 className="font-jakarta text-lg font-extrabold text-slate-900 mb-2">Acceso Restringido</h3>
        <p className="text-slate-500 text-xs max-w-md mx-auto">Tu rol actual ({usuario?.rol || 'Sin Rol'}) no tiene permisos para acceder a la gestión de Sedes.</p>
      </div>
    );
  }

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
    <div className="space-y-6 font-sans">
      <div className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-7 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.03)]">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div>
            <h3 className="font-jakarta text-lg font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
              <IconBuilding className="text-[#fb5962] w-5 h-5" />
              <span>Administración de Sedes del Laboratorio</span>
            </h3>
            <p className="text-slate-500 text-xs mt-0.5">Gestión de sedes registradas en la red clínica de UNIDOSLAB</p>
          </div>
          <button
            onClick={handleOpenCrearModal}
            className="px-3.5 py-2 bg-[#fb5962] hover:bg-[#e54550] text-white font-bold text-xs rounded-xl shadow-md shadow-rose-500/20 transition-all flex items-center gap-1.5 cursor-pointer shrink-0"
          >
            <IconPlus className="w-4 h-4" />
            <span>Nueva Sede</span>
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
                className="border border-slate-200/80 rounded-3xl bg-white hover:border-[#fb5962]/40 hover:shadow-lg transition-all flex flex-col justify-between overflow-hidden shadow-2xs"
              >
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="w-10 h-10 bg-[#fff0f1] text-[#fb5962] rounded-2xl flex items-center justify-center">
                      <IconBuilding className="w-5 h-5" />
                    </div>
                    <button
                      onClick={() => handleOpenEditarModal(s)}
                      className="p-2 text-slate-400 hover:text-[#fb5962] hover:bg-[#fff0f1] rounded-xl transition-colors cursor-pointer"
                      title="Editar Sede"
                    >
                      <IconEdit className="w-4 h-4" />
                    </button>
                  </div>

                  <h4 className="font-jakarta font-extrabold text-slate-900 text-lg">{s.nombre}</h4>
                  <p className="text-slate-400 text-[10px] font-mono uppercase tracking-wider mt-1">ID: {s.id}</p>

                  <div className="mt-4 space-y-2 text-xs text-slate-600">
                    <div className="flex items-start gap-2">
                      <IconMapPin className="w-4 h-4 text-[#fb5962] shrink-0 mt-0.5" />
                      <span className="font-medium">{s.direccion || 'Sin dirección registrada'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <IconPhone className="w-4 h-4 text-slate-400 shrink-0" />
                      <span>{s.telefono || 'Sin teléfono'}</span>
                    </div>
                  </div>
                </div>

                {/* Vista previa Google Maps */}
                <div className="relative h-36 w-full bg-slate-100 border-t border-slate-100">
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
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl p-6 sm:p-7 max-w-md w-full shadow-2xl border border-slate-200/80">
            <h3 className="font-jakarta text-base font-extrabold text-slate-900 mb-5">
              {editingSede ? 'Editar Sede' : 'Registrar Nueva Sede'}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-[10px] uppercase tracking-wider text-slate-400 font-extrabold mb-1.5 block">
                  Nombre de Sede *
                </label>
                <input
                  type="text"
                  value={nombreInput}
                  onChange={(e) => setNombreInput(e.target.value)}
                  placeholder="Ej: Sede Cono Sur"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:border-[#fb5962] focus:bg-white transition-all"
                  required
                />
              </div>

              <div>
                <label className="text-[10px] uppercase tracking-wider text-slate-400 font-extrabold mb-1.5 block">
                  Dirección
                </label>
                <input
                  type="text"
                  value={direccionInput}
                  onChange={(e) => setDireccionInput(e.target.value)}
                  placeholder="Ej: Av. Manuel A. Odría 1234"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:border-[#fb5962] focus:bg-white transition-all"
                />
              </div>

              <div>
                <label className="text-[10px] uppercase tracking-wider text-slate-400 font-extrabold mb-1.5 block">
                  Teléfono / Contacto
                </label>
                <input
                  type="text"
                  value={telefonoInput}
                  onChange={(e) => setTelefonoInput(e.target.value)}
                  placeholder="Ej: (052) 60-1234"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:border-[#fb5962] focus:bg-white transition-all"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  className="flex-1 py-3 bg-[#fb5962] hover:bg-[#e54550] text-white font-bold uppercase tracking-wider text-xs rounded-xl shadow-md shadow-rose-500/20 transition-all cursor-pointer"
                >
                  {editingSede ? 'Guardar Cambios' : 'Crear Sede'}
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
