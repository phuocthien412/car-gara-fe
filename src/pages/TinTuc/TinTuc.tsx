import { usePosts } from '@/hooks/useQueryData'
import LazyImage from '@/components/LazyImage'
import Skeleton from '@/components/Skeleton'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'

export default function TinTuc() {
  const { data, isLoading } = usePosts()
  return (
    <section className="container-pad py-10">
      <h1 className="mb-6 text-3xl font-bold">Tin tức</h1>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {isLoading && Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-56" />)}
        {data?.map((p, i) => (
          <motion.article
            key={p.id}
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.35, delay: i * 0.03 }}
            className="card overflow-hidden"
          >
            <Link to={`/tin-tuc/${p.id}`} className="block">
              <LazyImage src={p.image} alt={p.title} className="h-40 w-full object-cover" />
              <div className="p-5">
                <h3 className="text-lg font-semibold hover:text-brand transition-colors">{p.title}</h3>
                <p className="mt-1 text-sm text-neutral-600">{p.description}</p>
              </div>
            </Link>
          </motion.article>
        ))}
      </div>
    </section>
  )
}
