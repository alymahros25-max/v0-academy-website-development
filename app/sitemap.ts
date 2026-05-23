import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://quran-elhafez.com'
    
      // الصفحات الثابتة وترتيب أولوياتها حسب طلبك
        const staticPages = [
            { route: '', priority: 1.0, changeFreq: 'daily' as const },           // الرئيسية
                
                    // التوب 3 (الأهم)
                        { route: '/quran', priority: 0.9, changeFreq: 'weekly' as const },        // القرآن
                            { route: '/arabic', priority: 0.9, changeFreq: 'weekly' as const },       // العربي
                                { route: '/games', priority: 0.9, changeFreq: 'weekly' as const },        // الألعاب
                                    
                                        // المعلمين والمدونة
                                            { route: '/teachers', priority: 0.8, changeFreq: 'weekly' as const },     // المعلمين
                                                { route: '/blog', priority: 0.8, changeFreq: 'daily' as const },         // المدونة
                                                    
                                                        // باقي الصفحات الخدمية والتعريفية
                                                            { route: '/reviews', priority: 0.7, changeFreq: 'weekly' as const },      // التقييمات
                                                                { route: '/library', priority: 0.7, changeFreq: 'weekly' as const },      // المكتبة
                                                                    { route: '/about', priority: 0.6, changeFreq: 'monthly' as const },       // من نحن
                                                                        { route: '/faq', priority: 0.6, changeFreq: 'monthly' as const },         // الأسئلة الشائعة
                                                                            { route: '/contact', priority: 0.6, changeFreq: 'monthly' as const },     // اتصل بنا
                                                                                { route: '/account', priority: 0.5, changeFreq: 'monthly' as const },     // الحساب
                                                                                    
                                                                                        // الصفحات القانونية
                                                                                            { route: '/privacy', priority: 0.3, changeFreq: 'monthly' as const },     // الخصوصية
                                                                                                { route: '/terms', priority: 0.3, changeFreq: 'monthly' as const },       // الشروط
                                                                                                  ]

                                                                                                    // الـ Slugs الحقيقية للمقالات المأخوذة من تقرير المدونة الفعلي
                                                                                                      const blogSlugs = [
                                                                                                          'quran-memorization-techniques',
                                                                                                              'arabic-foundation-importance',
                                                                                                                  'online-learning-benefits',
                                                                                                                    ]

                                                                                                                      const sitemapEntries: MetadataRoute.Sitemap = [
                                                                                                                          // توليد روابط الصفحات الثابتة
                                                                                                                              ...staticPages.map((page) => ({
                                                                                                                                    url: `${baseUrl}${page.route}`,
                                                                                                                                          lastModified: new Date(),
                                                                                                                                                changeFrequency: page.changeFreq,
                                                                                                                                                      priority: page.priority,
                                                                                                                                                          })),
                                                                                                                                                              
                                                                                                                                                                  // توليد روابط المقالات
                                                                                                                                                                      ...blogSlugs.map((slug) => ({
                                                                                                                                                                            url: `${baseUrl}/blog/${slug}`,
                                                                                                                                                                                  lastModified: new Date(),
                                                                                                                                                                                        changeFrequency: 'weekly' as const,
                                                                                                                                                                                              priority: 0.7,
                                                                                                                                                                                                  }))
                                                                                                                                                                                                    ]

                                                                                                                                                                                                      return sitemapEntries
                                                                                                                                                                                                      }
                                                                                                                                                                                                vscode-remote://sb-1e5l5l3c33oq.vercel.run/vercel/share/v0-project/app/sitemap.ts      