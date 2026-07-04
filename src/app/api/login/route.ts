import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@/lib/db';
import { ensureSeed } from '@/lib/seedHelper';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const { username, password } = await req.json();
    console.log("POST /api/login - Intentando autenticación para usuario:", username);

    if (!username || !password) {
      return NextResponse.json({ error: 'Usuario y contraseña son requeridos' }, { status: 400 });
    }

    // Asegurar que la base de datos de Neon esté sembrada
    console.log("POST /api/login - Ejecutando siembra de base de datos...");
    await ensureSeed();

    console.log("POST /api/login - Consultando usuario en la base de datos...");
    const usuarios = await sql`
      SELECT * FROM "Usuario" WHERE username = ${username} LIMIT 1
    `;

    if (usuarios.length === 0) {
      console.log("POST /api/login - Usuario no encontrado:", username);
      return NextResponse.json({ error: 'Credenciales inválidas' }, { status: 401 });
    }

    const usuario = usuarios[0] as any;

    if (usuario.password !== password) {
      console.log("POST /api/login - Contraseña incorrecta para usuario:", username);
      return NextResponse.json({ error: 'Credenciales inválidas' }, { status: 401 });
    }

    console.log("POST /api/login - Autenticación exitosa para usuario:", username);
    const { password: _, ...usuarioInfo } = usuario;
    return NextResponse.json(usuarioInfo);
  } catch (e: any) {
    console.error("ERROR CRÍTICO EN POST /api/login:", e);
    return NextResponse.json({ error: e.message, stack: e.stack }, { status: 550 });
  }
}
