"use client";

import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import { database, Reactivo, Paciente, PruebaClinica, MovimientoInventario, Sede, Usuario } from '../services/db';
import { 
  IconHexagon, 
  IconLayoutDashboard, 
  IconUsers, 
  IconFlask, 
  IconClipboardList, 
  IconPower, 
  IconBuilding, 
  IconAlertTriangle, 
  IconPlus, 
  IconMinus, 
  IconSearch, 
  IconClock, 
  IconCheck, 
  IconPrinter,
  IconEye
} from '@tabler/icons-react';

interface DashboardProps {
  onLogout: () => void;
  usuario: Usuario;
}

type Section = 'resumen' | 'inventario' | 'pacientes' | 'resultados' | 'sedes' | 'usuarios';

const Dashboard: React.FC<DashboardProps> = ({ onLogout, usuario }) => {
  const [activeSection, setActiveSection] = useState<Section>('resumen');
  const [sedeActivaId, setSedeActivaId] = useState<string>('SEDE-BRENA');
  const [sedes, setSedes] = useState<Sede[]>([]);
  const [showSedeDropdown, setShowSedeDropdown] = useState(false);
  const sedeActiva = sedes.find(s => s.id === sedeActivaId)?.nombre || sedeActivaId;
  
  // Data States
  const [reactivos, setReactivos] = useState<Reactivo[]>([]);
  const [pacientes, setPacientes] = useState<Paciente[]>([]);
  const [pruebas, setPruebas] = useState<PruebaClinica[]>([]);
  const [movimientos, setMovimientos] = useState<MovimientoInventario[]>([]);
  
  // Form States (Paciente)
  const [dniInput, setDniInput] = useState('');
  const [nombreInput, setNombreInput] = useState('');
  const [apellidoInput, setApellidoInput] = useState('');
  const [telefonoInput, setTelefonoInput] = useState('');
  const [correoInput, setCorreoInput] = useState('');
  const [loadingReniec, setLoadingReniec] = useState(false);
  const [reniecRemaining, setReniecRemaining] = useState<number | null>(null);
  const [isRegistrandoPaciente, setIsRegistrandoPaciente] = useState(false);

  // Examen filter state
  const [filterQuery, setFilterQuery] = useState('');
  const [selectedPacienteForPrueba, setSelectedPacienteForPrueba] = useState<Paciente | null>(null);
  const [tipoPruebaInput, setTipoPruebaInput] = useState('Hemoglobina');

  // Inicializar
  useEffect(() => {
    const init = async () => {
      await database.initSeed();
      const listaSedes = await database.getSedes();
      setSedes(listaSedes);
      if (listaSedes.length > 0) {
        setSedeActivaId(listaSedes[0].id);
      }
      await refreshData();
    };
    init();
  }, []);

  // Cargar datos al cambiar de sede
  useEffect(() => {
    if (sedeActivaId) {
      loadData();
    }
  }, [sedeActivaId, activeSection]);

  const loadData = async () => {
    const r = await database.getReactivos(sedeActivaId);
    const p = await database.getPacientes(sedeActivaId);
    const pr = await database.getPruebas(sedeActivaId);
    const m = await database.getMovimientos();
    setReactivos(r);
    setPacientes(p);
    setPruebas(pr);
    setMovimientos(m);
  };

  const refreshData = async () => {
    const r = await database.getReactivos(sedeActivaId);
    const p = await database.getPacientes(sedeActivaId);
    const pr = await database.getPruebas(sedeActivaId);
    const m = await database.getMovimientos();
    setReactivos(r);
    setPacientes(p);
    setPruebas(pr);
    setMovimientos(m);
  };

  // --- CONSULTA RENIEC ---
  const handleConsultarReniec = async () => {
    if (dniInput.length !== 8) {
      Swal.fire({
        title: 'Error',
        text: 'El DNI debe tener exactamente 8 dígitos.',
        icon: 'error',
        confirmButtonColor: '#77D4FC'
      });
      return;
    }

    setLoadingReniec(true);
    setErrorMsg('');
    
    try {
      const data = await database.consultarRENIEC(dniInput);
      if (data) {
        setNombreInput(data.nombre);
        setApellidoInput(data.apellido);
        if (data.remaining !== undefined) setReniecRemaining(data.remaining);
        Swal.fire({
          title: 'DNI Consultado',
          text: `Se encontraron datos para el DNI ${dniInput}`,
          icon: 'success',
          timer: 1500,
          showConfirmButton: false
        });
      } else {
        Swal.fire({
          title: 'No encontrado',
          text: 'No se pudieron recuperar datos para este DNI.',
          icon: 'warning',
          confirmButtonColor: '#77D4FC'
        });
      }
    } catch (e) {
      Swal.fire({
        title: 'Error de Conexión',
        text: 'Ocurrió un error consultando los servicios de RENIEC.',
        icon: 'error',
        confirmButtonColor: '#77D4FC'
      });
    } finally {
      setLoadingReniec(false);
    }
  };

  const [errorMsg, setErrorMsg] = useState('');

  // --- REGISTRAR PACIENTE ---
  const handleRegistrarPaciente = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!dniInput || !nombreInput || !apellidoInput) {
      Swal.fire({
        title: 'Campos requeridos',
        text: 'Por favor complete el DNI y los nombres del paciente.',
        icon: 'warning',
        confirmButtonColor: '#77D4FC'
      });
      return;
    }

    const nuevoPaciente: Paciente = {
      dni: dniInput,
      nombre: nombreInput.toUpperCase(),
      apellido: apellidoInput.toUpperCase(),
      telefono: telefonoInput || undefined,
      correo: correoInput || undefined,
      sedeRegistro: sedeActivaId,
      sedeId: sedeActivaId,
      fechaRegistro: new Date().toISOString().split('T')[0]
    };

    const exito = await database.registrarPaciente(nuevoPaciente);
    
    if (exito) {
      Swal.fire({
        title: '¡Registro Exitoso!',
        text: `El paciente ${nuevoPaciente.nombre} ${nuevoPaciente.apellido} fue registrado.`,
        icon: 'success',
        confirmButtonColor: '#77D4FC'
      });
    }

    // Resetear form
    setDniInput('');
    setNombreInput('');
    setApellidoInput('');
    setTelefonoInput('');
    setCorreoInput('');
    setIsRegistrandoPaciente(false);
    await refreshData();
  };

  // --- REGISTRAR EXAMEN PARA PACIENTE ---
  const handleCrearExamen = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPacienteForPrueba) return;

    await database.crearPrueba(selectedPacienteForPrueba.dni, tipoPruebaInput, sedeActivaId);
    
    Swal.fire({
      title: 'Examen Asignado',
      text: `Se registró la prueba de ${tipoPruebaInput} para el paciente.`,
      icon: 'success',
      confirmButtonColor: '#77D4FC'
    });

    setSelectedPacienteForPrueba(null);
    await refreshData();
  };

  // --- ACTUALIZAR STOCK REACTIVOS (SWEETALERT2) ---
  const openMovimientoModal = (reactivo: Reactivo, tipo: 'Entrada' | 'Salida') => {
    Swal.fire({
      title: `${tipo} de Reactivo`,
      html: `
        <div class="text-left font-plex text-sm">
          <p class="mb-2"><strong>Reactivo:</strong> ${reactivo.name}</p>
          <p class="mb-4"><strong>Stock actual:</strong> ${reactivo.stock} ${reactivo.unit}</p>
          <label class="block text-xs uppercase font-bold text-slate-500 mb-1">Cantidad a ${tipo === 'Entrada' ? 'ingresar' : 'retirar'}</label>
          <input type="number" id="swal-cantidad" class="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-cerulean focus:bg-white text-slate-700 font-medium text-sm transition-all" min="1" placeholder="Ej: 5">
        </div>
      `,
      showCancelButton: true,
      confirmButtonText: 'Confirmar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#77D4FC',
      cancelButtonColor: '#94a3b8',
      preConfirm: () => {
        const cantidadInput = document.getElementById('swal-cantidad') as HTMLInputElement;
        const cantidad = parseInt(cantidadInput.value, 10);
        if (!cantidad || cantidad <= 0) {
          Swal.showValidationMessage('Por favor ingrese una cantidad válida mayor a cero.');
          return false;
        }
        if (tipo === 'Salida' && cantidad > reactivo.stock) {
          Swal.showValidationMessage('Stock insuficiente para realizar este retiro.');
          return false;
        }
        return cantidad;
      }
    }).then(async (result) => {
      if (result.isConfirmed && result.value) {
        const cantidad = result.value;
        const exito = await database.registrarMovimientoReactivo(sedeActivaId, reactivo.id, cantidad, tipo);
        
        if (exito) {
          Swal.fire({
            title: 'Actualizado',
            text: `Se registró la ${tipo.toLowerCase()} de ${cantidad} unidades con éxito.`,
            icon: 'success',
            timer: 2000,
            showConfirmButton: false
          });
          await refreshData();
        } else {
          Swal.fire({
            title: 'Error',
            text: 'Ocurrió un error al procesar el inventario.',
            icon: 'error',
            confirmButtonColor: '#77D4FC'
          });
        }
      }
    });
  };

  // --- REGISTRAR RESULTADO DE PRUEBA (SWEETALERT2) ---
  const openSubirResultadoModal = (prueba: PruebaClinica) => {
    Swal.fire({
      title: 'Completar Análisis',
      html: `
        <div class="text-left font-plex text-sm">
          <p class="mb-2"><strong>Examen:</strong> ${prueba.examen}</p>
          <p class="mb-4"><strong>Paciente DNI:</strong> ${prueba.pacienteDni}</p>
          <label class="block text-xs uppercase font-bold text-slate-500 mb-1">Resultado de Análisis</label>
          <input type="text" id="swal-resultado" class="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-cerulean focus:bg-white text-slate-700 font-medium text-sm transition-all" placeholder="Ej: 14.5 g/dL o Negativo">
        </div>
      `,
      showCancelButton: true,
      confirmButtonText: 'Guardar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#77D4FC',
      cancelButtonColor: '#94a3b8',
      preConfirm: () => {
        const resultadoInput = document.getElementById('swal-resultado') as HTMLInputElement;
        const resultado = resultadoInput.value.trim();
        if (!resultado) {
          Swal.showValidationMessage('Por favor ingrese el resultado obtenido del análisis.');
          return false;
        }
        return resultado;
      }
    }).then(async (result) => {
      if (result.isConfirmed && result.value) {
        const resultado = result.value;
        const exito = await database.actualizarEstadoPrueba(prueba.id, 'Completado', resultado);
        if (exito) {
          Swal.fire({
            title: 'Análisis Completado',
            text: 'El resultado fue registrado e impreso virtualmente.',
            icon: 'success',
            timer: 2000,
            showConfirmButton: false
          });
          await refreshData();
        }
      }
    });
  };

  // --- DATOS ESTADÍSTICOS DEL RESUMEN ---
  const totalPacientes = pacientes.length;
  const reactivosCriticos = reactivos.filter((r) => r.stock <= r.minStock).length;
  const pruebasEnProceso = pruebas.filter((p) => p.status === 'En Proceso').length;
  const pruebasCompletadas = pruebas.filter((p) => p.status === 'Completado').length;

  return (
    <div className="flex h-screen bg-slate-50/50 font-plex overflow-hidden">
      
      {/* SIDEBAR */}
      <aside className="w-64 bg-white border-r border-slate-100 hidden md:flex flex-col justify-between p-6 shrink-0">
        <div className="space-y-8">
          {/* Brand */}
          <div className="flex items-center gap-3">
            <div className="relative flex items-center justify-center">
              <div className="absolute w-8 h-8 rounded-full bg-cerulean/15 animate-pulse"></div>
              <div className="relative w-6 h-6 border border-cerulean/40 flex items-center justify-center rotate-45">
                <IconHexagon className="text-cerulean w-4 h-4 -rotate-45" />
              </div>
            </div>
            <div>
              <span className="font-jakarta font-extrabold text-base tracking-tighter text-slate-800 leading-none">
                AQUA<span className="text-cerulean">LAB</span>
              </span>
              <p className="text-[7px] font-bold uppercase tracking-[0.2em] text-slate-400">Clinical Operations</p>
            </div>
          </div>

          {/* Menú de Navegación */}
          <nav className="space-y-1.5">
            <button 
              onClick={() => setActiveSection('resumen')} 
              className={`w-full flex items-center gap-3 px-4 py-3 text-xs font-bold uppercase tracking-wider rounded-xl transition-all cursor-pointer ${
                activeSection === 'resumen' 
                  ? 'bg-cerulean/10 text-cerulean' 
                  : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'
              }`}
            >
              <IconLayoutDashboard className="w-5 h-5" />
              Dashboard
            </button>
            <button 
              onClick={() => setActiveSection('pacientes')} 
              className={`w-full flex items-center gap-3 px-4 py-3 text-xs font-bold uppercase tracking-wider rounded-xl transition-all cursor-pointer ${
                activeSection === 'pacientes' 
                  ? 'bg-cerulean/10 text-cerulean' 
                  : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'
              }`}
            >
              <IconUsers className="w-5 h-5" />
              Pacientes
            </button>
            <button 
              onClick={() => setActiveSection('inventario')} 
              className={`w-full flex items-center gap-3 px-4 py-3 text-xs font-bold uppercase tracking-wider rounded-xl transition-all cursor-pointer ${
                activeSection === 'inventario' 
                  ? 'bg-cerulean/10 text-cerulean' 
                  : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'
              }`}
            >
              <IconFlask className="w-5 h-5" />
              Inventario
            </button>
            <button 
              onClick={() => setActiveSection('resultados')} 
              className={`w-full flex items-center gap-3 px-4 py-3 text-xs font-bold uppercase tracking-wider rounded-xl transition-all cursor-pointer ${
                activeSection === 'resultados' 
                  ? 'bg-cerulean/10 text-cerulean' 
                  : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'
              }`}
            >
              <IconClipboardList className="w-5 h-5" />
              Resultados
            </button>

            {usuario.rol === 'ADMIN' && (
              <div className="border-t border-slate-100 pt-3 mt-3">
                <p className="px-4 text-[9px] font-bold uppercase tracking-widest text-slate-300 mb-2">Administración</p>
                <button 
                  onClick={() => setActiveSection('sedes')} 
                  className={`w-full flex items-center gap-3 px-4 py-3 text-xs font-bold uppercase tracking-wider rounded-xl transition-all cursor-pointer ${
                    activeSection === 'sedes' 
                      ? 'bg-cerulean/10 text-cerulean' 
                      : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'
                  }`}
                >
                  <IconBuilding className="w-5 h-5" />
                  Sedes
                </button>
                <button 
                  onClick={() => setActiveSection('usuarios')} 
                  className={`w-full flex items-center gap-3 px-4 py-3 text-xs font-bold uppercase tracking-wider rounded-xl transition-all cursor-pointer ${
                    activeSection === 'usuarios' 
                      ? 'bg-cerulean/10 text-cerulean' 
                      : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'
                  }`}
                >
                  <IconUsers className="w-5 h-5" />
                  Usuarios
                </button>
              </div>
            )}
          </nav>
        </div>

        {/* Salir */}
        <button 
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-4 py-3 text-xs font-bold uppercase tracking-wider rounded-xl text-rose-500 hover:bg-rose-50 hover:text-rose-600 transition-all cursor-pointer"
        >
          <IconPower className="w-5 h-5" />
          Cerrar Sesión
        </button>
      </aside>

      {/* CONTENIDO PRINCIPAL */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        
        {/* Cabecera del Panel */}
        <header className="h-20 bg-white border-b border-slate-100 px-4 sm:px-6 flex items-center justify-between shrink-0">
          {/* Título en escritorio, oculto en móviles */}
          <div className="hidden md:block">
            <h2 className="font-jakarta text-lg font-extrabold text-slate-850">Operaciones Clínicas</h2>
            <p className="text-slate-400 text-[10px] uppercase font-bold tracking-widest mt-0.5">Módulo de Administración</p>
          </div>

          {/* Logo visible solo en móviles */}
          <div className="flex items-center gap-2 md:hidden">
            <div className="relative flex items-center justify-center">
              <div className="absolute w-7 h-7 rounded-full bg-cerulean/15 animate-pulse"></div>
              <div className="relative w-5 h-5 border border-cerulean/40 flex items-center justify-center rotate-45">
                <IconHexagon className="text-cerulean w-3.5 h-3.5 -rotate-45" />
              </div>
            </div>
            <span className="font-jakarta font-extrabold text-sm tracking-tighter text-slate-850 leading-none">
              AQUA<span className="text-cerulean">LAB</span>
            </span>
          </div>

          {/* Sede selector & User profile */}
          <div className="flex items-center gap-3">
            {/* Custom Sede Selector Dropdown */}
            <div className="relative">
              <button 
                onClick={() => setShowSedeDropdown(!showSedeDropdown)}
                className="flex items-center bg-slate-50 border border-slate-100 hover:bg-slate-100/50 rounded-xl px-2.5 py-1.5 sm:px-3 sm:py-2 gap-1.5 sm:gap-2 text-[11px] sm:text-xs font-bold text-slate-650 transition-colors cursor-pointer"
              >
                <IconBuilding className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-cerulean" />
                <span>Sede {sedeActiva}</span>
                <svg className={`w-3 h-3 text-slate-400 transition-transform ${showSedeDropdown ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {showSedeDropdown && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setShowSedeDropdown(false)}></div>
                  
                  <div className="absolute right-0 mt-2 w-40 sm:w-44 bg-white/95 backdrop-blur-md border border-slate-100 rounded-xl shadow-lg py-1.5 z-50">
                    {sedes.map(s => (
                      <button
                        key={s.id}
                        onClick={() => {
                          setSedeActivaId(s.id);
                          setShowSedeDropdown(false);
                        }}
                        className={`w-full text-left px-4 py-2.5 text-[11px] sm:text-xs font-bold transition-colors flex items-center gap-2 cursor-pointer ${
                          sedeActivaId === s.id ? 'text-cerulean bg-cerulean/5' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-800'
                        }`}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${sedeActivaId === s.id ? 'bg-cerulean' : 'bg-transparent'}`}></span>
                        {s.nombre}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Logout Mobile */}
            <button 
              onClick={onLogout} 
              className="p-2 bg-rose-50 text-rose-500 hover:bg-rose-100 hover:text-rose-600 rounded-xl cursor-pointer md:hidden"
              title="Cerrar Sesión"
            >
              <IconPower className="w-4.5 h-4.5" />
            </button>
          </div>
        </header>

        {/* CONTENEDOR DE SECCIÓN (SCROLL) */}
        <main className="flex-1 p-4 sm:p-6 pb-28 md:pb-6 overflow-y-auto">

          {/* VISTA RESUMEN */}
          {activeSection === 'resumen' && (
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
          )}

          {/* VISTA INVENTARIO */}
          {activeSection === 'inventario' && (
            <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-xs">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <div>
                  <h3 className="font-jakarta text-base font-bold text-slate-800 uppercase tracking-wider">Inventario de Reactivos</h3>
                  <p className="text-slate-400 text-xs mt-1">Control de entrada y salida de materiales para la sede: {sedeActiva}</p>
                </div>
              </div>

              <div className="border border-slate-100 rounded-xl overflow-x-auto w-full max-w-full block touch-pan-x">

                {/* Indicador de scroll horizontal en mobile */}
                <div className="sm:hidden text-center pb-2 -mb-2">
                  <span className="text-[9px] text-slate-300 uppercase tracking-wider font-medium animate-pulse">← Desliza para ver más →</span>
                </div>

                <table className="w-full text-left text-xs border-collapse min-w-[750px]">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-100 text-[10px] font-bold uppercase tracking-wider text-slate-550">
                      <th className="p-4">Código</th>
                      <th className="p-4">Reactivo / Insumo</th>
                      <th className="p-4">Unidad de Medida</th>
                      <th className="p-4">Stock Mínimo</th>
                      <th className="p-4">Stock Actual</th>
                      <th className="p-4 text-right">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    {reactivos.map((reactivo) => {
                      const isLowStock = reactivo.stock <= reactivo.minStock;
                      return (
                        <tr key={reactivo.id} className="hover:bg-slate-50/50 transition-colors">
                          <td className="p-4 font-mono font-bold text-slate-400">{reactivo.id}</td>
                          <td className="p-4">
                            <span className="font-semibold text-slate-800">{reactivo.name}</span>
                            {isLowStock && (
                              <span className="ml-2 px-1.5 py-0.5 bg-amber-50 text-amber-600 rounded text-[9px] font-bold">STOCK BAJO</span>
                            )}
                          </td>
                          <td className="p-4 text-slate-500">{reactivo.unit}</td>
                          <td className="p-4 text-slate-400">{reactivo.minStock}</td>
                          <td className="p-4">
                            <span className={`font-bold text-sm ${isLowStock ? 'text-amber-500' : 'text-slate-850'}`}>
                              {reactivo.stock}
                            </span>
                          </td>
                          <td className="p-4 flex justify-end gap-2">
                            <button 
                              onClick={() => openMovimientoModal(reactivo, 'Entrada')}
                              className="p-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-600 rounded-xl transition-colors cursor-pointer flex items-center gap-1 font-bold text-[10px] uppercase"
                            >
                              <IconPlus className="w-3.5 h-3.5" /> Entrada
                            </button>
                            <button 
                              onClick={() => openMovimientoModal(reactivo, 'Salida')}
                              className="p-2 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-xl transition-colors cursor-pointer flex items-center gap-1 font-bold text-[10px] uppercase"
                            >
                              <IconMinus className="w-3.5 h-3.5" /> Salida
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* VISTA PACIENTES */}
          {activeSection === 'pacientes' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Formulario/Lista Panel Izquierdo (2 Columnas) */}
              <div className="lg:col-span-2 space-y-6">
                
                {/* Registro de Paciente nuevo */}
                {isRegistrandoPaciente ? (
                  <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-xs">
                    <div className="flex justify-between items-center mb-6">
                      <h3 className="font-jakarta text-base font-bold text-slate-800 uppercase tracking-wider">Nuevo Registro de Paciente</h3>
                      <button 
                        onClick={() => setIsRegistrandoPaciente(false)}
                        className="px-3 py-1.5 border border-slate-200 text-slate-500 hover:bg-slate-50 rounded-lg text-xs font-semibold cursor-pointer"
                      >
                        Ver Lista
                      </button>
                    </div>

                    <form onSubmit={handleRegistrarPaciente} className="space-y-6">
                      
                      {/* DNI Consulta Row */}
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end">
                        <div className="sm:col-span-2">
                          <label className="text-[10px] uppercase tracking-wider text-slate-400 font-bold mb-2 block">DNI / Documento</label>
                          <input 
                            type="text" 
                            maxLength={8}
                            value={dniInput}
                            onChange={(e) => setDniInput(e.target.value.replace(/\D/g, ''))}
                            placeholder="Ingrese DNI (8 dígitos)"
                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-cerulean focus:bg-white text-slate-700 font-medium text-sm transition-all"
                            required
                          />
                        </div>
                        <button 
                          type="button"
                          onClick={handleConsultarReniec}
                          disabled={loadingReniec || dniInput.length !== 8}
                          className="w-full py-3.5 bg-cerulean hover:bg-cerulean/95 disabled:bg-slate-200 text-white font-bold uppercase tracking-wider text-xs rounded-xl shadow-md transition-colors cursor-pointer flex justify-center items-center gap-2"
                        >
                          {loadingReniec ? (
                            <>
                              <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                              </svg>
                              Consultando...
                            </>
                          ) : 'Consultar RENIEC'}
                        </button>
                      </div>
                      {reniecRemaining !== null && (
                        <div className="flex justify-end -mt-2">
                          <span className="text-[10px] text-slate-400 font-medium">
                            Consultas disponibles: <strong className={reniecRemaining <= 10 ? 'text-red-500' : 'text-emerald-500'}>{reniecRemaining}</strong> / 100
                          </span>
                        </div>
                      )}

                      {/* Nombres y Apellidos */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="text-[10px] uppercase tracking-wider text-slate-400 font-bold mb-2 block">Nombre Completo</label>
                          <input 
                            type="text" 
                            value={nombreInput}
                            onChange={(e) => setNombreInput(e.target.value)}
                            placeholder="Nombre del Paciente"
                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-cerulean focus:bg-white text-slate-700 font-medium text-sm transition-all"
                            required
                          />
                        </div>
                        <div>
                          <label className="text-[10px] uppercase tracking-wider text-slate-400 font-bold mb-2 block">Apellidos</label>
                          <input 
                            type="text" 
                            value={apellidoInput}
                            onChange={(e) => setApellidoInput(e.target.value)}
                            placeholder="Apellidos del Paciente"
                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-cerulean focus:bg-white text-slate-700 font-medium text-sm transition-all"
                            required
                          />
                        </div>
                      </div>

                      {/* Contactos */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="text-[10px] uppercase tracking-wider text-slate-400 font-bold mb-2 block">Teléfono (Opcional)</label>
                          <input 
                            type="tel" 
                            value={telefonoInput}
                            onChange={(e) => setTelefonoInput(e.target.value)}
                            placeholder="Ej: 999888777"
                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-cerulean focus:bg-white text-slate-700 font-medium text-sm transition-all"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] uppercase tracking-wider text-slate-400 font-bold mb-2 block">Correo Electrónico (Opcional)</label>
                          <input 
                            type="email" 
                            value={correoInput}
                            onChange={(e) => setCorreoInput(e.target.value)}
                            placeholder="correo@ejemplo.com"
                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-cerulean focus:bg-white text-slate-700 font-medium text-sm transition-all"
                          />
                        </div>
                      </div>

                      <button 
                        type="submit"
                        className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold uppercase tracking-wider text-xs rounded-xl shadow-md transition-colors cursor-pointer"
                      >
                        Registrar Paciente en Sede {sedeActiva}
                      </button>

                    </form>
                  </div>
                ) : (
                  <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-xs">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                      <div>
                        <h3 className="font-jakarta text-base font-bold text-slate-800 uppercase tracking-wider">Historial de Pacientes</h3>
                        <p className="text-slate-400 text-xs mt-1">Pacientes registrados en esta sede</p>
                      </div>
                      <button 
                        onClick={() => setIsRegistrandoPaciente(true)}
                        className="px-4 py-2.5 bg-cerulean hover:bg-cerulean/95 text-white font-bold uppercase tracking-wider text-[10px] rounded-xl shadow-sm transition-colors cursor-pointer"
                      >
                        + Nuevo Paciente
                      </button>
                    </div>

                    {/* Tabla de Pacientes */}
                    <div className="border border-slate-100 rounded-xl overflow-x-auto w-full max-w-full block touch-pan-x">
                      <table className="w-full text-left text-xs border-collapse min-w-[650px]">
                        <thead>
                          <tr className="bg-slate-50 border-b border-slate-100 text-[10px] font-bold uppercase tracking-wider text-slate-550">
                            <th className="p-4">Documento / DNI</th>
                            <th className="p-4">Paciente</th>
                            <th className="p-4">Contacto</th>
                            <th className="p-4 text-right">Análisis</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 text-slate-700">
                          {pacientes.length === 0 ? (
                            <tr>
                              <td colSpan={4} className="p-8 text-center text-slate-450">No hay pacientes registrados en esta sede.</td>
                            </tr>
                          ) : (
                            pacientes.map((paciente) => (
                              <tr key={paciente.dni} className="hover:bg-slate-50/50 transition-colors">
                                <td className="p-4 font-mono font-bold text-slate-400">{paciente.dni}</td>
                                <td className="p-4">
                                  <span className="font-bold text-slate-800">{paciente.nombre} {paciente.apellido}</span>
                                  <p className="text-[10px] text-slate-400 mt-0.5">Reg: {paciente.fechaRegistro}</p>
                                </td>
                                <td className="p-4">
                                  <p className="text-slate-550">{paciente.telefono || 'Sin tel.'}</p>
                                  <p className="text-[10px] text-slate-400 mt-0.5">{paciente.correo || 'Sin correo'}</p>
                                </td>
                                <td className="p-4 flex justify-end">
                                  <button 
                                    onClick={() => setSelectedPacienteForPrueba(paciente)}
                                    className="px-3 py-1.5 bg-cerulean/10 hover:bg-cerulean/20 text-cerulean font-bold text-[10px] uppercase rounded-xl transition-all cursor-pointer"
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

              {/* Panel de Asignar Examen Derecho (1 Columna) */}
              <div className="lg:col-span-1 space-y-6">
                {selectedPacienteForPrueba ? (
                  <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-xs">
                    <h3 className="font-jakarta text-sm font-bold text-slate-800 uppercase tracking-wider mb-4">Generar Orden Médica</h3>
                    <div className="bg-slate-50 rounded-xl p-4 mb-6">
                      <p className="text-slate-400 text-[10px] font-bold uppercase tracking-wider">Paciente Seleccionado</p>
                      <p className="font-bold text-slate-800 mt-1">{selectedPacienteForPrueba.nombre} {selectedPacienteForPrueba.apellido}</p>
                      <p className="text-slate-400 font-mono text-xs mt-0.5">DNI: {selectedPacienteForPrueba.dni}</p>
                    </div>

                    <form onSubmit={handleCrearExamen} className="space-y-6">
                      <div>
                        <label className="text-[10px] uppercase tracking-wider text-slate-400 font-bold mb-2 block">Examen Clínico</label>
                        <select 
                          value={tipoPruebaInput} 
                          onChange={(e) => setTipoPruebaInput(e.target.value)} 
                          className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-cerulean focus:bg-white text-slate-700 font-medium text-sm transition-all cursor-pointer"
                        >
                          <option value="Hemoglobina">Hemoglobina</option>
                          <option value="Glucosa en Ayunas">Glucosa en Ayunas</option>
                          <option value="Colesterol Total">Colesterol Total</option>
                          <option value="Triglicéridos">Triglicéridos</option>
                        </select>
                      </div>

                      <div className="flex gap-2">
                        <button 
                          type="submit" 
                          className="flex-1 py-3 bg-cerulean text-white font-bold uppercase tracking-wider text-xs rounded-xl shadow-md hover:bg-cerulean/95 transition-colors cursor-pointer text-center"
                        >
                          Registrar Orden
                        </button>
                        <button 
                          type="button" 
                          onClick={() => setSelectedPacienteForPrueba(null)}
                          className="py-3 px-4 border border-slate-200 text-slate-500 rounded-xl text-xs font-semibold hover:bg-slate-50 transition-colors cursor-pointer"
                        >
                          Cancelar
                        </button>
                      </div>
                    </form>
                  </div>
                ) : (
                  <div className="bg-slate-50 border border-dashed border-slate-200 rounded-2xl p-6 text-center flex flex-col justify-center items-center min-h-[200px]">
                    <IconClipboardList className="text-slate-350 w-10 h-10 mb-2" />
                    <p className="text-slate-500 font-semibold text-xs leading-relaxed max-w-[200px]">
                      Seleccione un paciente de la lista para emitir una nueva orden clínica.
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* VISTA RESULTADOS */}
          {activeSection === 'resultados' && (
            <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-xs">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <div>
                  <h3 className="font-jakarta text-base font-bold text-slate-800 uppercase tracking-wider">Gestión de Resultados Clínicos</h3>
                  <p className="text-slate-400 text-xs mt-1">Análisis asignados en la sede: {sedeActiva}</p>
                </div>

                {/* Filtro búsqueda rápida */}
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

              {/* Tabla de análisis */}
              <div className="border border-slate-100 rounded-xl overflow-x-auto w-full max-w-full block touch-pan-x">
                <table className="w-full text-left text-xs border-collapse min-w-[750px]">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-100 text-[10px] font-bold uppercase tracking-wider text-slate-550">
                      <th className="p-4">Código Orden</th>
                      <th className="p-4">Paciente DNI</th>
                      <th className="p-4">Análisis</th>
                      <th className="p-4">Fecha</th>
                      <th className="p-4">Estado</th>
                      <th className="p-4">Resultado obtenido</th>
                      <th className="p-4 text-right">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    {pruebas
                      .filter((p) => p.pacienteDni.includes(filterQuery))
                      .length === 0 ? (
                        <tr>
                          <td colSpan={7} className="p-8 text-center text-slate-450">No se encontraron órdenes registradas en esta sede.</td>
                        </tr>
                    ) : (
                      pruebas
                        .filter((p) => p.pacienteDni.includes(filterQuery))
                        .map((prueba) => {
                          const isProcess = prueba.status === 'En Proceso';
                          return (
                            <tr key={prueba.id} className="hover:bg-slate-50/50 transition-colors">
                              <td className="p-4 font-mono font-bold text-slate-400">{prueba.id}</td>
                              <td className="p-4 font-semibold text-slate-800">{prueba.pacienteDni}</td>
                              <td className="p-4 text-slate-650 font-bold">{prueba.examen}</td>
                              <td className="p-4 text-slate-400">{prueba.fecha}</td>
                              <td className="p-4">
                                <span className={`px-2.5 py-1 text-[9px] font-bold uppercase rounded-md ${isProcess ? 'bg-amber-50 text-amber-600 animate-pulse' : 'bg-emerald-50 text-emerald-600'}`}>
                                  {prueba.status}
                                </span>
                              </td>
                              <td className="p-4 text-slate-550 font-semibold">{prueba.resultado || 'Pendiente'}</td>
                              <td className="p-4 flex justify-end gap-2">
                                {isProcess ? (
                                  <button 
                                    onClick={() => openSubirResultadoModal(prueba)}
                                    className="px-3 py-1.5 bg-cerulean text-white font-bold text-[10px] uppercase rounded-xl transition-all cursor-pointer"
                                  >
                                    Cargar Resultado
                                  </button>
                                ) : (
                                  <button 
                                    onClick={() => {
                                      Swal.fire({
                                        title: 'Imprimiendo Reporte',
                                        text: `Se ha enviado el documento de ${prueba.examen} a la cola de impresión.`,
                                        icon: 'info',
                                        timer: 2000,
                                        showConfirmButton: false
                                      });
                                    }}
                                    className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl transition-colors cursor-pointer flex items-center gap-1"
                                    title="Imprimir"
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
            </div>
          )}

          {/* VISTA SEDES (ADMIN) */}
          {activeSection === 'sedes' && (
            <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-xs">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <div>
                  <h3 className="font-jakarta text-base font-bold text-slate-800 uppercase tracking-wider">Gestión de Sedes</h3>
                  <p className="text-slate-400 text-xs mt-1">Administración de sedes de la clínica</p>
                </div>
                <button
                  onClick={async () => {
                    const { value } = await Swal.fire({
                      title: 'Nueva Sede',
                      html: `
                        <div class="text-left font-plex text-sm space-y-4">
                          <div>
                            <label class="block text-xs uppercase font-bold text-slate-500 mb-1">Nombre</label>
                            <input id="swal-nombre" class="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm" placeholder="Ej: San Isidro">
                          </div>
                          <div>
                            <label class="block text-xs uppercase font-bold text-slate-500 mb-1">Dirección</label>
                            <input id="swal-direccion" class="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm" placeholder="Av. Principal 123">
                          </div>
                          <div>
                            <label class="block text-xs uppercase font-bold text-slate-500 mb-1">Teléfono</label>
                            <input id="swal-telefono" class="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm" placeholder="01-5550000">
                          </div>
                        </div>
                      `,
                      showCancelButton: true,
                      confirmButtonText: 'Crear Sede',
                      cancelButtonText: 'Cancelar',
                      confirmButtonColor: '#77D4FC',
                      preConfirm: () => {
                        const nombre = (document.getElementById('swal-nombre') as HTMLInputElement).value.trim();
                        if (!nombre) { Swal.showValidationMessage('El nombre es requerido'); return false; }
                        return {
                          nombre,
                          direccion: (document.getElementById('swal-direccion') as HTMLInputElement).value.trim(),
                          telefono: (document.getElementById('swal-telefono') as HTMLInputElement).value.trim(),
                        };
                      }
                    });
                    if (value) {
                      const ok = await database.crearSede(value);
                      if (ok) {
                        const lista = await database.getSedes();
                        setSedes(lista);
                        Swal.fire({ title: 'Creada', text: 'Sede creada con éxito', icon: 'success', timer: 1500, showConfirmButton: false });
                      }
                    }
                  }}
                  className="px-4 py-2.5 bg-cerulean hover:bg-cerulean/95 text-white font-bold uppercase tracking-wider text-[10px] rounded-xl shadow-sm transition-colors cursor-pointer"
                >
                  + Nueva Sede
                </button>
              </div>

              <div className="border border-slate-100 rounded-xl overflow-x-auto w-full max-w-full block touch-pan-x">
                <div className="sm:hidden text-center pb-2 -mb-2">
                  <span className="text-[9px] text-slate-300 uppercase tracking-wider font-medium animate-pulse">← Desliza para ver más →</span>
                </div>
                <table className="w-full text-left text-xs border-collapse min-w-[650px]">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-100 text-[10px] font-bold uppercase tracking-wider text-slate-550">
                      <th className="p-4">Sede</th>
                      <th className="p-4">Dirección</th>
                      <th className="p-4">Teléfono</th>
                      <th className="p-4">Estado</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    {sedes.length === 0 ? (
                      <tr><td colSpan={4} className="p-8 text-center text-slate-450">No hay sedes registradas</td></tr>
                    ) : (
                      sedes.map(s => (
                        <tr key={s.id} className="hover:bg-slate-50/50 transition-colors">
                          <td className="p-4 font-bold text-slate-800">{s.nombre}</td>
                          <td className="p-4 text-slate-500">{s.direccion || '-'}</td>
                          <td className="p-4 text-slate-500">{s.telefono || '-'}</td>
                          <td className="p-4">
                            <span className={`px-2.5 py-1 text-[9px] font-bold uppercase rounded-md ${s.activo ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                              {s.activo ? 'Activo' : 'Inactivo'}
                            </span>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* VISTA USUARIOS (ADMIN) */}
          {activeSection === 'usuarios' && (
            <UsuarioManager />
          )}

        </main>

        {/* MOBILE BOTTOM NAV BAR (Fija en la parte inferior en móvil) */}
        <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-md border-t border-slate-100 p-2.5 flex justify-around items-center z-50 shadow-[0_-4px_20px_-4px_rgba(0,0,0,0.05)]">
          <button 
            onClick={() => setActiveSection('resumen')} 
            className={`p-1.5 rounded-lg flex flex-col items-center gap-0.5 transition-colors cursor-pointer ${activeSection === 'resumen' ? 'text-cerulean' : 'text-slate-400'}`}
          >
            <IconLayoutDashboard className="w-5 h-5" />
            <span className="text-[8px] font-bold uppercase tracking-wider">Dash</span>
          </button>
          <button 
            onClick={() => setActiveSection('pacientes')} 
            className={`p-1.5 rounded-lg flex flex-col items-center gap-0.5 transition-colors cursor-pointer ${activeSection === 'pacientes' ? 'text-cerulean' : 'text-slate-400'}`}
          >
            <IconUsers className="w-5 h-5" />
            <span className="text-[8px] font-bold uppercase tracking-wider">Pacientes</span>
          </button>
          <button 
            onClick={() => setActiveSection('inventario')} 
            className={`p-1.5 rounded-lg flex flex-col items-center gap-0.5 transition-colors cursor-pointer ${activeSection === 'inventario' ? 'text-cerulean' : 'text-slate-400'}`}
          >
            <IconFlask className="w-5 h-5" />
            <span className="text-[8px] font-bold uppercase tracking-wider">Inventario</span>
          </button>
          <button 
            onClick={() => setActiveSection('resultados')} 
            className={`p-1.5 rounded-lg flex flex-col items-center gap-0.5 transition-colors cursor-pointer ${activeSection === 'resultados' ? 'text-cerulean' : 'text-slate-400'}`}
          >
            <IconClipboardList className="w-5 h-5" />
            <span className="text-[8px] font-bold uppercase tracking-wider">Resultados</span>
          </button>

          {usuario.rol === 'ADMIN' && (
            <>
              <button 
                onClick={() => setActiveSection('sedes')} 
                className={`p-1.5 rounded-lg flex flex-col items-center gap-0.5 transition-colors cursor-pointer ${activeSection === 'sedes' ? 'text-cerulean' : 'text-slate-400'}`}
              >
                <IconBuilding className="w-5 h-5" />
                <span className="text-[8px] font-bold uppercase tracking-wider">Sedes</span>
              </button>
              <button 
                onClick={() => setActiveSection('usuarios')} 
                className={`p-1.5 rounded-lg flex flex-col items-center gap-0.5 transition-colors cursor-pointer ${activeSection === 'usuarios' ? 'text-cerulean' : 'text-slate-400'}`}
              >
                <IconUsers className="w-5 h-5" />
                <span className="text-[8px] font-bold uppercase tracking-wider">Users</span>
              </button>
            </>
          )}
        </div>

      </div>
    </div>
  );
};

// --- COMPONENTE DE GESTIÓN DE USUARIOS (ADMIN) ---
const UsuarioManager: React.FC = () => {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);

  const load = async () => {
    const list = await database.getUsuarios();
    setUsuarios(list);
  };

  useEffect(() => { load(); }, []);

  const handleCrear = async () => {
    const { value } = await Swal.fire({
      title: 'Nuevo Usuario',
      html: `
        <div class="text-left font-plex text-sm space-y-4">
          <div>
            <label class="block text-xs uppercase font-bold text-slate-500 mb-1">Username</label>
            <input id="swal-username" class="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm" placeholder="ej: tecnico1">
          </div>
          <div>
            <label class="block text-xs uppercase font-bold text-slate-500 mb-1">Nombre Completo</label>
            <input id="swal-nombre" class="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm" placeholder="Ej: Carlos López">
          </div>
          <div>
            <label class="block text-xs uppercase font-bold text-slate-500 mb-1">Contraseña</label>
            <input id="swal-password" type="password" class="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm">
          </div>
          <div>
            <label class="block text-xs uppercase font-bold text-slate-500 mb-1">Rol</label>
            <select id="swal-rol" class="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm cursor-pointer">
              <option value="DOCTOR">DOCTOR</option>
              <option value="ADMIN">ADMIN</option>
            </select>
          </div>
        </div>
      `,
      showCancelButton: true,
      confirmButtonText: 'Crear Usuario',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#77D4FC',
      preConfirm: () => {
        const username = (document.getElementById('swal-username') as HTMLInputElement).value.trim();
        const nombre = (document.getElementById('swal-nombre') as HTMLInputElement).value.trim();
        const password = (document.getElementById('swal-password') as HTMLInputElement).value.trim();
        const rol = (document.getElementById('swal-rol') as HTMLSelectElement).value;
        if (!username || !nombre || !password) { Swal.showValidationMessage('Todos los campos son requeridos'); return false; }
        return { username, nombre, password, rol };
      }
    });
    if (value) {
      const ok = await database.crearUsuario(value);
      if (ok) {
        await load();
        Swal.fire({ title: 'Creado', text: 'Usuario creado con éxito', icon: 'success', timer: 1500, showConfirmButton: false });
      }
    }
  };

  const handleToggleActivo = async (u: Usuario) => {
    const ok = await database.actualizarUsuario(u.id, { activo: !u.activo });
    if (ok) await load();
  };

  return (
    <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-xs">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h3 className="font-jakarta text-base font-bold text-slate-800 uppercase tracking-wider">Gestión de Usuarios</h3>
          <p className="text-slate-400 text-xs mt-1">Administración de cuentas del sistema</p>
        </div>
        <button
          onClick={handleCrear}
          className="px-4 py-2.5 bg-cerulean hover:bg-cerulean/95 text-white font-bold uppercase tracking-wider text-[10px] rounded-xl shadow-sm transition-colors cursor-pointer"
        >
          + Nuevo Usuario
        </button>
      </div>

      <div className="border border-slate-100 rounded-xl overflow-x-auto w-full max-w-full block touch-pan-x">
        <div className="sm:hidden text-center pb-2 -mb-2">
          <span className="text-[9px] text-slate-300 uppercase tracking-wider font-medium animate-pulse">← Desliza para ver más →</span>
        </div>
        <table className="w-full text-left text-xs border-collapse min-w-[650px]">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-100 text-[10px] font-bold uppercase tracking-wider text-slate-550">
              <th className="p-4">Usuario</th>
              <th className="p-4">Nombre</th>
              <th className="p-4">Rol</th>
              <th className="p-4">Estado</th>
              <th className="p-4 text-right">Acción</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-700">
            {usuarios.length === 0 ? (
              <tr><td colSpan={5} className="p-8 text-center text-slate-450">No hay usuarios registrados</td></tr>
            ) : (
              usuarios.map(u => (
                <tr key={u.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="p-4 font-mono font-bold text-slate-400">{u.username}</td>
                  <td className="p-4 font-bold text-slate-800">{u.nombre}</td>
                  <td className="p-4">
                    <span className={`px-2.5 py-1 text-[9px] font-bold uppercase rounded-md ${u.rol === 'ADMIN' ? 'bg-purple-50 text-purple-600' : 'bg-sky-50 text-sky-600'}`}>
                      {u.rol}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className={`px-2.5 py-1 text-[9px] font-bold uppercase rounded-md ${u.activo ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                      {u.activo ? 'Activo' : 'Inactivo'}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <button
                      onClick={() => handleToggleActivo(u)}
                      className={`px-3 py-1.5 text-[10px] font-bold uppercase rounded-xl transition-all cursor-pointer ${u.activo ? 'bg-rose-50 text-rose-600 hover:bg-rose-100' : 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100'}`}
                    >
                      {u.activo ? 'Desactivar' : 'Activar'}
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Dashboard;
