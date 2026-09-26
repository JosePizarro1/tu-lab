"use client";

import React, { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import { useDashboardContext } from '../layout';
import { database, Reactivo, MovimientoInventario } from '@/services/db';
import { IconFlask, IconPlus, IconMinus, IconAlertTriangle, IconShieldLock } from '@tabler/icons-react';
import { hasPermission } from '@/types/roles';

export default function InventarioPage() {
  const { sedeActivaId, sedes, usuario } = useDashboardContext();
  const [reactivos, setReactivos] = useState<Reactivo[]>([]);
  const [movimientos, setMovimientos] = useState<MovimientoInventario[]>([]);
  const [selectedReactivo, setSelectedReactivo] = useState<Reactivo | null>(null);
  const [cantidadInput, setCantidadInput] = useState<number>(1);
  const [tipoMovimiento, setTipoMovimiento] = useState<'Entrada' | 'Salida'>('Entrada');

  const sedeActiva = sedes.find(s => s.id === sedeActivaId)?.nombre || sedeActivaId;

  const loadInventario = async () => {
    const r = await database.getReactivos(sedeActivaId);
    const m = await database.getMovimientos();
    setReactivos(r);
    setMovimientos(m);
  };

  useEffect(() => {
    if (sedeActivaId && hasPermission(usuario?.rol, '/dashboard/inventario')) {
      loadInventario();
    }
  }, [sedeActivaId, usuario?.rol]);

  if (!hasPermission(usuario?.rol, '/dashboard/inventario')) {
    return (
      <div className="bg-white border border-slate-200/80 rounded-3xl p-12 text-center shadow-[0_4px_20px_-4px_rgba(0,0,0,0.03)] font-sans">
        <IconShieldLock className="w-12 h-12 text-amber-500 mx-auto mb-3" />
        <h3 className="font-jakarta text-lg font-extrabold text-slate-900 mb-2">Acceso Restringido</h3>
        <p className="text-slate-500 text-xs max-w-md mx-auto">Tu rol actual ({usuario?.rol || 'Sin Rol'}) no tiene permisos para acceder al módulo de Inventario y Reactivos.</p>
      </div>
    );
  }

  const handleMovimiento = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedReactivo || cantidadInput <= 0) return;

    const ok = await database.registrarMovimientoReactivo(
      sedeActivaId,
      selectedReactivo.id,
      cantidadInput,
      tipoMovimiento
    );

    if (ok) {
      Swal.fire('Éxito', `Movimiento de ${tipoMovimiento} registrado.`, 'success');
      setSelectedReactivo(null);
      setCantidadInput(1);
      loadInventario();
    } else {
      Swal.fire('Error', 'No se pudo registrar el movimiento.', 'error');
    }
  };

  return (
    <div className="space-y-6 font-sans">
      <div className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-7 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.03)]">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h3 className="font-jakarta text-lg font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
              <IconFlask className="text-[#fb5962] w-5 h-5" />
              <span>Inventario de Reactivos y Químicos</span>
            </h3>
            <p className="text-slate-500 text-xs mt-0.5">Control de insumos en Sede {sedeActiva}</p>
          </div>
        </div>

        <div className="border border-slate-200/70 rounded-2xl overflow-x-auto shadow-2xs">
          <table className="w-full text-left text-xs border-collapse min-w-[650px]">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200/70 text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                <th className="py-3.5 px-4">Reactivo / Insumo</th>
                <th className="py-3.5 px-4">Stock Actual</th>
                <th className="py-3.5 px-4">Stock Mínimo</th>
                <th className="py-3.5 px-4">Estado</th>
                <th className="py-3.5 px-4 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {reactivos.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-slate-400">No hay reactivos registrados en esta sede.</td>
                </tr>
              ) : (
                reactivos.map((r) => {
                  const isCritico = r.stock <= r.minStock;
                  return (
                    <tr key={r.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3.5 px-4 font-bold text-slate-900">{r.name}</td>
                      <td className="py-3.5 px-4 font-mono font-bold text-slate-800">{r.stock} {r.unit}</td>
                      <td className="py-3.5 px-4 text-slate-400">{r.minStock} {r.unit}</td>
                      <td className="py-3.5 px-4">
                        <span className={`px-2.5 py-1 text-[9px] font-extrabold uppercase rounded-md flex items-center gap-1 w-fit border ${
                          isCritico ? 'bg-amber-50 text-amber-700 border-amber-200/60 animate-pulse' : 'bg-emerald-50 text-emerald-700 border-emerald-200/60'
                        }`}>
                          {isCritico && <IconAlertTriangle className="w-3 h-3" />}
                          {isCritico ? 'Reabastecer' : 'Óptimo'}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 flex justify-end gap-2">
                        <button
                          onClick={() => {
                            setSelectedReactivo(r);
                            setTipoMovimiento('Entrada');
                          }}
                          className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold text-xs rounded-xl flex items-center gap-1 cursor-pointer border border-emerald-200/60 transition-colors"
                        >
                          <IconPlus className="w-3.5 h-3.5" /> Entrada
                        </button>
                        <button
                          onClick={() => {
                            setSelectedReactivo(r);
                            setTipoMovimiento('Salida');
                          }}
                          className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs rounded-xl flex items-center gap-1 cursor-pointer border border-rose-200/60 transition-colors"
                        >
                          <IconMinus className="w-3.5 h-3.5" /> Salida
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Movimiento de Inventario */}
      {selectedReactivo && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-slate-200/80">
            <h3 className="font-jakarta text-base font-extrabold text-slate-900 mb-1">
              Registrar {tipoMovimiento} de Stock
            </h3>
            <p className="text-slate-500 text-xs mb-5">
              Reactivo: <strong className="text-slate-800">{selectedReactivo.name}</strong> ({selectedReactivo.stock} {selectedReactivo.unit} actuales)
            </p>

            <form onSubmit={handleMovimiento} className="space-y-4">
              <div>
                <label className="text-[10px] uppercase tracking-wider text-slate-400 font-extrabold mb-1.5 block">
                  Cantidad ({selectedReactivo.unit})
                </label>
                <input
                  type="number"
                  min={1}
                  value={cantidadInput}
                  onChange={(e) => setCantidadInput(Number(e.target.value))}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold focus:outline-none focus:border-[#fb5962] focus:bg-white transition-all"
                  required
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  className={`flex-1 py-3 text-white font-bold uppercase tracking-wider text-xs rounded-xl shadow-md cursor-pointer transition-all ${
                    tipoMovimiento === 'Entrada' ? 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-500/20' : 'bg-rose-600 hover:bg-rose-700 shadow-rose-500/20'
                  }`}
                >
                  Confirmar {tipoMovimiento}
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedReactivo(null)}
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
