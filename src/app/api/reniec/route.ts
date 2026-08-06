import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

const APIS_PERU_TOKEN = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJlbWFpbCI6Imx1aXMuY2hhbWJpbGxhMTIzNDVAZ21haWwuY29tIn0.ioSsBmaUoSwQkq-pdObgozhDSO1JMYRT5Jjwok6YZnE';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const dni = searchParams.get('dni');

  if (!dni || dni.length !== 8) {
    return NextResponse.json({ error: 'Se requiere un DNI válido de 8 dígitos' }, { status: 400 });
  }

  try {
    const url = `https://dniruc.apisperu.com/api/v1/dni/${dni}?token=${APIS_PERU_TOKEN}`;
    const res = await fetch(url);

    if (!res.ok) {
      const text = await res.text();
      return NextResponse.json({
        error: `APIs Perú respondió con estado ${res.status}: ${text}`
      }, { status: res.status });
    }

    const data = await res.json();

    // Estructurar la respuesta para el frontend
    return NextResponse.json({
      dni: data.dni || dni,
      nombre: data.nombres || '',
      apellido: `${data.apellidoPaterno || ''} ${data.apellidoMaterno || ''}`.trim(),
      raw: data
    });

  } catch (e: any) {
    return NextResponse.json({
      error: `Error al consultar RENIEC: ${e.message}`
    }, { status: 500 });
  }
}
