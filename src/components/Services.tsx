"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  IconCheck,
  IconChevronRight,
  IconChevronLeft,
  IconPhone,
  IconMapPin,
  IconBuildingHospital,
  IconClock,
  IconInfoCircle,
  IconBuilding
} from '@tabler/icons-react';
import WhatsAppIcon from './icons/WhatsAppIcon';
import { database, Especialidad, Sede } from '@/services/db';
import Swal from 'sweetalert2';

interface SlotColumna {
  fecha: string;
  slots: { hora: string; disponible: boolean }[];
}

interface ServicesProps {
  setActiveTab?: (tab: string) => void;
}

const SEDES_CONFIG = [
  {
    id: 'SEDE-LEGUIA',
    nombre: 'Sede Av. Leguía',
    direccion: 'Av. Leguía N° 778-C, Tacna',
    horarioDesc: 'Lun a Sáb: 7:45 am – 1:00 pm / 3:00 pm – 8:00 pm',
    notaApertura: 'Atención desde las 7:45 am',
  },
  {
    id: 'SEDE-MELENDEZ',
    nombre: 'Sede Patricio Meléndez',
    direccion: 'Calle Patricio Meléndez N° 382 Of. 303, Tacna',
    horarioDesc: 'Lun a Sáb: 8:00 am – 1:00 pm / 3:00 pm – 8:00 pm',
    notaApertura: 'Atención desde las 8:00 am',
  },
];

const DIAS_SEMANA = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
const MESES = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Set', 'Oct', 'Nov', 'Dic'];

const Services: React.FC<ServicesProps> = ({ setActiveTab }) => {
  // Sede seleccionada
  const [selectedSedeId, setSelectedSedeId] = useState<string>('SEDE-LEGUIA');

  // Especialidades
  const [especialidades, setEspecialidades] = useState<Especialidad[]>([]);
  const [selectedEspId, setSelectedEspId] = useState<string>('');
  const [loadingEsp, setLoadingEsp] = useState(true);

  // Navegación de fechas (carrusel de 4 días) - Fecha local de Perú (Tacna/Lima)
  const hoyStr = useMemo(() => {
    try {
      const formatter = new Intl.DateTimeFormat('en-CA', {
        timeZone: 'America/Lima',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
      });
      return formatter.format(new Date());
    } catch {
      return new Date().toISOString().split('T')[0];
    }
  }, []);
  const [fechaOffset, setFechaOffset] = useState<number>(0);

  const [columnas, setColumnas] = useState<SlotColumna[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);

  // Cita seleccionada
  const [slotSeleccionado, setSlotSeleccionado] = useState<{ fecha: string; hora: string } | null>(null);

  // Formulario del paciente (mínimo viable: DNI, Teléfono y Motivo opcional)
  const [dni, setDni] = useState('');
  const [telefono, setTelefono] = useState('');
  const [motivo, setMotivo] = useState('');
  const [aceptaTerminos, setAceptaTerminos] = useState(true);
  const [guardandoCita, setGuardandoCita] = useState(false);

  // Confirmación
  const [citaConfirmada, setCitaConfirmada] = useState<any | null>(null);

  // Sede actual activa
  const sedeActual = useMemo(() => {
    return SEDES_CONFIG.find(s => s.id === selectedSedeId) || SEDES_CONFIG[0];
  }, [selectedSedeId]);

  // Fecha base para las 4 columnas
  const fechaInicioCalculada = useMemo(() => {
    const d = new Date(hoyStr + 'T12:00:00');
    d.setDate(d.getDate() + fechaOffset);
    return d.toISOString().split('T')[0];
  }, [hoyStr, fechaOffset]);

  // Cargar especialidades
  useEffect(() => {
    const init = async () => {
      setLoadingEsp(true);
      const data = await database.getEspecialidades();
      setEspecialidades(data);
      if (data.length > 0) {
        setSelectedEspId(data[0].id);
      }
      setLoadingEsp(false);
    };
    init();
  }, []);

  // Cache del lado del cliente para evitar peticiones repetidas al cambiar de sede o navegar fechas
  const slotsCacheRef = React.useRef<Map<string, SlotColumna[]>>(new Map());

  // Cargar disponibilidad cuando cambie especialidad, fecha o sede
  useEffect(() => {
    if (!selectedEspId) return;

    const cacheKey = `${fechaInicioCalculada}_${selectedEspId}_${selectedSedeId}`;
    if (slotsCacheRef.current.has(cacheKey)) {
      setColumnas(slotsCacheRef.current.get(cacheKey)!);
      setLoadingSlots(false);
      return;
    }

    let isMounted = true;
    const fetchColumnas = async () => {
      setLoadingSlots(true);
      const res = await database.getDisponibilidadMultiDia(fechaInicioCalculada, selectedEspId, 4, selectedSedeId);
      if (isMounted) {
        const cols = res.columnas || [];
        slotsCacheRef.current.set(cacheKey, cols);
        setColumnas(cols);
        setLoadingSlots(false);
      }
    };

    fetchColumnas();

    return () => {
      isMounted = false;
    };
  }, [selectedEspId, fechaInicioCalculada, selectedSedeId]);


  // Manejador del DNI (solo filtro de dígitos, sin llamada pública a RENIEC)
  const handleDniChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, '').slice(0, 8);
    setDni(val);
  };

  // Formatear cabecera de cada columna
  const formatHeaderCol = (fechaStr: string) => {
    const fecha = new Date(fechaStr + 'T12:00:00');
    const hoy = new Date(hoyStr + 'T12:00:00');
    const diffDias = Math.round((fecha.getTime() - hoy.getTime()) / (1000 * 60 * 60 * 24));

    let titulo = DIAS_SEMANA[fecha.getDay()];
    if (diffDias === 0) titulo = 'Hoy';
    else if (diffDias === 1) titulo = 'Mañana';

    const diaNum = fecha.getDate();
    const mesNom = MESES[fecha.getMonth()];

    return {
      titulo,
      subtitulo: `${diaNum} ${mesNom}`,
    };
  };

  // Enviar reserva
  const handleReservar = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!slotSeleccionado) {
      Swal.fire('Atención', 'Seleccione un horario disponible', 'warning');
      return;
    }
    if (!aceptaTerminos) {
      Swal.fire('Atención', 'Debe aceptar los términos y condiciones para continuar.', 'warning');
      return;
    }
    if (dni.length < 8) {
      Swal.fire('Atención', 'Ingrese un DNI válido de 8 dígitos', 'warning');
      return;
    }
    if (!telefono.trim()) {
      Swal.fire('Atención', 'Ingrese un celular de contacto para la confirmación', 'warning');
      return;
    }

    const espActual = especialidades.find(e => e.id === selectedEspId);

    setGuardandoCita(true);
    const res = await database.crearCita({
      sedeId: selectedSedeId,
      especialidadId: selectedEspId,
      fecha: slotSeleccionado.fecha,
      hora: slotSeleccionado.hora,
      duracionMinutos: espActual?.duracionMinutos || 30,
      pacienteDni: dni,
      pacienteNombre: 'Por confirmar',
      pacienteTelefono: telefono,
      motivo: motivo || undefined,
      origen: 'web',
      estado: 'pendiente',
    });
    setGuardandoCita(false);

    if (!res.ok) {
      Swal.fire('Error', res.error || 'No se pudo reservar el turno', 'error');
      return;
    }

    // Invalidar caché local de disponibilidad porque se acaba de ocupar un slot
    slotsCacheRef.current.clear();

    setCitaConfirmada({
      ...res.cita,
      sedeNombre: sedeActual.nombre,
      sedeDireccion: sedeActual.direccion,
      especialidadNombre: espActual?.nombre,
    });
  };

  const resetFormulario = () => {
    setCitaConfirmada(null);
    setSlotSeleccionado(null);
    setMotivo('');
    slotsCacheRef.current.clear();
    if (selectedEspId) {
      database.getDisponibilidadMultiDia(fechaInicioCalculada, selectedEspId, 4, selectedSedeId).then(res => {
        setColumnas(res.columnas || []);
      });
    }
  };


  const selectedEspObj = especialidades.find(e => e.id === selectedEspId);

  return (
    <div className="bg-[#f8fafc] min-h-screen text-[#09283c] font-manrope pt-[96px] pb-[80px]">
      <div className="w-[min(1180px,100%-32px)] sm:w-[min(1180px,100%-48px)] mx-auto">

        {/* 1. ENCABEZADO DE SECCIÓN */}
        <div className="text-center max-w-[760px] mx-auto mb-[36px]">
          <p className="inline-flex items-center gap-[9px] text-[12px] font-[800] uppercase tracking-[0.14em] text-[#e54550] mb-[12px]">
            <span className="w-[7px] h-[7px] rounded-full bg-[#fb5962] shadow-[0_0_0_5px_#fff0f1] shrink-0"></span>
            <span>Atención Médica y Laboratorio</span>
          </p>
          <h1 className="font-manrope text-[clamp(28px,3.8vw,46px)] font-[800] text-[#09283c] leading-[1.12] tracking-[-0.035em] mb-[12px]">
            Agenda tu Cita en UNIDOSLAB
          </h1>

        </div>

        {/* 2. CARD PRINCIPAL */}
        <div className="bg-white rounded-[24px] sm:rounded-[30px] border border-[#dce6ec] shadow-[0_18px_50px_rgba(9,40,60,0.07)] overflow-hidden mb-[50px]">
          <div className="p-[20px] sm:p-[36px] lg:p-[42px]">

            {citaConfirmada ? (
              /* PANTALLA DE ÉXITO */
              <motion.div
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                className="max-w-[580px] mx-auto text-center py-[20px]"
              >
                <div className="w-[72px] h-[72px] bg-[#fff0f1] text-[#e54550] rounded-full flex items-center justify-center mx-auto mb-[20px] border border-[#f7d1d4] shadow-sm">
                  <IconCheck className="w-[38px] h-[38px] stroke-[2.8]" />
                </div>
                <span className="text-[11px] font-[800] tracking-widest uppercase text-[#e54550] bg-[#fff0f1] border border-[#ffd5d8] px-[14px] py-[5px] rounded-full">
                  ¡Turno Reservado con Éxito!
                </span>
                <h3 className="text-[25px] sm:text-[27px] font-[800] text-[#09283c] mt-[14px] mb-[10px]">
                  Cita Agendada en UNIDOSLAB
                </h3>
                <p className="text-[14px] sm:text-[15px] text-[#60788a] leading-[1.6] mb-[26px]">
                  Hemos registrado tu reserva. Te esperamos en <b>{citaConfirmada.sedeNombre}</b> ({citaConfirmada.sedeDireccion}) 10 minutos antes con tu DNI.
                </p>

                <div className="bg-[#f8fafc] border border-[#dce6ec] rounded-[22px] p-[22px] text-left space-y-[12px] mb-[28px]">
                  <div className="flex justify-between items-center pb-[10px] border-b border-slate-200">
                    <span className="text-[12px] text-slate-500 font-extrabold uppercase">Código de Cita</span>
                    <span className="text-[15px] font-extrabold text-[#e54550] font-mono">{citaConfirmada.id}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[13px] text-slate-500 font-semibold">Sede de Atención</span>
                    <span className="text-[14px] font-bold text-[#09283c]">{citaConfirmada.sedeNombre}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[13px] text-slate-500 font-semibold">Especialidad</span>
                    <span className="text-[14px] font-bold text-[#09283c]">{citaConfirmada.especialidadNombre}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[13px] text-slate-500 font-semibold">Fecha y Hora</span>
                    <span className="text-[14px] font-bold text-[#09283c]">{citaConfirmada.fecha} a las {citaConfirmada.hora} hrs</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[13px] text-slate-500 font-semibold">DNI del Paciente</span>
                    <span className="text-[14px] font-bold text-[#09283c] font-mono">{citaConfirmada.pacienteDni}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[13px] text-slate-500 font-semibold">Celular de Contacto</span>
                    <span className="text-[14px] font-bold text-[#09283c]">{citaConfirmada.pacienteTelefono}</span>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-[12px] justify-center">
                  <a
                    href={`https://api.whatsapp.com/send/?phone=51952920616&text=Hola%20UNIDOSLAB,%20acabo%20de%20reservar%20mi%20cita%20con%20c%C3%B3digo%20${citaConfirmada.id}%20para%20${encodeURIComponent(citaConfirmada.especialidadNombre)}%20en%20${encodeURIComponent(citaConfirmada.sedeNombre)}%20el%20${citaConfirmada.fecha}%20a%20las%20${citaConfirmada.hora}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-[24px] py-[13px] bg-[#25D366] hover:bg-[#20ba59] text-white font-[800] text-[13px] rounded-[14px] shadow-sm flex items-center justify-center gap-[8px] transition-all"
                  >
                    <WhatsAppIcon className="w-[18px] h-[18px]" />
                    <span>Confirmar por WhatsApp</span>
                  </a>
                  <button
                    type="button"
                    onClick={resetFormulario}
                    className="px-[22px] py-[13px] bg-slate-100 hover:bg-slate-200 text-[#09283c] font-[800] text-[13px] rounded-[14px] transition-colors cursor-pointer"
                  >
                    Agendar otra cita
                  </button>
                </div>
              </motion.div>
            ) : (
              /* FLUJO DE RESERVA */
              <div className="relative pl-[30px] sm:pl-[44px] space-y-[32px]">

                {/* LÍNEA GUÍA VERTICAL */}
                <div className="absolute left-[11px] sm:left-[17px] top-[14px] bottom-[14px] w-[2px] bg-[#ffd5d8] pointer-events-none"></div>

                {/* 1. SELECCIÓN DE SEDE EN TACNA */}
                <div className="relative">
                  <div className="absolute -left-[30px] sm:-left-[44px] top-[2px] w-[24px] h-[24px] rounded-full bg-white border-2 border-[#fb5962] text-[#fb5962] flex items-center justify-center shadow-xs">
                    <IconCheck className="w-[14px] h-[14px] stroke-[3]" />
                  </div>
                  <div>
                    <span className="block text-[14px] font-[800] text-[#09283c] mb-2.5">
                      Sede de Atención en Tacna
                    </span>

                    {/* Tarjetas de Selección de Sedes: Ancho completo y responsivo */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-[16px] w-full">
                      {SEDES_CONFIG.map((s) => {
                        const isSelected = selectedSedeId === s.id;
                        return (
                          <div
                            key={s.id}
                            onClick={() => {
                              setSelectedSedeId(s.id);
                              setSlotSeleccionado(null);
                            }}
                            className={`p-[20px] rounded-[20px] border-2 cursor-pointer transition-all duration-200 flex flex-col justify-between ${
                              isSelected
                                ? 'border-[#fb5962] bg-[#fff8f8] shadow-[0_8px_20px_rgba(251,89,98,0.12)] -translate-y-0.5'
                                : 'border-[#e2e8f0] bg-white hover:border-slate-300 hover:bg-slate-50/50'
                            }`}
                          >
                            <div>
                              <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                                <div className="flex items-center gap-2">
                                  <div className={`p-1.5 rounded-lg ${isSelected ? 'bg-[#fb5962] text-white' : 'bg-slate-100 text-slate-600'}`}>
                                    <IconBuildingHospital className="w-4 h-4" />
                                  </div>
                                  <h4 className="font-[800] text-[16px] text-[#09283c]">{s.nombre}</h4>
                                </div>
                                <span className={`text-[11px] font-[800] px-[10px] py-[3px] rounded-full shrink-0 ${
                                  isSelected ? 'bg-[#fb5962] text-white' : 'bg-slate-100 text-slate-600'
                                }`}>
                                  {s.notaApertura}
                                </span>
                              </div>
                              <p className="text-[13px] text-[#60788a] font-medium leading-snug flex items-center gap-1.5 mt-1">
                                <IconMapPin className="w-4 h-4 text-slate-400 shrink-0" />
                                <span>{s.direccion}</span>
                              </p>
                            </div>

                            <div className="mt-3 pt-3 border-t border-slate-100/80 flex items-center gap-1.5 text-[12px] text-slate-500 font-semibold">
                              <IconClock className="w-3.5 h-3.5 text-[#fb5962] shrink-0" />
                              <span>{s.horarioDesc}</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* 2. SELECCIÓN DE SERVICIO / ESPECIALIDAD */}
                <div className="relative">
                  <div className="absolute -left-[30px] sm:-left-[44px] top-[2px] w-[24px] h-[24px] rounded-full bg-white border-2 border-[#fb5962] text-[#fb5962] flex items-center justify-center shadow-xs">
                    <IconCheck className="w-[14px] h-[14px] stroke-[3]" />
                  </div>
                  <div>
                    <label className="block text-[14px] font-[800] text-[#09283c] mb-2">
                      Servicios y Especialidad
                    </label>
                    <div className="relative w-full max-w-[560px]">
                      <select
                        value={selectedEspId}
                        onChange={(e) => {
                          setSelectedEspId(e.target.value);
                          setSlotSeleccionado(null);
                        }}
                        className="w-full appearance-none bg-white border border-[#cbd5e1] hover:border-[#fb5962] rounded-[16px] px-[18px] py-[13px] text-[15px] font-[700] text-[#09283c] focus:outline-none focus:ring-2 focus:ring-[#fb5962]/20 focus:border-[#fb5962] transition-all cursor-pointer shadow-2xs"
                      >
                        {especialidades.map((esp) => (
                          <option key={esp.id} value={esp.id}>
                            Consulta {esp.nombre} (~{esp.duracionMinutos} min)
                          </option>
                        ))}
                      </select>
                      <div className="pointer-events-none absolute right-[18px] top-1/2 -translate-y-1/2 text-slate-500">
                        <IconChevronRight className="w-5 h-5 rotate-90" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* 3. MODALIDAD DE ATENCIÓN */}
                <div className="relative">
                  <div className="absolute -left-[30px] sm:-left-[44px] top-[2px] w-[24px] h-[24px] rounded-full bg-white border-2 border-[#fb5962] text-[#fb5962] flex items-center justify-center shadow-xs">
                    <IconCheck className="w-[14px] h-[14px] stroke-[3]" />
                  </div>
                  <div>
                    <span className="block text-[14px] font-[800] text-[#09283c] mb-1">
                      Modalidad de atención
                    </span>
                    <p className="text-[14px] text-[#60788a]">
                      Tarifas accesibles particulares y convenios directos en caja (Pago en sede).
                    </p>
                  </div>
                </div>

                {/* 4. CALENDARIO DE DISPONIBILIDAD */}
                <div className="pt-[6px]">

                  {/* Encabezado del calendario con flechas */}
                  <div className="flex items-center justify-between mb-[18px]">
                    <div>
                      <span className="text-[13px] font-[800] uppercase tracking-wider text-[#09283c] block">
                        Horarios Disponibles en {sedeActual.nombre}
                      </span>
                      <span className="text-[12px] text-[#60788a]">
                        {sedeActual.horarioDesc}
                      </span>
                    </div>

                    <div className="flex items-center gap-[8px]">
                      {fechaOffset > 0 && (
                        <button
                          type="button"
                          onClick={() => setFechaOffset(Math.max(0, fechaOffset - 4))}
                          className="w-[34px] h-[34px] rounded-full border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 flex items-center justify-center cursor-pointer shadow-2xs transition-colors"
                          title="Días anteriores"
                        >
                          <IconChevronLeft className="w-4 h-4" />
                        </button>
                      )}

                      <button
                        type="button"
                        onClick={() => setFechaOffset(fechaOffset + 4)}
                        className="w-[34px] h-[34px] rounded-full bg-[#fff0f1] hover:bg-[#ffe2e5] text-[#e54550] border border-[#ffd5d8] flex items-center justify-center cursor-pointer shadow-2xs transition-colors"
                        title="Ver siguientes días"
                      >
                        <IconChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Matriz de 4 Columnas */}
                  {loadingSlots ? (
                    <div className="py-16 text-center text-slate-400 font-bold text-xs uppercase tracking-wider">
                      Cargando horarios de atención...
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-[10px] sm:gap-[14px]">
                      {columnas.map((col) => {
                        const { titulo, subtitulo } = formatHeaderCol(col.fecha);
                        return (
                          <div key={col.fecha} className="flex flex-col items-center bg-[#f8fafc] sm:bg-transparent rounded-[18px] p-2 sm:p-0">

                            <div className="text-center mb-[14px]">
                              <span className="block text-[14px] sm:text-[15px] font-[800] text-[#09283c] leading-tight">
                                {titulo}
                              </span>
                              <span className="block text-[12px] sm:text-[13px] font-[600] text-[#60788a] mt-0.5">
                                {subtitulo}
                              </span>
                            </div>

                            <div className="flex flex-col items-center gap-[8px] sm:gap-[10px] w-full max-h-[320px] overflow-y-auto px-1 py-1">
                              {col.slots.length === 0 ? (
                                <div className="py-6 text-center">
                                  <span className="text-[11px] font-bold text-slate-400 bg-slate-100 px-2 py-1 rounded-full uppercase tracking-wider select-none">
                                    Sin atención
                                  </span>
                                </div>
                              ) : (
                                col.slots.map((slot) => {

                                  const isSelected =
                                    slotSeleccionado?.fecha === col.fecha &&
                                    slotSeleccionado?.hora === slot.hora;

                                  if (!slot.disponible) {
                                    return (
                                      <span
                                        key={slot.hora}
                                        className="text-[13px] sm:text-[14px] font-[700] text-slate-400 line-through py-[6px] select-none cursor-not-allowed"
                                      >
                                        {slot.hora}
                                      </span>
                                    );
                                  }

                                  return (
                                    <button
                                      key={slot.hora}
                                      type="button"
                                      onClick={() =>
                                        setSlotSeleccionado({ fecha: col.fecha, hora: slot.hora })
                                      }
                                      className={`w-full max-w-[105px] py-[7px] sm:py-[8px] px-[8px] rounded-[16px] text-[13px] sm:text-[14px] font-[800] transition-all cursor-pointer ${isSelected
                                          ? 'bg-[#fb5962] text-white shadow-md shadow-[#fb5962]/30 scale-105'
                                          : 'bg-[#fff0f1] hover:bg-[#ffd5d8] text-[#e54550]'
                                        }`}
                                    >
                                      {slot.hora}
                                    </button>
                                  );
                                })
                              )}
                            </div>

                          </div>
                        );
                      })}
                    </div>
                  )}

                  {/* FORMULARIO DE RESERVA AL SELECCIONAR UN TURNO */}
                  <AnimatePresence>
                    {slotSeleccionado && (
                      <motion.div
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="mt-[32px] pt-[28px] border-t border-slate-200"
                      >
                        <div className="bg-[#fff8f8] border border-[#fbd3d6] rounded-[20px] p-[18px] mb-[24px] flex flex-col sm:flex-row sm:items-center justify-between gap-[10px]">
                          <div>
                            <span className="text-[12px] font-[800] uppercase text-[#e54550] tracking-wider block">
                              Turno Seleccionado en {sedeActual.nombre}
                            </span>
                            <span className="text-[16px] font-[800] text-[#09283c]">
                              {selectedEspObj?.nombre} — {slotSeleccionado.fecha} a las {slotSeleccionado.hora} hrs
                            </span>
                          </div>
                          <button
                            type="button"
                            onClick={() => setSlotSeleccionado(null)}
                            className="text-[#e54550] hover:text-[#fb5962] text-xs font-bold underline self-start sm:self-auto cursor-pointer"
                          >
                            Cambiar horario
                          </button>
                        </div>

                        <form onSubmit={handleReservar} className="space-y-[18px]">
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-[16px]">
                            {/* DNI */}
                            <div>
                              <label className="block text-[12px] font-[800] uppercase text-[#09283c] tracking-wider mb-1.5">
                                DNI del Paciente *
                              </label>
                              <input
                                type="text"
                                required
                                maxLength={8}
                                placeholder="Ej. 72345678"
                                value={dni}
                                onChange={handleDniChange}
                                className="w-full bg-[#f8fafc] border border-[#cbd5e1] rounded-[14px] px-[14px] py-[11px] text-[14px] font-[700] text-[#09283c] focus:outline-none focus:bg-white focus:border-[#fb5962]"
                              />
                            </div>

                            {/* CELULAR */}
                            <div>
                              <label className="block text-[12px] font-[800] uppercase text-[#09283c] tracking-wider mb-1.5">
                                Celular / WhatsApp *
                              </label>
                              <input
                                type="tel"
                                required
                                placeholder="Ej. 952920616"
                                value={telefono}
                                onChange={(e) => setTelefono(e.target.value)}
                                className="w-full bg-[#f8fafc] border border-[#cbd5e1] rounded-[14px] px-[14px] py-[11px] text-[14px] font-[700] text-[#09283c] focus:outline-none focus:bg-white focus:border-[#fb5962]"
                              />
                            </div>

                            {/* MOTIVO (OPCIONAL) */}
                            <div className="sm:col-span-2">
                              <label className="block text-[12px] font-[800] uppercase text-[#09283c] tracking-wider mb-1.5">
                                Motivo de Consulta o Comentario (Opcional)
                              </label>
                              <input
                                type="text"
                                placeholder="Ej. Chequeo preventivo, dolor abdominal, etc."
                                value={motivo}
                                onChange={(e) => setMotivo(e.target.value)}
                                className="w-full bg-[#f8fafc] border border-[#cbd5e1] rounded-[14px] px-[14px] py-[11px] text-[14px] font-[600] text-[#09283c] focus:outline-none focus:bg-white focus:border-[#fb5962]"
                              />
                            </div>
                          </div>

                          {/* CHECKBOX DE TÉRMINOS Y CONDICIONES */}
                          <div className="pt-[10px] pb-[6px]">
                            <label className="flex items-start gap-[10px] cursor-pointer">
                              <input
                                type="checkbox"
                                checked={aceptaTerminos}
                                onChange={(e) => setAceptaTerminos(e.target.checked)}
                                className="w-[18px] h-[18px] mt-0.5 text-[#fb5962] accent-[#fb5962] rounded cursor-pointer shrink-0"
                              />
                              <span className="text-[13px] text-[#60788a] leading-[1.5]">
                                Al reservar una cita, aceptas nuestros{' '}
                                <button
                                  type="button"
                                  onClick={() => setActiveTab?.('terminos')}
                                  className="text-[#e54550] hover:underline font-[700] cursor-pointer"
                                >
                                  términos y condiciones
                                </button>{' '}
                                y confirmas que entiendes nuestro{' '}
                                <button
                                  type="button"
                                  onClick={() => setActiveTab?.('privacidad')}
                                  className="text-[#e54550] hover:underline font-[700] cursor-pointer"
                                >
                                  aviso de privacidad
                                </button>
                                .
                              </span>
                            </label>
                          </div>

                          {/* BOTÓN CONFIRMAR */}
                          <div className="pt-2 flex justify-end">
                            <button
                              type="submit"
                              disabled={guardandoCita || !aceptaTerminos}
                              className="w-full sm:w-auto px-[36px] py-[14px] bg-[#fb5962] hover:bg-[#e54550] disabled:bg-slate-300 text-white font-[800] text-[14px] rounded-[16px] shadow-[0_10px_25px_rgba(251,89,98,0.3)] disabled:shadow-none transition-all flex items-center justify-center gap-[8px] cursor-pointer"
                            >
                              {guardandoCita ? (
                                <span>Procesando reserva...</span>
                              ) : (
                                <>
                                  <IconCheck className="w-[18px] h-[18px]" />
                                  <span>Confirmar Cita en {sedeActual.nombre}</span>
                                </>
                              )}
                            </button>
                          </div>
                        </form>
                      </motion.div>
                    )}
                  </AnimatePresence>

                </div>

              </div>
            )}

          </div>

        </div>

        {/* 3. SECCIÓN PRESERVADA: ¿No puedes salir de casa? Vamos hacia ti. */}
        <section className="bg-[#09283c] rounded-[26px] p-[36px_26px] sm:p-[48px_52px] text-white shadow-[0_20px_50px_rgba(9,40,60,0.18)] relative overflow-hidden flex flex-col lg:flex-row items-center justify-between gap-[30px]">
          {/* Acento circular decorativo */}
          <div className="absolute -top-[120px] -right-[120px] w-[320px] h-[320px] rounded-full border-[60px] border-white/[0.03] pointer-events-none"></div>

          <div className="flex flex-col items-start text-left max-w-[680px] relative z-10">
            <p className="inline-flex items-center gap-[9px] text-[12px] font-[800] uppercase tracking-[0.14em] text-[#ff9da3] mb-[15px]">
              <span className="w-[7px] h-[7px] rounded-full bg-[#fb5962] shadow-[0_0_0_5px_rgba(251,89,98,0.15)] shrink-0"></span>
              <span>Atención a domicilio en Tacna</span>
            </p>
            <h2 className="font-manrope text-[clamp(24px,3vw,36px)] font-[800] text-white leading-[1.15] tracking-[-0.03em] mb-[12px]">
              ¿No puedes salir de casa? Vamos hacia ti.
            </h2>
            <p className="font-manrope text-[14px] sm:text-[15px] text-[#b9cad3] leading-[1.65]">
              Realizamos la toma de muestras de laboratorio en tu hogar con personal especializado, puntualidad y protocolos clínicos 100% seguros.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-[12px] w-full lg:w-auto shrink-0 relative z-10">
            <a
              href="https://api.whatsapp.com/send/?phone=51952920616&text=Hola%20UNIDOSLAB,%20deseo%20agendar%20una%20toma%20de%20muestra%20a%20domicilio%20en%20Tacna"
              target="_blank"
              rel="noopener noreferrer"
              className="min-h-[48px] px-[22px] bg-white hover:bg-slate-100 text-[#09283c] font-manrope font-[800] text-[13px] rounded-[13px] shadow-sm transition-all hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-[9px] cursor-pointer"
            >
              <WhatsAppIcon className="w-[18px] h-[18px]" />
              <span>Agendar por WhatsApp</span>
            </a>

            <a
              href="tel:51952920616"
              className="min-h-[48px] px-[22px] bg-transparent hover:bg-white/[0.08] border border-white/[0.22] hover:border-white/40 text-white font-manrope font-[800] text-[13px] rounded-[13px] transition-all hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-[9px] cursor-pointer"
            >
              <IconPhone className="w-[18px] h-[18px]" />
              <span>952 920 616</span>
            </a>
          </div>
        </section>

      </div>
    </div>
  );
};

export default Services;
