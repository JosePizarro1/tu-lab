"use client";

import React, { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import { useDashboardContext } from '../layout';
import { database, PruebaClinica } from '@/services/db';
import { IconSearch, IconPrinter } from '@tabler/icons-react';

export default function ResultadosPage() {
  const { sedeActivaId, sedes } = useDashboardContext();
  const [pruebas, setPruebas] = useState<PruebaClinica[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [filterQuery, setFilterQuery] = useState('');
  const [selectedPruebaForModal, setSelectedPruebaForModal] = useState<PruebaClinica | null>(null);
  const [resultadoInput, setResultadoInput] = useState('');

  const sedeActiva = sedes.find((s) => s.id === sedeActivaId)?.nombre || sedeActivaId;

  const loadPruebas = async () => {
    setLoading(true);
    const list = await database.getPruebas(sedeActivaId);
    setPruebas(list);
    setLoading(false);
  };

  useEffect(() => {
    if (sedeActivaId) loadPruebas();
  }, [sedeActivaId]);

  const handleSubirResultado = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPruebaForModal || !resultadoInput) return;

    const ok = await database.actualizarEstadoPrueba(
      selectedPruebaForModal.id,
      'Completado',
      resultadoInput
    );

    if (ok) {
      Swal.fire('Éxito', 'Resultado registrado correctamente.', 'success');
      setSelectedPruebaForModal(null);
      setResultadoInput('');
      loadPruebas();
    } else {
      Swal.fire('Error', 'No se pudo registrar el resultado.', 'error');
    }
  };

  return (
    <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-xs">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h3 className="font-jakarta text-base font-bold text-slate-800 uppercase tracking-wider">
            Gestión de Resultados Clínicos
          </h3>
          <p className="text-slate-400 text-xs mt-1">Análisis asignados en la sede: {sedeActiva}</p>
        </div>

        <div className="w-full sm:w-64 relative">
          <input
            type="text"
            placeholder="Filtrar por DNI..."
            value={filterQuery}
            onChange={(e) => setFilterQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 font-medium text-xs focus:outline-none focus:border-cerulean focus:bg-white transition-all"
          />
          <IconSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
        </div>
      </div>

      {/* Tabla de Resultados */}
      <div className="border border-slate-100 rounded-xl overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse min-w-[750px]">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-100 text-[10px] font-bold uppercase tracking-wider text-slate-500">
              <th className="p-4">Código Orden</th>
              <th className="p-4">Paciente DNI</th>
              <th className="p-4">Análisis</th>
              <th className="p-4">Fecha</th>
              <th className="p-4">Estado</th>
              <th className="p-4">Resultado Obtenido</th>
              <th className="p-4 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-700">
            {loading ? (
              <tr>
                <td colSpan={7} className="p-12 text-center text-slate-400">
                  <div className="flex flex-col items-center justify-center">
                    <div className="w-8 h-8 border-3 border-cerulean border-t-transparent rounded-full animate-spin mb-3"></div>
                    <p className="text-xs font-semibold text-slate-500">Cargando resultados de la sede...</p>
                  </div>
                </td>
              </tr>
            ) : pruebas.filter((p) => p.pacienteDni.includes(filterQuery)).length === 0 ? (
              <tr>
                <td colSpan={7} className="p-8 text-center text-slate-400">
                  No se encontraron órdenes registradas en esta sede.
                </td>
              </tr>
            ) : (
              pruebas
                .filter((p) => p.pacienteDni.includes(filterQuery))
                .map((prueba) => {
                  const isProcess = prueba.status === 'En Proceso';
                  return (
                    <tr key={prueba.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="p-4 font-mono font-bold text-slate-500">{prueba.id}</td>
                      <td className="p-4 font-bold text-slate-800">{prueba.pacienteDni}</td>
                      <td className="p-4 font-bold text-slate-700">{prueba.examen}</td>
                      <td className="p-4 text-slate-400">{prueba.fecha}</td>
                      <td className="p-4">
                        <span
                          className={`px-2.5 py-1 text-[9px] font-bold uppercase rounded-md ${
                            isProcess
                              ? 'bg-amber-50 text-amber-600 animate-pulse'
                              : 'bg-emerald-50 text-emerald-600'
                          }`}
                        >
                          {prueba.status}
                        </span>
                      </td>
                      <td className="p-4 text-slate-600 font-semibold">
                        {prueba.resultado || 'Pendiente'}
                      </td>
                      <td className="p-4 flex justify-end gap-2">
                        {isProcess ? (
                          <>
                            <button
                              onClick={() => {
                                setSelectedPruebaForModal(prueba);
                                setResultadoInput('');
                              }}
                              className="px-3 py-1.5 bg-cerulean text-white font-bold text-[10px] uppercase rounded-xl cursor-pointer"
                            >
                              Cargar Resultado
                            </button>
                            <button
                              onClick={() => {
                                Swal.fire({
                                  title: '¿Cancelar Orden Pendiente?',
                                  text: `Se eliminará la orden ${prueba.id} (${prueba.examen}). Esta acción no se puede deshacer.`,
                                  icon: 'warning',
                                  showCancelButton: true,
                                  confirmButtonColor: '#e11d48',
                                  cancelButtonColor: '#94a3b8',
                                  confirmButtonText: 'Sí, cancelar orden',
                                  cancelButtonText: 'Volver',
                                }).then(async (result) => {
                                  if (result.isConfirmed) {
                                    const res = await database.eliminarPrueba(prueba.id);
                                    if (res.ok) {
                                      Swal.fire('Orden Cancelada', 'La prueba pendiente ha sido eliminada.', 'success');
                                      loadPruebas();
                                    } else {
                                      Swal.fire('Error', res.error || 'No se pudo eliminar la orden.', 'error');
                                    }
                                  }
                                });
                              }}
                              className="px-2.5 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 font-bold text-[10px] uppercase rounded-xl cursor-pointer"
                            >
                              Eliminar
                            </button>
                          </>
                        ) : (
                          <button
                            onClick={() => {
                              Swal.fire({
                                title: 'Imprimiendo Reporte',
                                text: `Se ha enviado el documento de ${prueba.examen} a la cola de impresión.`,
                                icon: 'info',
                                timer: 2000,
                                showConfirmButton: false,
                              });
                            }}
                            className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl cursor-pointer"
                            title="Imprimir Reporte"
                          >
                            <IconPrinter className="w-4 h-4" />
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })
            )}
          </tbody>
        </table>
      </div>

      {/* Modal Manual de Carga de Resultado */}
      {selectedPruebaForModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl">
            <h3 className="font-jakarta text-base font-bold text-slate-800 uppercase tracking-wider mb-2">
              Ingreso de Resultado Analítico
            </h3>
            <p className="text-slate-500 text-xs mb-6">
              Orden: <strong className="font-mono text-cerulean">{selectedPruebaForModal.id}</strong> | Examen: {selectedPruebaForModal.examen}
            </p>

            <form onSubmit={handleSubirResultado} className="space-y-4">
              <div>
                <label className="text-[10px] uppercase tracking-wider text-slate-400 font-bold mb-2 block">
                  Valor / Resultado Obtenido
                </label>
                <input
                  type="text"
                  value={resultadoInput}
                  onChange={(e) => setResultadoInput(e.target.value)}
                  placeholder="Ej: 3.45 ng/mL"
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold focus:outline-none focus:border-cerulean focus:bg-white"
                  required
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  className="flex-1 py-3 bg-cerulean text-white font-bold uppercase tracking-wider text-xs rounded-xl shadow-md cursor-pointer"
                >
                  Guardar Resultado
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedPruebaForModal(null)}
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
