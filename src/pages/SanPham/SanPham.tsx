import LazyImage from '@/components/LazyImage'
import Skeleton from '@/components/Skeleton'
import Pagination from '@/components/Pagination'
import sanphamApi from '@/apis/sanpham'
import type { SuccessResponseApi } from '@/types/common'
import type { ListSanPhamResponsePagination, sanpham } from '@/types/sanpham'
import { useQuery } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { Link, useSearchParams } from 'react-router-dom'

export default function SanPham() {
  const [searchParams] = useSearchParams()
  const page = Number(searchParams.get('page') || '1')
  const limit = 9

  const { data, isLoading } = useQuery({
    queryKey: ['sanpham', 'list', page, limit],
    queryFn: async () => sanphamApi.sanphamList({ page: String(page), limit: String(limit) })
  })

  const payload = (data?.data as SuccessResponseApi<ListSanPhamResponsePagination> | undefined)?.data
  const items: sanpham[] = payload?.data ?? []
  const totalPage = payload?.total_pages ?? 0

  return (
    <section className="container-pad py-10">
      <h1 className="mb-6 text-3xl font-bold">Sản phẩm</h1>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {isLoading && Array.from({ length: limit }).map((_, i) => <Skeleton key={i} className="h-64" />)}
        {items?.map((p, i) => (
          <motion.article
            key={p._id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }} // animate ngay khi mount, không chờ scroll
            transition={{ duration: 0.35, delay: i * 0.03 }}
            whileHover={{ y: -6, scale: 1.02, boxShadow: '0 10px 30px rgba(2,6,23,0.08)' }} // hover mượt, nâng nhẹ + shadow
            className="card overflow-hidden transform-gpu transition-shadow duration-200 hover:shadow-lg"
          >
            <Link to={`/san-pham/${p._id}`} className="block">
              <LazyImage
                src={p.image}
                alt={p.title}
                loading="eager" // ưu tiên tải ảnh hiển thị ngay
                className="h-44 w-full object-cover transition-transform duration-200"
              />
              <div className="p-5">
                <h3 className="text-lg font-semibold hover:text-brand transition-colors">{p.title}</h3>
                <div className="mt-2 flex items-center justify-between">
                  <span className="font-bold text-brand">
                    {p.price?.toLocaleString('vi-VN')} ₫
                  </span>
                </div>
              </div>
            </Link>
          </motion.article>
        ))}
      </div>
      {totalPage > 1 && (
        <div className="mt-6">
          <Pagination page={page} totalPage={totalPage} />
        </div>
      )}
    </section>
  )
}

