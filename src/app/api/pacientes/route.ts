import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@/lib/db';
import { ensureSeed } from '@/lib/seedHelper';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const sedeId = searchParams.get('sedeId');

  try {
    await ensureSeed();
    const list = sedeId 
      ? await sql`SELECT * FROM "Paciente" WHERE "sedeId" = ${sedeId}`
      : await sql`SELECT * FROM "Paciente"`;
    
    const mapped = list.map((p: any) => ({
      dni: p.dni,
      nombre: p.nombre,
      apellido: p.apellido,
      telefono: p.telefono,
      correo: p.correo,
      sedeRegistro: p.sedeRegistro,
      sedeId: p.sedeId,
      fechaRegistro: p.fechaRegistro
    }));

    return NextResponse.json(mapped);
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { dni, nombre, apellido, telefono, correo, sedeId } = await req.json();

    if (!dni || !nombre || !apellido || !sedeId) {
      return NextResponse.json({ error: 'Faltan parámetros requeridos' }, { status: 400 });
    }

    await ensureSeed();
    const hoy = new Date().toISOString().split('T')[0];
    const n = nombre.toUpperCase();
    const a = apellido.toUpperCase();
    const t = telefono || null;
    const c = correo || null;

    const res = await sql`
      INSERT INTO "Paciente" (dni, nombre, apellido, telefono, correo, "sedeRegistro", "fechaRegistro", "sedeId") 
      VALUES (${dni}, ${n}, ${a}, ${t}, ${c}, ${sedeId}, ${hoy}, ${sedeId})
      ON CONFLICT (dni) 
      DO UPDATE SET 
        nombre = EXCLUDED.nombre,
        apellido = EXCLUDED.apellido,
        telefono = EXCLUDED.telefono,
        correo = EXCLUDED.correo,
        "sedeRegistro" = EXCLUDED."sedeRegistro",
        "sedeId" = EXCLUDED."sedeId"
      RETURNING *
    `;

    const p = res[0] as any;
    const paciente = {
      dni: p.dni,
      nombre: p.nombre,
      apellido: p.apellido,
      telefono: p.telefono,
      correo: p.correo,
      sedeRegistro: p.sedeRegistro,
      sedeId: p.sedeId,
      fechaRegistro: p.fechaRegistro
    };

    return NextResponse.json(paciente);
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
