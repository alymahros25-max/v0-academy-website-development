import { NextRequest, NextResponse } from 'next/server'
import { JWT } from 'google-auth-library'

const INDEXING_API = 'https://indexing.googleapis.com/v3/urlNotifications:publish'
const SCOPE = ['https://www.googleapis.com/auth/indexing']

// Google Service Account credentials - Hardcoded for Vercel deployment
const SERVICE_ACCOUNT = {
  type: 'service_account',
  project_id: 'quran-elhafez',
  private_key_id: '0a9f7f516a4a03fa1410e5b874b50110eedaea82',
  private_key: `-----BEGIN PRIVATE KEY-----
MIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQDjLPfiV9Z2ouv5
VEatoZbTRqfwTgxAwGym10L8Jk8JJ+5vydub+aOkR0AChPeuC6BQfa6y5OchFUAQ
vCwrEhaHdMr5IT/HQTztNmJMqrF+z4kJWOzo8Puma7NUTC6zPLuamPsd/7y6oSXA
rrBDeqCoYejPr8C3EQNYd0dFxm3YiUpJkQPVq1PXbz1cx6D5z0z5ntfhkFF/82YH
rw3R8H78EJqJ2o+vjxb1dHaPzDjM2eKztNee/5uL1CPMIAOOkVtVGjI7WmPehdNi
imAuud14VceEvsidg+61jj3vz42y3z7/hFVie+9hxShO0JSg9O6pEmOhhka1MN7w
C0yhMrQ7AgMBAAECggEARsJR74lGfqtebsmmPhzPur0OQBY/UMfez9TKw3k3MvXi
GaW5JosKQngC4wYBk4+BfrC3Anez2iUhUFUcOMoohEaHljOaBvk1/fjrg0/De2kv
GN8+44t0BrETKVWVUjS/hnbR+NUYNtVMyghfVJVUhz3/4viuQRcmgJ6eb4hP3JrI
cHi5wnLojerjFJdgT/O6ilygNxnTXNDi3ZPP1Ktf25PRUEnGUJP5JdNHdLnI2E7s
cb5TGYXMWpDcR7Ak0CrsYb3WXvsXyi8oI2YbBrqtkCcJNEvWQmD9A6HXwONHOp8N
38k+X2ltyRrjFph0ujDLmIQyasyiKqZ4OFaZl1FQ8QKBgQDz0UxYE1Fy0FtWH5vH
A2WkwjaijaXew+TDuHuTpkXO4ETt9+dhJBa4f7Z+9g4stknJxw3ihh/a3z7G0r21
WPzPoUcbm4fR58S7CNraEgZTr9pmRINjs1VgVdiN0/SKNJWLcwB+gL8j6HrP1ZxU
rWIr1y95AHX9KuOJL0c+dBdCmQKBgQDuhs0dSnm+59uLPphh90PW999D/d8OHCF/
7blFt8ww4WVnRF654jzqWFctaf7jxH9O2uJqmJFsRLp/xMTiXXbKn/6USaW2uw9F
l2Wgdn+wn/RSMo/QPPmArw8AEuNm8eZrnZT0tWuDkcMWk6vf53bynBzx1x1koBPv
sk7sTc2F8wKBgF9w0IexmDJvaTF/UgVHSSSDecuL0yAuYoBS2NzlO3JNy+2zGvml
nNc/9vof61CJUr0PlFnV0uZkeThvCh/Q47WLFkCyUypRpWrpfnHamGtt7PoXW69N
ZeA9+nUaQSFQkDF0JP9f+nJd8KUmovlqnYE3zLd6/LTLcyIiRasm2mwRAoGBAN04
bJfT8OIby8RzA4UofOSs84btt6gwculhI0oD0v8qrI+AG5KuvuxhjkjyW5IHNkN+
Qiu24HjXrVi+uBNxt7DpfoUtYOH+z4UtivWtsXOwhjqN5k+tnYG52mGpIvrhM2Fv
vyzN7a8SyyrvPqLk267bFwU9C2e+B39xkj0bU5f9AoGBAOjlnD8yxA234ruRWxXb
VNmiy7hD1q6Uaiqpxy4bNOhgV2maxTojjTyzxmeyjhQy+J7nTvF1i6h8pdtJ9r/t
4RT4M65BbP7K7yQkKr2RFn5NhWx1O5yaNxcV32ZgehldrCUni2GOoAPjp/wexLRr
gdX7lobJ9rV4B5G6Q4hECNHP
-----END PRIVATE KEY-----`,
  client_email: 'quran-elhafez@quran-elhafez.iam.gserviceaccount.com',
  client_id: '114179116031642310748',
  auth_uri: 'https://accounts.google.com/o/oauth2/auth',
  token_uri: 'https://oauth2.googleapis.com/token',
  auth_provider_x509_cert_url: 'https://www.googleapis.com/oauth2/v1/certs',
  client_x509_cert_url:
    'https://www.googleapis.com/robot/v1/metadata/x509/quran-elhafez%40quran-elhafez.iam.gserviceaccount.com',
}

async function getAccessToken() {
  const auth = new JWT({
    email: SERVICE_ACCOUNT.client_email,
    key: SERVICE_ACCOUNT.private_key,
    scopes: SCOPE,
  })

  const token = await auth.getAccessToken()
  return token.token
}

export async function POST(request: NextRequest) {
  try {

    const { url, type = 'URL_UPDATED' } = await request.json()

    if (!url) {
      return NextResponse.json(
        { error: 'URL is required' },
        { status: 400 }
      )
    }

    // Validate URL format
    try {
      new URL(url)
    } catch {
      return NextResponse.json(
        { error: 'Invalid URL format' },
        { status: 400 }
      )
    }

    const accessToken = await getAccessToken()

    const response = await fetch(INDEXING_API, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        url,
        type,
      }),
    })

    const data = await response.json()

    if (!response.ok) {
      return NextResponse.json(
        { error: 'Failed to request indexing', details: data },
        { status: response.status }
      )
    }

    return NextResponse.json({
      success: true,
      url,
      status: 'Indexing request submitted',
      response: data,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error('[Indexing API] Error:', error)
    return NextResponse.json(
      { error: 'Failed to process indexing request', details: String(error) },
      { status: 500 }
    )
  }
}

// GET for batch status check
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const urls = searchParams.getAll('url')

  if (urls.length === 0) {
    return NextResponse.json(
      { error: 'At least one URL is required' },
      { status: 400 }
    )
  }

  try {
    const accessToken = await getAccessToken()
    const results = []

    for (const url of urls) {
      const response = await fetch(INDEXING_API, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          url,
          type: 'URL_UPDATED',
        }),
      })

      const data = await response.json()
      results.push({
        url,
        success: response.ok,
        status: data,
      })
    }

    return NextResponse.json({
      success: true,
      submitted: results.length,
      results,
    })
  } catch (error) {
    console.error('[Indexing API] Batch error:', error)
    return NextResponse.json(
      { error: 'Failed to process batch request' },
      { status: 500 }
    )
  }
}
