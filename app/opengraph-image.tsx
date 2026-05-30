import { headers } from 'next/headers'
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
  let title = 'Sumit Kolgire'
  let subtitle = 'Personal Site & Research Lab'
  let excerpt = ''
  let tags: string[] = []

  try {
    const headersList = await headers()
    
    // Method 1: Check x-invoke-query (Next.js query params internal header)
    const xInvokeQuery = headersList.get('x-invoke-query')
    if (xInvokeQuery) {
      try {
        const query = JSON.parse(decodeURIComponent(xInvokeQuery))
        if (query.title) title = String(query.title)
        if (query.subtitle) subtitle = String(query.subtitle)
        if (query.category) {
          tags = [String(query.category)]
        } else if (query.tags) {
          tags = Array.isArray(query.tags)
            ? query.tags.map(String)
            : String(query.tags).split(',').map(t => t.trim())
        }
        if (query.excerpt) excerpt = String(query.excerpt)
        else if (query.description) excerpt = String(query.description)
      } catch (e) {
        console.error('Failed to parse x-invoke-query:', e)
      }
    }

    // Method 2: Check referer URL query parameters as a fallback
    const referer = headersList.get('referer')
    if (referer && (!xInvokeQuery || title === 'Sumit Kolgire')) {
      try {
        const url = new URL(referer)
        const paramTitle = url.searchParams.get('title')
        const paramCategory = url.searchParams.get('category') || url.searchParams.get('tags')
        const paramExcerpt = url.searchParams.get('excerpt') || url.searchParams.get('description')
        
        if (paramTitle) title = paramTitle
        if (paramCategory) {
          tags = paramCategory.split(',').map(t => t.trim())
        }
        if (paramExcerpt) excerpt = paramExcerpt
      } catch (e) {
        // Ignore URL parsing errors from invalid referer values
      }
    }
  } catch (e) {
    console.error('Error fetching headers:', e)
  }

  const isDefault = title === 'Sumit Kolgire' && !excerpt && tags.length === 0

  return new ImageResponse(
    (
      <div
        style={{
          background: '#f7f3ec',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          padding: '60px',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            border: '2px solid rgba(139,115,85,0.25)',
            width: '100%',
            height: '100%',
            padding: '50px',
            position: 'relative',
          }}
        >
          {isDefault ? (
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                height: '100%',
                margin: 'auto',
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
                  color: '#c41e3a', // seal-red
                  marginBottom: 24,
                }}
              >
                {subtitle}
              </div>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {/* Top segment: Tags */}
              {tags.length > 0 && (
                <div
                  style={{
                    display: 'flex',
                    gap: '12px',
                    marginBottom: '20px',
                    fontFamily: 'monospace',
                    fontSize: '18px',
                    letterSpacing: '0.15em',
                    color: '#c41e3a', // seal-red
                    textTransform: 'uppercase',
                    fontWeight: 600,
                  }}
                >
                  {tags.join(' · ')}
                </div>
              )}

              {/* Title */}
              <div
                style={{
                  fontSize: title.length > 60 ? '54px' : '64px',
                  fontWeight: 700,
                  color: '#1c1a15',
                  lineHeight: 1.25,
                  fontFamily: 'serif',
                  marginBottom: '24px',
                  wordBreak: 'break-word',
                }}
              >
                {title}
              </div>

              {/* Excerpt */}
              {excerpt && (
                <div
                  style={{
                    fontSize: '24px',
                    fontStyle: 'italic',
                    color: '#5c574f',
                    lineHeight: 1.6,
                    maxWidth: '900px',
                    fontFamily: 'serif',
                  }}
                >
                  {excerpt}
                </div>
              )}
            </div>
          )}

          {/* Bottom segment: Footer */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-end',
              width: '100%',
              borderTop: '1px solid rgba(139,115,85,0.15)',
              paddingTop: '20px',
            }}
          >
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <div
                style={{
                  fontFamily: 'serif',
                  fontSize: '22px',
                  fontWeight: 600,
                  color: '#1c1a15',
                }}
              >
                Sumit Kolgire
              </div>
              <div
                style={{
                  fontFamily: 'sans-serif',
                  fontSize: '16px',
                  color: '#c41e3a',
                  marginTop: '4px',
                }}
              >
                Personal Site & Research Lab
              </div>
            </div>

            {/* Seal stamp */}
            <div
              style={{
                background: '#c41e3a',
                color: '#f7f3ec',
                fontFamily: 'monospace',
                fontSize: '18px',
                fontWeight: 'bold',
                padding: '8px 12px',
                border: '2px solid #c41e3a',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                letterSpacing: '0.1em',
              }}
            >
              SUMIT
            </div>
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  )
}
