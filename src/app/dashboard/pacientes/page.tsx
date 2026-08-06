"use client";

import React, { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import { useDashboardContext } from '../layout';
import { database, Paciente, PruebaClinica } from '@/services/db';
import { IconClipboardList, IconHistory, IconFlask, IconCheck, IconClock } from '@tabler/icons-react';

export default function PacientesPage() {
  const { sedeActivaId, sedes } = useDashboardContext();
  const [pacientes, setPacientes] = useState<Paciente[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isRegistrando, setIsRegistrando] = useState(false);
  const [selectedPaciente, setSelectedPaciente] = useState<Paciente | null>(null);
  
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
  const [loadingReniec, setLoadingReniec] = useState(false);
  const [tipoPruebaInput, setTipoPruebaInput] = useState('Hemoglobina');

  const sedeActiva = sedes.find(s => s.id === sedeActivaId)?.nombre || sedeActivaId;

  const loadPacientes = async () => {
    setLoading(true);
    const list = await database.getPacientes(sedeActivaId);
    setPacientes(list);
    setLoading(false);
  };

  const handleVerHistorialPaciente = async (paciente: Paciente) => {
    setHistorialPaciente(paciente);
    setLoadingHistorial(true);
    const list = await database.getPruebasByPaciente(paciente.dni);
    setPruebasHistorial(list);
    setLoadingHistorial(false);
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

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-6">
        {isRegistrando ? (
          <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-xs">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="font-jakarta text-base font-bold text-slate-800 uppercase tracking-wider">Nuevo Paciente</h3>
                <p className="text-slate-400 text-xs mt-1">Registrar paciente en Sede {sedeActiva}</p>
              </div>
              <button
                onClick={() => setIsRegistrando(false)}
                className="text-xs text-slate-400 hover:text-slate-600 font-bold"
              >
                Volver a la lista
              </button>
            </div>

            <form onSubmit={handleRegistrarPaciente} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end">
                <div className="sm:col-span-2">
                  <label className="text-[10px] uppercase tracking-wider text-slate-400 font-bold mb-2 block">DNI / Documento</label>
                  <input
                    type="text"
                    maxLength={8}
                    value={dniInput}
                    onChange={(e) => setDniInput(e.target.value.replace(/\D/g, ''))}
                    placeholder="Ingrese DNI (8 dígitos)"
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:border-cerulean focus:bg-white"
                    required
                  />
                </div>
                <button
                  type="button"
                  onClick={handleConsultarReniec}
                  disabled={loadingReniec || dniInput.length !== 8}
                  className="w-full py-3.5 bg-cerulean text-white font-bold uppercase tracking-wider text-xs rounded-xl shadow-md cursor-pointer disabled:bg-slate-200"
                >
                  {loadingReniec ? 'Consultando...' : 'Consultar RENIEC'}
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] uppercase tracking-wider text-slate-400 font-bold mb-2 block">Nombre Completo</label>
                  <input
                    type="text"
                    value={nombreInput}
                    onChange={(e) => setNombreInput(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:border-cerulean focus:bg-white"
                    required
                  />
                </div>
                <div>
                  <label className="text-[10px] uppercase tracking-wider text-slate-400 font-bold mb-2 block">Apellidos</label>
                  <input
                    type="text"
                    value={apellidoInput}
                    onChange={(e) => setApellidoInput(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:border-cerulean focus:bg-white"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] uppercase tracking-wider text-slate-400 font-bold mb-2 block">Teléfono (Opcional)</label>
                  <input
                    type="tel"
                    value={telefonoInput}
                    onChange={(e) => setTelefonoInput(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:border-cerulean focus:bg-white"
                  />
                </div>
                <div>
                  <label className="text-[10px] uppercase tracking-wider text-slate-400 font-bold mb-2 block">Correo Electrónico (Opcional)</label>
                  <input
                    type="email"
                    value={correoInput}
                    onChange={(e) => setCorreoInput(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:border-cerulean focus:bg-white"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold uppercase tracking-wider text-xs rounded-xl shadow-md cursor-pointer"
              >
                Registrar Paciente
              </button>
            </form>
          </div>
        ) : (
          <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-xs">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="font-jakarta text-base font-bold text-slate-800 uppercase tracking-wider">Historial de Pacientes</h3>
                <p className="text-slate-400 text-xs mt-1">Pacientes registrados en Sede {sedeActiva}</p>
              </div>
              <button
                onClick={() => setIsRegistrando(true)}
                className="px-4 py-2.5 bg-cerulean text-white font-bold uppercase tracking-wider text-[10px] rounded-xl shadow-sm cursor-pointer"
              >
                + Nuevo Paciente
              </button>
            </div>

            <div className="border border-slate-100 rounded-xl overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse min-w-[600px]">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-100 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                    <th className="p-4">DNI</th>
                    <th className="p-4">Paciente</th>
                    <th className="p-4">Contacto</th>
                    <th className="p-4 text-right">Acción</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {loading ? (
                    <tr>
                      <td colSpan={4} className="p-12 text-center text-slate-400">
                        <div className="flex flex-col items-center justify-center">
                          <div className="w-8 h-8 border-3 border-cerulean border-t-transparent rounded-full animate-spin mb-3"></div>
                          <p className="text-xs font-semibold text-slate-500">Cargando pacientes registrados...</p>
                        </div>
                      </td>
                    </tr>
                  ) : pacientes.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="p-8 text-center text-slate-400">No hay pacientes registrados en esta sede.</td>
                    </tr>
                  ) : (
                    pacientes.map((p) => (
                      <tr key={p.dni} className="hover:bg-slate-50/50">
                        <td className="p-4 font-mono font-bold text-slate-500">{p.dni}</td>
                        <td className="p-4 font-bold text-slate-800">{p.nombre} {p.apellido}</td>
                        <td className="p-4 text-slate-500">{p.telefono || 'Sin tel.'}</td>
                        <td className="p-4 text-right flex justify-end gap-2">
                          <button
                            onClick={() => handleVerHistorialPaciente(p)}
                            className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold text-[10px] uppercase rounded-xl flex items-center gap-1 cursor-pointer"
                            title="Ver Historial Clínico"
                          >
                            <IconHistory className="w-3.5 h-3.5 text-slate-500" /> Historial
                          </button>
                          <button
                            onClick={() => setSelectedPaciente(p)}
                            className="px-3 py-1.5 bg-cerulean/10 text-cerulean font-bold text-[10px] uppercase rounded-xl hover:bg-cerulean/20 cursor-pointer"
                          >
                            Asignar Examen
                          </button>
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

      {/* Panel Orden Médica */}
      <div className="lg:col-span-1 space-y-6">
        {selectedPaciente ? (
          <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-xs">
            <h3 className="font-jakarta text-sm font-bold text-slate-800 uppercase tracking-wider mb-4">Generar Orden Médica</h3>
            <div className="bg-slate-50 rounded-xl p-4 mb-6">
              <p className="text-slate-400 text-[10px] font-bold uppercase">Paciente Seleccionado</p>
              <p className="font-bold text-slate-800 mt-1">{selectedPaciente.nombre} {selectedPaciente.apellido}</p>
              <p className="text-slate-400 font-mono text-xs mt-0.5">DNI: {selectedPaciente.dni}</p>
            </div>

            <form onSubmit={handleCrearExamen} className="space-y-6">
              <div>
                <label className="text-[10px] uppercase tracking-wider text-slate-400 font-bold mb-2 block">Examen Clínico</label>
                <select
                  value={tipoPruebaInput}
                  onChange={(e) => setTipoPruebaInput(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:border-cerulean cursor-pointer"
                >
                  <optgroup label="Exámenes Convencionales">
                    <option value="Hemoglobina">Hemoglobina</option>
                    <option value="Glucosa en Ayunas">Glucosa en Ayunas</option>
                    <option value="Colesterol Total">Colesterol Total</option>
                    <option value="Triglicéridos">Triglicéridos</option>
                  </optgroup>
                  <optgroup label="🔬 Lifotronic eCL8000 (Inmunoensayo)">
                    <option value="CEA">CEA (Antígeno Carcinoembrionario)</option>
                    <option value="AFP">AFP (Alfa-Fetoproteína)</option>
                    <option value="CA19-9">CA 19-9 (Antígeno de Cáncer 19-9)</option>
                    <option value="CA125">CA 125 (Antígeno de Cáncer 125)</option>
                    <option value="TPSA">TPSA (Antígeno Prostático Total)</option>
                    <option value="FPSA">FPSA (Antígeno Prostático Libre)</option>
                    <option value="HE4">HE4 (Proteína del Epidídimo Humano 4)</option>
                  </optgroup>
                </select>
              </div>

              <div className="flex gap-2">
                <button
                  type="submit"
                  className="flex-1 py-3 bg-cerulean text-white font-bold uppercase tracking-wider text-xs rounded-xl shadow-md cursor-pointer"
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
          <div className="bg-slate-50 border border-dashed border-slate-200 rounded-2xl p-6 text-center flex flex-col justify-center items-center min-h-[200px]">
            <IconClipboardList className="text-slate-300 w-10 h-10 mb-2" />
            <p className="text-slate-500 font-semibold text-xs leading-relaxed max-w-[200px]">
              Seleccione un paciente de la lista para emitir una nueva orden clínica.
            </p>
          </div>
        )}
      </div>

      {/* MODAL DE HISTORIAL CLÍNICO DEL PACIENTE */}
      {historialPaciente && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 max-w-2xl w-full shadow-2xl space-y-6">
            <div className="flex justify-between items-start border-b border-slate-100 pb-4">
              <div>
                <span className="px-2.5 py-1 bg-cerulean/10 text-cerulean text-[10px] font-extrabold uppercase rounded-md">
                  Historial Clínico de Análisis
                </span>
                <h3 className="font-jakarta font-bold text-lg text-slate-800 mt-1">
                  {historialPaciente.nombre} {historialPaciente.apellido}
                </h3>
                <p className="text-slate-400 text-xs font-mono">DNI: {historialPaciente.dni} | Contacto: {historialPaciente.telefono || 'Sin teléfono'}</p>
              </div>
              <button
                onClick={() => setHistorialPaciente(null)}
                className="text-slate-400 hover:text-slate-600 font-bold text-sm px-2 py-1 bg-slate-100 rounded-lg"
              >
                ✕ Cerrar
              </button>
            </div>

            <div className="border border-slate-100 rounded-xl overflow-x-auto max-h-80 overflow-y-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-100 text-[10px] font-bold uppercase tracking-wider text-slate-500 sticky top-0 bg-white">
                    <th className="p-3">Código Orden</th>
                    <th className="p-3">Examen / Análisis</th>
                    <th className="p-3">Fecha</th>
                    <th className="p-3">Estado</th>
                    <th className="p-3 text-right">Resultado</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {loadingHistorial ? (
                    <tr>
                      <td colSpan={5} className="p-8 text-center text-slate-400">
                        <div className="flex flex-col items-center justify-center">
                          <div className="w-6 h-6 border-2 border-cerulean border-t-transparent rounded-full animate-spin mb-2"></div>
                          <p className="text-xs">Cargando historial de análisis...</p>
                        </div>
                      </td>
                    </tr>
                  ) : pruebasHistorial.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="p-8 text-center text-slate-400">
                        Este paciente no cuenta con historial de órdenes registradas.
                      </td>
                    </tr>
                  ) : (
                    pruebasHistorial.map((item) => (
                      <tr key={item.id} className="hover:bg-slate-50">
                        <td className="p-3 font-mono font-bold text-slate-500">{item.id}</td>
                        <td className="p-3 font-bold text-slate-800">{item.examen}</td>
                        <td className="p-3 text-slate-400">{item.fecha}</td>
                        <td className="p-3">
                          <span
                            className={`px-2 py-0.5 text-[9px] font-bold uppercase rounded-md ${
                              item.status === 'Completado' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600 animate-pulse'
                            }`}
                          >
                            {item.status}
                          </span>
                        </td>
                        <td className="p-3 text-right font-bold text-slate-700">
                          {item.resultado || 'Pendiente'}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
