import { ImageResponse } from 'next/og';

export const size = { width: 64, height: 64 };
export const contentType = 'image/png';

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#0e1f17',
          color: '#d4a017',
          fontSize: 56,
          fontWeight: 700,
          fontFamily: 'Georgia, serif',
          letterSpacing: '-0.04em',
          lineHeight: 1,
        }}
      >
        C
      </div>
    ),
    { ...size }
  );
}
