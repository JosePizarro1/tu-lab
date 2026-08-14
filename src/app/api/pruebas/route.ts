import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@/lib/db';
import { ensureSeed } from '@/lib/seedHelper';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const sedeId = searchParams.get('sedeId');
  const pacienteDni = searchParams.get('pacienteDni');

  try {
    await ensureSeed();

    let list;
    if (sedeId && sedeId !== 'ALL' && pacienteDni) {
      list = await sql`
        SELECT * FROM "PruebaClinica" 
        WHERE "sedeId" = ${sedeId} AND "pacienteDni" = ${pacienteDni} 
        ORDER BY id DESC
      `;
    } else if (sedeId && sedeId !== 'ALL') {
      list = await sql`
        SELECT * FROM "PruebaClinica" 
        WHERE "sedeId" = ${sedeId} 
        ORDER BY id DESC
      `;
    } else if (pacienteDni) {
      list = await sql`
        SELECT * FROM "PruebaClinica" 
        WHERE "pacienteDni" = ${pacienteDni} 
        ORDER BY id DESC
      `;
    } else {
      list = await sql`
        SELECT * FROM "PruebaClinica" 
        ORDER BY id DESC
      `;
    }
    
    const mapped = list.map((p: any) => ({
      id: p.id,
      pacienteDni: p.pacienteDni,
      examen: p.examen,
      status: p.status,
      fecha: p.fecha,
      resultado: p.resultado,
      sede: p.sede,
      sedeId: p.sedeId
    }));

    return NextResponse.json(mapped);
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { pacienteDni, examen, sedeId } = await req.json();

    if (!pacienteDni || !examen || !sedeId) {
      return NextResponse.json({ error: 'Faltan parámetros requeridos' }, { status: 400 });
    }

    await ensureSeed();
    
    // Obtener la cantidad de órdenes de hoy para este paciente para crear un correlativo limpio (ej: 70850583-01)
    const previas = await sql`
      SELECT COUNT(*)::int as count FROM "PruebaClinica" WHERE "pacienteDni" = ${pacienteDni}
    `;
    const num = (previas[0]?.count || 0) + 1;
    const id = `${pacienteDni}-${String(num).padStart(2, '0')}`;
    const fecha = new Date().toISOString().split('T')[0];

    const res = await sql`
      INSERT INTO "PruebaClinica" (id, "pacienteDni", examen, status, fecha, resultado, sede, "sedeId") 
      VALUES (${id}, ${pacienteDni}, ${examen}, 'En Proceso', ${fecha}, ${null}, ${sedeId}, ${sedeId})
      RETURNING *
    `;

    const p = res[0] as any;
    const nuevaPrueba = {
      id: p.id,
      pacienteDni: p.pacienteDni,
      examen: p.examen,
      status: p.status,
      fecha: p.fecha,
      resultado: p.resultado,
      sede: p.sede,
      sedeId: p.sedeId
    };

    return NextResponse.json(nuevaPrueba, { status: 201 });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const { id, status, resultado } = await req.json();

    if (!id || !status) {
      return NextResponse.json({ error: 'Faltan parámetros requeridos' }, { status: 400 });
    }

    await ensureSeed();
    
    const r = resultado || null;
    const res = await sql`
      UPDATE "PruebaClinica" 
      SET status = ${status}, resultado = ${r} 
      WHERE id = ${id} 
      RETURNING *
    `;

    if (res.length === 0) {
      return NextResponse.json({ error: 'Prueba clínica no encontrada' }, { status: 404 });
    }

    const p = res[0] as any;
    const pruebaActualizada = {
      id: p.id,
      pacienteDni: p.pacienteDni,
      examen: p.examen,
      status: p.status,
      fecha: p.fecha,
      resultado: p.resultado,
      sede: p.sede,
      sedeId: p.sedeId
    };

    return NextResponse.json(pruebaActualizada);
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');

  if (!id) {
    return NextResponse.json({ error: 'El ID de la orden es requerido' }, { status: 400 });
  }

  try {
    await ensureSeed();

    // Verificar el estado de la prueba antes de borrar
    const existentes = await sql`
      SELECT * FROM "PruebaClinica" WHERE id = ${id} LIMIT 1
    `;

    if (existentes.length === 0) {
      return NextResponse.json({ error: 'Orden no encontrada' }, { status: 404 });
    }

    const prueba = existentes[0] as any;

    // Regla de seguridad: Si la prueba ya fue procesada por el Lifotronic eCL8000 (Completado), NO se puede eliminar
    if (prueba.status === 'Completado') {
      return NextResponse.json(
        { error: 'No se puede eliminar una orden completada con resultados analíticos procesados' },
        { status: 403 }
      );
    }

    // Si está 'En Proceso' (pendiente), sí se permite cancelar/eliminar
    await sql`
      DELETE FROM "PruebaClinica" WHERE id = ${id}
    `;

    return NextResponse.json({ success: true, message: 'Orden pendiente eliminada correctamente', id });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

