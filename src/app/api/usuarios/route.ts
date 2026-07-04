import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const list = await sql`
      SELECT id, username, nombre, rol, activo FROM "Usuario" ORDER BY nombre ASC
    `;
    return NextResponse.json(list);
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { username, password, nombre, rol } = await req.json();

    if (!username || !password || !nombre || !rol) {
      return NextResponse.json({ error: 'Todos los campos son requeridos' }, { status: 400 });
    }

    const id = 'U-' + username.toUpperCase();

    await sql`
      INSERT INTO "Usuario" (id, username, password, nombre, rol, activo)
      VALUES (${id}, ${username}, ${password}, ${nombre}, ${rol}, true)
      ON CONFLICT (id) DO NOTHING
    `;

    return NextResponse.json({ success: true, id }, { status: 201 });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const { id, username, password, nombre, rol, activo } = await req.json();

    if (!id) {
      return NextResponse.json({ error: 'ID de usuario requerido' }, { status: 400 });
    }

    if (username !== undefined) {
      await sql`UPDATE "Usuario" SET username = ${username} WHERE id = ${id}`;
    }
    if (password !== undefined) {
      await sql`UPDATE "Usuario" SET password = ${password} WHERE id = ${id}`;
    }
    if (nombre !== undefined) {
      await sql`UPDATE "Usuario" SET nombre = ${nombre} WHERE id = ${id}`;
    }
    if (rol !== undefined) {
      await sql`UPDATE "Usuario" SET rol = ${rol} WHERE id = ${id}`;
    }
    if (activo !== undefined) {
      await sql`UPDATE "Usuario" SET activo = ${activo} WHERE id = ${id}`;
    }

    const res = await sql`
      SELECT id, username, nombre, rol, activo FROM "Usuario" WHERE id = ${id}
    `;

    if (res.length === 0) {
      return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 });
    }

    return NextResponse.json(res[0]);
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
