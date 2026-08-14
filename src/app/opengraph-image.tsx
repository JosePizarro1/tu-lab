import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'UNIDOSLAB - Unidos por tu Salud';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          background: 'linear-gradient(135deg, #1e3a4c 0%, #0f1d26 50%, #e52320 100%)',
          fontFamily: 'sans-serif',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 24,
            marginBottom: 20,
          }}
        >
          <div
            style={{
              width: 80,
              height: 80,
              borderRadius: 16,
              background: 'rgba(229, 35, 32, 0.2)',
              border: '3px solid rgba(229, 35, 32, 0.5)',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              fontSize: 40,
            }}
          >
            🧪
          </div>
        </div>
        <div
          style={{
            fontSize: 64,
            fontWeight: 800,
            color: '#ffffff',
            letterSpacing: '-2px',
          }}
        >
          UNIDOS<span style={{ color: '#E52320' }}>LAB</span>
        </div>
        <div
          style={{
            fontSize: 24,
            color: 'rgba(255,255,255,0.8)',
            marginTop: 12,
            fontWeight: 500,
            letterSpacing: '4px',
            textTransform: 'uppercase',
          }}
        >
          Unidos por tu Salud
        </div>
      </div>
    ),
    { ...size }
  );
}
