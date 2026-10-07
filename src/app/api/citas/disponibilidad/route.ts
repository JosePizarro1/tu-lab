import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@/lib/db';
import { ensureSeed } from '@/lib/seedHelper';

// Horarios según sede:
// Lun a Sáb:
// Sede Av. Leguía: Mañana desde 7:45 am hasta 1:00 pm / Tarde: 3:00 pm a 8:00 pm
// Sede Patricio Meléndez: Mañana desde 8:00 am hasta 1:00 pm / Tarde: 3:00 pm a 8:00 pm
function generarHorarios(duracionMinutos = 30, sedeId = 'SEDE-LEGUIA'): string[] {
  const slots: string[] = [];
  
  const esLeguia = sedeId === 'SEDE-LEGUIA' || !sedeId.includes('MELENDEZ');

  const rangos = [
    { startH: esLeguia ? 7 : 8, startM: esLeguia ? 45 : 0, endH: 13, endM: 0 },
    { startH: 15, startM: 0, endH: 20, endM: 0 },
  ];

  for (const rango of rangos) {
    let currentMin = rango.startH * 60 + rango.startM;
    const endMin = rango.endH * 60 + rango.endM;

    while (currentMin < endMin) {
      const h = Math.floor(currentMin / 60).toString().padStart(2, '0');
      const m = (currentMin % 60).toString().padStart(2, '0');
      slots.push(`${h}:${m}`);
      currentMin += duracionMinutos;
    }
  }

  return slots;
}

// Obtener fecha y hora actual en zona horaria de Perú (America/Lima)
function getPeruDateTime(): { fechaHoy: string; horaActual: string } {
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
  return {
    fechaHoy: `${map.year}-${map.month}-${map.day}`,
    horaActual: `${map.hour}:${map.minute}`,
  };
}

// Cache en memoria para duraciones de especialidad (evita SELECT extra en cada petición)
const duracionesMap = new Map<string, number>([
  ['esp-medicina-general', 30],
  ['esp-obstetricia', 30],
  ['esp-enfermeria', 20],
]);

function getCachedDuracion(especialidadId: string): number {
  return duracionesMap.get(especialidadId) || 30;
}

export async function GET(request: NextRequest) {


  try {
    await ensureSeed();
    const { searchParams } = new URL(request.url);
    const fecha = searchParams.get('fecha');
    const fechaInicio = searchParams.get('fechaInicio');
    const dias = parseInt(searchParams.get('dias') || '4', 10);
    const especialidadId = searchParams.get('especialidadId');
    const sedeId = searchParams.get('sedeId') || 'SEDE-LEGUIA';

    const { fechaHoy, horaActual } = getPeruDateTime();

    if (!especialidadId) {
      return NextResponse.json({ error: 'Parámetro especialidadId requerido' }, { status: 400 });
    }

    // Duración de la especialidad (cacheador en memoria rápido)
    const duracion = getCachedDuracion(especialidadId);
    const todosLosHorarios = generarHorarios(duracion, sedeId);

    // Consulta de fecha única
    if (fecha && !fechaInicio) {
      const citasOcupadas = await sql`
        SELECT hora, estado, origen
        FROM "Cita"
        WHERE fecha = ${fecha}
          AND "especialidadId" = ${especialidadId}
          AND ("sedeId" = ${sedeId} OR "sedeId" IS NULL)
          AND estado != 'cancelada'
      `;

      const bloqueos = await sql`
        SELECT "horaInicio", "horaFin"
        FROM "HorarioBloqueado"
        WHERE fecha = ${fecha}
          AND ("sedeId" = ${sedeId} OR "sedeId" IS NULL)
          AND ("especialidadId" = ${especialidadId} OR "especialidadId" IS NULL)
      `;

      const mapaOcupadas = new Map<string, any>();
      for (const c of citasOcupadas) {
        mapaOcupadas.set(c.hora, c);
      }

      const esPasado = fecha < fechaHoy;
      const esHoy = fecha === fechaHoy;

      const slots = todosLosHorarios.map((hora) => {
        const cita = mapaOcupadas.get(hora);
        const estaBloqueado = bloqueos.some((b: any) => hora >= b.horaInicio && hora < b.horaFin);
        const yaPaso = esPasado || (esHoy && hora <= horaActual);

        return {
          hora,
          disponible: !cita && !estaBloqueado && !yaPaso,
          bloqueado: estaBloqueado,
          pasado: yaPaso,
          cita: cita ? { estado: cita.estado, origen: cita.origen } : null,
        };
      });
      return NextResponse.json({ fecha, especialidadId, sedeId, slots });
    }

    // Rango de fechas para el carrusel de 4 columnas
    const baseDateStr = fechaInicio || new Date().toISOString().split('T')[0];
    const baseDate = new Date(baseDateStr + 'T12:00:00');
    const fechasList: string[] = [];

    for (let i = 0; i < dias; i++) {
      const d = new Date(baseDate);
      d.setDate(baseDate.getDate() + i);
      const iso = d.toISOString().split('T')[0];
      fechasList.push(iso);
    }

    // Ejecución paralela eficiente con sólo columnas requeridas
    const [citasRango, bloqueosRango] = await Promise.all([
      sql`
        SELECT fecha, hora
        FROM "Cita"
        WHERE fecha = ANY(${fechasList})
          AND "especialidadId" = ${especialidadId}
          AND ("sedeId" = ${sedeId} OR "sedeId" IS NULL)
          AND estado != 'cancelada'
      `,
      sql`
        SELECT fecha, "horaInicio", "horaFin"
        FROM "HorarioBloqueado"
        WHERE fecha = ANY(${fechasList})
          AND ("sedeId" = ${sedeId} OR "sedeId" IS NULL)
          AND ("especialidadId" = ${especialidadId} OR "especialidadId" IS NULL)
      `
    ]);


    const citasPorFechaYHora = new Set<string>();
    for (const c of citasRango) {
      citasPorFechaYHora.add(`${c.fecha}_${c.hora}`);
    }

    const columnas = fechasList.map((f) => {
      // 0 = Domingo (Laboratorio atiende de Lunes a Sábado)
      const dayOfWeek = new Date(f + 'T12:00:00').getDay();
      const esDomingo = dayOfWeek === 0;

      const esPasado = f < fechaHoy;
      const esHoy = f === fechaHoy;

      const bloqueosDelDia = bloqueosRango.filter((b: any) => b.fecha === f);

      const slots = esDomingo ? [] : todosLosHorarios.map((hora) => {
        const key = `${f}_${hora}`;
        const ocupado = citasPorFechaYHora.has(key);
        const estaBloqueado = bloqueosDelDia.some((b: any) => hora >= b.horaInicio && hora < b.horaFin);
        const yaPaso = esPasado || (esHoy && hora <= horaActual);

        return {
          hora,
          disponible: !ocupado && !estaBloqueado && !yaPaso,
          bloqueado: estaBloqueado,
          pasado: yaPaso,
        };
      });

      return {
        fecha: f,
        slots,
      };
    });

    return NextResponse.json({ especialidadId, sedeId, columnas });

  } catch (error: any) {
    console.error('Error al calcular disponibilidad múltiple:', error);
    return NextResponse.json({ error: error.message || 'Error interno' }, { status: 500 });
  }
}
