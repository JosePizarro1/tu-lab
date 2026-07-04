import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@/lib/db';
import { ensureSeed } from '@/lib/seedHelper';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const sede = searchParams.get('sede');
  const pacienteDni = searchParams.get('pacienteDni');

  try {
    await ensureSeed();

    let list;
    if (sede && pacienteDni) {
      list = await sql`
        SELECT * FROM "PruebaClinica" 
        WHERE sede = ${sede} AND "pacienteDni" = ${pacienteDni} 
        ORDER BY id DESC
      `;
    } else if (sede) {
      list = await sql`
        SELECT * FROM "PruebaClinica" 
        WHERE sede = ${sede} 
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
    
    // Mapear de camelCase a PascalCase para el frontend
    const mapped = list.map((p: any) => ({
      id: p.id,
      pacienteDni: p.pacienteDni,
      examen: p.examen,
      status: p.status,
      fecha: p.fecha,
      resultado: p.resultado,
      sede: p.sede
    }));

    return NextResponse.json(mapped);
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { pacienteDni, examen, sede } = await req.json();

    if (!pacienteDni || !examen || !sede) {
      return NextResponse.json({ error: 'Faltan parámetros requeridos' }, { status: 400 });
    }

    await ensureSeed();
    const id = 'P-' + Date.now();
    const fecha = new Date().toISOString().split('T')[0];

    const res = await sql`
      INSERT INTO "PruebaClinica" (id, "pacienteDni", examen, status, fecha, resultado, sede) 
      VALUES (${id}, ${pacienteDni}, ${examen}, 'En Proceso', ${fecha}, ${null}, ${sede})
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
      sede: p.sede
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
      sede: p.sede
    };

    return NextResponse.json(pruebaActualizada);
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
