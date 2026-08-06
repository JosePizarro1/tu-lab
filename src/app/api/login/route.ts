import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@/lib/db';
import { ensureSeed } from '@/lib/seedHelper';
import { LoginSchema } from '@/lib/schemas';
import { signSessionToken, SESSION_COOKIE_NAME, SESSION_DURATION_SECONDS } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validation = LoginSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: 'Datos de inicio de sesión inválidos', details: validation.error.format() },
        { status: 400 }
      );
    }

    const { username, password } = validation.data;
    console.log("POST /api/login - Intentando autenticación para usuario:", username);

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

    // Generar token JWT de sesión
    const token = await signSessionToken({
      id: usuarioInfo.id,
      username: usuarioInfo.username,
      nombre: usuarioInfo.nombre,
      rol: usuarioInfo.rol
    });

    const response = NextResponse.json(usuarioInfo);

    // Configurar cookie de sesión HTTP-Only (30 días)
    response.cookies.set({
      name: SESSION_COOKIE_NAME,
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: SESSION_DURATION_SECONDS,
      path: '/',
    });

    return response;
  } catch (e: any) {
    console.error("ERROR CRÍTICO EN POST /api/login:", e);
    return NextResponse.json({ error: e.message, stack: e.stack }, { status: 550 });
  }
}

