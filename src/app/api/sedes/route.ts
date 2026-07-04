import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const list = await sql`SELECT * FROM "Sede" ORDER BY nombre ASC`;
    return NextResponse.json(list);
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { nombre, direccion, telefono } = await req.json();

    if (!nombre) {
      return NextResponse.json({ error: 'El nombre de la sede es requerido' }, { status: 400 });
    }

    const id = 'SEDE-' + nombre.toUpperCase().replace(/\s+/g, '-');

    await sql`
      INSERT INTO "Sede" (id, nombre, direccion, telefono)
      VALUES (${id}, ${nombre}, ${direccion || null}, ${telefono || null})
      ON CONFLICT (id) DO UPDATE SET
        nombre = EXCLUDED.nombre,
        direccion = EXCLUDED.direccion,
        telefono = EXCLUDED.telefono
      RETURNING *
    `;

    return NextResponse.json({ success: true, id }, { status: 201 });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const { id, nombre, direccion, telefono, activo } = await req.json();

    if (!id) {
      return NextResponse.json({ error: 'ID de sede requerido' }, { status: 400 });
    }

    const res = await sql`
      UPDATE "Sede" SET
        nombre = COALESCE(${nombre}, nombre),
        direccion = COALESCE(${direccion}, direccion),
        telefono = COALESCE(${telefono}, telefono),
        activo = COALESCE(${activo}, activo)
      WHERE id = ${id}
      RETURNING *
    `;

    if (res.length === 0) {
      return NextResponse.json({ error: 'Sede no encontrada' }, { status: 404 });
    }

    return NextResponse.json(res[0]);
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
