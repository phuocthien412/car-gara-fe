import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import LazyImage from '@/components/LazyImage'
import Skeleton from '@/components/Skeleton'
import { usePostDetail } from '@/hooks/useQueryData'
import Zoom from 'react-medium-image-zoom'
import 'react-medium-image-zoom/dist/styles.css'
import { useNavigate } from 'react-router-dom'
import PATH from '@/constants/path'

export default function TinTucDetail() {
  const { id } = useParams()
  const { data, isLoading } = usePostDetail(id)
  const navigate = useNavigate()

  return (
    <section className="container-pad py-20">
      {isLoading && (
        <div className="grid gap-4">
          <Skeleton className="h-8 w-1/2" />
          <Skeleton className="h-96" />
          <Skeleton className="h-32" />
        </div>
      )}

      {!isLoading && data && (
        <motion.article
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="max-w-5xl mx-auto"
        >

          {/* 🧭 Breadcrumb */}
          <div className="mb-6 text-sm text-neutral-600">
            <Link to="/" className="text-neutral-500 hover:text-amber-600 transition-colors">Trang chủ</Link>
            {' / '}
            <Link to="/tin-tuc" className="text-neutral-500 hover:text-amber-600 transition-colors">Tin tức</Link>
            {' / '}
            <span className="text-neutral-800 font-medium">{data.title}</span>
          </div>

           <button
            onClick={() => navigate(-1)}
            className="mb-4 inline-flex items-center gap-2 rounded-full border border-neutral-200 px-4 py-2 text-sm font-medium text-neutral-600 hover:text-amber-600 hover:border-amber-400 transition-all"
          >
            <span className="text-lg">←</span> Quay lại
          </button>

          {/* 🌅 Hero image */}
          {data.image && (
            <div className="relative mb-10 overflow-hidden rounded-2xl shadow-lg">
              <Zoom>
                <LazyImage
                  src={data.image}
                  alt={data.title}
                  className="h-[400px] w-full object-cover"
                />
              </Zoom>
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
              <div className="absolute bottom-6 left-6 text-white">
                <p className="text-sm text-white/80">Bài viết</p>
                <h1 className="text-3xl sm:text-4xl font-extrabold drop-shadow-md">{data.title}</h1>
              </div>
            </div>
          )}

          {/* 📝 Nội dung bài viết */}
          <div className="rounded-2xl bg-white p-8 shadow-sm border border-neutral-100">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
              <p className="text-sm text-neutral-500">
                Cập nhật: {data.created_at ? new Date(data.created_at).toLocaleDateString('vi-VN') : '—'}
              </p>
            </div>

            <div className="prose prose-neutral max-w-none prose-img:rounded-xl prose-headings:text-neutral-800">
              <p className="text-neutral-700 leading-relaxed whitespace-pre-line text-lg">
                {data.description}
              </p>
            </div>
          </div>

          {/* 💬 CTA hoặc gợi ý */}
          <div className="mt-16 bg-gradient-to-r from-neutral-100 to-white border border-neutral-200 rounded-2xl p-8 text-center">
            <h2 className="text-2xl font-bold text-neutral-800 mb-3">Cảm ơn bạn đã đọc bài viết</h2>
            <p className="text-neutral-600 max-w-2xl mx-auto">
              Theo dõi Gara Auto Pro để cập nhật thêm nhiều tin tức, mẹo chăm sóc xe, và các dự án mới nhất của chúng tôi.
            </p>
            <div className="mt-6">
              <a
                href={PATH.LIEN_HE}
                className="inline-block rounded-full bg-amber-500 px-6 py-3 text-white font-semibold shadow-md transition-all hover:bg-amber-400 hover:shadow-lg"
              >
                Liên hệ với chúng tôi
              </a>
            </div>
          </div>
        </motion.article>
      )}

      {!isLoading && !data && (
        <div className="text-center text-neutral-600">Không tìm thấy bài viết.</div>
      )}
    </section>
  )
}
