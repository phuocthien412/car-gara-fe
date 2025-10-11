import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import LazyImage from '@/components/LazyImage'
import Skeleton from '@/components/Skeleton'
import { useServiceDetail } from '@/hooks/useQueryData'
import Zoom from 'react-medium-image-zoom'
import 'react-medium-image-zoom/dist/styles.css'
import { useNavigate } from 'react-router-dom'
export default function DichVuDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { data, isLoading } = useServiceDetail(id)

  return (
    <section className="container-pad py-16">
      {isLoading && (
        <div className="grid gap-4">
          <Skeleton className="h-8 w-1/2" />
          <Skeleton className="h-80" />
          <Skeleton className="h-32" />
        </div>
      )}

      {!isLoading && data && (
        <motion.article
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="max-w-4xl mx-auto"
        >
          {/* 🧭 Breadcrumb */}
          <div className="mb-6 text-sm text-neutral-600">
            <Link to="/" className="text-neutral-500 hover:text-amber-600 transition-colors">Trang chủ</Link>
            {' / '}
            <Link to="/dich-vu" className="text-neutral-500 hover:text-amber-600 transition-colors">Dịch vụ</Link>
            {' / '}
            <span className="text-neutral-800 font-medium">{data.title}</span>
          </div>

           {/* 🔙 Nút quay lại */}
          <button
            onClick={() => navigate(-1)}
            className="mb-4 inline-flex items-center gap-2 rounded-full border border-neutral-200 px-4 py-2 text-sm font-medium text-neutral-600 hover:text-amber-600 hover:border-amber-400 transition-all"
          >
            <span className="text-lg">←</span> Quay lại
          </button>

          {/* Tiêu đề */}
          <h1 className="mb-4 text-3xl font-extrabold text-neutral-900 sm:text-4xl">
            {data.title}
          </h1>

          {/* Ảnh */}
          {data.image && (
            <div className="mb-8 overflow-hidden rounded-2xl shadow-md transition-all hover:shadow-xl">
              <Zoom>
                <LazyImage
                  src={data.image}
                  alt={data.title}
                  className="h-[420px] w-full object-cover transition-transform duration-300 hover:scale-[1.02]"
                />
              </Zoom>
            </div>
          )}

          {/* Thông tin chi tiết */}
          <div className="rounded-2xl bg-white p-6 shadow-sm border border-neutral-100">
            {data.price !== undefined && (
              <div className="mb-5 flex items-center gap-2">
                <span className="text-lg font-semibold text-neutral-700">Giá dịch vụ:</span>
                <span className="text-2xl font-bold text-amber-600">
                  {data.price.toLocaleString('vi-VN')}₫
                </span>
              </div>
            )}

            <p className="text-neutral-700 leading-relaxed whitespace-pre-line">
              {data.description}
            </p>

            {/* CTA */}
            <div className="mt-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <p className="text-sm text-neutral-500">
                Cần tư vấn hoặc đặt lịch? Hãy liên hệ với chúng tôi để được hỗ trợ nhanh nhất.
              </p>
              <a
                href="/lien-he"
                className="inline-block rounded-full bg-amber-500 px-6 py-3 text-white font-semibold shadow-md transition-all hover:bg-amber-400 hover:shadow-lg"
              >
                Liên hệ ngay
              </a>
            </div>
          </div>
        </motion.article>
      )}

      {!isLoading && !data && (
        <div className="text-center text-neutral-600">Không tìm thấy dịch vụ.</div>
      )}
    </section>
  )
}
