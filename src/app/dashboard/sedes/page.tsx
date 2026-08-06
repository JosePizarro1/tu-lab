"use client";

import React, { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import { useDashboardContext } from '../layout';
import { database, Sede } from '@/services/db';
import { IconBuilding, IconPlus } from '@tabler/icons-react';

export default function SedesPage() {
  const { sedes, refreshGlobalData, usuario } = useDashboardContext();
  const [showModal, setShowModal] = useState(false);
  const [nombreInput, setNombreInput] = useState('');
  const [direccionInput, setDireccionInput] = useState('');
  const [telefonoInput, setTelefonoInput] = useState('');

  const handleCrearSede = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nombreInput) return;

    const ok = await database.crearSede({
      nombre: nombreInput,
      direccion: direccionInput,
      telefono: telefonoInput,
    });

    if (ok) {
      Swal.fire('Éxito', 'Sede creada correctamente.', 'success');
      setShowModal(false);
      setNombreInput('');
      setDireccionInput('');
      setTelefonoInput('');
      refreshGlobalData();
    } else {
      Swal.fire('Error', 'No se pudo crear la sede.', 'error');
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
            <p className="text-slate-400 text-xs mt-1">Sedes registradas en la red clínica</p>
          </div>
          {usuario?.rol === 'Administrador' && (
            <button
              onClick={() => setShowModal(true)}
              className="px-4 py-2.5 bg-cerulean text-white font-bold uppercase tracking-wider text-[10px] rounded-xl shadow-sm cursor-pointer flex items-center gap-1.5"
            >
              <IconPlus className="w-4 h-4" /> Nueva Sede
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sedes.map((s) => (
            <div key={s.id} className="border border-slate-100 rounded-2xl p-6 hover:shadow-md transition-shadow">
              <div className="w-10 h-10 bg-sky-50 text-cerulean rounded-xl flex items-center justify-center mb-4">
                <IconBuilding className="w-5 h-5" />
              </div>
              <h4 className="font-jakarta font-bold text-slate-800 text-lg">{s.nombre}</h4>
              <p className="text-slate-400 text-xs font-mono mt-1">ID: {s.id}</p>
              <div className="mt-4 pt-4 border-t border-slate-50 space-y-1 text-xs text-slate-600">
                <p>📍 {s.direccion || 'Sin dirección registrada'}</p>
                <p>📞 {s.telefono || 'Sin teléfono'}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl">
            <h3 className="font-jakarta text-base font-bold text-slate-800 uppercase tracking-wider mb-6">
              Registrar Nueva Sede
            </h3>

            <form onSubmit={handleCrearSede} className="space-y-4">
              <div>
                <label className="text-[10px] uppercase tracking-wider text-slate-400 font-bold mb-2 block">
                  Nombre de Sede
                </label>
                <input
                  type="text"
                  value={nombreInput}
                  onChange={(e) => setNombreInput(e.target.value)}
                  placeholder="Ej: Sede Miraflores"
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold focus:outline-none focus:border-cerulean"
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
                  placeholder="Av. Principal 123"
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold focus:outline-none focus:border-cerulean"
                />
              </div>

              <div>
                <label className="text-[10px] uppercase tracking-wider text-slate-400 font-bold mb-2 block">
                  Teléfono
                </label>
                <input
                  type="tel"
                  value={telefonoInput}
                  onChange={(e) => setTelefonoInput(e.target.value)}
                  placeholder="01 222 3333"
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold focus:outline-none focus:border-cerulean"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  className="flex-1 py-3 bg-cerulean text-white font-bold uppercase tracking-wider text-xs rounded-xl shadow-md cursor-pointer"
                >
                  Guardar Sede
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
