import { useParams, Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import LazyImage from '@/components/LazyImage'
import Skeleton from '@/components/Skeleton'
import { useProjectDetail } from '@/hooks/useQueryData'
import Zoom from 'react-medium-image-zoom'
import 'react-medium-image-zoom/dist/styles.css'

export default function DuAnDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { data, isLoading } = useProjectDetail(id)

  return (
    <section className="container-pad py-20">
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
          className="max-w-6xl mx-auto"
        >
          {/* 🧭 Breadcrumb */}
          <div className="mb-6 text-sm text-neutral-600">
            <Link to="/" className="text-neutral-500 hover:text-amber-600 transition-colors">Trang chủ</Link>
            {' / '}
            <Link to="/du-an" className="text-neutral-500 hover:text-amber-600 transition-colors">Dự án</Link>
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

          {/* 🌆 Header */}
          <h1 className="mb-10 text-4xl font-extrabold text-neutral-900 sm:text-5xl">
            {data.title}
          </h1>

          {/* ⚙️ Nội dung chính - 2 cột */}
          <div className="grid gap-10 md:grid-cols-2 items-start">
            {/* Ảnh dự án */}
            {data.image && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="overflow-hidden rounded-2xl shadow-md hover:shadow-xl transition-all"
              >
                <Zoom>
                  <LazyImage
                    src={data.image}
                    alt={data.title}
                    className="h-[400px] w-full object-cover transition-transform duration-300 hover:scale-[1.03]"
                  />
                </Zoom>
              </motion.div>
            )}

            {/* Thông tin dự án */}
            <div className="flex flex-col justify-center">
              <p className="text-neutral-700 leading-relaxed whitespace-pre-line text-lg">
                {data.description}
              </p>

              {/* Thông tin thêm (tùy chọn nếu có) */}
              {data.created_at && (
                <p className="mt-6 text-sm text-neutral-500">
                  Cập nhật: {new Date(data.created_at).toLocaleDateString('vi-VN')}
                </p>
              )}

              {/* CTA */}
              <div className="mt-8">
                <a
                  href="/lien-he"
                  className="inline-block rounded-full bg-amber-500 px-6 py-3 text-white font-semibold shadow-md transition-all hover:bg-amber-400 hover:shadow-lg"
                >
                  Liên hệ hợp tác
                </a>
              </div>
            </div>
          </div>

          {/* 💬 Kết luận / Gợi ý */}
          <div className="mt-16 rounded-2xl bg-gradient-to-r from-neutral-100 to-white p-8 border border-neutral-200">
            <h2 className="text-2xl font-bold text-neutral-800 mb-3">Tổng quan dự án</h2>
            <p className="text-neutral-600 leading-relaxed">
              Dự án <span className="font-medium text-amber-600">{data.title}</span> là minh chứng cho năng lực và
              tâm huyết của đội ngũ Gara Auto Pro trong việc mang lại các giải pháp tiên tiến cho khách hàng.
              Chúng tôi không chỉ tạo ra sản phẩm, mà còn xây dựng niềm tin và giá trị bền vững.
            </p>
          </div>
        </motion.article>
      )}

      {!isLoading && !data && (
        <div className="text-center text-neutral-600">Không tìm thấy dự án.</div>
      )}
    </section>
  )
}
