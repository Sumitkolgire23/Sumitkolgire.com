import { ImageResponse } from 'next/og'
 
export const runtime = 'edge'
 
// Image metadata
export const alt = 'Sumit Kolgire - Personal Site & Research Lab'
export const size = {
  width: 1200,
  height: 630,
}
 
export const contentType = 'image/png'
 
export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: '#f7f3ec',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '80px',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            border: '2px solid rgba(139,115,85,0.25)',
            width: '100%',
            height: '100%',
            padding: '40px',
          }}
        >
          <div
            style={{
              fontSize: 84,
              fontWeight: 700,
              color: '#1c1a15',
              marginBottom: 24,
              fontFamily: 'serif',
            }}
          >
            Sumit Kolgire
          </div>
          <div
            style={{
              fontSize: 42,
              color: '#c41e3a', // seal
              marginBottom: 24,
            }}
          >
            Personal Site & Research Lab
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  )
}
