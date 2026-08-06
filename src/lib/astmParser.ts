import { ASTMOrderRecord, ASTMResultRecord } from './lisSchemas';

/**
 * Mapeo de códigos estándar del equipo Lifotronic eCL8000 a nombres en la DB de Demo Lab.
 */
export const LIFOTRONIC_TEST_MAPPING: Record<string, string> = {
  'CEA': 'Antígeno Carcinoembrionario (CEA)',
  'AFP': 'Alfa-Fetoproteína (AFP)',
  'CA19-9': 'Antígeno de Cáncer 19-9 (CA 19-9)',
  'CA125': 'Antígeno de Cáncer 125 (CA 125)',
  'CA15-3': 'Antígeno de Cáncer 15-3 (CA 15-3)',
  'TPSA': 'Antígeno Prostático Específico Total (TPSA)',
  'FPSA': 'Antígeno Prostático Específico Libre (FPSA)',
  'HE4': 'Proteína del Epidídimo Humano 4 (HE4)',
  'SCC': 'Antígeno de Carcinoma de Células Escamosas (SCC)',
  'NSE': 'Enolasa Específica de la Neurona (NSE)',
  'CYFRA': 'CYFRA 21-1',
};

/**
 * Convierte un código recibido del Lifotronic a su nombre formateado.
 */
export function getTestNameFromCode(code: string): string {
  const normalized = code.trim().toUpperCase();
  return LIFOTRONIC_TEST_MAPPING[normalized] || normalized;
}

/**
 * Convierte una lista de exámenes requeridos en una trama de Orden ASTM E1394.
 */
export function buildASTMOrderFrame(order: ASTMOrderRecord): string {
  const dateStr = new Date().toISOString().replace(/[-T::.Z]/g, '').slice(0, 14);
  const testsStr = order.tests.map((t) => `^^^${t}`).join('\\');

  return [
    `H|\\^&|||DemoLab^LIS|||||||P|1|${dateStr}`,
    `P|1||${order.patientDni}||${order.patientName}||||U`,
    `O|1|${order.sampleId}||${testsStr}|R||${dateStr}||||N||||||||||||||O`,
    `L|1|N`,
  ].join('\r');
}

/**
 * Parsea una trama ASTM básica de resultado enviada por el Lifotronic eCL8000.
 */
export function parseASTMResultFrame(rawASTM: string): Partial<ASTMResultRecord> | null {
  try {
    const lines = rawASTM.split(/[\r\n]+/);
    let sampleId = '';
    let testCode = '';
    let value = '';
    let unit = '';
    let referenceRange = '';

    for (const line of lines) {
      const fields = line.split('|');
      const recordType = fields[0];

      if (recordType === 'O') {
        sampleId = fields[2] || fields[3] || '';
      } else if (recordType === 'R') {
        const rawCode = fields[2] || '';
        // Extrae el código limpio (ej: ^^^CEA -> CEA)
        testCode = rawCode.replace(/\^/g, '').trim();
        value = fields[3] || '';
        unit = fields[4] || '';
        referenceRange = fields[5] || '';
      }
    }

    if (!testCode || !value) return null;

    return {
      sampleId,
      testCode,
      value,
      unit,
      referenceRange,
    };
  } catch (error) {
    console.error('Error parseando trama ASTM:', error);
    return null;
  }
}
