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

import { ALL_ROLES } from '@/types/roles';

// Esquema de Usuarios
export const UsuarioSchema = z.object({
  username: z.string().min(3, 'El nombre de usuario debe tener al menos 3 caracteres'),
  password: z.string().min(4, 'La contraseña debe tener al menos 4 caracteres'),
  nombre: z.string().min(1, 'El nombre es obligatorio'),
  rol: z.enum(ALL_ROLES, { message: 'Rol no válido' }),
});

// Esquemas de Citas y Especialidades
export const EspecialidadSchema = z.object({
  nombre: z.string().min(2, 'El nombre de la especialidad es obligatorio'),
  descripcion: z.string().optional(),
  duracionMinutos: z.number().min(5).max(180).default(30),
  icono: z.string().optional().default('IconStethoscope'),
  activo: z.boolean().optional().default(true),
});

export const CitaSchema = z.object({
  sedeId: z.string().optional().default('SEDE-LEGUIA'),
  especialidadId: z.string().min(1, 'La especialidad es obligatoria'),
  fecha: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Formato de fecha inválido (YYYY-MM-DD)'),
  hora: z.string().regex(/^\d{2}:\d{2}$/, 'Formato de hora inválido (HH:MM)'),
  pacienteDni: z.string().min(8, 'El DNI debe tener al menos 8 caracteres').max(15),
  pacienteNombre: z.string().optional().default('Por confirmar'),
  pacienteTelefono: z.string().min(6, 'Ingrese un teléfono de contacto válido'),
  pacienteEmail: z.string().email('Correo electrónico inválido').optional().or(z.literal('')),
  motivo: z.string().optional().or(z.literal('')),
  origen: z.enum(['web', 'presencial', 'telefono']).default('web'),
});

export const ActualizarCitaSchema = z.object({
  id: z.string().min(1, 'El ID de la cita es obligatorio'),
  estado: z.enum(['pendiente', 'confirmada', 'completada', 'cancelada']).optional(),
  hora: z.string().regex(/^\d{2}:\d{2}$/, 'Formato de hora inválido (HH:MM)').optional(),
  fecha: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Formato de fecha inválido (YYYY-MM-DD)').optional(),
  pacienteNombre: z.string().optional(),
  motivo: z.string().optional(),
  recordatorioEnviado: z.boolean().optional(),
  recordatorioEnviadoEn: z.string().optional(),
});



export const HorarioBloqueadoSchema = z.object({
  sedeId: z.string().min(1, 'La sede es obligatoria'),
  especialidadId: z.string().optional().nullable(),
  fecha: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Formato de fecha inválido (YYYY-MM-DD)'),
  horaInicio: z.string().regex(/^\d{2}:\d{2}$/, 'Formato de hora de inicio inválido (HH:MM)'),
  horaFin: z.string().regex(/^\d{2}:\d{2}$/, 'Formato de hora fin inválido (HH:MM)'),
  motivo: z.string().optional().default('Horario bloqueado por administración'),
});


