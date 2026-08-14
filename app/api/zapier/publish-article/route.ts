import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs/promises'
import path from 'path'

const ARTICLES_FILE = path.join(process.cwd(), 'data', 'zapier-articles.json')

// قراءة المقالات المحفوظة
async function readArticles() {
  try {
    const data = await fs.readFile(ARTICLES_FILE, 'utf-8')
    return JSON.parse(data)
  } catch {
    return {}
  }
}

// حفظ المقالات
async function saveArticles(articles: any) {
  try {
    await fs.mkdir(path.dirname(ARTICLES_FILE), { recursive: true })
    await fs.writeFile(ARTICLES_FILE, JSON.stringify(articles, null, 2))
  } catch (error) {
    console.error('[v0] Error saving articles:', error)
  }
}

export async function POST(request: NextRequest) {
  try {
    console.log('[v0] Zapier POST request received')
    
    // التحقق من API Key
    const apiKey = request.headers.get('x-api-key') || request.headers.get('authorization')?.replace(/^Bearer\s+/i, '')
    const expectedKey = process.env.ZAPIER_API_KEY
    
    if (!expectedKey || apiKey !== expectedKey) {
      console.warn('[v0] Invalid Zapier API key')
      return NextResponse.json(
        { error: 'Unauthorized: Invalid API Key' },
        { status: 401 }
      )
    }

    const body = await request.json()
    console.log('[v0] Request body received - Slug:', body.slug, 'Content length:', JSON.stringify(body).length)
    
    // التحقق من البيانات المطلوبة
    const requiredFields = ['slug', 'title']
    const missingFields = requiredFields.filter(field => !body[field])
    
    if (missingFields.length > 0) {
      return NextResponse.json(
        { error: `Missing required fields: ${missingFields.join(', ')}` },
        { status: 400 }
      )
    }

    // معالجة البيانات - دعم صيغ متعددة
    const processField = (field: any, defaultObj = {}) => {
      if (typeof field === 'string') {
        return { ar: field, en: field, fr: field }
      }
      if (typeof field === 'object') {
        return {
          ar: field.ar || field.ar_content || field.arabic || '',
          en: field.en || field.en_content || field.english || '',
          fr: field.fr || field.fr_content || field.french || '',
        }
      }
      return defaultObj
    }

    // بيانات المقالة الكاملة
    const article: any = {
      slug: body.slug.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
      title: processField(body.title),
      description: processField(body.description),
      content: processField(body.content),
      category: processField(body.category, { ar: 'عام', en: 'General', fr: 'Général' }),
      author: processField(body.author, { ar: 'فريق الأكاديمية', en: 'Academy Team', fr: 'Équipe' }),
      keywords: processField(body.keywords, { ar: '', en: '', fr: '' }),
      image: body.image || '/images/blog-default.jpg',
      date: body.date || new Date().toISOString().split('T')[0],
      readTime: body.readTime || calculateReadTime(body.content?.ar || body.content || ''),
      status: 'published',
      source: 'zapier',
      createdAt: new Date().toISOString(),
    }

    // قراءة المقالات الموجودة وإضافة الجديدة
    const articles = await readArticles()
    articles[article.slug] = article
    
    // حفظ في الملف
    await saveArticles(articles)

    console.log('[v0] Article saved successfully:', {
      slug: article.slug,
      contentLengths: {
        ar: article.content.ar?.length || 0,
        en: article.content.en?.length || 0,
        fr: article.content.fr?.length || 0,
      }
    })

    return NextResponse.json(
      {
        success: true,
        message: 'Article published successfully from Zapier',
        article: {
          slug: article.slug,
          title: article.title.ar,
          date: article.date,
          status: 'published',
          contentSummary: {
            ar: `${article.content.ar?.length || 0} characters`,
            en: `${article.content.en?.length || 0} characters`,
            fr: `${article.content.fr?.length || 0} characters`,
          },
          viewUrl: `https://quran-elhafez.com/blog/${article.slug}`
        },
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('[v0] Zapier Error:', error)
    return NextResponse.json(
      { error: 'Internal Server Error', details: String(error) },
      { status: 500 }
    )
  }
}

function calculateReadTime(content: string): number {
  // حساب وقت القراءة: 200 كلمة في الدقيقة
  const words = content.split(/\s+/).length
  return Math.max(1, Math.ceil(words / 200))
}
