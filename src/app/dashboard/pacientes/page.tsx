"use client";

import React, { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import { useDashboardContext } from '../layout';
import { database, Paciente, PruebaClinica } from '@/services/db';
import { 
  IconClipboardList, 
  IconHistory, 
  IconUserPlus,
  IconSearch,
  IconX,
  IconArrowLeft
} from '@tabler/icons-react';
import { CATALOGO_EXAMENES } from '@/lib/catalogExamenes';

export default function PacientesPage() {
  const { sedeActivaId, sedes } = useDashboardContext();
  const [pacientes, setPacientes] = useState<Paciente[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isRegistrando, setIsRegistrando] = useState(false);
  const [selectedPaciente, setSelectedPaciente] = useState<Paciente | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Modal de Historial
  const [historialPaciente, setHistorialPaciente] = useState<Paciente | null>(null);
  const [pruebasHistorial, setPruebasHistorial] = useState<PruebaClinica[]>([]);
  const [loadingHistorial, setLoadingHistorial] = useState<boolean>(false);

  // Form states
  const [dniInput, setDniInput] = useState('');
  const [nombreInput, setNombreInput] = useState('');
  const [apellidoInput, setApellidoInput] = useState('');
  const [telefonoInput, setTelefonoInput] = useState('');
  const [correoInput, setCorreoInput] = useState('');
  const [tipoPruebaInput, setTipoPruebaInput] = useState('Hemograma Automatizado');
  const [loadingReniec, setLoadingReniec] = useState(false);

  const sedeActiva = sedes.find((s) => s.id === sedeActivaId)?.nombre || sedeActivaId;

  const loadPacientes = async () => {
    setLoading(true);
    const list = await database.getPacientes(sedeActivaId);
    setPacientes(list);
    setLoading(false);
  };

  useEffect(() => {
    if (sedeActivaId) loadPacientes();
  }, [sedeActivaId]);

  const handleConsultarReniec = async () => {
    if (dniInput.length !== 8) return;
    setLoadingReniec(true);
    const data = await database.consultarRENIEC(dniInput);
    setLoadingReniec(false);

    if (data) {
      setNombreInput(data.nombre);
      setApellidoInput(data.apellido);
      Swal.fire({
        title: 'Consulta RENIEC Exitosa',
        text: `Datos cargados: ${data.nombre} ${data.apellido}`,
        icon: 'success',
        timer: 1800,
        showConfirmButton: false,
      });
    } else {
      Swal.fire('Error', 'No se encontraron datos para el DNI ingresado.', 'error');
    }
  };

  const handleRegistrarPaciente = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!dniInput || !nombreInput || !apellidoInput) return;

    const ok = await database.registrarPaciente({
      dni: dniInput,
      nombre: nombreInput,
      apellido: apellidoInput,
      telefono: telefonoInput,
      correo: correoInput,
      sedeId: sedeActivaId,
      sedeRegistro: sedeActiva,
      fechaRegistro: new Date().toISOString().split('T')[0],
    });

    if (ok) {
      Swal.fire('Éxito', 'Paciente registrado correctamente.', 'success');
      setDniInput('');
      setNombreInput('');
      setApellidoInput('');
      setTelefonoInput('');
      setCorreoInput('');
      setIsRegistrando(false);
      loadPacientes();
    } else {
      Swal.fire('Error', 'No se pudo registrar el paciente.', 'error');
    }
  };

  const handleCrearExamen = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPaciente) return;

    const res = await database.crearPrueba(selectedPaciente.dni, tipoPruebaInput, sedeActivaId);
    if (res) {
      Swal.fire({
        title: 'Orden Médica Generada',
        text: `Código asignado: ${res.id} (${tipoPruebaInput})`,
        icon: 'success',
      });
      setSelectedPaciente(null);
    } else {
      Swal.fire('Error', 'No se pudo generar la orden médica.', 'error');
    }
  };

  const handleVerHistorial = async (paciente: Paciente) => {
    setHistorialPaciente(paciente);
    setLoadingHistorial(true);
    const todasLasPruebas = await database.getPruebas(sedeActivaId);
    const pruebasDelPaciente = todasLasPruebas.filter((p) => p.pacienteDni === paciente.dni);
    setPruebasHistorial(pruebasDelPaciente);
    setLoadingHistorial(false);
  };

  const filteredPacientes = pacientes.filter((p) => {
    const q = searchQuery.toLowerCase().trim();
    return (
      p.dni.includes(q) ||
      `${p.nombre} ${p.apellido}`.toLowerCase().includes(q) ||
      (p.telefono && p.telefono.includes(q))
    );
  });

  return (
    <div className="space-y-6 font-sans">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Columna Izquierda: Lista o Formulario de Pacientes */}
        <div className="lg:col-span-2 space-y-6">
          {isRegistrando ? (
            <div className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-8 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.03)]">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h3 className="font-jakarta text-base font-extrabold text-slate-900">
                    Registro de Nuevo Paciente
                  </h3>
                  <p className="text-slate-500 text-xs mt-0.5">
                    Ingresando ficha clínica en Sede {sedeActiva}
                  </p>
                </div>
                <button
                  onClick={() => setIsRegistrando(false)}
                  className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-800 font-bold px-3 py-1.5 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  <IconArrowLeft className="w-4 h-4" />
                  <span>Volver a la lista</span>
                </button>
              </div>

              <form onSubmit={handleRegistrarPaciente} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end">
                  <div className="sm:col-span-2">
                    <label className="text-[10px] uppercase tracking-wider text-slate-400 font-extrabold mb-1.5 block">
                      DNI / Documento de Identidad
                    </label>
                    <input
                      type="text"
                      maxLength={8}
                      value={dniInput}
                      onChange={(e) => setDniInput(e.target.value)}
                      placeholder="Ingrese DNI (8 dígitos)"
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-bold text-xs focus:outline-none focus:border-[#fb5962] focus:bg-white transition-all font-mono"
                      required
                    />
                  </div>
                  <div>
                    <button
                      type="button"
                      onClick={handleConsultarReniec}
                      disabled={loadingReniec || dniInput.length !== 8}
                      className="w-full py-2.5 bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs rounded-xl shadow-sm transition-all disabled:opacity-50 cursor-pointer"
                    >
                      {loadingReniec ? 'Buscando...' : 'Consultar RENIEC'}
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] uppercase tracking-wider text-slate-400 font-extrabold mb-1.5 block">
                      Nombres
                    </label>
                    <input
                      type="text"
                      value={nombreInput}
                      onChange={(e) => setNombreInput(e.target.value)}
                      placeholder="Nombres completos"
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-semibold text-xs focus:outline-none focus:border-[#fb5962] focus:bg-white transition-all"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-[10px] uppercase tracking-wider text-slate-400 font-extrabold mb-1.5 block">
                      Apellidos
                    </label>
                    <input
                      type="text"
                      value={apellidoInput}
                      onChange={(e) => setApellidoInput(e.target.value)}
                      placeholder="Apellidos completos"
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-semibold text-xs focus:outline-none focus:border-[#fb5962] focus:bg-white transition-all"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] uppercase tracking-wider text-slate-400 font-extrabold mb-1.5 block">
                      Teléfono / WhatsApp
                    </label>
                    <input
                      type="tel"
                      value={telefonoInput}
                      onChange={(e) => setTelefonoInput(e.target.value)}
                      placeholder="Ej: 952920616"
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-semibold text-xs focus:outline-none focus:border-[#fb5962] focus:bg-white transition-all"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] uppercase tracking-wider text-slate-400 font-extrabold mb-1.5 block">
                      Correo Electrónico (Opcional)
                    </label>
                    <input
                      type="email"
                      value={correoInput}
                      onChange={(e) => setCorreoInput(e.target.value)}
                      placeholder="paciente@correo.com"
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-semibold text-xs focus:outline-none focus:border-[#fb5962] focus:bg-white transition-all"
                    />
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full py-3 bg-[#fb5962] hover:bg-[#e54550] text-white font-bold uppercase tracking-wider text-xs rounded-xl shadow-md shadow-rose-500/20 transition-all cursor-pointer"
                  >
                    Guardar Paciente
                  </button>
                </div>
              </form>
            </div>
          ) : (
            <div className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-7 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.03)]">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <div>
                  <h3 className="font-jakarta text-lg font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
                    Directorio de Pacientes
                  </h3>
                  <p className="text-slate-500 text-xs mt-0.5">
                    Pacientes registrados en Sede {sedeActiva}
                  </p>
                </div>

                <div className="flex items-center gap-3 w-full sm:w-auto">
                  <div className="w-full sm:w-60 relative">
                    <input
                      type="text"
                      placeholder="Buscar por DNI, nombre..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200/80 rounded-xl text-slate-800 font-medium text-xs focus:outline-none focus:border-[#fb5962] focus:bg-white transition-all placeholder:text-slate-400"
                    />
                    <IconSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                  </div>

                  <button
                    onClick={() => setIsRegistrando(true)}
                    className="px-3.5 py-2 bg-[#fb5962] hover:bg-[#e54550] text-white font-bold text-xs rounded-xl shadow-md shadow-rose-500/20 transition-all flex items-center gap-1.5 cursor-pointer shrink-0"
                  >
                    <IconUserPlus className="w-4 h-4" />
                    <span>Nuevo Paciente</span>
                  </button>
                </div>
              </div>

              {/* Tabla de Pacientes */}
              <div className="border border-slate-200/70 rounded-2xl overflow-x-auto shadow-2xs">
                <table className="w-full text-left text-xs border-collapse min-w-[550px]">
                  <thead>
                    <tr className="bg-slate-50/80 border-b border-slate-200/70 text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                      <th className="py-3.5 px-4">DNI</th>
                      <th className="py-3.5 px-4">Paciente</th>
                      <th className="py-3.5 px-4">Contacto</th>
                      <th className="py-3.5 px-4 text-right">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    {loading ? (
                      <tr>
                        <td colSpan={4} className="p-10 text-center text-slate-400">
                          <div className="flex flex-col items-center justify-center">
                            <div className="w-8 h-8 border-3 border-[#fb5962] border-t-transparent rounded-full animate-spin mb-3"></div>
                            <p className="text-xs font-semibold text-slate-500">Cargando pacientes...</p>
                          </div>
                        </td>
                      </tr>
                    ) : filteredPacientes.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="p-8 text-center text-slate-400">
                          No se encontraron pacientes registrados en esta sede.
                        </td>
                      </tr>
                    ) : (
                      filteredPacientes.map((paciente) => (
                        <tr key={paciente.dni} className="hover:bg-slate-50/70 transition-colors">
                          <td className="py-3.5 px-4 font-mono font-bold text-slate-900">
                            {paciente.dni}
                          </td>
                          <td className="py-3.5 px-4 font-bold text-slate-900">
                            {paciente.nombre} {paciente.apellido}
                          </td>
                          <td className="py-3.5 px-4 font-medium text-slate-500">
                            {paciente.telefono || paciente.correo || '-'}
                          </td>
                          <td className="py-3.5 px-4">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() => handleVerHistorial(paciente)}
                                className="p-2 bg-slate-50 hover:bg-[#fff0f1] text-slate-600 hover:text-[#fb5962] border border-slate-200/70 rounded-xl transition-all cursor-pointer shadow-2xs"
                                title="Ver Historial Clínico"
                              >
                                <IconHistory className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => setSelectedPaciente(paciente)}
                                className="px-3 py-1.5 bg-[#fff0f1] hover:bg-[#fb5962] text-[#fb5962] hover:text-white font-bold text-xs rounded-xl border border-[#fb5962]/20 transition-all cursor-pointer shadow-2xs"
                              >
                                Emitir Orden
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Columna Derecha: Tarjeta de Emisión de Orden */}
        <div>
          {selectedPaciente ? (
            <div className="bg-white border border-[#fb5962]/30 rounded-3xl p-6 shadow-lg shadow-rose-500/5 sticky top-24">
              <div className="mb-5 pb-4 border-b border-slate-100">
                <span className="px-2.5 py-0.5 bg-[#fff0f1] text-[#fb5962] font-extrabold text-[10px] uppercase rounded-md border border-[#fb5962]/20 inline-block mb-2">
                  Nueva Orden Clínica
                </span>
                <h4 className="font-extrabold text-base text-slate-900">
                  {selectedPaciente.nombre} {selectedPaciente.apellido}
                </h4>
                <p className="text-slate-400 font-mono text-xs mt-0.5">
                  DNI: {selectedPaciente.dni}
                </p>
              </div>

              <form onSubmit={handleCrearExamen} className="space-y-5">
                <div>
                  <label className="text-[10px] uppercase tracking-wider text-slate-400 font-extrabold mb-1.5 block">
                    Seleccionar Examen Clínico
                  </label>
                  <select
                    value={tipoPruebaInput}
                    onChange={(e) => setTipoPruebaInput(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:border-[#fb5962] focus:bg-white cursor-pointer"
                  >
                    {Array.from(new Set(CATALOGO_EXAMENES.map((e) => e.categoria))).map((categoria) => (
                      <optgroup key={categoria} label={`Área: ${categoria}`}>
                        {CATALOGO_EXAMENES.filter((e) => e.categoria === categoria).map((examen) => (
                          <option key={examen.id} value={examen.nombre}>
                            {examen.nombre} {examen.metodo ? `(${examen.metodo.split('/')[0].trim()})` : ''}
                          </option>
                        ))}
                      </optgroup>
                    ))}
                  </select>
                </div>

                <div className="flex gap-2">
                  <button
                    type="submit"
                    className="flex-1 py-3 bg-[#fb5962] hover:bg-[#e54550] text-white font-bold uppercase tracking-wider text-xs rounded-xl shadow-md shadow-rose-500/20 transition-all cursor-pointer"
                  >
                    Registrar Orden
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedPaciente(null)}
                    className="py-3 px-4 border border-slate-200 text-slate-500 rounded-xl text-xs font-semibold hover:bg-slate-50 cursor-pointer"
                  >
                    Cancelar
                  </button>
                </div>
              </form>
            </div>
          ) : (
            <div className="bg-white border border-dashed border-slate-200 rounded-3xl p-8 text-center flex flex-col justify-center items-center min-h-[220px] shadow-2xs">
              <div className="w-12 h-12 rounded-2xl bg-[#fff0f1] text-[#fb5962] flex items-center justify-center mb-3">
                <IconClipboardList className="w-6 h-6" />
              </div>
              <p className="text-slate-800 font-bold text-xs">
                Emisión Rápida de Órdenes
              </p>
              <p className="text-slate-400 text-[11px] mt-1 max-w-[210px] leading-relaxed">
                Seleccione un paciente de la lista para emitir una nueva orden clínica.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Modal Historial de Paciente */}
      {historialPaciente && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 shadow-2xl border border-slate-200/80">
            <div className="flex justify-between items-start mb-5 pb-4 border-b border-slate-100">
              <div>
                <span className="px-2.5 py-0.5 bg-[#fff0f1] text-[#fb5962] font-extrabold text-[10px] uppercase rounded-md border border-[#fb5962]/20 inline-block mb-1">
                  Historial Clínico
                </span>
                <h4 className="font-extrabold text-base text-slate-900">
                  {historialPaciente.nombre} {historialPaciente.apellido}
                </h4>
                <p className="text-slate-400 font-mono text-xs">
                  DNI: {historialPaciente.dni}
                </p>
              </div>
              <button
                onClick={() => setHistorialPaciente(null)}
                className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
              >
                <IconX className="w-5 h-5" />
              </button>
            </div>

            <div className="max-h-80 overflow-y-auto space-y-2.5 pr-1">
              {loadingHistorial ? (
                <div className="p-8 text-center text-slate-400">
                  Cargando historial...
                </div>
              ) : pruebasHistorial.length === 0 ? (
                <div className="p-8 text-center text-slate-400 text-xs">
                  El paciente aún no tiene órdenes registradas.
                </div>
              ) : (
                pruebasHistorial.map((p) => (
                  <div
                    key={p.id}
                    className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-between"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-[#fb5962] text-xs">{p.id}</span>
                        <span className="font-bold text-slate-800 text-xs">{p.examen}</span>
                      </div>
                      <p className="text-[11px] text-slate-400 mt-0.5">Fecha: {p.fecha}</p>
                    </div>

                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-1 text-[9px] font-extrabold uppercase rounded-md ${
                        p.status === 'En Proceso'
                          ? 'bg-amber-50 text-amber-700 border border-amber-200/60'
                          : 'bg-emerald-50 text-emerald-700 border border-emerald-200/60'
                      }`}
                    >
                      {p.status}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
