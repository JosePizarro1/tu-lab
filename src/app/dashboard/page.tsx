"use client";

import React, { useEffect, useState } from 'react';
import { useDashboardContext } from './layout';
import { database, Reactivo, PruebaClinica, MovimientoInventario } from '@/services/db';
import { 
  IconBuilding, 
  IconUsers, 
  IconAlertTriangle, 
  IconCheck, 
  IconFlask, 
  IconClock 
} from '@tabler/icons-react';

export default function ResumenDashboardPage() {
  const { sedeActivaId, sedes } = useDashboardContext();
  const [totalPacientes, setTotalPacientes] = useState<number>(0);
  const [reactivos, setReactivos] = useState<Reactivo[]>([]);
  const [pruebas, setPruebas] = useState<PruebaClinica[]>([]);
  const [movimientos, setMovimientos] = useState<MovimientoInventario[]>([]);

  const sedeActiva = sedes.find(s => s.id === sedeActivaId)?.nombre || sedeActivaId;

  useEffect(() => {
    const load = async () => {
      const p = await database.getPacientes(sedeActivaId);
      const r = await database.getReactivos(sedeActivaId);
      const pr = await database.getPruebas(sedeActivaId);
      const m = await database.getMovimientos();
      setTotalPacientes(p.length);
      setReactivos(r);
      setPruebas(pr);
      setMovimientos(m);
    };
    if (sedeActivaId) load();
  }, [sedeActivaId]);

  const reactivosCriticos = reactivos.filter(r => r.stock <= r.minStock).length;
  const pruebasCompletadas = pruebas.filter(pr => pr.status === 'Completado').length;

  return (
    <div className="space-y-6">
      {/* Tarjetas de Métricas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        
        <div className="bg-white p-6 border border-slate-100 rounded-2xl shadow-xs flex items-center justify-between">
          <div>
            <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">Sede Activa</p>
            <h3 className="font-jakarta text-2xl font-extrabold text-slate-800 mt-1">{sedeActiva}</h3>
          </div>
          <div className="w-12 h-12 bg-sky-50 text-cerulean rounded-xl flex items-center justify-center">
            <IconBuilding className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-6 border border-slate-100 rounded-2xl shadow-xs flex items-center justify-between">
          <div>
            <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">Pacientes Sede</p>
            <h3 className="font-jakarta text-2xl font-extrabold text-slate-800 mt-1">{totalPacientes}</h3>
          </div>
          <div className="w-12 h-12 bg-indigo-50 text-indigo-500 rounded-xl flex items-center justify-center">
            <IconUsers className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-6 border border-slate-100 rounded-2xl shadow-xs flex items-center justify-between">
          <div>
            <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">Alertas de Stock</p>
            <h3 className="font-jakarta text-2xl font-extrabold text-slate-800 mt-1">{reactivosCriticos}</h3>
          </div>
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${reactivosCriticos > 0 ? 'bg-amber-50 text-amber-500 animate-pulse' : 'bg-emerald-50 text-emerald-500'}`}>
            <IconAlertTriangle className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-6 border border-slate-100 rounded-2xl shadow-xs flex items-center justify-between">
          <div>
            <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">Análisis del Día</p>
            <h3 className="font-jakarta text-2xl font-extrabold text-slate-800 mt-1">{pruebasCompletadas} / {pruebas.length}</h3>
          </div>
          <div className="w-12 h-12 bg-emerald-50 text-emerald-500 rounded-xl flex items-center justify-center">
            <IconCheck className="w-6 h-6" />
          </div>
        </div>

      </div>

      {/* Paneles Informativos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Reactivos en Alerta */}
        <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-xs">
          <h3 className="font-jakarta text-sm font-bold text-slate-800 uppercase tracking-wider mb-4 flex items-center gap-2">
            <IconFlask className="text-cerulean w-5 h-5" /> Stock de Reactivos Críticos ({sedeActiva})
          </h3>
          <div className="divide-y divide-slate-50">
            {reactivos.filter(r => r.stock <= r.minStock).length === 0 ? (
              <p className="text-slate-450 text-xs py-4 text-center">Todos los reactivos tienen stock óptimo.</p>
            ) : (
              reactivos.filter(r => r.stock <= r.minStock).map(r => (
                <div key={r.id} className="flex justify-between items-center py-3">
                  <div>
                    <p className="text-xs font-bold text-slate-750">{r.name}</p>
                    <p className="text-[10px] text-slate-400 mt-0.5">Mínimo: {r.minStock} {r.unit}</p>
                  </div>
                  <span className="px-2.5 py-1 bg-amber-50 text-amber-600 rounded-md text-[10px] font-bold">
                    {r.stock} {r.unit}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Últimos Movimientos */}
        <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-xs">
          <h3 className="font-jakarta text-sm font-bold text-slate-800 uppercase tracking-wider mb-4 flex items-center gap-2">
            <IconClock className="text-cerulean w-5 h-5" /> Log de Movimientos de Inventario
          </h3>
          <div className="divide-y divide-slate-50 text-xs">
            {movimientos.slice(0, 5).length === 0 ? (
              <p className="text-slate-450 text-xs py-4 text-center">No se registran movimientos en esta sesión.</p>
            ) : (
              movimientos.slice(0, 5).map(m => (
                <div key={m.id} className="flex justify-between items-center py-3">
                  <div>
                    <p className="font-bold text-slate-750">{m.reactivoId}</p>
                    <p className="text-[10px] text-slate-400 mt-0.5">{m.fecha} - Responsable: {m.responsable}</p>
                  </div>
                  <span className={`px-2 py-0.5 font-bold text-[9px] uppercase rounded-md ${m.tipo === 'Entrada' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                    {m.tipo} (+{m.cantidad})
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
