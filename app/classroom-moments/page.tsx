import { Metadata } from 'next'
import { VideoGrid, VideoData } from '@/components/classroom-moments/VideoGrid'
import { fetchClassroomVideos } from '@/lib/classroom-videos-client'
import { extractYouTubeId } from '@/lib/youtube-utils'

// Revalidate every 60 seconds so newly added videos appear without a redeploy
export const revalidate = 60

export const metadata: Metadata = {
  title: 'لقطات من الحصص - أكاديمية الحافظ المتميز',
  description: 'شاهد فيديوهات الحصص واللقطات الترويجية للأكاديمية. حصص تفاعلية في التجويد واللغة العربية والقرآن الكريم.',
  keywords: 'فيديوهات حصص، تجويد، قرآن، حصص أون لاين، أكاديمية الحافظ',
  openGraph: {
    title: 'لقطات من الحصص - أكاديمية الحافظ المتميز',
    description: 'شاهد فيديوهات الحصص واللقطات الترويجية للأكاديمية',
    url: 'https://quran-elhafez.com/classroom-moments',
    type: 'website',
    locale: 'ar_SA',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'لقطات من الحصص - أكاديمية الحافظ المتميز',
    description: 'شاهد فيديوهات الحصص واللقطات الترويجية',
  },
}

async function getClassroomVideos(): Promise<VideoData[]> {
  try {
    const videos = await fetchClassroomVideos()

    if (!Array.isArray(videos)) {
      return []
    }

    return videos
      .map((video: any): VideoData => {
        // Always re-extract the ID from the stored URL to guard against
        // rows that were inserted before the regex was hardened.
        const embedId: string =
          extractYouTubeId(video?.youtube_url ?? '') ??
          video?.youtube_embed_id ??
          ''

        return {
          // VideoData expects these exact field names (matches VideoGrid interface)
          id: video?.id ?? 0,
          title_ar: video?.title_ar ?? 'بدون عنوان',
          title_en: video?.title_en ?? video?.title_ar ?? 'No title',
          title_fr: video?.title_fr ?? video?.title_ar ?? 'Sans titre',
          description_ar: video?.description_ar ?? '',
          description_en: video?.description_en ?? '',
          description_fr: video?.description_fr ?? '',
          youtube_embed_id: embedId,
          thumbnail_url: video?.thumbnail_url ?? '',
          category: video?.category ?? '',
          teacher_name_ar: video?.teacher_name_ar ?? '',
          teacher_name_en: video?.teacher_name_en ?? '',
          teacher_name_fr: video?.teacher_name_fr ?? '',
          duration_seconds: video?.duration_seconds ?? undefined,
          is_featured: video?.is_featured ?? false,
        }
      })
      .filter((v) => v.youtube_embed_id.length === 11)
  } catch (error) {
    console.error('[v0] Error fetching classroom videos:', error)
    return []
  }
}

export default async function ClassroomMomentsPage() {
  const videos = await getClassroomVideos()

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-[#1a4d2e] to-[#2d7a4e] text-white py-12 md:py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
              لقطات من الحصص
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
              <a
                href="/"
                className="inline-block px-6 py-3 bg-[#1a4d2e] text-white font-medium rounded-lg hover:bg-[#0f3620] transition-colors"
              >
                العودة للصفحة الرئيسية
              </a>
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
      <section className="bg-gradient-to-r from-[#1a4d2e] to-[#2d7a4e] text-white py-12 md:py-16">
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
