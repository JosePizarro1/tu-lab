"use client";

import React, { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import { useDashboardContext } from '../layout';
import { database, Reactivo, MovimientoInventario } from '@/services/db';
import { IconFlask, IconPlus, IconMinus, IconAlertTriangle } from '@tabler/icons-react';

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
    if (sedeActivaId) loadInventario();
  }, [sedeActivaId]);

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
    <div className="space-y-6">
      <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-xs">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h3 className="font-jakarta text-base font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
              <IconFlask className="text-cerulean w-5 h-5" /> Inventario de Reactivos y Químicos
            </h3>
            <p className="text-slate-400 text-xs mt-1">Control de insumos en Sede {sedeActiva}</p>
          </div>
        </div>

        <div className="border border-slate-100 rounded-xl overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse min-w-[650px]">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                <th className="p-4">Reactivo / Insumo</th>
                <th className="p-4">Stock Actual</th>
                <th className="p-4">Stock Mínimo</th>
                <th className="p-4">Estado</th>
                <th className="p-4 text-right">Acciones</th>
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
                    <tr key={r.id} className="hover:bg-slate-50/50">
                      <td className="p-4 font-bold text-slate-800">{r.name}</td>
                      <td className="p-4 font-mono font-bold text-slate-700">{r.stock} {r.unit}</td>
                      <td className="p-4 text-slate-400">{r.minStock} {r.unit}</td>
                      <td className="p-4">
                        <span className={`px-2.5 py-1 text-[9px] font-bold uppercase rounded-md flex items-center gap-1 w-fit ${
                          isCritico ? 'bg-amber-50 text-amber-600 animate-pulse' : 'bg-emerald-50 text-emerald-600'
                        }`}>
                          {isCritico && <IconAlertTriangle className="w-3 h-3" />}
                          {isCritico ? 'Reabastecer' : 'Óptimo'}
                        </span>
                      </td>
                      <td className="p-4 flex justify-end gap-2">
                        <button
                          onClick={() => {
                            setSelectedReactivo(r);
                            setTipoMovimiento('Entrada');
                          }}
                          className="px-2.5 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-600 font-bold text-[10px] uppercase rounded-xl flex items-center gap-1 cursor-pointer"
                        >
                          <IconPlus className="w-3.5 h-3.5" /> Entrada
                        </button>
                        <button
                          onClick={() => {
                            setSelectedReactivo(r);
                            setTipoMovimiento('Salida');
                          }}
                          className="px-2.5 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 font-bold text-[10px] uppercase rounded-xl flex items-center gap-1 cursor-pointer"
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
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl">
            <h3 className="font-jakarta text-base font-bold text-slate-800 uppercase tracking-wider mb-2">
              Registrar {tipoMovimiento} de Stock
            </h3>
            <p className="text-slate-500 text-xs mb-6">
              Reactivo: <strong className="text-slate-800">{selectedReactivo.name}</strong> ({selectedReactivo.stock} {selectedReactivo.unit} actuales)
            </p>

            <form onSubmit={handleMovimiento} className="space-y-4">
              <div>
                <label className="text-[10px] uppercase tracking-wider text-slate-400 font-bold mb-2 block">
                  Cantidad ({selectedReactivo.unit})
                </label>
                <input
                  type="number"
                  min={1}
                  value={cantidadInput}
                  onChange={(e) => setCantidadInput(Number(e.target.value))}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold focus:outline-none focus:border-cerulean"
                  required
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  className={`flex-1 py-3 text-white font-bold uppercase tracking-wider text-xs rounded-xl shadow-md cursor-pointer ${
                    tipoMovimiento === 'Entrada' ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-rose-600 hover:bg-rose-700'
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
