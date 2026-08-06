import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@/lib/db';
import { buildASTMOrderFrame } from '@/lib/astmParser';

export const dynamic = 'force-dynamic';

/**
 * GET /api/lis/order?sampleId=XXXX
 * Endpoint consultado por el Lifotronic eCL8000 para obtener las pruebas pendientes de una muestra.
 */
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const sampleId = searchParams.get('sampleId') || searchParams.get('dni');
  const format = searchParams.get('format') || 'astm'; // 'astm' o 'json'

  if (!sampleId) {
    return NextResponse.json({ error: 'Parámetro sampleId o dni es requerido' }, { status: 400 });
  }

  try {
    // Buscar paciente por DNI o código de muestra
    const pacientes = await sql`
      SELECT * FROM "Paciente" WHERE dni = ${sampleId} LIMIT 1
    `;

    if (pacientes.length === 0) {
      return NextResponse.json({ error: 'Paciente/Muestra no encontrada' }, { status: 404 });
    }

    const paciente = pacientes[0] as any;

    // Buscar pruebas pendientes para el paciente
    const pruebas = await sql`
      SELECT * FROM "PruebaClinica" 
      WHERE "pacienteDni" = ${paciente.dni} AND status = 'En Proceso'
    `;

    const testCodes = pruebas.map((p: any) => p.examen);

    if (format === 'json') {
      return NextResponse.json({
        sampleId: paciente.dni,
        patientName: `${paciente.nombre} ${paciente.apellido}`,
        tests: testCodes,
      });
    }

    // Retornar en formato de trama de orden ASTM E1394
    const astmFrame = buildASTMOrderFrame({
      sampleId: paciente.dni,
      patientDni: paciente.dni,
      patientName: `${paciente.nombre} ${paciente.apellido}`,
      tests: testCodes,
    });

    return new NextResponse(astmFrame, {
      headers: { 'Content-Type': 'text/plain; charset=utf-8' },
    });
  } catch (e: any) {
    console.error('Error en GET /api/lis/order:', e);
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
