import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@/lib/db';
import { ensureSeed } from '@/lib/seedHelper';
import { CitaSchema, ActualizarCitaSchema } from '@/lib/schemas';

// GET /api/citas - Listar citas con filtros opcionales de fecha, especialidad y sede
export async function GET(request: NextRequest) {
  try {
    await ensureSeed();
    const { searchParams } = new URL(request.url);
    const fecha = searchParams.get('fecha');
    const fechaDesde = searchParams.get('fechaDesde');
    const fechaHasta = searchParams.get('fechaHasta');
    const especialidadId = searchParams.get('especialidadId');
    const sedeId = searchParams.get('sedeId');

    const conditions = [];
    if (fecha) {
      conditions.push(sql`c.fecha = ${fecha}`);
    } else if (fechaDesde && fechaHasta) {
      conditions.push(sql`c.fecha >= ${fechaDesde} AND c.fecha <= ${fechaHasta}`);
    } else if (fechaDesde) {
      conditions.push(sql`c.fecha >= ${fechaDesde}`);
    }
    if (especialidadId) conditions.push(sql`c."especialidadId" = ${especialidadId}`);
    if (sedeId) conditions.push(sql`c."sedeId" = ${sedeId}`);


    let query;
    if (conditions.length > 0) {
      // Combinar condiciones
      query = await sql`
        SELECT c.*, e.nombre as "especialidadNombre", s.nombre as "sedeNombre"
        FROM "Cita" c
        JOIN "Especialidad" e ON c."especialidadId" = e.id
        LEFT JOIN "Sede" s ON c."sedeId" = s.id
        WHERE ${conditions.reduce((prev, curr) => sql`${prev} AND ${curr}`)}
        ORDER BY c.fecha DESC, c.hora ASC
        LIMIT 150
      `;
    } else {
      query = await sql`
        SELECT c.*, e.nombre as "especialidadNombre", s.nombre as "sedeNombre"
        FROM "Cita" c
        JOIN "Especialidad" e ON c."especialidadId" = e.id
        LEFT JOIN "Sede" s ON c."sedeId" = s.id
        ORDER BY c.fecha DESC, c.hora ASC
        LIMIT 150
      `;
    }

    return NextResponse.json(query);
  } catch (error: any) {
    console.error('Error al obtener citas:', error);
    return NextResponse.json({ error: error.message || 'Error al obtener citas' }, { status: 500 });
  }
}

// POST /api/citas - Crear nueva cita
export async function POST(request: NextRequest) {
  try {
    await ensureSeed();
    const body = await request.json();
    const validated = CitaSchema.parse(body);

    const sedeEfectiva = validated.sedeId || 'SEDE-LEGUIA';

    // Validar que la cita no sea en fecha/hora pasada (según hora oficial de Perú)
    const now = new Date();
    const formatter = new Intl.DateTimeFormat('en-CA', {
      timeZone: 'America/Lima',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    });
    const partes = formatter.formatToParts(now);
    const map = Object.fromEntries(partes.map(p => [p.type, p.value]));
    const fechaHoyPeru = `${map.year}-${map.month}-${map.day}`;
    const horaActualPeru = `${map.hour}:${map.minute}`;

    if (validated.fecha < fechaHoyPeru || (validated.fecha === fechaHoyPeru && validated.hora <= horaActualPeru)) {
      return NextResponse.json(
        { error: 'No es posible agendar citas en fechas u horarios que ya transcurrieron.' },
        { status: 400 }
      );
    }

    // Verificar conflicto en la misma sede, fecha, especialidad y hora
    const conflicto = await sql`
      SELECT id FROM "Cita"
      WHERE "especialidadId" = ${validated.especialidadId}
        AND ("sedeId" = ${sedeEfectiva} OR "sedeId" IS NULL)
        AND fecha = ${validated.fecha}
        AND hora = ${validated.hora}
        AND estado != 'cancelada'
      LIMIT 1
    `;

    if (conflicto.length > 0) {
      return NextResponse.json(
        { error: 'El horario seleccionado ya no está disponible en esta sede. Por favor elija otro horario.' },
        { status: 409 }
      );
    }

    // Verificar si el horario está bloqueado por administración
    const bloqueo = await sql`
      SELECT id, motivo FROM "HorarioBloqueado"
      WHERE ("sedeId" = ${sedeEfectiva} OR "sedeId" IS NULL)
        AND ("especialidadId" = ${validated.especialidadId} OR "especialidadId" IS NULL)
        AND fecha = ${validated.fecha}
        AND "horaInicio" <= ${validated.hora}
        AND "horaFin" > ${validated.hora}
      LIMIT 1
    `;

    if (bloqueo.length > 0) {
      return NextResponse.json(
        { error: `Este horario se encuentra bloqueado por administración (${bloqueo[0].motivo || 'No disponible'}).` },
        { status: 409 }
      );
    }

    // Duración de la especialidad
    const esp = await sql`
      SELECT "duracionMinutos" FROM "Especialidad" WHERE id = ${validated.especialidadId} LIMIT 1
    `;
    const duracion = esp.length > 0 ? (esp[0].duracionMinutos || 30) : 30;

    const id = `CITA-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

    const insertResult = await sql`
      INSERT INTO "Cita" (
        id, "sedeId", "especialidadId", fecha, hora, "duracionMinutos",
        "pacienteDni", "pacienteNombre", "pacienteTelefono", "pacienteEmail",
        motivo, origen, estado
      ) VALUES (
        ${id}, ${sedeEfectiva}, ${validated.especialidadId}, ${validated.fecha}, ${validated.hora}, ${duracion},
        ${validated.pacienteDni}, ${validated.pacienteNombre}, ${validated.pacienteTelefono},
        ${validated.pacienteEmail || null}, ${validated.motivo || null},
        ${validated.origen || 'web'}, 'pendiente'
      )
      RETURNING *
    `;

    return NextResponse.json(insertResult[0], { status: 201 });
  } catch (error: any) {
    console.error('Error al crear cita:', error);
    if (error.errors) {
      return NextResponse.json({ error: error.errors[0]?.message || 'Datos inválidos' }, { status: 400 });
    }
    return NextResponse.json({ error: error.message || 'Error al registrar la cita' }, { status: 500 });
  }
}

// PUT /api/citas - Actualizar estado o reprogramar cita
export async function PUT(request: NextRequest) {
  try {
    await ensureSeed();
    const body = await request.json();
    const validated = ActualizarCitaSchema.parse(body);

    const updateResult = await sql`
      UPDATE "Cita"
      SET
        estado = COALESCE(${validated.estado || null}, estado),
        "pacienteNombre" = COALESCE(${validated.pacienteNombre || null}, "pacienteNombre"),
        hora = COALESCE(${validated.hora || null}, hora),
        fecha = COALESCE(${validated.fecha || null}, fecha),
        motivo = COALESCE(${validated.motivo || null}, motivo),
        "recordatorioEnviado" = COALESCE(${validated.recordatorioEnviado !== undefined ? validated.recordatorioEnviado : null}, "recordatorioEnviado"),
        "recordatorioEnviadoEn" = COALESCE(${validated.recordatorioEnviadoEn ? new Date(validated.recordatorioEnviadoEn) : null}, "recordatorioEnviadoEn")
      WHERE id = ${validated.id}
      RETURNING *
    `;



    if (updateResult.length === 0) {
      return NextResponse.json({ error: 'Cita no encontrada' }, { status: 404 });
    }

    return NextResponse.json(updateResult[0]);
  } catch (error: any) {
    console.error('Error al actualizar cita:', error);
    return NextResponse.json({ error: error.message || 'Error al actualizar la cita' }, { status: 500 });
  }
}

// DELETE /api/citas?id=CITA-123 - Cancelar cita
export async function DELETE(request: NextRequest) {
  try {
    await ensureSeed();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'ID de cita requerido' }, { status: 400 });
    }

    await sql`DELETE FROM "Cita" WHERE id = ${id}`;

    return NextResponse.json({ ok: true, message: 'Cita eliminada correctamente' });
  } catch (error: any) {
    console.error('Error al eliminar cita:', error);
    return NextResponse.json({ error: error.message || 'Error al eliminar la cita' }, { status: 500 });
  }
}
