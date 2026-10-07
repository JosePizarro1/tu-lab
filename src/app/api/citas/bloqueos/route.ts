import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@/lib/db';
import { ensureSeed } from '@/lib/seedHelper';
import { HorarioBloqueadoSchema } from '@/lib/schemas';

// GET /api/citas/bloqueos - Listar bloqueos de horarios (filtros opcionales: fecha, sedeId)
export async function GET(request: NextRequest) {
  try {
    await ensureSeed();
    const { searchParams } = new URL(request.url);
    const fecha = searchParams.get('fecha');
    const sedeId = searchParams.get('sedeId');

    const conditions = [];
    if (fecha) conditions.push(sql`b.fecha = ${fecha}`);
    if (sedeId) conditions.push(sql`b."sedeId" = ${sedeId}`);

    let res;
    if (conditions.length > 0) {
      res = await sql`
        SELECT b.*, e.nombre as "especialidadNombre", s.nombre as "sedeNombre"
        FROM "HorarioBloqueado" b
        LEFT JOIN "Especialidad" e ON b."especialidadId" = e.id
        LEFT JOIN "Sede" s ON b."sedeId" = s.id
        WHERE ${conditions.reduce((prev, curr) => sql`${prev} AND ${curr}`)}
        ORDER BY b.fecha ASC, b."horaInicio" ASC
      `;
    } else {
      res = await sql`
        SELECT b.*, e.nombre as "especialidadNombre", s.nombre as "sedeNombre"
        FROM "HorarioBloqueado" b
        LEFT JOIN "Especialidad" e ON b."especialidadId" = e.id
        LEFT JOIN "Sede" s ON b."sedeId" = s.id
        ORDER BY b.fecha DESC, b."horaInicio" ASC
        LIMIT 100
      `;
    }

    return NextResponse.json(res);
  } catch (error: any) {
    console.error('Error al obtener horarios bloqueados:', error);
    return NextResponse.json({ error: error.message || 'Error al obtener bloqueos' }, { status: 500 });
  }
}

// POST /api/citas/bloqueos - Crear nuevo bloqueo de horario
export async function POST(request: NextRequest) {
  try {
    await ensureSeed();
    const body = await request.json();
    const validated = HorarioBloqueadoSchema.parse(body);

    if (validated.horaInicio >= validated.horaFin) {
      return NextResponse.json(
        { error: 'La hora de inicio debe ser anterior a la hora de fin' },
        { status: 400 }
      );
    }

    const id = `BLOQ-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

    const res = await sql`
      INSERT INTO "HorarioBloqueado" (
        id, "sedeId", "especialidadId", fecha, "horaInicio", "horaFin", motivo
      ) VALUES (
        ${id},
        ${validated.sedeId},
        ${validated.especialidadId || null},
        ${validated.fecha},
        ${validated.horaInicio},
        ${validated.horaFin},
        ${validated.motivo || 'Horario bloqueado por administración'}
      )
      RETURNING *
    `;

    return NextResponse.json(res[0], { status: 201 });
  } catch (error: any) {
    console.error('Error al crear bloqueo de horario:', error);
    return NextResponse.json({ error: error.message || 'Error al crear bloqueo' }, { status: 500 });
  }
}

// DELETE /api/citas/bloqueos?id=... - Eliminar/desbloquear horario
export async function DELETE(request: NextRequest) {
  try {
    await ensureSeed();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'ID requerido' }, { status: 400 });
    }

    await sql`
      DELETE FROM "HorarioBloqueado"
      WHERE id = ${id}
    `;

    return NextResponse.json({ ok: true, message: 'Horario desbloqueado correctamente' });
  } catch (error: any) {
    console.error('Error al eliminar bloqueo:', error);
    return NextResponse.json({ error: error.message || 'Error al eliminar bloqueo' }, { status: 500 });
  }
}
