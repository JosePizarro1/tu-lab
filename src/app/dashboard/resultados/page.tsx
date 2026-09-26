"use client";

import React, { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import { useDashboardContext } from '../layout';
import { database, PruebaClinica, Paciente } from '@/services/db';
import { 
  IconSearch, 
  IconEye, 
  IconFlask, 
  IconCheck, 
  IconClock, 
  IconTrash, 
  IconEdit,
  IconX,
  IconDownload
} from '@tabler/icons-react';
import { getExamenByIdOrName, ParametroExamen } from '@/lib/catalogExamenes';
import { ReportPreview } from '@/components/ReportPreview';
import { downloadReportPDF, parseResultadosMap } from '@/lib/reportGenerator';

export default function ResultadosPage() {
  const { sedeActivaId, sedes } = useDashboardContext();
  const [pruebas, setPruebas] = useState<PruebaClinica[]>([]);
  const [pacientesMap, setPacientesMap] = useState<Record<string, Paciente>>({});
  const [loading, setLoading] = useState<boolean>(true);
  const [filterQuery, setFilterQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'ALL' | 'En Proceso' | 'Completado'>('ALL');

  // Modal de Carga de Resultados (Split-Screen)
  const [selectedPruebaForCapture, setSelectedPruebaForCapture] = useState<PruebaClinica | null>(null);
  const [formDataResultados, setFormDataResultados] = useState<Record<string, string>>({});

  // Modal de Previsualización / Impresión
  const [previewPrueba, setPreviewPrueba] = useState<PruebaClinica | null>(null);

  const sedeActiva = sedes.find((s) => s.id === sedeActivaId)?.nombre || sedeActivaId;

  const loadData = async () => {
    setLoading(true);
    const [listPruebas, listPacientes] = await Promise.all([
      database.getPruebas(sedeActivaId),
      database.getPacientes(sedeActivaId),
    ]);

    setPruebas(listPruebas);

    const map: Record<string, Paciente> = {};
    listPacientes.forEach((p) => {
      map[p.dni] = p;
    });
    setPacientesMap(map);
    setLoading(false);
  };

  useEffect(() => {
    if (sedeActivaId) loadData();
  }, [sedeActivaId]);

  const handleOpenCapture = (prueba: PruebaClinica) => {
    setSelectedPruebaForCapture(prueba);
    const existingMap = parseResultadosMap(prueba.resultado);
    const examenDef = getExamenByIdOrName(prueba.examen);

    if (examenDef) {
      const initial: Record<string, string> = {};
      examenDef.parametros.forEach((p) => {
        initial[p.id] = existingMap[p.id] || (p.opciones ? p.opciones[0] : '');
      });
      if (existingMap['default_val'] && examenDef.parametros.length > 0) {
        initial[examenDef.parametros[0].id] = existingMap['default_val'];
      }
      setFormDataResultados(initial);
    } else {
      setFormDataResultados(existingMap);
    }
  };

  const handleInputChange = (paramId: string, val: string) => {
    setFormDataResultados((prev) => ({
      ...prev,
      [paramId]: val,
    }));
  };

  const handleGuardarResultados = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPruebaForCapture) return;

    const jsonString = JSON.stringify(formDataResultados);

    const ok = await database.actualizarEstadoPrueba(
      selectedPruebaForCapture.id,
      'Completado',
      jsonString
    );

    if (ok) {
      Swal.fire({
        title: 'Resultado Validado',
        text: 'Los valores analíticos se registraron correctamente en el sistema.',
        icon: 'success',
        timer: 1600,
        showConfirmButton: false,
      });
      setSelectedPruebaForCapture(null);
      setFormDataResultados({});
      loadData();
    } else {
      Swal.fire('Error', 'No se pudo guardar el resultado.', 'error');
    }
  };

  const handleEliminarOrden = (prueba: PruebaClinica) => {
    Swal.fire({
      title: '¿Cancelar Orden?',
      text: `Se eliminará la orden ${prueba.id} (${prueba.examen}). Esta acción no se puede deshacer.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#e11d48',
      cancelButtonColor: '#94a3b8',
      confirmButtonText: 'Sí, cancelar',
      cancelButtonText: 'Volver',
    }).then(async (result) => {
      if (result.isConfirmed) {
        const res = await database.eliminarPrueba(prueba.id);
        if (res.ok) {
          Swal.fire('Orden Cancelada', 'La prueba ha sido eliminada.', 'success');
          loadData();
        } else {
          Swal.fire('Error', res.error || 'No se pudo cancelar la orden.', 'error');
        }
      }
    });
  };

  const filteredPruebas = pruebas.filter((p) => {
    const paciente = pacientesMap[p.pacienteDni];
    const q = filterQuery.toLowerCase().trim();
    const matchesQuery = (
      p.pacienteDni.includes(q) ||
      p.id.toLowerCase().includes(q) ||
      p.examen.toLowerCase().includes(q) ||
      (paciente && `${paciente.nombre} ${paciente.apellido}`.toLowerCase().includes(q))
    );
    const matchesStatus = filterStatus === 'ALL' || p.status === filterStatus;
    return matchesQuery && matchesStatus;
  });

  const totalCompletados = pruebas.filter((p) => p.status === 'Completado').length;
  const totalEnProceso = pruebas.filter((p) => p.status === 'En Proceso').length;

  return (
    <div className="space-y-6 font-sans">
      {/* Header & Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.03)] flex items-center justify-between">
          <div>
            <p className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400">
              Total de Órdenes
            </p>
            <h4 className="text-2xl font-extrabold text-slate-900 mt-1">
              {pruebas.length}
            </h4>
          </div>
          <div className="w-11 h-11 rounded-2xl bg-[#fff0f1] text-[#fb5962] flex items-center justify-center">
            <IconFlask className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.03)] flex items-center justify-between">
          <div>
            <p className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400">
              En Proceso / Pendientes
            </p>
            <h4 className="text-2xl font-extrabold text-amber-600 mt-1">
              {totalEnProceso}
            </h4>
          </div>
          <div className="w-11 h-11 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <IconClock className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.03)] flex items-center justify-between">
          <div>
            <p className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400">
              Informes Validados
            </p>
            <h4 className="text-2xl font-extrabold text-emerald-600 mt-1">
              {totalCompletados}
            </h4>
          </div>
          <div className="w-11 h-11 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <IconCheck className="w-5 h-5 stroke-[2.5]" />
          </div>
        </div>
      </div>

      {/* Main Table Card */}
      <div className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-7 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.03)]">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6">
          <div>
            <h3 className="font-jakarta text-lg font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
              Gestión de Resultados Clínicos
            </h3>
            <p className="text-slate-500 text-xs mt-0.5">
              Análisis y emisión de informes oficiales en Sede {sedeActiva}
            </p>
          </div>

          {/* Search & Status Filters */}
          <div className="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto">
            {/* Filter Pills */}
            <div className="bg-slate-100/70 p-1 rounded-xl flex items-center gap-1 w-full sm:w-auto">
              <button
                type="button"
                onClick={() => setFilterStatus('ALL')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  filterStatus === 'ALL'
                    ? 'bg-white text-slate-900 shadow-2xs'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                Todos ({pruebas.length})
              </button>
              <button
                type="button"
                onClick={() => setFilterStatus('En Proceso')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  filterStatus === 'En Proceso'
                    ? 'bg-white text-amber-600 shadow-2xs'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                Pendientes ({totalEnProceso})
              </button>
              <button
                type="button"
                onClick={() => setFilterStatus('Completado')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  filterStatus === 'Completado'
                    ? 'bg-white text-emerald-600 shadow-2xs'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                Validados ({totalCompletados})
              </button>
            </div>

            {/* Search Input */}
            <div className="w-full sm:w-64 relative">
              <input
                type="text"
                placeholder="Buscar por DNI, paciente..."
                value={filterQuery}
                onChange={(e) => setFilterQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200/80 rounded-xl text-slate-800 font-medium text-xs focus:outline-none focus:border-[#fb5962] focus:bg-white transition-all placeholder:text-slate-400"
              />
              <IconSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
            </div>
          </div>
        </div>

        {/* Tabla de Órdenes */}
        <div className="border border-slate-200/70 rounded-2xl overflow-x-auto shadow-2xs">
          <table className="w-full text-left text-xs border-collapse min-w-[850px]">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200/70 text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                <th className="py-3.5 px-5">Código Orden</th>
                <th className="py-3.5 px-5">Paciente</th>
                <th className="py-3.5 px-5">Examen Clínico</th>
                <th className="py-3.5 px-5">Fecha</th>
                <th className="py-3.5 px-5">Estado</th>
                <th className="py-3.5 px-5 text-right">Acciones & Informe</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {loading ? (
                <tr>
                  <td colSpan={6} className="p-12 text-center text-slate-400">
                    <div className="flex flex-col items-center justify-center">
                      <div className="w-8 h-8 border-3 border-[#fb5962] border-t-transparent rounded-full animate-spin mb-3"></div>
                      <p className="text-xs font-semibold text-slate-500">Cargando resultados de la sede...</p>
                    </div>
                  </td>
                </tr>
              ) : filteredPruebas.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-10 text-center text-slate-400">
                    No se encontraron órdenes registradas en esta sede con el filtro aplicado.
                  </td>
                </tr>
              ) : (
                filteredPruebas.map((prueba) => {
                  const isProcess = prueba.status === 'En Proceso';
                  const paciente = pacientesMap[prueba.pacienteDni];
                  const nombrePaciente = paciente ? `${paciente.nombre} ${paciente.apellido}` : 'Sin Registro';

                  return (
                    <tr key={prueba.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-4 px-5 font-mono font-bold text-slate-900">
                        {prueba.id}
                      </td>
                      <td className="py-4 px-5">
                        <p className="font-bold text-slate-900 text-xs">{nombrePaciente}</p>
                        <p className="font-mono text-[11px] text-slate-400">DNI: {prueba.pacienteDni}</p>
                      </td>
                      <td className="py-4 px-5">
                        <span className="font-semibold text-slate-800 block text-xs">{prueba.examen}</span>
                        <span className="text-[10px] font-extrabold text-[#fb5962] uppercase">
                          {getExamenByIdOrName(prueba.examen)?.categoria || 'CLÍNICO'}
                        </span>
                      </td>
                      <td className="py-4 px-5 font-medium text-slate-500">
                        {prueba.fecha}
                      </td>
                      <td className="py-4 px-5">
                        <span
                          className={`inline-flex items-center gap-1.5 px-3 py-1 text-[10px] font-extrabold uppercase rounded-lg tracking-wider border ${
                            isProcess
                              ? 'bg-amber-50 text-amber-700 border-amber-200/60'
                              : 'bg-emerald-50 text-emerald-700 border-emerald-200/60'
                          }`}
                        >
                          <span className={`w-1.5 h-1.5 rounded-full ${isProcess ? 'bg-amber-500 animate-pulse' : 'bg-emerald-500'}`}></span>
                          <span>{isProcess ? 'En Proceso' : 'Completado'}</span>
                        </span>
                      </td>
                      <td className="py-4 px-5">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* Botón de Ojito / Vista Previa */}
                          <button
                            onClick={() => setPreviewPrueba(prueba)}
                            className="p-2 bg-slate-50 hover:bg-[#fff0f1] text-slate-600 hover:text-[#fb5962] rounded-xl border border-slate-200/70 transition-all cursor-pointer shadow-2xs"
                            title="Previsualizar Informe Membretado"
                          >
                            <IconEye className="w-4 h-4" />
                          </button>

                          {/* Botón de Descarga Rápida PDF */}
                          <button
                            onClick={() => {
                              downloadReportPDF({
                                paciente: paciente || { dni: prueba.pacienteDni },
                                prueba,
                                sede: sedeActiva,
                                valoresResultados: parseResultadosMap(prueba.resultado),
                              });
                            }}
                            className="p-2 bg-slate-50 hover:bg-rose-50 text-slate-600 hover:text-rose-600 rounded-xl border border-slate-200/70 transition-all cursor-pointer shadow-2xs"
                            title="Descargar PDF Oficial"
                          >
                            <IconDownload className="w-4 h-4" />
                          </button>

                          {/* Cargar o Editar Resultados */}
                          <button
                            onClick={() => handleOpenCapture(prueba)}
                            className={`px-3.5 py-2 font-bold text-xs rounded-xl transition-all flex items-center gap-1.5 cursor-pointer ${
                              isProcess
                                ? 'bg-[#fb5962] hover:bg-[#e54550] text-white shadow-md shadow-rose-500/20'
                                : 'bg-white hover:bg-slate-50 text-slate-700 border border-slate-200/80 shadow-2xs'
                            }`}
                          >
                            <IconEdit className="w-3.5 h-3.5" />
                            <span>{isProcess ? 'Cargar Resultado' : 'Editar'}</span>
                          </button>

                          {/* Eliminar si está en proceso */}
                          {isProcess && (
                            <button
                              onClick={() => handleEliminarOrden(prueba)}
                              className="p-2 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-xl border border-rose-100 transition-colors cursor-pointer"
                              title="Cancelar orden"
                            >
                              <IconTrash className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* MODAL 1: CAPTURA INTELIGENTE CON LIVE PREVIEW (SPLIT-SCREEN LADO A LADO) */}
      {/* ========================================================================= */}
      {selectedPruebaForCapture && (() => {
        const examenDef = getExamenByIdOrName(selectedPruebaForCapture.examen);
        const paciente = pacientesMap[selectedPruebaForCapture.pacienteDni];
        const parametros: ParametroExamen[] = examenDef?.parametros || [
          { id: 'default_val', nombre: selectedPruebaForCapture.examen, unidad: '', valorReferencial: 'Normal' },
        ];

        return (
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 z-50 animate-in fade-in duration-150">
            <div className="bg-white rounded-3xl max-w-6xl w-full h-[92vh] shadow-2xl flex flex-col overflow-hidden border border-slate-200/80">
              {/* Header Modal */}
              <div className="px-6 py-4 bg-white border-b border-slate-100 flex items-center justify-between shrink-0">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 bg-[#fff0f1] text-[#fb5962] font-extrabold text-[10px] uppercase rounded-md border border-[#fb5962]/20">
                      Captura Analítica
                    </span>
                    <h3 className="font-jakarta text-base font-extrabold text-slate-900">
                      {examenDef?.nombre || selectedPruebaForCapture.examen}
                    </h3>
                  </div>
                  <p className="text-slate-500 text-xs mt-0.5">
                    Paciente: <strong className="text-slate-800">{paciente ? `${paciente.nombre} ${paciente.apellido}` : selectedPruebaForCapture.pacienteDni}</strong> | Orden: <span className="font-mono text-[#fb5962] font-bold">{selectedPruebaForCapture.id}</span>
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setSelectedPruebaForCapture(null)}
                  className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
                >
                  <IconX className="w-5 h-5" />
                </button>
              </div>

              {/* Contenido Split-Screen */}
              <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 overflow-hidden">
                {/* Panel Izquierdo: Formulario Dinámico de Parámetros */}
                <div className="lg:col-span-5 border-r border-slate-200/80 p-5 overflow-y-auto flex flex-col justify-between bg-slate-50/40">
                  <form id="form-capture" onSubmit={handleGuardarResultados} className="space-y-4">
                    <div className="flex items-center justify-between pb-2 border-b border-slate-200/60">
                      <span className="text-[11px] font-extrabold text-slate-600 uppercase tracking-wider">
                        Parámetros Clínicos ({parametros.length})
                      </span>
                      <span className="text-[10px] text-slate-400 font-medium italic">
                        Vista previa en vivo 👉
                      </span>
                    </div>

                    <div className="space-y-3">
                      {parametros.map((param) => (
                        <div key={param.id} className="bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-2xs">
                          <div className="flex justify-between items-start mb-1.5">
                            <label htmlFor={`param-${param.id}`} className="text-xs font-bold text-slate-800">
                              {param.nombre}
                            </label>
                            {param.unidad && (
                              <span className="text-[10px] font-mono font-bold text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">
                                {param.unidad}
                              </span>
                            )}
                          </div>

                          {param.tipo === 'select' && param.opciones ? (
                            <select
                              id={`param-${param.id}`}
                              value={formDataResultados[param.id] || ''}
                              onChange={(e) => handleInputChange(param.id, e.target.value)}
                              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:border-[#fb5962] focus:bg-white cursor-pointer"
                            >
                              {param.opciones.map((opt) => (
                                <option key={opt} value={opt}>
                                  {opt}
                                </option>
                              ))}
                            </select>
                          ) : (
                            <input
                              id={`param-${param.id}`}
                              type="text"
                              value={formDataResultados[param.id] || ''}
                              onChange={(e) => handleInputChange(param.id, e.target.value)}
                              placeholder={`Ej: ${param.valorReferencial.split('|')[0].trim()}`}
                              className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:border-[#fb5962] focus:bg-white transition-all placeholder:text-slate-300"
                            />
                          )}

                          <p className="text-[10px] text-slate-400 mt-1">
                            Ref: <span className="font-medium text-slate-500">{param.valorReferencial}</span>
                          </p>
                        </div>
                      ))}
                    </div>
                  </form>

                  {/* Acciones del formulario */}
                  <div className="pt-4 mt-4 border-t border-slate-200 flex gap-2">
                    <button
                      type="submit"
                      form="form-capture"
                      className="flex-1 py-3 bg-[#fb5962] hover:bg-[#e54550] text-white font-bold uppercase tracking-wider text-xs rounded-xl shadow-md shadow-rose-500/20 transition-all cursor-pointer flex items-center justify-center gap-1.5"
                    >
                      <IconCheck className="w-4 h-4" />
                      <span>Guardar y Validar</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setSelectedPruebaForCapture(null)}
                      className="py-3 px-4 border border-slate-200 text-slate-500 rounded-xl text-xs font-semibold hover:bg-slate-100 cursor-pointer"
                    >
                      Cancelar
                    </button>
                  </div>
                </div>

                {/* Panel Derecho: Live Preview en Tiempo Real */}
                <div className="lg:col-span-7 p-4 bg-slate-100 overflow-hidden flex flex-col">
                  <ReportPreview
                    paciente={paciente}
                    prueba={selectedPruebaForCapture}
                    sede={sedeActiva}
                    valoresResultados={formDataResultados}
                    showActions={false}
                  />
                </div>
              </div>
            </div>
          </div>
        );
      })()}

      {/* ========================================================================= */}
      {/* MODAL 2: PREVISUALIZACIÓN INDEPENDIENTE / IMPRESIÓN OFICIAL (OJITO)      */}
      {/* ========================================================================= */}
      {previewPrueba && (() => {
        const paciente = pacientesMap[previewPrueba.pacienteDni];
        return (
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 z-50 animate-in fade-in duration-150">
            <div className="bg-white rounded-3xl max-w-4xl w-full h-[90vh] shadow-2xl flex flex-col overflow-hidden border border-slate-200/80">
              <div className="px-6 py-4 bg-white border-b border-slate-100 flex items-center justify-between shrink-0">
                <div>
                  <h3 className="font-jakarta text-base font-extrabold text-slate-900 flex items-center gap-2">
                    <IconEye className="text-[#fb5962] w-5 h-5" />
                    Informe Clínico Oficial
                  </h3>
                  <p className="text-slate-400 text-xs">
                    Orden: <strong className="font-mono text-[#fb5962]">{previewPrueba.id}</strong> | Examen: {previewPrueba.examen}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setPreviewPrueba(null)}
                  className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
                >
                  <IconX className="w-5 h-5" />
                </button>
              </div>

              <div className="flex-1 overflow-hidden p-4 bg-slate-100">
                <ReportPreview
                  paciente={paciente}
                  prueba={previewPrueba}
                  sede={sedeActiva}
                  showActions={true}
                />
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
}
