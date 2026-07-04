import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic';

const API_BASE = 'https://app.apiinti.dev/api/v1';
const MAX_MONTHLY = 100;
const COUNTER_FILE = path.join(process.cwd(), '.reniec-counter.json');

async function getCounter(): Promise<{ used: number; month: string }> {
  try {
    const data = await fs.readFile(COUNTER_FILE, 'utf-8');
    return JSON.parse(data);
  } catch {
    return { used: 0, month: '' };
  }
}

async function saveCounter(used: number, month: string) {
  await fs.writeFile(COUNTER_FILE, JSON.stringify({ used, month }), 'utf-8');
}

function getCurrentMonth(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const dni = searchParams.get('dni');

  if (!dni || dni.length !== 8) {
    return NextResponse.json({ error: 'Se requiere un DNI válido de 8 dígitos' }, { status: 400 });
  }

  const apiKey = process.env.APIINTI_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: 'APIINTI_KEY no configurada' }, { status: 500 });
  }

  // Control de consultas mensuales
  const counter = await getCounter();
  const currentMonth = getCurrentMonth();
  let used = counter.month === currentMonth ? counter.used : 0;
  const remaining = Math.max(0, MAX_MONTHLY - used);

  if (used >= MAX_MONTHLY) {
    return NextResponse.json({
      error: 'Límite mensual de consultas alcanzado (100/mes)',
      remaining: 0,
      maxQueries: MAX_MONTHLY
    }, { status: 429 });
  }

  try {
    const res = await fetch(`${API_BASE}/dni/${dni}`, {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      }
    });

    if (!res.ok) {
      const text = await res.text();
      return NextResponse.json({
        error: `ApiInti respondió con ${res.status}: ${text}`,
        remaining,
        maxQueries: MAX_MONTHLY
      }, { status: 502 });
    }

    const json = await res.json();
    const data = json.data || json;

    // Incrementar contador
    used++;
    await saveCounter(used, currentMonth);

    return NextResponse.json({
      dni: data.dni || dni,
      nombre: data.nombres || '',
      apellido: `${data.apellidoPaterno || ''} ${data.apellidoMaterno || ''}`.trim(),
      remaining: MAX_MONTHLY - used,
      maxQueries: MAX_MONTHLY
    });

  } catch (e: any) {
    return NextResponse.json({
      error: `Error al consultar ApiInti: ${e.message}`,
      remaining,
      maxQueries: MAX_MONTHLY
    }, { status: 500 });
  }
}
