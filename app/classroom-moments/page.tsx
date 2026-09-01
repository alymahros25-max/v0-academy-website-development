import type { Metadata } from 'next'
import Link from 'next/link'
import { VideoGrid } from '@/components/classroom-moments/VideoGrid'
import { getPublishedClassroomVideos } from '@/lib/classroom-videos'

// Revalidate every 60 s as a safety net.
// The admin CMS route also calls revalidateTag('classroom-videos') on every
// save/update/delete so changes appear immediately without waiting.
export const revalidate = 60

export const metadata: Metadata = {
  title: 'فيديوهات من حصصنا - أكاديمية الحافظ المتميز',
  description: 'شاهد فيديوهات الحصص واللقطات الترويجية للأكاديمية. حصص تفاعلية في التجويد واللغة العربية والقرآن الكريم.',
  keywords: 'فيديوهات حصص، تجويد، قرآن، حصص أون لاين، أكاديمية الحافظ',
  alternates: { canonical: 'https://quran-elhafez.com/classroom-moments' },
  openGraph: {
    title: 'فيديوهات من حصصنا - أكاديمية الحافظ المتميز',
    description: 'شاهد فيديوهات الحصص واللقطات الترويجية للأكاديمية',
    url: 'https://quran-elhafez.com/classroom-moments',
    type: 'website',
    locale: 'ar_SA',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'فيديوهات من حصصنا - أكاديمية الحافظ المتميز',
    description: 'شاهد فيديوهات الحصص واللقطات الترويجية',
  },
}

async function getClassroomVideos() {
  return getPublishedClassroomVideos()
}

export default async function ClassroomMomentsPage() {
  const videos = await getClassroomVideos()

  return (
    <main className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="bg-navy-primary text-white py-12 md:py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
              فيديوهات من حصصنا
            </h1>
            <p className="text-lg text-gray-100 mb-6">
              شاهد فيديوهات حصصنا التفاعلية وتعرف على طريقة تدريسنا الحديثة في تجويد القرآن الكريم واللغة العربية
            </p>
            <div className="flex flex-wrap gap-3">
              <div className="bg-white/20 backdrop-blur px-4 py-2 rounded-full text-sm">
                ✨ {videos.length} حصة متاحة
              </div>
              <div className="bg-white/20 backdrop-blur px-4 py-2 rounded-full text-sm">
                🎬 محتوى حصري
              </div>
              <div className="bg-white/20 backdrop-blur px-4 py-2 rounded-full text-sm">
                📱 متوافق مع جميع الأجهزة
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Videos Grid Section */}
      <section className="py-12 md:py-20">
        <div className="container mx-auto px-4">
          {videos.length > 0 ? (
            <VideoGrid videos={videos} language="ar" showCategories={true} />
          ) : (
            <div className="text-center py-16">
              <div className="text-6xl mb-4">🎬</div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">لم يتم رفع أي حصص بعد</h2>
              <p className="text-gray-600 mb-6">
                سيتم إضافة حصص جديدة قريباً. تابعنا للحصول على أحدث المحتوى
              </p>
              <Link
                href="/"
                className="inline-block px-6 py-3 bg-navy-primary text-white font-medium rounded-lg hover:bg-navy-light transition-colors"
              >
                العودة للصفحة الرئيسية
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Info Section */}
      <section className="bg-gray-100 py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-4xl mb-3">📚</div>
              <h3 className="text-lg font-bold text-gray-800 mb-2">محتوى متنوع</h3>
              <p className="text-gray-600">
                حصص في التجويد، القرآن الكريم، واللغة العربية من معلمينا المتخصصين
              </p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-3">🎯</div>
              <h3 className="text-lg font-bold text-gray-800 mb-2">جودة عالية</h3>
              <p className="text-gray-600">
                جميع الفيديوهات بجودة عالية وواضحة لتجربة مشاهدة ممتعة
              </p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-3">♻️</div>
              <h3 className="text-lg font-bold text-gray-800 mb-2">متوفر دائماً</h3>
              <p className="text-gray-600">
                شاهد الحصص في أي وقت وأي مكان مباشرة من موقعنا دون الحاجة للخروج
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="bg-navy-primary text-white py-12 md:py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            جاهز للبدء؟
          </h2>
          <p className="text-lg text-gray-100 mb-8 max-w-xl mx-auto">
            سجل الآن في أكاديميتنا واحصل على وصول كامل لجميع الحصص والمحتوى الحصري
          </p>
          <a
            href="/account"
            className="inline-block px-8 py-3 bg-white text-[#1a4d2e] font-bold rounded-lg hover:bg-gray-100 transition-colors"
          >
            سجل الآن مجاناً
          </a>
        </div>
      </section>
    </main>
  )
}
