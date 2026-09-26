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
  IconClock,
  IconArrowRight
} from '@tabler/icons-react';
import Link from 'next/link';

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
    <div className="space-y-6 font-sans">
      {/* Tarjetas de Métricas Principales */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        
        {/* Sede Activa */}
        <div className="bg-white p-6 border border-slate-200/80 rounded-3xl shadow-[0_4px_20px_-4px_rgba(0,0,0,0.03)] flex items-center justify-between">
          <div>
            <p className="text-slate-400 text-[10px] font-extrabold uppercase tracking-wider">Sede Seleccionada</p>
            <h3 className="font-jakarta text-xl sm:text-2xl font-extrabold text-slate-900 mt-1">{sedeActiva}</h3>
          </div>
          <div className="w-12 h-12 bg-[#fff0f1] text-[#fb5962] rounded-2xl flex items-center justify-center">
            <IconBuilding className="w-6 h-6" />
          </div>
        </div>

        {/* Pacientes Registrados */}
        <div className="bg-white p-6 border border-slate-200/80 rounded-3xl shadow-[0_4px_20px_-4px_rgba(0,0,0,0.03)] flex items-center justify-between">
          <div>
            <p className="text-slate-400 text-[10px] font-extrabold uppercase tracking-wider">Pacientes de Sede</p>
            <h3 className="font-jakarta text-2xl font-extrabold text-slate-900 mt-1">{totalPacientes}</h3>
          </div>
          <div className="w-12 h-12 bg-slate-100 text-slate-700 rounded-2xl flex items-center justify-center">
            <IconUsers className="w-6 h-6" />
          </div>
        </div>

        {/* Alertas de Stock */}
        <div className="bg-white p-6 border border-slate-200/80 rounded-3xl shadow-[0_4px_20px_-4px_rgba(0,0,0,0.03)] flex items-center justify-between">
          <div>
            <p className="text-slate-400 text-[10px] font-extrabold uppercase tracking-wider">Alertas de Stock</p>
            <h3 className="font-jakarta text-2xl font-extrabold text-slate-900 mt-1">{reactivosCriticos}</h3>
          </div>
          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${reactivosCriticos > 0 ? 'bg-amber-50 text-amber-600 animate-pulse' : 'bg-emerald-50 text-emerald-600'}`}>
            <IconAlertTriangle className="w-6 h-6" />
          </div>
        </div>

        {/* Pruebas Realizadas */}
        <div className="bg-white p-6 border border-slate-200/80 rounded-3xl shadow-[0_4px_20px_-4px_rgba(0,0,0,0.03)] flex items-center justify-between">
          <div>
            <p className="text-slate-400 text-[10px] font-extrabold uppercase tracking-wider">Órdenes Validadas</p>
            <h3 className="font-jakarta text-2xl font-extrabold text-slate-900 mt-1">{pruebasCompletadas} / {pruebas.length}</h3>
          </div>
          <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center">
            <IconCheck className="w-6 h-6 stroke-[2.5]" />
          </div>
        </div>

      </div>

      {/* Paneles Informativos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Reactivos en Alerta */}
        <div className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-7 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.03)]">
          <div className="flex justify-between items-center mb-5 pb-3 border-b border-slate-100">
            <h3 className="font-jakarta text-base font-extrabold text-slate-900 flex items-center gap-2">
              <IconFlask className="text-[#fb5962] w-5 h-5" />
              <span>Stock Crítico de Reactivos</span>
            </h3>
            <Link href="/dashboard/inventario" className="text-xs font-bold text-[#fb5962] hover:underline flex items-center gap-1">
              <span>Ver Inventario</span>
              <IconArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="divide-y divide-slate-100">
            {reactivos.filter(r => r.stock <= r.minStock).length === 0 ? (
              <p className="text-slate-400 text-xs py-8 text-center">Todos los reactivos tienen stock óptimo en esta sede.</p>
            ) : (
              reactivos.filter(r => r.stock <= r.minStock).map(r => (
                <div key={r.id} className="flex justify-between items-center py-3">
                  <div>
                    <p className="text-xs font-bold text-slate-900">{r.name}</p>
                    <p className="text-[10px] text-slate-400">Sede: {r.sede || sedeActiva}</p>
                  </div>
                  <div className="text-right">
                    <span className="inline-block px-2 py-0.5 bg-rose-50 text-rose-600 text-xs font-extrabold rounded-md border border-rose-100 font-mono">
                      {r.stock} {r.unit}
                    </span>
                    <p className="text-[10px] text-slate-400 mt-0.5">Mín: {r.minStock}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Últimos Análisis Registrados */}
        <div className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-7 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.03)]">
          <div className="flex justify-between items-center mb-5 pb-3 border-b border-slate-100">
            <h3 className="font-jakarta text-base font-extrabold text-slate-900 flex items-center gap-2">
              <IconClock className="text-[#fb5962] w-5 h-5" />
              <span>Órdenes Recientes</span>
            </h3>
            <Link href="/dashboard/resultados" className="text-xs font-bold text-[#fb5962] hover:underline flex items-center gap-1">
              <span>Ver Resultados</span>
              <IconArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="divide-y divide-slate-100">
            {pruebas.length === 0 ? (
              <p className="text-slate-400 text-xs py-8 text-center">No hay órdenes recientes registradas.</p>
            ) : (
              pruebas.slice(0, 5).map(p => (
                <div key={p.id} className="flex justify-between items-center py-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-xs text-[#fb5962]">{p.id}</span>
                      <span className="text-xs font-bold text-slate-900">{p.examen}</span>
                    </div>
                    <p className="text-[10px] text-slate-400 mt-0.5 font-mono">DNI: {p.pacienteDni} · {p.fecha}</p>
                  </div>
                  <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 text-[10px] font-extrabold uppercase rounded-md border ${
                    p.status === 'En Proceso'
                      ? 'bg-amber-50 text-amber-700 border-amber-200/60'
                      : 'bg-emerald-50 text-emerald-700 border-emerald-200/60'
                  }`}>
                    {p.status}
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
