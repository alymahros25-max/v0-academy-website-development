import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs/promises'
import path from 'path'

const ARTICLES_FILE = path.join(process.cwd(), 'data', 'zapier-articles.json')

export async function GET(request: NextRequest) {
  try {
    const articles = await readArticles()
    
    return NextResponse.json({
      success: true,
      articles,
      count: Object.keys(articles).length,
    })
  } catch (error) {
    console.error('[v0] Error reading articles:', error)
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    )
  }
}

async function readArticles() {
  try {
    const data = await fs.readFile(ARTICLES_FILE, 'utf-8')
    return JSON.parse(data)
  } catch {
    return {}
  }
}
