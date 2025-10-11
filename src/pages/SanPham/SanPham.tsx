import { useProducts } from '@/hooks/useQueryData'
import LazyImage from '@/components/LazyImage'
import Skeleton from '@/components/Skeleton'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'

export default function SanPham() {
  const { data, isLoading } = useProducts()
  return (
    <section className="container-pad py-10">
      <h1 className="mb-6 text-3xl font-bold">Sản phẩm</h1>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {isLoading && Array.from({ length: 9 }).map((_, i) => <Skeleton key={i} className="h-64" />)}
        {data?.map((p, i) => (
          <motion.article
            key={p.id}
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.35, delay: i * 0.03 }}
            className="card overflow-hidden"
          >
            <Link to={`/san-pham/${p.id}`} className="block">
              <LazyImage src={p.image} alt={p.title} className="h-44 w-full object-cover" />
              <div className="p-5">
                <h3 className="text-lg font-semibold hover:text-brand transition-colors">{p.title}</h3>
                <div className="mt-2 flex items-center justify-between">
                  <span className="font-bold text-brand">
                    {p.price?.toLocaleString('vi-VN')}₫
                  </span>
                </div>
              </div>
            </Link>
          </motion.article>
        ))}
      </div>
    </section>
  )
}

