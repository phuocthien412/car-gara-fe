import LazyImage from '@/components/LazyImage'
import Skeleton from '@/components/Skeleton'
import { useServices } from '@/hooks/useQueryData'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'

export default function DichVu() {
  const { data, isLoading } = useServices()
  return (
    <section className="container-pad py-10">
      <h1 className="mb-6 text-3xl font-bold">Dịch vụ</h1>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {isLoading && Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-56" />)}
        {data?.map((s, i) => (
          <motion.article
            key={s.id}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45, delay: i * 0.03 }}
            className="card overflow-hidden"
          >
            <Link to={`/dich-vu/${s.id}`} className="block">
              <LazyImage src={s.image} alt={s.title} className="h-44 w-full object-cover" />
              <div className="p-5">
                <h3 className="text-lg font-semibold hover:text-brand transition-colors">{s.title}</h3>
                <p className="mt-1 text-sm text-neutral-600">{s.description}</p>
              </div>
            </Link>
          </motion.article>
        ))}
      </div>
    </section>
  )
}
