import { z } from 'zod';

// Esquema de Login
export const LoginSchema = z.object({
  username: z.string().min(1, 'El nombre de usuario es obligatorio'),
  password: z.string().min(1, 'La contraseña es obligatoria'),
});

// Esquema de Paciente
export const PacienteSchema = z.object({
  dni: z.string().length(8, 'El DNI debe tener exactamente 8 caracteres'),
  nombre: z.string().min(1, 'El nombre es obligatorio'),
  apellido: z.string().min(1, 'El apellido es obligatorio'),
  telefono: z.string().nullable().optional(),
  correo: z.string().email('El correo electrónico no es válido').nullable().optional().or(z.literal('')),
  sedeId: z.string().min(1, 'La sede es obligatoria'),
});

// Esquema de Pruebas Clínicas
export const CrearPruebaSchema = z.object({
  pacienteDni: z.string().length(8, 'El DNI debe tener 8 dígitos'),
  examen: z.string().min(1, 'El nombre del examen es obligatorio'),
  sedeId: z.string().min(1, 'La sede es obligatoria'),
});

export const ActualizarPruebaSchema = z.object({
  id: z.string().min(1, 'El ID de la prueba es obligatorio'),
  status: z.enum(['En Proceso', 'Completado']),
  resultado: z.string().optional(),
});

// Esquema de Reactivos / Inventario
export const MovimientoReactivoSchema = z.object({
  reactivoId: z.string().min(1, 'El ID del reactivo es obligatorio'),
  cantidad: z.number().positive('La cantidad debe ser mayor a cero'),
  tipo: z.enum(['Entrada', 'Salida']),
  sedeId: z.string().min(1, 'La sede es obligatoria'),
});

// Esquema de Sedes
export const SedeSchema = z.object({
  nombre: z.string().min(1, 'El nombre de la sede es obligatorio'),
  direccion: z.string().optional(),
  telefono: z.string().optional(),
});

// Esquema de Usuarios
export const UsuarioSchema = z.object({
  username: z.string().min(3, 'El nombre de usuario debe tener al menos 3 caracteres'),
  password: z.string().min(4, 'La contraseña debe tener al menos 4 caracteres'),
  nombre: z.string().min(1, 'El nombre es obligatorio'),
  rol: z.string().min(1, 'El rol es obligatorio'),
});
