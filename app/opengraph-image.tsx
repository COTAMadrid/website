import { ImageResponse } from 'next/og';

export const alt = 'Cota — Reforma con criterio · Madrid';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          background: '#0a0a0a',
          color: '#ffffff',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'flex-start',
          padding: '80px',
          fontFamily: 'sans-serif',
        }}
      >
        <div style={{ fontSize: 140, fontWeight: 300, lineHeight: 1, letterSpacing: '-0.04em' }}>
          Cota
        </div>
        <div style={{ fontSize: 36, color: '#a3a3a3', marginTop: 24 }}>
          Reforma con criterio · Madrid
        </div>
        <div style={{ fontSize: 28, color: '#737373', marginTop: 40, maxWidth: 900, lineHeight: 1.4 }}>
          Antes de empezar tu reforma, te decimos si es viable, cuánto cuesta y qué riesgos puede tener.
        </div>
      </div>
    ),
    { ...size },
  );
}
