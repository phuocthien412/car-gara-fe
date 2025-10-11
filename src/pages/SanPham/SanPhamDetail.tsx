import { useParams, Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import LazyImage from '@/components/LazyImage'
import Skeleton from '@/components/Skeleton'
import { useProductDetail } from '@/hooks/useQueryData'
import Zoom from 'react-medium-image-zoom'
import 'react-medium-image-zoom/dist/styles.css'

export default function SanPhamDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { data, isLoading } = useProductDetail(id)

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
            <Link to="/san-pham" className="text-neutral-500 hover:text-amber-600 transition-colors">Sản phẩm</Link>
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

          {/* 🌟 Chi tiết sản phẩm - 2 cột */}
          <div className="grid gap-10 md:grid-cols-2 items-start">
            {/* Hình ảnh sản phẩm */}
            <div className="overflow-hidden rounded-2xl bg-white shadow-sm border border-neutral-100">
              <Zoom>
                <LazyImage
                  src={data.image}
                  alt={data.title}
                  className="h-[420px] w-full object-cover transition-transform duration-300 hover:scale-[1.03]"
                />
              </Zoom>
            </div>

            {/* Thông tin chi tiết */}
            <div>
              <h1 className="text-3xl font-extrabold text-neutral-900 mb-4">{data.title}</h1>

              {data.price !== undefined && (
                <div className="text-3xl font-bold text-amber-600 mb-6">
                  {data.price.toLocaleString('vi-VN')}₫
                </div>
              )}

              <p className="text-neutral-700 leading-relaxed whitespace-pre-line mb-6">
                {data.description}
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <a
                  href="/lien-he"
                  className="flex-1 rounded-full border border-amber-500 px-6 py-3 text-amber-600 font-semibold text-center hover:bg-amber-500 hover:text-white transition-all"
                >
                  Liên hệ mua hàng
                </a>
              </div>

              {data.created_at && (
                <p className="mt-6 text-sm text-neutral-500">
                  Cập nhật: {new Date(data.created_at).toLocaleDateString('vi-VN')}
                </p>
              )}
            </div>
          </div>

          {/* 📦 Mô tả chi tiết hơn */}
          <div className="mt-16 rounded-2xl bg-gradient-to-r from-neutral-100 to-white p-8 border border-neutral-200">
            <h2 className="text-2xl font-bold text-neutral-800 mb-3">Chi tiết sản phẩm</h2>
            <p className="text-neutral-600 leading-relaxed">
              Sản phẩm <span className="font-medium text-amber-600">{data.title}</span> được tuyển chọn và kiểm định
              chất lượng kỹ lưỡng, phù hợp với tiêu chuẩn của Gara Auto Pro. Chúng tôi cam kết mang lại giải pháp
              hiệu quả, an toàn và bền bỉ nhất cho khách hàng.
            </p>
          </div>
        </motion.article>
      )}

      {!isLoading && !data && (
        <div className="text-center text-neutral-600">Không tìm thấy sản phẩm.</div>
      )}
    </section>
  )
}
