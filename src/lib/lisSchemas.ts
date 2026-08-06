import { z } from 'zod';

// Esquemas Zod para la integración LIS (Lifotronic eCL8000)

export const LisQuerySchema = z.object({
  sampleId: z.string().min(1, 'El código de muestra es requerido'),
  sedeId: z.string().optional(),
});

export const LisResultSchema = z.object({
  sampleId: z.string().min(1, 'El código de muestra es requerido'),
  testCode: z.string().min(1, 'El código del examen (ej. CEA) es requerido'),
  value: z.union([z.number(), z.string()]),
  unit: z.string().optional(),
  referenceRange: z.string().optional(),
  status: z.enum(['F', 'P', 'C']).optional(), // F = Final, P = Pendiente, C = Cancelado
  executedAt: z.string().optional(),
});

export interface ASTMFrameHeader {
  sender: string;
  receiver: string;
  timestamp: string;
}

export interface ASTMQueryRecord {
  sampleId: string;
}

export interface ASTMOrderRecord {
  sampleId: string;
  patientDni: string;
  patientName: string;
  tests: string[];
}

export interface ASTMResultRecord {
  sampleId: string;
  testCode: string;
  value: string;
  unit: string;
  referenceRange: string;
}
