import { ImageResponse } from 'next/og';

export const alt = 'Cota Madrid — Reforma con criterio';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          background:
            'radial-gradient(ellipse at top right, #1a3329 0%, #0a1a14 60%, #050d09 100%)',
          color: '#fafafa',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '70px',
          fontFamily: 'sans-serif',
          position: 'relative',
        }}
      >
        {/* Subtle gold grid */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            opacity: 0.08,
            backgroundImage:
              'linear-gradient(to right, #d4a017 1px, transparent 1px), linear-gradient(to bottom, #d4a017 1px, transparent 1px)',
            backgroundSize: '60px 60px',
          }}
        />

        {/* Top: eyebrow */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 18,
            color: '#d4a017',
            fontSize: 22,
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
            fontWeight: 500,
          }}
        >
          <div style={{ width: 60, height: 1, background: '#d4a017' }} />
          <span>Cota Madrid · Consultoría</span>
        </div>

        {/* Center: headline */}
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div
            style={{
              fontSize: 96,
              lineHeight: 1.0,
              fontWeight: 300,
              letterSpacing: '-0.03em',
              maxWidth: 1000,
            }}
          >
            Reformar con{' '}
            <span style={{ color: '#d4a017', fontStyle: 'italic' }}>
              criterio
            </span>
            ,
            <br />
            no con prisa.
          </div>
          <div
            style={{
              fontSize: 30,
              color: '#a3b3ad',
              marginTop: 28,
              maxWidth: 900,
              lineHeight: 1.4,
            }}
          >
            Antes de empezar tu reforma, te decimos si es viable, cuánto cuesta
            y qué riesgos puede tener.
          </div>
        </div>

        {/* Bottom: domain + chips */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            color: '#737373',
            fontSize: 22,
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
          }}
        >
          <span>cotamadrid.es</span>
          <div style={{ display: 'flex', gap: 16 }}>
            <span
              style={{
                border: '1px solid #d4a01755',
                color: '#d4a017',
                padding: '8px 16px',
                borderRadius: 999,
                fontSize: 18,
              }}
            >
              +10 años · Madrid
            </span>
            <span
              style={{
                border: '1px solid #d4a01755',
                color: '#d4a017',
                padding: '8px 16px',
                borderRadius: 999,
                fontSize: 18,
              }}
            >
              Garantía LOE 10 años
            </span>
          </div>
        </div>
      </div>
    ),
    { ...size },
  );
}
