export interface Reactivo {
  id: string;
  name: string;
  stock: number;
  unit: string;
  minStock: number;
  sede: string;
}

export interface Paciente {
  dni: string;
  nombre: string;
  apellido: string;
  telefono?: string;
  correo?: string;
  sedeRegistro: string;
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
}

export const database = {
  // Inicialización (gatilla el seed de la BD)
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

  // --- REACTIVOS ---
  getReactivos: async (sede: string): Promise<Reactivo[]> => {
    try {
      const res = await fetch(`/api/reactivos?sede=${encodeURIComponent(sede)}`);
      if (!res.ok) return [];
      return await res.json();
    } catch (e) {
      console.error(e);
      return [];
    }
  },

  registrarMovimientoReactivo: async (sede: string, reactivoId: string, cantidad: number, tipo: 'Entrada' | 'Salida'): Promise<boolean> => {
    try {
      const res = await fetch('/api/reactivos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reactivoId, cantidad, tipo, sede })
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
  getPacientes: async (sede?: string): Promise<Paciente[]> => {
    try {
      const url = sede ? `/api/pacientes?sede=${encodeURIComponent(sede)}` : '/api/pacientes';
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
          SedeRegistro: paciente.sedeRegistro
        })
      });
      return res.ok;
    } catch (e) {
      console.error(e);
      return false;
    }
  },

  // --- PRUEBAS CLÍNICAS (HISTORIAL) ---
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

  getPruebas: async (sede?: string): Promise<PruebaClinica[]> => {
    try {
      const url = sede ? `/api/pruebas?sede=${encodeURIComponent(sede)}` : '/api/pruebas';
      const res = await fetch(url);
      if (!res.ok) return [];
      return await res.json();
    } catch (e) {
      console.error(e);
      return [];
    }
  },

  crearPrueba: async (pacienteDni: string, examen: string, sede: string): Promise<PruebaClinica | null> => {
    try {
      const res = await fetch('/api/pruebas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pacienteDni, examen, sede })
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
