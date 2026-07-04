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
  sedeRegistro: string;
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
  sede: string;
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
  rol: string;
  activo: boolean;
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

  crearUsuario: async (usuario: { username: string; password: string; nombre: string; rol: string }): Promise<boolean> => {
    try {
      const res = await fetch('/api/usuarios', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(usuario)
      });
      return res.ok;
    } catch (e) {
      console.error(e);
      return false;
    }
  },

  actualizarUsuario: async (id: string, data: Partial<{ username: string; password: string; nombre: string; rol: string; activo: boolean }>): Promise<boolean> => {
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
      const res = await fetch('/api/pacientes');
      if (!res.ok) return undefined;
      const list: Paciente[] = await res.json();
      return list.find((p) => p.dni === dni);
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
  }
};
