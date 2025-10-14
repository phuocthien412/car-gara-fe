import LazyImage from '@/components/LazyImage'
import Skeleton from '@/components/Skeleton'
import Pagination from '@/components/Pagination'
import dichvuApi from '@/apis/dichvu'
import type { SuccessResponseApi } from '@/types/common'
import type { ListDichVuResponsePagination, dichvu } from '@/types/dichvu'
import { useQuery } from '@tanstack/react-query'
import { Link, useSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'

export default function DichVu() {
  const [searchParams] = useSearchParams()
  const page = Number(searchParams.get('page') || '1')
  const limit = 12

  const { data, isLoading } = useQuery({
    queryKey: ['dichvu', 'list', page, limit],
    queryFn: async () => dichvuApi.dichvuList({ page: String(page), limit: String(limit) })
  })

  const payload = (data?.data as SuccessResponseApi<ListDichVuResponsePagination> | undefined)?.data
  const items: dichvu[] = payload?.data ?? []
  const totalPage = payload?.total_pages ?? 0

  return (
    <section className="container-pad py-10">
      <h1 className="mb-6 text-3xl font-bold">Dịch vụ</h1>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {isLoading && Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-56" />)}
        {items?.map((s, i) => (
          <motion.article
            key={s._id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: i * 0.03 }}
            className="card overflow-hidden"
          >
            <Link to={`/dich-vu/${s._id}`} className="block">
              <LazyImage src={s.image} alt={s.title} className="h-44 w-full object-cover" />
              <div className="p-5">
                <h3 className="text-lg font-semibold hover:text-brand transition-colors">{s.title}</h3>
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

