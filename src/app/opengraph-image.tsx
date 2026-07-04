import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'AquaLab - Clinical Operations';
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
          background: 'linear-gradient(135deg, #0f172a 0%, #1e3a5f 50%, #1a8bc6 100%)',
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
              background: 'rgba(59, 181, 232, 0.2)',
              border: '3px solid rgba(59, 181, 232, 0.5)',
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
          AQUA<span style={{ color: '#3BB5E8' }}>LAB</span>
        </div>
        <div
          style={{
            fontSize: 24,
            color: 'rgba(255,255,255,0.6)',
            marginTop: 12,
            fontWeight: 400,
            letterSpacing: '4px',
            textTransform: 'uppercase',
          }}
        >
          Clinical Operations
        </div>
      </div>
    ),
    { ...size }
  );
}
