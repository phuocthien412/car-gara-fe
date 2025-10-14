import { useQuery } from '@tanstack/react-query'
import Pagination from '@/components/Pagination'
import tintucApi from '@/apis/tintuc'
import type { SuccessResponseApi } from '@/types/common'
import type { ListtintucResponsePagination, tintuc } from '@/types/tintuc'
import LazyImage from '@/components/LazyImage'
import Skeleton from '@/components/Skeleton'
import { motion } from 'framer-motion'
import { Link, useSearchParams } from 'react-router-dom'

export default function TinTuc() {
  const [searchParams] = useSearchParams()
  const page = Number(searchParams.get('page') || '1')
  const limit = 6

  const { data, isLoading } = useQuery({
    queryKey: ['tintuc', 'list', page, limit],
    queryFn: async () => tintucApi.tintucList({ page: String(page), limit: String(limit) })
  })

  const payload = (data?.data as SuccessResponseApi<ListtintucResponsePagination> | undefined)?.data
  const items: tintuc[] = payload?.data ?? []
  const totalPage = payload?.total_pages ?? 0

  return (
    <section className="container-pad py-10">
      <h1 className="mb-6 text-3xl font-bold">Tin tức</h1>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {isLoading && Array.from({ length: limit }).map((_, i) => <Skeleton key={i} className="h-56" />)}

        {!isLoading && items?.map((p, i) => (
          <motion.article
            key={p._id}
            initial={{ opacity: 0, y: 10 }}
            // ⬇️ Hiện ngay khi mount
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: i * 0.03 }}
            className="group overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md"
          >
            <Link to={`/tin-tuc/${p._id}`} className="block">
              <div className="relative h-40 w-full overflow-hidden">
                <LazyImage
                  src={p.image}
                  alt={p.title}
                  loading={i < 4 ? 'eager' : 'lazy'}
                  decoding="async"
                  className="h-40 w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>

              <div className="p-5">
                <h3 className="text-lg font-semibold transition-colors group-hover:text-brand">
                  {p.title}
                </h3>
                <p className="mt-1 line-clamp-2 text-sm text-neutral-600">
                  {p.description}
                </p>
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
