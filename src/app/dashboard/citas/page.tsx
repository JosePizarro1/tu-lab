"use client";

import React, { useState, useEffect } from 'react';
import {
  IconCalendar,
  IconClock,
  IconUser,
  IconPhone,
  IconPlus,
  IconSearch,
  IconCheck,
  IconX,
  IconAlertCircle,
  IconFilter,
  IconRefresh,
  IconStethoscope,
  IconHeartbeat,
  IconNurse,
  IconTrash,
  IconEdit,
  IconBuilding,
  IconLock,
  IconLockOpen,
  IconBrandWhatsapp,
  IconBell,
  IconBellCheck
} from '@tabler/icons-react';
import { database, Cita, Especialidad, Sede, HorarioBloqueado } from '@/services/db';

import Swal from 'sweetalert2';

const SEDES_DEFAULT = [
  { id: 'SEDE-LEGUIA', nombre: 'Sede Av. Leguía', direccion: 'Av. Leguía N° 778-C, Tacna' },
  { id: 'SEDE-MELENDEZ', nombre: 'Sede Patricio Meléndez', direccion: 'Calle Patricio Meléndez N° 382 Of. 303, Tacna' },
];

export default function CitasDashboardPage() {
  const hoyStr = new Date().toISOString().split('T')[0];

  const [citas, setCitas] = useState<Cita[]>([]);
  const [especialidades, setEspecialidades] = useState<Especialidad[]>([]);
  const [sedes, setSedes] = useState<Sede[]>([]);
  const [bloqueos, setBloqueos] = useState<HorarioBloqueado[]>([]);
  const [loading, setLoading] = useState(true);

  // Filtros
  const [rangoTipo, setRangoTipo] = useState<'hoy' | 'semana' | '7dias' | 'mes' | 'custom'>('hoy');
  const [fechaFiltro, setFechaFiltro] = useState<string>(hoyStr);
  const [espFiltro, setEspFiltro] = useState<string>('');
  const [sedeFiltro, setSedeFiltro] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState<string>('');

  // Modal de Nueva Cita Presencial / Telefónica
  const [modalAbierto, setModalAbierto] = useState(false);
  const [guardando, setGuardando] = useState(false);

  // Modal de Bloqueo de Horarios
  const [modalBloqueoAbierto, setModalBloqueoAbierto] = useState(false);
  const [guardandoBloqueo, setGuardandoBloqueo] = useState(false);
  const [bloqueoSedeId, setBloqueoSedeId] = useState('SEDE-LEGUIA');
  const [bloqueoEspId, setBloqueoEspId] = useState('');
  const [bloqueoFecha, setBloqueoFecha] = useState(hoyStr);
  const [bloqueoHoraInicio, setBloqueoHoraInicio] = useState('13:00');
  const [bloqueoHoraFin, setBloqueoHoraFin] = useState('15:00');
  const [bloqueoMotivo, setBloqueoMotivo] = useState('Refrigerio / Mantenimiento');

  // Formulario de cita manual
  const [formSedeId, setFormSedeId] = useState('SEDE-LEGUIA');
  const [formEspId, setFormEspId] = useState('');
  const [formFecha, setFormFecha] = useState(hoyStr);
  const [formHora, setFormHora] = useState('08:00');
  const [formDni, setFormDni] = useState('');
  const [formNombre, setFormNombre] = useState('');
  const [formTelefono, setFormTelefono] = useState('');
  const [formMotivo, setFormMotivo] = useState('');
  const [formOrigen, setFormOrigen] = useState<'presencial' | 'telefono' | 'web'>('presencial');
  const [buscandoReniec, setBuscandoReniec] = useState(false);

  // Calcular rango de fechas según rangoTipo
  const getRangoFechas = () => {
    const hoy = new Date(hoyStr + 'T12:00:00');
    if (rangoTipo === 'hoy') {
      return { fecha: hoyStr };
    }
    if (rangoTipo === 'semana') {
      // De Lunes a Sábado de la semana actual
      const day = hoy.getDay();
      const diffToMonday = day === 0 ? -6 : 1 - day;
      const monday = new Date(hoy);
      monday.setDate(hoy.getDate() + diffToMonday);
      const saturday = new Date(monday);
      saturday.setDate(monday.getDate() + 5);
      return {
        fechaDesde: monday.toISOString().split('T')[0],
        fechaHasta: saturday.toISOString().split('T')[0],
      };
    }
    if (rangoTipo === '7dias') {
      const hasta = new Date(hoy);
      hasta.setDate(hoy.getDate() + 6);
      return {
        fechaDesde: hoyStr,
        fechaHasta: hasta.toISOString().split('T')[0],
      };
    }
    if (rangoTipo === 'mes') {
      const year = hoy.getFullYear();
      const month = String(hoy.getMonth() + 1).padStart(2, '0');
      const lastDay = new Date(year, hoy.getMonth() + 1, 0).getDate();
      return {
        fechaDesde: `${year}-${month}-01`,
        fechaHasta: `${year}-${month}-${String(lastDay).padStart(2, '0')}`,
      };
    }
    // custom
    return { fecha: fechaFiltro };
  };

  // Cargar datos
  const cargarDatos = async () => {
    setLoading(true);
    const { fecha, fechaDesde, fechaHasta } = getRangoFechas();

    const [listaEsp, listaCitas, listaSedes, listaBloqueos] = await Promise.all([
      database.getEspecialidades(),
      database.getCitas(fecha, espFiltro || undefined, sedeFiltro || undefined, fechaDesde, fechaHasta),
      database.getSedes(),
      database.getBloqueos(fecha || fechaDesde || undefined, sedeFiltro || undefined),
    ]);
    setEspecialidades(listaEsp);
    setCitas(listaCitas);
    setSedes(listaSedes.length > 0 ? listaSedes : (SEDES_DEFAULT as any));
    setBloqueos(listaBloqueos);
    if (!formEspId && listaEsp.length > 0) {
      setFormEspId(listaEsp[0].id);
    }
    setLoading(false);
  };

  useEffect(() => {
    cargarDatos();
  }, [rangoTipo, fechaFiltro, espFiltro, sedeFiltro]);


  // Manejador para crear bloqueo
  const handleCrearBloqueo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!bloqueoSedeId || !bloqueoFecha || !bloqueoHoraInicio || !bloqueoHoraFin) {
      Swal.fire('Atención', 'Complete la sede, fecha y rango de horas', 'warning');
      return;
    }

    if (bloqueoHoraInicio >= bloqueoHoraFin) {
      Swal.fire('Atención', 'La hora de inicio debe ser menor a la hora de fin', 'warning');
      return;
    }

    setGuardandoBloqueo(true);
    const res = await database.crearBloqueo({
      sedeId: bloqueoSedeId,
      especialidadId: bloqueoEspId || null,
      fecha: bloqueoFecha,
      horaInicio: bloqueoHoraInicio,
      horaFin: bloqueoHoraFin,
      motivo: bloqueoMotivo,
    });
    setGuardandoBloqueo(false);

    if (!res.ok) {
      Swal.fire('Error', res.error || 'No se pudo guardar el bloqueo', 'error');
      return;
    }

    Swal.fire('Bloqueo Registrado', 'El horario ha quedado inhabilitado para citas en línea y recepción', 'success');
    setModalBloqueoAbierto(false);
    cargarDatos();
  };

  // Manejador para eliminar bloqueo
  const handleEliminarBloqueo = async (bloqueo: HorarioBloqueado) => {
    const confirm = await Swal.fire({
      title: '¿Desbloquear horario?',
      text: `Se habilitará nuevamente el horario ${bloqueo.horaInicio} - ${bloqueo.horaFin} en ${bloqueo.sedeNombre || 'la sede'} para la fecha ${bloqueo.fecha}.`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Sí, desbloquear',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#09283c',
    });

    if (confirm.isConfirmed) {
      const res = await database.eliminarBloqueo(bloqueo.id);
      if (res.ok) {
        Swal.fire('Desbloqueado', 'El horario está disponible nuevamente', 'success');
        setBloqueos(bloqueos.filter(b => b.id !== bloqueo.id));
      } else {
        Swal.fire('Error', res.error || 'No se pudo desbloquear', 'error');
      }
    }
  };

  // Consultar RENIEC en el modal
  const handleDniModal = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, '').slice(0, 8);
    setFormDni(val);

    if (val.length === 8) {
      setBuscandoReniec(true);
      const res = await database.consultarRENIEC(val);
      if (res && res.nombre) {
        setFormNombre(`${res.nombre} ${res.apellido}`.trim());
      }
      setBuscandoReniec(false);
    }
  };

  // Crear Cita Manual (Admin / Recepción)
  const handleSubmitManual = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formEspId || !formFecha || !formHora || !formDni || !formNombre || !formTelefono) {
      Swal.fire('Atención', 'Complete todos los campos obligatorios (*)', 'warning');
      return;
    }

    setGuardando(true);
    const esp = especialidades.find(e => e.id === formEspId);
    const res = await database.crearCita({
      sedeId: formSedeId,
      especialidadId: formEspId,
      fecha: formFecha,
      hora: formHora,
      duracionMinutos: esp?.duracionMinutos || 30,
      pacienteDni: formDni,
      pacienteNombre: formNombre,
      pacienteTelefono: formTelefono,
      motivo: formMotivo,
      origen: formOrigen,
      estado: 'confirmada',
    });
    setGuardando(false);

    if (!res.ok) {
      Swal.fire('Error', res.error || 'No se pudo registrar la cita', 'error');
      return;
    }

    Swal.fire('¡Éxito!', 'Cita agendada correctamente', 'success');
    setModalAbierto(false);
    setFormDni('');
    setFormNombre('');
    setFormTelefono('');
    setFormMotivo('');
    cargarDatos();
  };

  // Consultar RENIEC en recepción para citas web sin nombre
  const handleConsultarReniecCita = async (cita: Cita) => {
    try {
      const res = await database.consultarRENIEC(cita.pacienteDni);
      if (res && res.nombre) {
        const nombreCompleto = `${res.nombre} ${res.apellido}`.trim();
        // Guardar el nombre oficial en la base de datos
        await database.actualizarCita(cita.id, {
          estado: cita.estado,
          pacienteNombre: nombreCompleto,
        });
        setCitas(citas.map(c => c.id === cita.id ? { ...c, pacienteNombre: nombreCompleto } : c));
        Swal.fire({
          title: 'Paciente Identificado',
          text: `${nombreCompleto} (DNI: ${cita.pacienteDni})`,
          icon: 'success',
          confirmButtonColor: '#09283c',
        });
      } else {
        Swal.fire('Atención', 'No se encontró información en RENIEC para este DNI', 'info');
      }
    } catch (e: any) {
      Swal.fire('Error', 'No se pudo consultar RENIEC', 'error');
    }
  };

  // Cambiar estado de una cita con alerta de confirmación
  const handleCambiarEstado = async (cita: Cita, nuevoEstado: 'pendiente' | 'confirmada' | 'completada' | 'cancelada') => {
    const titulos = {
      confirmada: '¿Confirmar esta cita?',
      completada: '¿Marcar cita como Atendida?',
      cancelada: '¿Cancelar esta cita?',
      pendiente: '¿Cambiar a pendiente?',
    };

    const mensajes = {
      confirmada: `La cita de ${cita.pacienteNombre} (${cita.hora} hrs) quedará confirmada en el sistema.`,
      completada: `Se registrará que el paciente ${cita.pacienteNombre} ya fue atendido por el profesional de salud.`,
      cancelada: `La cita de ${cita.pacienteNombre} quedará cancelada y el horario se liberará.`,
      pendiente: `La cita volverá al estado pendiente.`,
    };

    const confirm = await Swal.fire({
      title: titulos[nuevoEstado],
      text: mensajes[nuevoEstado],
      icon: nuevoEstado === 'completada' ? 'success' : nuevoEstado === 'cancelada' ? 'warning' : 'question',
      showCancelButton: true,
      confirmButtonText: nuevoEstado === 'completada' ? 'Sí, marcar como atendida' : 'Sí, confirmar',
      cancelButtonText: 'Volver',
      confirmButtonColor: nuevoEstado === 'completada' ? '#09283c' : nuevoEstado === 'cancelada' ? '#fb5962' : '#10b981',
    });

    if (!confirm.isConfirmed) return;

    const res = await database.actualizarCita(cita.id, { estado: nuevoEstado });
    if (!res.ok) {
      Swal.fire('Error', res.error || 'No se pudo actualizar el estado', 'error');
      return;
    }
    setCitas(citas.map(c => c.id === cita.id ? { ...c, estado: nuevoEstado } : c));

    Swal.fire({
      toast: true,
      position: 'top-end',
      icon: 'success',
      title: nuevoEstado === 'completada' ? 'Cita marcada como Atendida' : 'Estado actualizado',
      showConfirmButton: false,
      timer: 2500,
    });
  };

  // Enviar recordatorio por WhatsApp y registrar en BD
  const handleEnviarRecordatorioWhatsApp = async (cita: Cita) => {
    if (!cita.pacienteTelefono) {
      Swal.fire('Atención', 'Esta cita no tiene número de teléfono registrado', 'warning');
      return;
    }

    const telLimpio = cita.pacienteTelefono.replace(/\D/g, '');
    const sedeNombre = cita.sedeNombre || (cita.sedeId?.includes('MELENDEZ') ? 'Sede Patricio Meléndez' : 'Sede Av. Leguía');
    const pacienteNombre = cita.pacienteNombre && cita.pacienteNombre !== 'Por confirmar' ? cita.pacienteNombre : 'Estimado(a) paciente';

    // Formato de fecha legible
    const fechaFormateada = cita.fecha ? cita.fecha.split('-').reverse().join('/') : cita.fecha;

    const mensaje = encodeURIComponent(
      `Hola *${pacienteNombre}*, te saludamos de *UNIDOSLAB Tacna* 🏥.\n\n` +
      `Te recordamos tu cita médica programada:\n` +
      `🩺 *Especialidad:* ${cita.especialidadNombre || 'Consulta Médica'}\n` +
      `📅 *Fecha:* ${fechaFormateada}\n` +
      `⏰ *Hora:* ${cita.hora} hrs\n` +
      `📍 *Lugar:* ${sedeNombre}\n\n` +
      `Por favor indícanos si confirmas tu asistencia respondiendo a este mensaje. ¡Te esperamos!`
    );

    const url = `https://wa.me/51${telLimpio}?text=${mensaje}`;

    // Abrir WhatsApp en nueva pestaña
    window.open(url, '_blank');

    // Registrar en base de datos la marca del recordatorio
    const ahoraIso = new Date().toISOString();
    await database.actualizarCita(cita.id, {
      recordatorioEnviado: true,
      recordatorioEnviadoEn: ahoraIso,
    });

    setCitas(citas.map(c => c.id === cita.id ? {
      ...c,
      recordatorioEnviado: true,
      recordatorioEnviadoEn: ahoraIso
    } : c));

    Swal.fire({
      toast: true,
      position: 'top-end',
      icon: 'success',
      title: 'Recordatorio enviado y registrado',
      showConfirmButton: false,
      timer: 3000,
    });
  };



  // Cancelar / Eliminar Cita
  const handleEliminarCita = async (cita: Cita) => {
    const confirm = await Swal.fire({
      title: '¿Eliminar cita?',
      text: `Se eliminará la cita de ${cita.pacienteNombre} a las ${cita.hora} hrs.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#fb5962',
    });

    if (confirm.isConfirmed) {
      const res = await database.eliminarCita(cita.id);
      if (res.ok) {
        Swal.fire('Eliminada', 'La cita fue eliminada del sistema', 'success');
        setCitas(citas.filter(c => c.id !== cita.id));
      } else {
        Swal.fire('Error', res.error || 'No se pudo eliminar', 'error');
      }
    }
  };

  // Filtrado por buscador de texto (DNI o nombre)
  const citasFiltradas = citas.filter((c) => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    return (
      c.pacienteNombre.toLowerCase().includes(term) ||
      c.pacienteDni.includes(term) ||
      (c.pacienteTelefono && c.pacienteTelefono.includes(term))
    );
  });

  const getEstadoBadge = (estado: string) => {
    switch (estado) {
      case 'confirmada':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">Confirmada</span>;
      case 'completada':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-100 text-blue-800">Atendida</span>;
      case 'cancelada':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-100 text-rose-800">Cancelada</span>;
      default:
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800">Pendiente</span>;
    }
  };

  const getOrigenBadge = (origen: string) => {
    switch (origen) {
      case 'web':
        return <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-indigo-50 text-indigo-600 border border-indigo-100">Web</span>;
      case 'telefono':
        return <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-50 text-emerald-600 border border-emerald-100">Teléfono</span>;
      default:
        return <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-amber-50 text-amber-600 border border-amber-100">Presencial</span>;
    }
  };

  return (
    <div className="space-y-6">
      
      {/* HEADER DE PÁGINA */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <h1 className="text-2xl font-extrabold text-[#09283c] tracking-tight">
            Gestión de Citas y Agenda Médica
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Administra citas en las sedes de Tacna (Av. Leguía y Patricio Meléndez).
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={cargarDatos}
            className="p-2.5 border border-slate-200 hover:bg-slate-50 text-slate-600 rounded-xl transition-colors cursor-pointer"
            title="Refrescar lista"
          >
            <IconRefresh className="w-5 h-5" />
          </button>

          <button
            onClick={() => setModalBloqueoAbierto(true)}
            className="px-4 py-2.5 bg-[#09283c] hover:bg-[#143d59] text-white font-bold text-sm rounded-xl shadow-xs transition-colors flex items-center gap-2 cursor-pointer"
          >
            <IconLock className="w-4 h-4 text-rose-400" />
            <span>Bloquear Horarios</span>
          </button>

          <button
            onClick={() => setModalAbierto(true)}
            className="px-4 py-2.5 bg-[#fb5962] hover:bg-[#e54550] text-white font-bold text-sm rounded-xl shadow-xs transition-colors flex items-center gap-2 cursor-pointer"
          >
            <IconPlus className="w-4 h-4" />
            <span>Nueva Cita Presencial</span>
          </button>
        </div>
      </div>

      {/* FILTROS Y ESTADÍSTICAS RÁPIDAS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Filtro Fecha y Período */}
        <div className="bg-white p-4 rounded-xl border border-slate-200">
          <div className="flex items-center justify-between mb-2">
            <label className="block text-xs font-extrabold text-slate-500 uppercase tracking-wider">
              Período de Agenda
            </label>
          </div>

          {/* Botones de acceso rápido */}
          <div className="grid grid-cols-4 gap-1 mb-2.5 bg-slate-100 p-1 rounded-lg text-[11px] font-bold">
            <button
              type="button"
              onClick={() => setRangoTipo('hoy')}
              className={`py-1 rounded text-center transition-colors cursor-pointer ${
                rangoTipo === 'hoy' ? 'bg-white text-[#09283c] shadow-2xs' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Hoy
            </button>
            <button
              type="button"
              onClick={() => setRangoTipo('semana')}
              className={`py-1 rounded text-center transition-colors cursor-pointer ${
                rangoTipo === 'semana' ? 'bg-white text-[#09283c] shadow-2xs' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Semana
            </button>
            <button
              type="button"
              onClick={() => setRangoTipo('7dias')}
              className={`py-1 rounded text-center transition-colors cursor-pointer ${
                rangoTipo === '7dias' ? 'bg-white text-[#09283c] shadow-2xs' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              +7 Días
            </button>
            <button
              type="button"
              onClick={() => setRangoTipo('mes')}
              className={`py-1 rounded text-center transition-colors cursor-pointer ${
                rangoTipo === 'mes' ? 'bg-white text-[#09283c] shadow-2xs' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Mes
            </button>
          </div>

          <input
            type="date"
            value={fechaFiltro}
            onChange={(e) => {
              setFechaFiltro(e.target.value);
              setRangoTipo('custom');
            }}
            className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-xs font-semibold text-slate-800 focus:outline-none focus:border-[#fb5962]"
            title="Elegir fecha puntual"
          />
        </div>


        {/* Filtro Sede */}
        <div className="bg-white p-4 rounded-xl border border-slate-200">
          <label className="block text-xs font-extrabold text-slate-500 uppercase tracking-wider mb-2">
            Sede en Tacna
          </label>
          <select
            value={sedeFiltro}
            onChange={(e) => setSedeFiltro(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm font-semibold text-slate-800 focus:outline-none focus:border-[#fb5962]"
          >
            <option value="">Todas las Sedes</option>
            {sedes.map((s) => (
              <option key={s.id} value={s.id}>{s.nombre}</option>
            ))}
          </select>
        </div>

        {/* Filtro Especialidad */}
        <div className="bg-white p-4 rounded-xl border border-slate-200">
          <label className="block text-xs font-extrabold text-slate-500 uppercase tracking-wider mb-2">
            Especialidad
          </label>
          <select
            value={espFiltro}
            onChange={(e) => setEspFiltro(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm font-semibold text-slate-800 focus:outline-none focus:border-[#fb5962]"
          >
            <option value="">Todas las Especialidades</option>
            {especialidades.map((e) => (
              <option key={e.id} value={e.id}>{e.nombre}</option>
            ))}
          </select>
        </div>

        {/* Buscador de Paciente */}
        <div className="bg-white p-4 rounded-xl border border-slate-200">
          <label className="block text-xs font-extrabold text-slate-500 uppercase tracking-wider mb-2">
            Buscar por Paciente o DNI
          </label>
          <div className="relative">
            <IconSearch className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
            <input
              type="text"
              placeholder="Buscar DNI o nombre..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-800 focus:outline-none focus:border-[#fb5962]"
            />
          </div>
        </div>
      </div>

      {/* SECCIÓN DE HORARIOS BLOQUEADOS ACTIVOS (SI EXISTEN PARA LA FECHA O FILTRO) */}
      {bloqueos.length > 0 && (
        <div className="bg-amber-50/70 border border-amber-200 rounded-2xl p-4 sm:p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2 text-amber-900 font-bold text-sm">
              <IconLock className="w-4 h-4 text-amber-700" />
              <span>Horarios Bloqueados en esta Fecha / Sede ({bloqueos.length})</span>
            </div>
            <span className="text-xs text-amber-700">Inhabilitados para reserva online y presencial</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {bloqueos.map((b) => (
              <div
                key={b.id}
                className="bg-white border border-amber-200/80 rounded-xl p-3 flex items-start justify-between shadow-2xs"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-sm text-[#09283c]">
                      {b.horaInicio} - {b.horaFin}
                    </span>
                    <span className="text-[10px] uppercase font-extrabold tracking-wide px-1.5 py-0.5 rounded bg-amber-100 text-amber-800">
                      {b.sedeNombre || (b.sedeId?.includes('MELENDEZ') ? 'P. Meléndez' : 'Av. Leguía')}
                    </span>
                  </div>
                  <div className="text-xs text-slate-500 mt-1">
                    {b.especialidadNombre ? `Especialidad: ${b.especialidadNombre}` : 'Todas las especialidades'}
                  </div>
                  <div className="text-xs text-slate-700 font-medium italic mt-0.5">
                    "{b.motivo || 'Bloqueado por administración'}"
                  </div>
                </div>
                <button
                  onClick={() => handleEliminarBloqueo(b)}
                  className="p-1.5 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors cursor-pointer"
                  title="Desbloquear horario"
                >
                  <IconLockOpen className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TABLA PRINCIPAL DE CITAS */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">

        <div className="px-6 py-4 border-b border-slate-200 flex justify-between items-center">
          <h2 className="font-extrabold text-[#09283c] text-base">
            Citas Programadas ({citasFiltradas.length})
          </h2>
          <span className="text-xs font-bold text-slate-500">
            {rangoTipo === 'hoy'
              ? `Hoy (${hoyStr})`
              : rangoTipo === 'semana'
              ? 'Esta Semana (Lun - Sáb)'
              : rangoTipo === '7dias'
              ? 'Próximos 7 días'
              : rangoTipo === 'mes'
              ? 'Mes en curso'
              : `Fecha: ${fechaFiltro}`}
          </span>
        </div>

        {loading ? (
          <div className="py-16 text-center text-slate-400 text-sm font-bold">
            Cargando agenda de citas...
          </div>
        ) : citasFiltradas.length === 0 ? (
          <div className="py-16 text-center text-slate-400">
            <IconCalendar className="w-12 h-12 mx-auto mb-2 opacity-30" />
            <p className="text-sm font-medium">No hay citas registradas para este filtro o período.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 text-xs font-bold uppercase tracking-wider">
                <tr>
                  {rangoTipo !== 'hoy' && <th className="py-3 px-4">Fecha</th>}
                  <th className="py-3 px-4">Hora</th>
                  <th className="py-3 px-4">Sede</th>
                  <th className="py-3 px-4">Paciente</th>
                  <th className="py-3 px-4">Especialidad</th>
                  <th className="py-3 px-4">Contacto</th>
                  <th className="py-3 px-4">Origen</th>
                  <th className="py-3 px-4">Estado</th>
                  <th className="py-3 px-4 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">

                {citasFiltradas.map((c) => (
                  <tr key={c.id} className="hover:bg-slate-50/70 transition-colors">
                    {/* Fecha (solo en vistas de rango) */}
                    {rangoTipo !== 'hoy' && (
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span className="font-mono font-bold text-xs text-slate-700 bg-slate-100 px-2.5 py-1 rounded-md inline-block">
                          {c.fecha ? c.fecha.split('-').reverse().join('/') : '-'}
                        </span>
                      </td>
                    )}

                    {/* Hora */}
                    <td className="py-3.5 px-4 font-mono font-extrabold text-[#09283c] whitespace-nowrap">
                      <div className="flex items-center gap-1.5">
                        <IconClock className="w-4 h-4 text-slate-400" />
                        <span>{c.hora}</span>
                      </div>
                    </td>

                    {/* Sede */}
                    <td className="py-3.5 px-4 font-semibold text-slate-700 whitespace-nowrap">
                      <span className="text-xs bg-slate-100 px-2 py-1 rounded-md text-slate-700">
                        {c.sedeNombre || (c.sedeId?.includes('MELENDEZ') ? 'P. Meléndez' : 'Av. Leguía')}
                      </span>
                    </td>


                    {/* Paciente */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2">
                        <span className={`font-bold ${c.pacienteNombre === 'Por confirmar' ? 'text-amber-600 italic' : 'text-[#09283c]'}`}>
                          {c.pacienteNombre}
                        </span>
                        {c.pacienteNombre === 'Por confirmar' && (
                          <button
                            type="button"
                            onClick={() => handleConsultarReniecCita(c)}
                            className="px-2 py-0.5 bg-sky-50 hover:bg-sky-100 text-sky-700 text-[10px] font-extrabold rounded-md border border-sky-200 transition-colors cursor-pointer"
                            title="Consultar RENIEC para este paciente"
                          >
                            RENIEC
                          </button>
                        )}
                      </div>
                      <div className="text-xs text-slate-500 font-mono">DNI: {c.pacienteDni}</div>
                    </td>

                    {/* Especialidad */}
                    <td className="py-3.5 px-4">
                      <span className="font-semibold text-slate-800">{c.especialidadNombre}</span>
                      {c.motivo && (
                        <div className="text-xs text-slate-400 truncate max-w-[200px]" title={c.motivo}>
                          {c.motivo}
                        </div>
                      )}
                    </td>

                    {/* Contacto y Recordatorio */}
                    <td className="py-3.5 px-4">
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => handleEnviarRecordatorioWhatsApp(c)}
                            title={c.recordatorioEnviado ? 'Reenviar recordatorio por WhatsApp' : 'Enviar recordatorio por WhatsApp'}
                            className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                              c.recordatorioEnviado
                                ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200'
                                : 'bg-[#25D366]/10 text-[#25D366] hover:bg-[#25D366]/20 border border-[#25D366]/30'
                            }`}
                          >
                            <IconBrandWhatsapp className="w-3.5 h-3.5" />
                            <span>{c.pacienteTelefono}</span>
                          </button>
                        </div>

                        {/* Indicador de si ya se envió el recordatorio */}
                        {c.recordatorioEnviado ? (
                          <div className="flex items-center gap-1 text-[10px] text-emerald-600 font-bold">
                            <IconBellCheck className="w-3 h-3 text-emerald-500 shrink-0" />
                            <span>Recordatorio enviado</span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-1 text-[10px] text-slate-400 font-medium">
                            <IconBell className="w-3 h-3 text-slate-300 shrink-0" />
                            <span>Sin recordatorio</span>
                          </div>
                        )}
                      </div>
                    </td>


                    {/* Origen */}
                    <td className="py-3.5 px-4">
                      {getOrigenBadge(c.origen)}
                    </td>

                    {/* Estado */}
                    <td className="py-3.5 px-4">
                      {getEstadoBadge(c.estado)}
                    </td>

                    {/* Acciones */}
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {c.estado === 'pendiente' && (
                          <button
                            onClick={() => handleCambiarEstado(c, 'confirmada')}
                            title="Confirmar Cita"
                            className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600 hover:bg-emerald-100 transition-colors cursor-pointer"
                          >
                            <IconCheck className="w-4 h-4" />
                          </button>
                        )}
                        {c.estado !== 'completada' && c.estado !== 'cancelada' && (
                          <button
                            onClick={() => handleCambiarEstado(c, 'completada')}
                            title="Marcar como Atendida"
                            className="p-1.5 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors cursor-pointer"
                          >
                            <IconStethoscope className="w-4 h-4" />
                          </button>
                        )}
                        <button
                          onClick={() => handleEliminarCita(c)}
                          title="Eliminar Cita"
                          className="p-1.5 rounded-lg bg-rose-50 text-rose-500 hover:bg-rose-100 transition-colors cursor-pointer"
                        >
                          <IconTrash className="w-4 h-4" />
                        </button>

                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* MODAL PARA AGENDAR CITA PRESENCIAL */}
      {modalAbierto && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h3 className="text-lg font-bold text-[#09283c]">
                Registrar Cita Presencial / Teléfono
              </h3>
              <button
                onClick={() => setModalAbierto(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <IconX className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitManual} className="space-y-4">
              
              {/* Sede */}
              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Sede de Atención *</label>
                <select
                  value={formSedeId}
                  onChange={(e) => setFormSedeId(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-sm font-semibold"
                >
                  {sedes.map(s => (
                    <option key={s.id} value={s.id}>{s.nombre} ({s.direccion})</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {/* Especialidad */}
                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Especialidad *</label>
                  <select
                    value={formEspId}
                    onChange={(e) => setFormEspId(e.target.value)}
                    required
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-sm font-semibold"
                  >
                    {especialidades.map(e => (
                      <option key={e.id} value={e.id}>{e.nombre}</option>
                    ))}
                  </select>
                </div>

                {/* Origen */}
                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Origen *</label>
                  <select
                    value={formOrigen}
                    onChange={(e) => setFormOrigen(e.target.value as any)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-sm font-semibold"
                  >
                    <option value="presencial">Presencial (Vino a sede)</option>
                    <option value="telefono">Llamada telefónica</option>
                    <option value="web">Web</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {/* Fecha */}
                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Fecha *</label>
                  <input
                    type="date"
                    required
                    value={formFecha}
                    onChange={(e) => setFormFecha(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-sm font-semibold"
                  />
                </div>

                {/* Hora */}
                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Hora (HH:MM) *</label>
                  <input
                    type="time"
                    required
                    value={formHora}
                    onChange={(e) => setFormHora(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-sm font-semibold"
                  />
                </div>
              </div>

              {/* DNI */}
              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase mb-1">DNI del Paciente *</label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    maxLength={8}
                    placeholder="8 dígitos"
                    value={formDni}
                    onChange={handleDniModal}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-sm font-semibold"
                  />
                  {buscandoReniec && (
                    <span className="absolute right-3 top-2.5 text-xs text-slate-400 font-bold animate-pulse">
                      RENIEC...
                    </span>
                  )}
                </div>
              </div>

              {/* Nombre */}
              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Nombres y Apellidos *</label>
                <input
                  type="text"
                  required
                  placeholder="Nombre completo"
                  value={formNombre}
                  onChange={(e) => setFormNombre(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-sm font-semibold"
                />
              </div>

              {/* Celular */}
              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Teléfono / WhatsApp *</label>
                <input
                  type="tel"
                  required
                  placeholder="Ej. 952920616"
                  value={formTelefono}
                  onChange={(e) => setFormTelefono(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-sm font-semibold"
                />
              </div>

              {/* Motivo */}
              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Motivo / Notas</label>
                <input
                  type="text"
                  placeholder="Ej. Chequeo general, consulta urgente..."
                  value={formMotivo}
                  onChange={(e) => setFormMotivo(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-sm"
                />
              </div>

              <div className="pt-3 flex justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setModalAbierto(false)}
                  className="px-4 py-2 border border-slate-300 rounded-xl text-slate-600 font-bold text-sm hover:bg-slate-50"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={guardando}
                  className="px-5 py-2 bg-[#fb5962] hover:bg-[#e54550] text-white font-bold text-sm rounded-xl shadow-xs"
                >
                  {guardando ? 'Guardando...' : 'Agendar Cita'}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* MODAL DE BLOQUEO DE HORARIOS */}
      {modalBloqueoAbierto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-100 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center">
                  <IconLock className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-extrabold text-[#09283c] text-lg">Bloquear Rango de Horarios</h3>
                  <p className="text-xs text-slate-500">Inhabilita horarios para citas web y presenciales</p>
                </div>
              </div>
              <button
                onClick={() => setModalBloqueoAbierto(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg cursor-pointer"
              >
                <IconX className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCrearBloqueo} className="mt-4 space-y-4">
              
              {/* Sede */}
              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Sede en Tacna *</label>
                <select
                  value={bloqueoSedeId}
                  onChange={(e) => setBloqueoSedeId(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-sm font-semibold"
                >
                  {sedes.map((s) => (
                    <option key={s.id} value={s.id}>{s.nombre}</option>
                  ))}
                </select>
              </div>

              {/* Especialidad (Opcional o todas) */}
              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Especialidad afectada</label>
                <select
                  value={bloqueoEspId}
                  onChange={(e) => setBloqueoEspId(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-sm font-semibold"
                >
                  <option value="">Todas las especialidades (Bloqueo general)</option>
                  {especialidades.map((e) => (
                    <option key={e.id} value={e.id}>{e.nombre}</option>
                  ))}
                </select>
                <span className="text-[11px] text-slate-400 block mt-1">
                  Si dejas "Todas", se bloqueará la atención para cualquier médico en ese horario.
                </span>
              </div>

              {/* Fecha */}
              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Fecha a bloquear *</label>
                <input
                  type="date"
                  required
                  value={bloqueoFecha}
                  onChange={(e) => setBloqueoFecha(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-sm font-semibold"
                />
              </div>

              {/* Rango de Horas */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Hora Inicio *</label>
                  <input
                    type="time"
                    required
                    value={bloqueoHoraInicio}
                    onChange={(e) => setBloqueoHoraInicio(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-sm font-mono font-bold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Hora Fin *</label>
                  <input
                    type="time"
                    required
                    value={bloqueoHoraFin}
                    onChange={(e) => setBloqueoHoraFin(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-sm font-mono font-bold"
                  />
                </div>
              </div>

              {/* Motivo */}
              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Motivo del Bloqueo</label>
                <input
                  type="text"
                  placeholder="Ej. Refrigerio del personal, Capacitación, Feriado..."
                  value={bloqueoMotivo}
                  onChange={(e) => setBloqueoMotivo(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-sm font-medium"
                />
              </div>

              <div className="pt-3 flex justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setModalBloqueoAbierto(false)}
                  className="px-4 py-2 border border-slate-300 rounded-xl text-slate-600 font-bold text-sm hover:bg-slate-50"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={guardandoBloqueo}
                  className="px-5 py-2 bg-[#09283c] hover:bg-[#143d59] text-white font-bold text-sm rounded-xl shadow-xs"
                >
                  {guardandoBloqueo ? 'Bloqueando...' : 'Confirmar Bloqueo'}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}

