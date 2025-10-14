import { useQuery } from '@tanstack/react-query'
import Pagination from '@/components/Pagination'
import duanApi from '@/apis/duan'
import type { SuccessResponseApi } from '@/types/common'
import type { ListDuAnResponsePagination, duan } from '@/types/duan'
import LazyImage from '@/components/LazyImage'
import Skeleton from '@/components/Skeleton'
import { motion } from 'framer-motion'
import { Link, useSearchParams } from 'react-router-dom'

export default function DuAn() {
  const [searchParams] = useSearchParams()
  const page = Number(searchParams.get('page') || '1')
  const limit = 8

  const { data, isLoading } = useQuery({
    queryKey: ['duan', 'list', page, limit],
    queryFn: async () => duanApi.duanList({ page: String(page), limit: String(limit) })
  })

  const payload = (data?.data as SuccessResponseApi<ListDuAnResponsePagination> | undefined)?.data
  const items: duan[] = payload?.data ?? []
  const totalPage = payload?.total_pages ?? 0

  return (
    <section className="container-pad py-10">
      <h1 className="mb-6 text-3xl font-bold">Dự Án</h1>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {isLoading &&
          Array.from({ length: limit }).map((_, i) => <Skeleton key={i} className="h-52" />)}

        {!isLoading &&
          items?.map((p, i) => (
            <motion.div
              key={p._id}
              initial={{ opacity: 0, scale: 0.98 }}
              // 👇 animate ngay khi mount (không dùng whileInView)
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.35, delay: i * 0.03 }}
              className="group relative overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-sm"
            >
              <Link to={`/du-an/${p._id}`} className="block">
                <LazyImage
                  src={p.image}
                  alt={p.title}
                  // 👇 ưu tiên tải sớm vài item đầu để hiện ngay trên fold
                  loading={i < 6 ? 'eager' : 'lazy'}
                  decoding="async"
                  className="h-48 w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-x-0 bottom-0 p-4 text-white">
                  <div className="rounded bg-black/40 px-3 py-1.5 text-sm backdrop-blur">
                    {p.title}
                  </div>
                </div>
              </Link>
            </motion.div>
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
