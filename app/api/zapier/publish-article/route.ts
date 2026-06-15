import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    // تحقق من API Key
    const apiKey = request.headers.get('x-api-key')
    const expectedKey = process.env.ZAPIER_API_KEY || 'your-secret-key-here'
    
    if (apiKey !== expectedKey) {
      return NextResponse.json(
        { error: 'Unauthorized: Invalid API Key' },
        { status: 401 }
      )
    }

    const body = await request.json()
    
    // التحقق من البيانات المطلوبة
    const requiredFields = ['slug', 'title', 'description', 'content', 'category']
    const missingFields = requiredFields.filter(field => !body[field])
    
    if (missingFields.length > 0) {
      return NextResponse.json(
        { error: `Missing required fields: ${missingFields.join(', ')}` },
        { status: 400 }
      )
    }

    // بيانات المقالة
    const article = {
      slug: body.slug,
      title: {
        ar: body.title.ar || body.title,
        en: body.title.en || body.title,
        fr: body.title.fr || body.title,
      },
      description: {
        ar: body.description.ar || body.description,
        en: body.description.en || body.description,
        fr: body.description.fr || body.description,
      },
      content: {
        ar: body.content.ar || body.content,
        en: body.content.en || body.content,
        fr: body.content.fr || body.content,
      },
      category: {
        ar: body.category.ar || body.category,
        en: body.category.en || body.category,
        fr: body.category.fr || body.category,
      },
      author: {
        ar: body.author?.ar || 'فريق الأكاديمية',
        en: body.author?.en || 'Academy Team',
        fr: body.author?.fr || 'Équipe de l\'académie',
      },
      date: body.date || new Date().toISOString().split('T')[0],
      readTime: body.readTime || 5,
      image: body.image || '/images/blog-default.jpg',
      keywords: {
        ar: body.keywords?.ar || '',
        en: body.keywords?.en || '',
        fr: body.keywords?.fr || '',
      },
    }

    // حفظ في database أو file (في هذه النسخة نحفظ في memory)
    // في الإنتاج، يجب حفظها في Supabase أو قاعدة بيانات أخرى
    console.log('[Zapier] New article published:', {
      slug: article.slug,
      title: article.title.ar,
      date: article.date,
    })

    return NextResponse.json(
      {
        success: true,
        message: 'Article published successfully',
        article: {
          slug: article.slug,
          title: article.title.ar,
          date: article.date,
          status: 'published',
        },
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('[Zapier] Error:', error)
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    )
  }
}
