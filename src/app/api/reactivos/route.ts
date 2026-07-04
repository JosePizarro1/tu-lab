import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@/lib/db';
import { ensureSeed } from '@/lib/seedHelper';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const sede = searchParams.get('sede');

  if (!sede) {
    return NextResponse.json({ error: 'La sede es requerida' }, { status: 400 });
  }

  try {
    await ensureSeed();
    const list = await sql`
      SELECT * FROM "Reactivo" WHERE sede = ${sede}
    `;
    return NextResponse.json(list);
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { reactivoId, cantidad, tipo, sede } = await req.json();

    if (!reactivoId || !cantidad || !tipo || !sede) {
      return NextResponse.json({ error: 'Faltan parámetros requeridos' }, { status: 400 });
    }

    await ensureSeed();
    const reactivos = await sql`
      SELECT * FROM "Reactivo" WHERE id = ${reactivoId} AND sede = ${sede} LIMIT 1
    `;

    if (reactivos.length === 0) {
      return NextResponse.json({ error: 'Reactivo no encontrado en esta sede' }, { status: 404 });
    }

    const reactivo = reactivos[0] as any;

    if (tipo === 'Salida' && reactivo.stock < cantidad) {
      return NextResponse.json({ error: 'Stock insuficiente para esta salida' }, { status: 400 });
    }

    const nuevoStock = tipo === 'Entrada' 
      ? reactivo.stock + cantidad 
      : reactivo.stock - cantidad;

    // Actualizar el stock
    await sql`
      UPDATE "Reactivo" SET stock = ${nuevoStock} WHERE id = ${reactivo.id}
    `;

    // Crear el movimiento
    const movimientoId = 'M-' + Date.now();
    const fechaActual = new Date().toISOString().split('T')[0] + ' ' + new Date().toLocaleTimeString();
    
    await sql`
      INSERT INTO "MovimientoInventario" (id, "reactivoId", cantidad, tipo, fecha, responsable) 
      VALUES (${movimientoId}, ${reactivoId}, ${cantidad}, ${tipo}, ${fechaActual}, 'Dr. Admin')
    `;

    const reactivoActualizado = { ...reactivo, stock: nuevoStock };
    const nuevoMovimiento = {
      id: movimientoId,
      reactivoId,
      cantidad,
      tipo,
      fecha: fechaActual,
      responsable: 'Dr. Admin'
    };

    return NextResponse.json({ reactivo: reactivoActualizado, movimiento: nuevoMovimiento });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
