import { UserRole } from '@/types/roles';

export interface Sede {
  id: string;
  nombre: string;
  direccion?: string;
  telefono?: string;
  activo: boolean;
}

export interface Reactivo {
  id: string;
  name: string;
  stock: number;
  unit: string;
  minStock: number;
  sede: string;
  sedeId: string;
}

export interface Paciente {
  dni: string;
  nombre: string;
  apellido: string;
  telefono?: string;
  correo?: string;
  sede?: string;
  sedeRegistro?: string;
  sedeId: string;
  fechaRegistro: string;
}

export interface PruebaClinica {
  id: string;
  pacienteDni: string;
  examen: string;
  status: 'En Proceso' | 'Completado';
  fecha: string;
  resultado?: string;
  sede?: string;
  sedeId: string;
}

export interface MovimientoInventario {
  id: string;
  reactivoId: string;
  cantidad: number;
  tipo: 'Entrada' | 'Salida';
  fecha: string;
  responsable: string;
}

export interface Usuario {
  id: string;
  username: string;
  nombre: string;
  rol: UserRole;
  activo: boolean;
}

export interface Especialidad {
  id: string;
  nombre: string;
  descripcion?: string;
  duracionMinutos: number;
  icono?: string;
  activo: boolean;
}

export interface Cita {
  id: string;
  sedeId?: string;
  sedeNombre?: string;
  especialidadId: string;
  especialidadNombre?: string;
  fecha: string;
  hora: string;
  duracionMinutos: number;
  pacienteDni: string;
  pacienteNombre: string;
  pacienteTelefono?: string;
  pacienteEmail?: string;
  motivo?: string;
  origen: 'web' | 'presencial' | 'telefono';
  estado: 'pendiente' | 'confirmada' | 'completada' | 'cancelada';
  recordatorioEnviado?: boolean;
  recordatorioEnviadoEn?: string;
  creadoEn?: string;
}



export interface HorarioBloqueado {
  id: string;
  sedeId: string;
  sedeNombre?: string;
  especialidadId?: string | null;
  especialidadNombre?: string;
  fecha: string;
  horaInicio: string;
  horaFin: string;
  motivo?: string;
  creadoEn?: string;
}

export const database = {
  initSeed: async (): Promise<void> => {
    try {
      await fetch('/api/seed');
    } catch (e) {
      console.error('Error inicializando semilla', e);
    }
  },

  // --- AUTENTICACIÓN ---
  login: async (username: string, password: string): Promise<Usuario | null> => {
    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      if (!res.ok) return null;
      return await res.json();
    } catch (e) {
      console.error('Error en autenticación', e);
      return null;
    }
  },

  // --- SEDES ---
  getSedes: async (): Promise<Sede[]> => {
    try {
      const res = await fetch('/api/sedes');
      if (!res.ok) return [];
      return await res.json();
    } catch (e) {
      console.error(e);
      return [];
    }
  },

  crearSede: async (sede: Omit<Sede, 'id' | 'activo'>): Promise<boolean> => {
    try {
      const res = await fetch('/api/sedes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(sede)
      });
      return res.ok;
    } catch (e) {
      console.error(e);
      return false;
    }
  },

  actualizarSede: async (id: string, data: Partial<Sede>): Promise<boolean> => {
    try {
      const res = await fetch('/api/sedes', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, ...data })
      });
      return res.ok;
    } catch (e) {
      console.error(e);
      return false;
    }
  },

  // --- USUARIOS ---
  getUsuarios: async (): Promise<Usuario[]> => {
    try {
      const res = await fetch('/api/usuarios');
      if (!res.ok) return [];
      return await res.json();
    } catch (e) {
      console.error(e);
      return [];
    }
  },

  crearUsuario: async (usuario: { username: string; password: string; nombre: string; rol: UserRole }): Promise<{ ok: boolean; error?: string }> => {
    try {
      console.log('[database.crearUsuario] Enviando datos a /api/usuarios:', {
        username: usuario.username,
        nombre: usuario.nombre,
        rol: usuario.rol,
      });

      const res = await fetch('/api/usuarios', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(usuario)
      });

      const data = await res.json().catch(() => ({}));
      console.log('[database.crearUsuario] Respuesta recibida:', res.status, data);

      if (!res.ok) {
        return { ok: false, error: data.error || 'Error al crear usuario' };
      }
      return { ok: true };
    } catch (e: any) {
      console.error('[database.crearUsuario] Excepción al crear usuario:', e);
      return { ok: false, error: e?.message || 'Error de conexión con el servidor' };
    }
  },

  actualizarUsuario: async (id: string, data: Partial<{ username: string; password: string; nombre: string; rol: UserRole; activo: boolean }>): Promise<boolean> => {
    try {
      const res = await fetch('/api/usuarios', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, ...data })
      });
      return res.ok;
    } catch (e) {
      console.error(e);
      return false;
    }
  },

  // --- REACTIVOS ---
  getReactivos: async (sedeId: string): Promise<Reactivo[]> => {
    try {
      const res = await fetch(`/api/reactivos?sedeId=${encodeURIComponent(sedeId)}`);
      if (!res.ok) return [];
      return await res.json();
    } catch (e) {
      console.error(e);
      return [];
    }
  },

  registrarMovimientoReactivo: async (sedeId: string, reactivoId: string, cantidad: number, tipo: 'Entrada' | 'Salida'): Promise<boolean> => {
    try {
      const res = await fetch('/api/reactivos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reactivoId, cantidad, tipo, sedeId })
      });
      return res.ok;
    } catch (e) {
      console.error(e);
      return false;
    }
  },

  getMovimientos: async (): Promise<MovimientoInventario[]> => {
    return [];
  },

  // --- PACIENTES ---
  getPacientes: async (sedeId?: string): Promise<Paciente[]> => {
    try {
      const url = sedeId ? `/api/pacientes?sedeId=${encodeURIComponent(sedeId)}` : '/api/pacientes';
      const res = await fetch(url);
      if (!res.ok) return [];
      return await res.json();
    } catch (e) {
      console.error(e);
      return [];
    }
  },

  getPacienteByDni: async (dni: string): Promise<Paciente | undefined> => {
    try {
      const res = await fetch(`/api/pacientes?dni=${encodeURIComponent(dni)}`);
      if (!res.ok) return undefined;
      const list: Paciente[] = await res.json();
      return list && list.length > 0 ? list[0] : undefined;
    } catch (e) {
      console.error(e);
      return undefined;
    }
  },

  registrarPaciente: async (paciente: Paciente): Promise<boolean> => {
    try {
      const res = await fetch('/api/pacientes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          dni: paciente.dni,
          nombre: paciente.nombre,
          apellido: paciente.apellido,
          telefono: paciente.telefono,
          correo: paciente.correo,
          sedeId: paciente.sedeId
        })
      });
      return res.ok;
    } catch (e) {
      console.error(e);
      return false;
    }
  },

  // --- PRUEBAS CLÍNICAS ---
  getPruebasByPaciente: async (dni: string): Promise<PruebaClinica[]> => {
    try {
      const res = await fetch(`/api/pruebas?pacienteDni=${encodeURIComponent(dni)}`);
      if (!res.ok) return [];
      return await res.json();
    } catch (e) {
      console.error(e);
      return [];
    }
  },

  getPruebas: async (sedeId?: string): Promise<PruebaClinica[]> => {
    try {
      const url = sedeId ? `/api/pruebas?sedeId=${encodeURIComponent(sedeId)}` : '/api/pruebas';
      const res = await fetch(url);
      if (!res.ok) return [];
      return await res.json();
    } catch (e) {
      console.error(e);
      return [];
    }
  },

  crearPrueba: async (pacienteDni: string, examen: string, sedeId: string): Promise<PruebaClinica | null> => {
    try {
      const res = await fetch('/api/pruebas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pacienteDni, examen, sedeId })
      });
      if (!res.ok) return null;
      return await res.json();
    } catch (e) {
      console.error(e);
      return null;
    }
  },

  actualizarEstadoPrueba: async (pruebaId: string, status: 'En Proceso' | 'Completado', resultado?: string): Promise<boolean> => {
    try {
      const res = await fetch('/api/pruebas', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: pruebaId, status, resultado })
      });
      return res.ok;
    } catch (e) {
      console.error(e);
      return false;
    }
  },

  eliminarPrueba: async (pruebaId: string): Promise<{ ok: boolean; error?: string }> => {
    try {
      const res = await fetch(`/api/pruebas?id=${encodeURIComponent(pruebaId)}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (!res.ok) {
        return { ok: false, error: data.error || 'No se pudo eliminar la orden' };
      }
      return { ok: true };
    } catch (e: any) {
      console.error(e);
      return { ok: false, error: e.message };
    }
  },

  // --- CONSULTA RENIEC (ApiInti) ---
  consultarRENIEC: async (dni: string): Promise<{ nombre: string; apellido: string; remaining?: number; maxQueries?: number } | null> => {
    try {
      const res = await fetch(`/api/reniec?dni=${encodeURIComponent(dni)}`);
      if (!res.ok) return null;
      return await res.json();
    } catch (e) {
      console.error(e);
      return null;
    }
  },

  // --- CITAS & ESPECIALIDADES ---
  getEspecialidades: async (): Promise<Especialidad[]> => {
    try {
      const res = await fetch('/api/especialidades');
      if (!res.ok) return [];
      return await res.json();
    } catch (e) {
      console.error(e);
      return [];
    }
  },

  getCitas: async (fecha?: string, especialidadId?: string, sedeId?: string, fechaDesde?: string, fechaHasta?: string): Promise<Cita[]> => {
    try {
      const params = new URLSearchParams();
      if (fecha) params.append('fecha', fecha);
      if (fechaDesde) params.append('fechaDesde', fechaDesde);
      if (fechaHasta) params.append('fechaHasta', fechaHasta);
      if (especialidadId) params.append('especialidadId', especialidadId);
      if (sedeId) params.append('sedeId', sedeId);
      const res = await fetch(`/api/citas?${params.toString()}`);
      if (!res.ok) return [];
      return await res.json();
    } catch (e) {
      console.error(e);
      return [];
    }
  },


  getDisponibilidad: async (fecha: string, especialidadId: string, sedeId?: string): Promise<{ slots: { hora: string; disponible: boolean; cita?: any }[] }> => {
    try {
      const params = new URLSearchParams({ fecha, especialidadId });
      if (sedeId) params.append('sedeId', sedeId);
      const res = await fetch(`/api/citas/disponibilidad?${params.toString()}`);
      if (!res.ok) return { slots: [] };
      return await res.json();
    } catch (e) {
      console.error(e);
      return { slots: [] };
    }
  },

  getDisponibilidadMultiDia: async (fechaInicio: string, especialidadId: string, dias = 4, sedeId?: string): Promise<{ columnas: { fecha: string; slots: { hora: string; disponible: boolean }[] }[] }> => {
    try {
      const params = new URLSearchParams({ fechaInicio, especialidadId, dias: dias.toString() });
      if (sedeId) params.append('sedeId', sedeId);
      const res = await fetch(`/api/citas/disponibilidad?${params.toString()}`);
      if (!res.ok) return { columnas: [] };
      return await res.json();
    } catch (e) {
      console.error(e);
      return { columnas: [] };
    }
  },

  crearCita: async (data: Omit<Cita, 'id' | 'creadoEn'>): Promise<{ ok: boolean; cita?: Cita; error?: string }> => {
    try {
      const res = await fetch('/api/citas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const resData = await res.json();
      if (!res.ok) {
        return { ok: false, error: resData.error || 'No se pudo agendar la cita' };
      }
      return { ok: true, cita: resData };
    } catch (e: any) {
      console.error(e);
      return { ok: false, error: e.message };
    }
  },

  actualizarCita: async (id: string, updateData: Partial<Cita>): Promise<{ ok: boolean; error?: string }> => {
    try {
      const res = await fetch('/api/citas', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, ...updateData }),
      });
      const data = await res.json();
      if (!res.ok) {
        return { ok: false, error: data.error || 'No se pudo actualizar la cita' };
      }
      return { ok: true };
    } catch (e: any) {
      console.error(e);
      return { ok: false, error: e.message };
    }
  },

  eliminarCita: async (id: string): Promise<{ ok: boolean; error?: string }> => {
    try {
      const res = await fetch(`/api/citas?id=${encodeURIComponent(id)}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (!res.ok) {
        return { ok: false, error: data.error || 'No se pudo cancelar la cita' };
      }
      return { ok: true };
    } catch (e: any) {
      console.error(e);
      return { ok: false, error: e.message };
    }
  },

  // --- BLOQUEOS DE HORARIO ---
  getBloqueos: async (fecha?: string, sedeId?: string): Promise<HorarioBloqueado[]> => {
    try {
      const params = new URLSearchParams();
      if (fecha) params.append('fecha', fecha);
      if (sedeId) params.append('sedeId', sedeId);
      const res = await fetch(`/api/citas/bloqueos?${params.toString()}`);
      if (!res.ok) return [];
      return await res.json();
    } catch (e) {
      console.error('Error al obtener bloqueos:', e);
      return [];
    }
  },

  crearBloqueo: async (data: Omit<HorarioBloqueado, 'id' | 'creadoEn'>): Promise<{ ok: boolean; bloqueo?: HorarioBloqueado; error?: string }> => {
    try {
      const res = await fetch('/api/citas/bloqueos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const resData = await res.json();
      if (!res.ok) {
        return { ok: false, error: resData.error || 'No se pudo registrar el bloqueo' };
      }
      return { ok: true, bloqueo: resData };
    } catch (e: any) {
      console.error(e);
      return { ok: false, error: e.message };
    }
  },

  eliminarBloqueo: async (id: string): Promise<{ ok: boolean; error?: string }> => {
    try {
      const res = await fetch(`/api/citas/bloqueos?id=${encodeURIComponent(id)}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (!res.ok) {
        return { ok: false, error: data.error || 'No se pudo desbloquear el horario' };
      }
      return { ok: true };
    } catch (e: any) {
      console.error(e);
      return { ok: false, error: e.message };
    }
  }
};

