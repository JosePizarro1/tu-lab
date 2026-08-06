import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@/lib/db';
import { parseASTMResultFrame, getTestNameFromCode } from '@/lib/astmParser';
import { LisResultSchema } from '@/lib/lisSchemas';

export const dynamic = 'force-dynamic';

/**
 * POST /api/lis/result
 * Endpoint donde el Lifotronic eCL8000 o el agente LIS envía los resultados procesados.
 */
export async function POST(req: NextRequest) {
  try {
    const contentType = req.headers.get('content-type') || '';
    let sampleId = '';
    let testCode = '';
    let value = '';
    let unit = '';
    let referenceRange = '';

    // Soporte para envío de tramas ASTM puras (text/plain) o JSON estructurado
    if (contentType.includes('text/plain') || contentType.includes('text/astm')) {
      const rawText = await req.text();
      const parsed = parseASTMResultFrame(rawText);

      if (!parsed || !parsed.testCode || !parsed.value) {
        return NextResponse.json({ error: 'Trama ASTM inválida o incompleta' }, { status: 400 });
      }

      sampleId = parsed.sampleId || '';
      testCode = parsed.testCode;
      value = parsed.value;
      unit = parsed.unit || '';
      referenceRange = parsed.referenceRange || '';
    } else {
      // JSON estructurado
      const body = await req.json();
      const validation = LisResultSchema.safeParse(body);

      if (!validation.success) {
        return NextResponse.json(
          { error: 'Datos de resultado LIS inválidos', details: validation.error.format() },
          { status: 400 }
        );
      }

      sampleId = validation.data.sampleId;
      testCode = validation.data.testCode;
      value = String(validation.data.value);
      unit = validation.data.unit || '';
      referenceRange = validation.data.referenceRange || '';
    }

    const testName = getTestNameFromCode(testCode);
    const resultadoFormateado = unit ? `${value} ${unit}` : value;

    console.log(`[LIS RESULT] Recibido para muestra ${sampleId}: ${testName} = ${resultadoFormateado}`);

    // 1. Intentar actualizar la prueba existente que esté 'En Proceso'
    const res = await sql`
      UPDATE "PruebaClinica"
      SET 
        status = 'Completado',
        resultado = ${resultadoFormateado}
      WHERE ("pacienteDni" = ${sampleId} OR id = ${sampleId})
        AND status = 'En Proceso'
      RETURNING *
    `;

    if (res.length > 0) {
      return NextResponse.json({
        success: true,
        message: 'Resultado guardado y vinculado a orden existente',
        prueba: res[0],
      });
    }

    // 2. FALLBACK DE SEGURIDAD: Si no había una orden vinculada previa
    const pacienteDniExtraido = sampleId.split('-')[0];
    const idGenerado = sampleId.includes('-') ? sampleId : `${sampleId}-LIS`;
    const hoy = new Date().toISOString().split('T')[0];
    const sedeIdFallback = 'SEDE-BRENA';

    // Verificar si el paciente existe en la base de datos
    const pacienteExiste = await sql`
      SELECT * FROM "Paciente" WHERE dni = ${pacienteDniExtraido} LIMIT 1
    `;

    // Si el paciente no existe en la DB, intentamos autocompletar sus datos con RENIEC (APIsPerú)
    if (pacienteExiste.length === 0) {
      let nombreReal = 'PACIENTE LIS';
      let apellidoReal = `DNI ${pacienteDniExtraido}`;

      if (pacienteDniExtraido.length === 8) {
        try {
          const apisPeruToken = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJlbWFpbCI6Imx1aXMuY2hhbWJpbGxhMTIzNDVAZ21haWwuY29tIn0.ioSsBmaUoSwQkq-pdObgozhDSO1JMYRT5Jjwok6YZnE';
          const reniecRes = await fetch(
            `https://dniruc.apisperu.com/api/v1/dni/${pacienteDniExtraido}?token=${apisPeruToken}`
          );

          if (reniecRes.ok) {
            const reniecData = await reniecRes.json();
            if (reniecData.nombres) {
              nombreReal = reniecData.nombres;
              apellidoReal = `${reniecData.apellidoPaterno || ''} ${reniecData.apellidoMaterno || ''}`.trim();
            }
          }
        } catch (reniecErr) {
          console.warn('[LIS FALLBACK RENIEC] No se pudo consultar RENIEC en segundo plano:', reniecErr);
        }
      }

      await sql`
        INSERT INTO "Paciente" (dni, nombre, apellido, telefono, correo, "sedeRegistro", "fechaRegistro", "sedeId")
        VALUES (${pacienteDniExtraido}, ${nombreReal}, ${apellidoReal}, NULL, NULL, ${sedeIdFallback}, ${hoy}, ${sedeIdFallback})
        ON CONFLICT (dni) DO NOTHING
      `;
    }

    // Insertar la orden clínica directamente en estado Completado
    const fallbackRes = await sql`
      INSERT INTO "PruebaClinica" (id, "pacienteDni", examen, status, fecha, resultado, sede, "sedeId")
      VALUES (${idGenerado}, ${pacienteDniExtraido}, ${testName}, 'Completado', ${hoy}, ${resultadoFormateado}, ${sedeIdFallback}, ${sedeIdFallback})
      RETURNING *
    `;

    return NextResponse.json({
      success: true,
      message: 'FALLBACK ACTIVADO: Resultado registrado automáticamente en nueva orden y vinculado al paciente',
      prueba: fallbackRes[0],
    });
  } catch (e: any) {
    console.error('Error en POST /api/lis/result:', e);
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
