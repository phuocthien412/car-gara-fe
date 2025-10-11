import { useProjects } from '@/hooks/useQueryData'
import LazyImage from '@/components/LazyImage'
import Skeleton from '@/components/Skeleton'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'

export default function DuAn() {
  const { data, isLoading } = useProjects()
  return (
    <section className="container-pad py-10">
      <h1 className="mb-6 text-3xl font-bold">Dự án</h1>
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {isLoading && Array.from({ length: 8 }).map((_, i) => <Skeleton key={i} className="h-52" />)}
        {data?.map((p, i) => (
          <motion.div
            key={p.id}
            initial={{ opacity: 0, scale: 0.98 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.35, delay: i * 0.03 }}
            className="group relative overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-sm"
          >
            <Link to={`/du-an/${p.id}`} className="block">
              <LazyImage src={p.image} alt={p.title} className="h-48 w-full object-cover transition-transform duration-500 group-hover:scale-105" />
              <div className="absolute inset-x-0 bottom-0 p-4 text-white">
                <div className="rounded bg-black/40 px-3 py-1.5 text-sm backdrop-blur">
                  {p.title}
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
