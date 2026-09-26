import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@/lib/db';

import { UsuarioSchema } from '@/lib/schemas';
import { ALL_ROLES } from '@/types/roles';

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
    const body = await req.json();
    console.log('[API POST /api/usuarios] Solicitud recibida:', {
      ...body,
      password: body.password ? '******' : undefined,
    });

    const parsed = UsuarioSchema.safeParse(body);
    if (!parsed.success) {
      const errorMsg = parsed.error.issues.map((i) => i.message).join('. ');
      console.warn('[API POST /api/usuarios] Error de validación Zod:', errorMsg, parsed.error.format());
      return NextResponse.json(
        { error: errorMsg, details: parsed.error.format() },
        { status: 400 }
      );
    }

    const { username, password, nombre, rol } = parsed.data;
    const cleanUsername = username.trim().toLowerCase();
    const id = 'U-' + cleanUsername.toUpperCase().replace(/\s+/g, '_');

    // Verificar si ya existe usuario con el mismo username o ID
    const existing = await sql`
      SELECT id, username FROM "Usuario"
      WHERE id = ${id} OR LOWER(username) = ${cleanUsername}
      LIMIT 1
    `;

    if (existing.length > 0) {
      console.warn(`[API POST /api/usuarios] Conflicto: el usuario ya existe: "${cleanUsername}" (ID: ${id})`);
      return NextResponse.json(
        { error: `El nombre de usuario "${cleanUsername}" ya está registrado en el sistema.` },
        { status: 409 }
      );
    }

    await sql`
      INSERT INTO "Usuario" (id, username, password, nombre, rol, activo)
      VALUES (${id}, ${cleanUsername}, ${password}, ${nombre.trim()}, ${rol}, true)
    `;

    console.log('[API POST /api/usuarios] Usuario creado exitosamente:', { id, username: cleanUsername, nombre: nombre.trim(), rol });
    return NextResponse.json({ success: true, id }, { status: 201 });
  } catch (e: any) {
    console.error('[API POST /api/usuarios] Error en base de datos al crear usuario:', e);
    return NextResponse.json({ error: e.message || 'Error interno del servidor al crear usuario' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const { id, username, password, nombre, rol, activo } = await req.json();

    if (!id) {
      return NextResponse.json({ error: 'ID de usuario requerido' }, { status: 400 });
    }

    if (rol !== undefined && !ALL_ROLES.includes(rol)) {
      return NextResponse.json({ error: 'Rol no válido' }, { status: 400 });
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
