import { motion } from 'framer-motion'
import LazyImage from '@/components/LazyImage'
import Skeleton from '@/components/Skeleton'
import { useServices, usePosts } from '@/hooks/useQueryData'
import { images } from '@/mocks/db'

export default function Home() {
  const { data: services, isLoading: loadingServices } = useServices()
  const { data: posts, isLoading: loadingPosts } = usePosts()

  return (
    <div className="bg-neutral-50 text-neutral-800">
      {/* 🏎 HERO SECTION */}
      <section className="relative isolate">
        <div className="absolute inset-0 -z-10">
          <LazyImage src={images.hero} alt="garage" className="h-[70vh] w-full object-cover" />
          {/* overlay gradient: đen -> vàng nhạt */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-amber-900/30" />
        </div>

        <div className="container-pad flex min-h-[70vh] flex-col justify-center text-white">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl text-5xl font-extrabold leading-tight sm:text-6xl drop-shadow-lg"
          >
            Dịch vụ chăm sóc xe chuyên nghiệp & tận tâm
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mt-4 max-w-2xl text-lg text-neutral-200"
          >
            Bảo dưỡng, sửa chữa, độ xe và cung cấp phụ tùng chính hãng. Cam kết chất lượng và uy tín hàng đầu.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-8 flex gap-3"
          >
            <a
              href="#services"
              className="rounded-full bg-amber-500 px-6 py-3 font-semibold text-white shadow-md transition-all hover:bg-amber-400 hover:shadow-lg"
            >
              Khám phá dịch vụ
            </a>
            <a
              href="/lien-he"
              className="rounded-full border border-white/60 px-6 py-3 font-semibold text-white transition-all hover:bg-white hover:text-black"
            >
              Liên hệ ngay
            </a>
          </motion.div>
        </div>
      </section>

      {/* 🔧 SERVICES SECTION */}
      <section id="services" className="container-pad py-20">
        <div className="mb-10 flex items-end justify-between">
          <h2 className="text-3xl font-bold text-neutral-800">Dịch vụ nổi bật</h2>
          <a className="text-amber-600 hover:underline font-medium" href="/dich-vu">
            Xem tất cả
          </a>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {loadingServices && (
            <>
              <Skeleton className="h-60" />
              <Skeleton className="h-60" />
              <Skeleton className="h-60" />
            </>
          )}
          {services?.map((s, i) => (
            <motion.article
              key={s.id}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.5, delay: i * 0.05 }}
              className="overflow-hidden rounded-2xl bg-white shadow-md transition-all hover:shadow-xl hover:-translate-y-1"
            >
              <a href={`/dich-vu/${s.id}`} className="block">
                <LazyImage
                  src={s.image}
                  alt={s.title}
                  className="h-48 w-full object-cover transition-transform duration-300 hover:scale-105"
                />
                <div className="p-5">
                  <h3 className="text-lg font-semibold text-neutral-800 hover:text-amber-600 transition-colors">
                    {s.title}
                  </h3>
                  <p className="mt-2 text-sm text-neutral-600">{s.description}</p>
                </div>
              </a>
            </motion.article>
          ))}
        </div>
      </section>

      {/* 📰 POSTS SECTION */}
      <section className="container-pad py-20 bg-gradient-to-b from-neutral-100 to-white">
        <div className="mb-10 flex items-end justify-between">
          <h2 className="text-3xl font-bold text-neutral-800">Tin tức mới nhất</h2>
          <a className="text-amber-600 hover:underline font-medium" href="/tin-tuc">
            Xem thêm
          </a>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {loadingPosts && (
            <>
              <Skeleton className="h-56" />
              <Skeleton className="h-56" />
              <Skeleton className="h-56" />
            </>
          )}
          {posts?.slice(0, 3).map((p, i) => (
            <motion.article
              key={p.id}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.5, delay: i * 0.05 }}
              className="overflow-hidden rounded-2xl bg-white shadow-md transition-all hover:shadow-xl hover:-translate-y-1"
            >
              <a href={`/tin-tuc/${p.id}`} className="block">
                <LazyImage
                  src={p.image}
                  alt={p.title}
                  className="h-44 w-full object-cover transition-transform duration-300 hover:scale-105"
                />
                <div className="p-5">
                  <h3 className="text-lg font-semibold text-neutral-800 hover:text-amber-600 transition-colors">
                    {p.title}
                  </h3>
                  <p className="mt-2 text-sm text-neutral-600">{p.description}</p>
                </div>
              </a>
            </motion.article>
          ))}
        </div>
      </section>
    </div>
  )
}
