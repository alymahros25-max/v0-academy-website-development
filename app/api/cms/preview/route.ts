import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

const supabase = supabaseUrl && supabaseServiceKey 
  ? createClient(supabaseUrl, supabaseServiceKey)
  : null

interface PreviewRequest {
  previewType: 'theme' | 'page' | 'typography' | 'animations'
  themeOverrides?: Record<string, string>
  pageId?: number
  deviceType?: 'mobile' | 'tablet' | 'desktop'
}

/**
 * Live Preview API
 * Generates preview HTML with temporary theme/layout overrides
 * Used for split-screen editing and real-time preview
 */
export async function POST(request: NextRequest) {
  try {
    if (!supabase) {
      return NextResponse.json({ error: 'Database not configured' }, { status: 503 })
    }

    const body: PreviewRequest = await request.json()
    const { previewType, themeOverrides = {}, pageId, deviceType = 'desktop' } = body

    // Generate device viewport sizes for responsive preview
    const deviceSizes: Record<string, { width: number; height: number }> = {
      mobile: { width: 375, height: 667 },
      tablet: { width: 768, height: 1024 },
      desktop: { width: 1920, height: 1080 },
    }

    const viewport = deviceSizes[deviceType] || deviceSizes.desktop

    // Build CSS variables from theme overrides
    const cssVariables = Object.entries(themeOverrides)
      .map(([key, value]) => `--${key}: ${value};`)
      .join('\n')

    let previewHtml = ''

    if (previewType === 'theme') {
      // Generate theme preview
      previewHtml = generateThemePreview(themeOverrides, cssVariables)
    } else if (previewType === 'page' && pageId) {
      // Generate page preview
      const { data: pageData } = await supabase
        .from('site_pages')
        .select('*')
        .eq('id', pageId)
        .single()

      if (pageData) {
        previewHtml = generatePagePreview(pageData, themeOverrides, cssVariables)
      }
    } else if (previewType === 'typography') {
      // Generate typography preview
      previewHtml = generateTypographyPreview(themeOverrides, cssVariables)
    } else if (previewType === 'animations') {
      // Generate animations preview
      previewHtml = generateAnimationsPreview(themeOverrides, cssVariables)
    }

    // Add device frame wrapper
    const framedHtml = wrapInDeviceFrame(previewHtml, viewport, deviceType)

    return NextResponse.json({
      html: framedHtml,
      viewport,
      deviceType,
      timestamp: new Date().toISOString(),
    }, { status: 200 })
  } catch (error) {
    console.error('[v0] Live preview error:', error)
    return NextResponse.json({ error: 'Failed to generate preview' }, { status: 500 })
  }
}

/**
 * Generate theme preview HTML with color swatches and styles
 */
function generateThemePreview(overrides: Record<string, string>, cssVars: string): string {
  return `
    <!DOCTYPE html>
    <html lang="ar" dir="rtl">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Theme Preview</title>
      <style>
        :root {
          ${cssVars}
          --primary-color: ${overrides.primaryColor || '#1a4d2e'};
          --secondary-color: ${overrides.secondaryColor || '#d4af37'};
          --background-color: ${overrides.backgroundColor || '#ffffff'};
          --text-color: ${overrides.textColor || '#000000'};
        }
        
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        
        body {
          font-family: 'Noto Sans Arabic', sans-serif;
          background-color: var(--background-color);
          color: var(--text-color);
          padding: 40px;
          line-height: 1.6;
        }
        
        .preview-container {
          max-width: 800px;
          margin: 0 auto;
        }
        
        .color-palette {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 20px;
          margin-bottom: 40px;
        }
        
        .color-swatch {
          padding: 20px;
          border-radius: 8px;
          text-align: center;
          color: white;
          font-weight: bold;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }
        
        .color-primary {
          background-color: var(--primary-color);
        }
        
        .color-secondary {
          background-color: var(--secondary-color);
          color: var(--text-color);
        }
        
        h1 {
          color: var(--primary-color);
          margin-bottom: 20px;
          font-size: 28px;
        }
        
        h2 {
          color: var(--secondary-color);
          margin: 30px 0 15px;
          font-size: 22px;
        }
        
        p {
          margin-bottom: 15px;
          color: var(--text-color);
        }
        
        .button-primary {
          background-color: var(--primary-color);
          color: white;
          padding: 12px 24px;
          border-radius: 6px;
          border: none;
          font-size: 16px;
          cursor: pointer;
          margin-right: 10px;
        }
        
        .button-secondary {
          background-color: var(--secondary-color);
          color: var(--text-color);
          padding: 12px 24px;
          border-radius: 6px;
          border: none;
          font-size: 16px;
          cursor: pointer;
        }
        
        .demo-section {
          background-color: #f5f5f5;
          padding: 20px;
          border-radius: 8px;
          margin-bottom: 20px;
        }
      </style>
    </head>
    <body>
      <div class="preview-container">
        <h1>معاينة المظهر</h1>
        <p>هذه معاينة مباشرة للألوان والتصميم المطبقة على موقعك.</p>
        
        <div class="color-palette">
          <div class="color-swatch color-primary">
            <div>اللون الأساسي</div>
            <div>${overrides.primaryColor || '#1a4d2e'}</div>
          </div>
          <div class="color-swatch color-secondary">
            <div>اللون الثانوي</div>
            <div>${overrides.secondaryColor || '#d4af37'}</div>
          </div>
        </div>
        
        <div class="demo-section">
          <h2>أمثلة على الأزرار</h2>
          <button class="button-primary">زر أساسي</button>
          <button class="button-secondary">زر ثانوي</button>
        </div>
        
        <div class="demo-section">
          <h2>نص العينة</h2>
          <p>هذا نص عينة لإظهار كيفية ظهور محتوى الموقع مع الألوان والأنماط المحددة حديثاً.</p>
        </div>
      </div>
    </body>
    </html>
  `
}

/**
 * Generate page preview HTML
 */
function generatePagePreview(page: any, overrides: Record<string, string>, cssVars: string): string {
  const title = page.title_ar || 'معاينة الصفحة'
  const content = page.content_json?.text || 'محتوى الصفحة'

  return `
    <!DOCTYPE html>
    <html lang="ar" dir="rtl">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${title}</title>
      <style>
        :root {
          ${cssVars}
        }
        
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        
        body {
          font-family: 'Noto Sans Arabic', sans-serif;
          background-color: ${overrides.backgroundColor || '#ffffff'};
          color: ${overrides.textColor || '#000000'};
          padding: 20px;
        }
        
        .page-container {
          max-width: 1000px;
          margin: 0 auto;
        }
        
        h1 {
          color: ${overrides.primaryColor || '#1a4d2e'};
          margin-bottom: 20px;
        }
        
        .content {
          line-height: 1.8;
          margin-bottom: 30px;
        }
      </style>
    </head>
    <body>
      <div class="page-container">
        <h1>${title}</h1>
        <div class="content">${content}</div>
        <p>معاينة حية للصفحة - يتم تحديثها فوراً عند تعديل الإعدادات</p>
      </div>
    </body>
    </html>
  `
}

/**
 * Generate typography preview
 */
function generateTypographyPreview(overrides: Record<string, string>, cssVars: string): string {
  return `
    <!DOCTYPE html>
    <html lang="ar" dir="rtl">
    <head>
      <meta charset="UTF-8">
      <style>
        :root {
          ${cssVars}
          --header-font: ${overrides.headerFont || 'Noto Sans Arabic'};
          --body-font: ${overrides.bodyFont || 'Inter'};
          --h1-size: ${overrides.h1Size || '32px'};
          --h2-size: ${overrides.h2Size || '24px'};
          --body-size: ${overrides.bodySize || '16px'};
        }
        
        body {
          font-family: var(--body-font), sans-serif;
          padding: 40px;
          background: ${overrides.backgroundColor || '#fff'};
        }
        
        h1 { font-family: var(--header-font); font-size: var(--h1-size); margin-bottom: 20px; }
        h2 { font-family: var(--header-font); font-size: var(--h2-size); margin-top: 30px; margin-bottom: 15px; }
        p { font-size: var(--body-size); margin-bottom: 15px; line-height: 1.6; }
      </style>
    </head>
    <body>
      <h1>معاينة الخطوط والأحجام</h1>
      <p>هذا نص عادي يظهر الخط والحجم الحالي للنصوص العادية.</p>
      <h2>عنوان ثانوي</h2>
      <p>جرب تغيير أنواع الخطوط وأحجامها من لوحة التحكم واستمتع بالمعاينة الفورية.</p>
    </body>
    </html>
  `
}

/**
 * Generate animations preview
 */
function generateAnimationsPreview(overrides: Record<string, string>, cssVars: string): string {
  const fadeIn = overrides.enableFadeIn === 'true'
  const slideIn = overrides.enableSlideIn === 'true'
  const zoomIn = overrides.enableZoomIn === 'true'

  return `
    <!DOCTYPE html>
    <html lang="ar" dir="rtl">
    <head>
      <meta charset="UTF-8">
      <style>
        body {
          font-family: 'Noto Sans Arabic', sans-serif;
          padding: 40px;
          background: #f5f5f5;
        }
        
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes slideInRight {
          from { transform: translateX(-100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        
        @keyframes zoomIn {
          from { transform: scale(0.95); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        
        .demo-box {
          background: white;
          padding: 30px;
          margin: 20px 0;
          border-radius: 8px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        
        .demo-box.fade-in {
          ${fadeIn ? 'animation: fadeIn 1s ease-in;' : ''}
        }
        
        .demo-box.slide-in {
          ${slideIn ? 'animation: slideInRight 1s ease-out;' : ''}
        }
        
        .demo-box.zoom-in {
          ${zoomIn ? 'animation: zoomIn 1s ease-out;' : ''}
        }
      </style>
    </head>
    <body>
      <h1>معاينة الحركات والتأثيرات</h1>
      <div class="demo-box fade-in">
        <h2>Fade In Effect</h2>
        <p>هذا الصندوق سيظهر بتأثير التلاشي ${fadeIn ? '✓ مفعّل' : '✗ معطّل'}</p>
      </div>
      <div class="demo-box slide-in">
        <h2>Slide In Effect</h2>
        <p>هذا الصندوق سيظهر بتأثير الانزلاق ${slideIn ? '✓ مفعّل' : '✗ معطّل'}</p>
      </div>
      <div class="demo-box zoom-in">
        <h2>Zoom In Effect</h2>
        <p>هذا الصندوق سيظهر بتأثير التكبير ${zoomIn ? '✓ مفعّل' : '✗ معطّل'}</p>
      </div>
    </body>
    </html>
  `
}

/**
 * Wrap preview HTML in a device frame
 */
function wrapInDeviceFrame(html: string, viewport: { width: number; height: number }, deviceType: string): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body {
          margin: 0;
          padding: 20px;
          background: #333;
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 100vh;
        }
        
        .device-frame {
          position: relative;
          width: ${viewport.width}px;
          height: ${viewport.height}px;
          border: 12px solid #000;
          border-radius: 20px;
          box-shadow: 0 10px 40px rgba(0,0,0,0.5);
          overflow: hidden;
        }
        
        .device-frame::before {
          content: "${deviceType.toUpperCase()}";
          position: absolute;
          top: -30px;
          left: 50%;
          transform: translateX(-50%);
          color: #fff;
          font-size: 12px;
          font-weight: bold;
        }
        
        iframe {
          width: 100%;
          height: 100%;
          border: none;
        }
      </style>
    </head>
    <body>
      <div class="device-frame">
        <iframe srcdoc="${escapeHtml(html)}"></iframe>
      </div>
    </body>
    </html>
  `
}

/**
 * Escape HTML entities for iframe srcdoc
 */
function escapeHtml(unsafe: string): string {
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}
