import { NextResponse } from 'next/server';
import { sql } from '@/lib/db';
import { ensureSeed } from '@/lib/seedHelper';

let cachedEspecialidades: any = null;
let lastFetchTime = 0;
const CACHE_TTL_MS = 60 * 1000 * 10; // 10 minutos de caché en memoria

export async function GET() {
  try {
    const now = Date.now();
    if (cachedEspecialidades && (now - lastFetchTime) < CACHE_TTL_MS) {
      return NextResponse.json(cachedEspecialidades, {
        headers: {
          'Cache-Control': 'public, s-maxage=600, stale-while-revalidate=1200',
        },
      });
    }

    await ensureSeed();
    const rows = await sql`
      SELECT id, nombre, descripcion, "duracionMinutos", icono, activo
      FROM "Especialidad"
      WHERE activo = true
      ORDER BY nombre ASC
    `;

    cachedEspecialidades = rows;
    lastFetchTime = now;

    return NextResponse.json(rows, {
      headers: {
        'Cache-Control': 'public, s-maxage=600, stale-while-revalidate=1200',
      },
    });
  } catch (error: any) {
    console.error('Error al obtener especialidades:', error);
    return NextResponse.json({ error: error.message || 'Error interno del servidor' }, { status: 500 });
  }
}

