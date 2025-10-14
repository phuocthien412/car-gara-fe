import { motion } from 'framer-motion'
import LazyImage from '@/components/LazyImage'
import Skeleton from '@/components/Skeleton'
import { useServices, usePosts, useContact } from '@/hooks/useQueryData'
import { images } from '@/mocks/db'
import PATH from '@/constants/path'

import {
  Wrench,
  ShieldCheck,
  Clock,
  Star,
  PhoneCall,
  Car,
  Sparkles
} from 'lucide-react'

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 }, // dùng animate thay cho whileInView để hiện ngay khi mount
  // typed bezier easing to match framer-motion types
  transition: { duration: 0.55, ease: [0.4, 0, 0.2, 1] as [number, number, number, number], delay }
})

export default function Home() {
  const { data: services, isLoading: loadingServices } = useServices()
  const { data: contact } = useContact()
  const { data: posts, isLoading: loadingPosts } = usePosts()

  // ⚙️ Hiển thị tên gara: ưu tiên contact.name, fallback là "H86 Thuận"
  const GARAGE_LOCAL = contact?.name?.trim() || 'H86 Thuận'
  const PHONE = contact?.hotline || contact?.phone || '0979 000 000'

  return (
    <div className="bg-neutral-50 text-neutral-800">
      {/* HERO */}
      <section className="relative isolate">
        {/* Background */}
        <div className="absolute inset-0 -z-10">
          <LazyImage
            src={images.hero}
            alt="garage"
            className="h-[76vh] w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-tr from-black/80 via-black/60 to-black/10" />
          <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-neutral-50" />
        </div>

        {/* Content */}
        <div className="container-pad flex min-h-[76vh] flex-col justify-center text-white">
          <motion.div
            {...fadeUp(0)}
            className="mb-4 inline-flex w-fit items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm backdrop-blur"
          >
            <Sparkles className="size-4" />
            <span className="font-medium">
              {GARAGE_LOCAL} • Chăm sóc xe toàn diện
            </span>
          </motion.div>

          <motion.h1
            {...fadeUp(0.05)}
            className="max-w-4xl text-5xl font-extrabold leading-tight drop-shadow sm:text-6xl"
          >
            Dịch vụ chăm sóc xe
            <span className="bg-gradient-to-r from-amber-300 to-amber-500 bg-clip-text text-transparent">
              {' '}chuyên nghiệp
            </span>{' '}
            & tận tâm
          </motion.h1>

          <motion.p
            {...fadeUp(0.15)}
            className="mt-5 max-w-2xl text-lg text-neutral-200"
          >
            Tại {GARAGE_LOCAL}, chúng tôi cam kết mang đến bảo dưỡng, sửa chữa chất
            lượng cao, linh kiện chính hãng và quy trình minh bạch để chiếc xe
            của bạn luôn an toàn & vận hành tối ưu.
          </motion.p>

          <motion.div {...fadeUp(0.25)} className="mt-8 flex flex-wrap gap-3">
            <a
              href="#services"
              className="rounded-full bg-amber-500 px-6 py-3 font-semibold text-white shadow-md transition-all hover:bg-amber-400 hover:shadow-lg"
            >
              Khám phá dịch vụ
            </a>
            <a
              href={PATH.LIEN_HE}
              className="rounded-full border border-white/60 px-6 py-3 font-semibold text-white transition-all hover:bg-white hover:text-black"
            >
              Liên hệ ngay
            </a>
            <a
              href={`tel:${PHONE.replace(/\s+/g, '')}`}
              className="inline-flex items-center gap-2 rounded-full bg-white/10 px-5 py-3 font-semibold text-white ring-1 ring-white/20 transition-all hover:bg-white/20"
            >
              <PhoneCall className="size-4" />
              Gọi {PHONE}
            </a>
          </motion.div>

          {/* Feature badges */}
          <motion.div
            {...fadeUp(0.35)}
            className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-4"
          >
            {[
              { icon: ShieldCheck, text: 'Bảo hành rõ ràng' },
              { icon: Wrench, text: 'Phụ tùng chính hãng' },
              { icon: Clock, text: 'Nhận xe nhanh' },
              { icon: Star, text: 'KTV > 10 năm kinh nghiệm' }
            ].map((f, i) => (
              <div
                key={i}
                className="flex items-center gap-2 rounded-xl bg-white/10 px-4 py-3 backdrop-blur ring-1 ring-white/15"
              >
                <f.icon className="size-5" />
                <span className="text-sm">{f.text}</span>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* SERVICES */}
      <section id="services" className="container-pad py-16 sm:py-20">
        {/* 🔥 Intro detail card (được làm mới) */}
        <motion.div {...fadeUp(0.05)} className="mb-10">
          <div className="rounded-2xl bg-gradient-to-r from-amber-200/70 via-orange-200/60 to-transparent p-[1px]">
            <div className="rounded-[14px] bg-white p-6 shadow-sm ring-1 ring-neutral-100/80 sm:p-8">
              <div className="flex flex-col items-start gap-6 md:flex-row md:items-center">
                {/* Text block */}
                <div className="flex-1">
                  <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-amber-700">
                    Về {GARAGE_LOCAL}
                  </div>
                  <p className="text-base leading-relaxed text-neutral-700">
                    Tại <span className="font-semibold text-neutral-900">{GARAGE_LOCAL}</span>,
                    chúng tôi cung cấp đầy đủ các dịch vụ chăm sóc xe: bảo dưỡng định kỳ,
                    sửa chữa, vệ sinh – chăm sóc nội ngoại thất, nâng cấp phụ kiện…
                    Đội ngũ kỹ thuật luôn sẵn sàng tư vấn phương án phù hợp nhất cho bạn.
                  </p>

                  {/* Chips */}
                  <div className="mt-3 flex flex-wrap gap-2">
                    {[
                      'Bảo dưỡng định kỳ',
                      'Sửa chữa',
                      'Vệ sinh nội/ngoại thất',
                      'Đánh bóng – phủ bóng',
                      'Nâng cấp phụ kiện'
                    ].map((label) => (
                      <span
                        key={label}
                        className="rounded-full bg-amber-50 px-3 py-1 text-xs font-medium text-amber-800 ring-1 ring-amber-200"
                      >
                        {label}
                      </span>
                    ))}
                  </div>

                  {/* Bullets */}
                  <ul className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <li className="flex items-start gap-3">
                      <ShieldCheck className="mt-0.5 size-5 text-amber-600" />
                      <span className="text-sm text-neutral-700">Bảo hành rõ ràng, quy trình minh bạch</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <Wrench className="mt-0.5 size-5 text-amber-600" />
                      <span className="text-sm text-neutral-700">Phụ tùng chính hãng, máy móc hiện đại</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <Clock className="mt-0.5 size-5 text-amber-600" />
                      <span className="text-sm text-neutral-700">Nhận xe nhanh, chủ động hẹn giờ</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <Star className="mt-0.5 size-5 text-amber-600" />
                      <span className="text-sm text-neutral-700">KTV &gt; 10 năm kinh nghiệm</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        <div className="mb-10 flex items-end justify-between">
          <h2 className="text-3xl font-bold">
            <span className="bg-gradient-to-r from-neutral-900 to-neutral-700 bg-clip-text text-transparent">
              Dịch vụ nổi bật
            </span>
          </h2>
          <a className="font-medium text-amber-600 hover:underline" href={PATH.DICH_VU}>
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

          {!loadingServices && (!services || services.length === 0) && (
            <div className="col-span-full rounded-2xl border border-dashed border-neutral-200 bg-white p-8 text-center">
              <Car className="mx-auto mb-3 size-8 text-neutral-400" />
              <div className="font-semibold">Chưa có dịch vụ để hiển thị</div>
              <p className="mt-1 text-sm text-neutral-600">
                Hãy thêm dịch vụ trong trang quản trị hoặc liên hệ {GARAGE_LOCAL} để được tư vấn.
              </p>
              <a
                href={PATH.LIEN_HE}
                className="mt-4 inline-block rounded-full bg-neutral-900 px-5 py-2 text-sm font-semibold text-white hover:bg-neutral-800"
              >
                Liên hệ tư vấn
              </a>
            </div>
          )}

          {services?.map((s, i) => (
            <motion.article
              key={s.id ?? i}
              {...fadeUp(i * 0.05)}
              className="group overflow-hidden rounded-2xl bg-white shadow-md ring-1 ring-neutral-100 transition-all hover:-translate-y-1 hover:shadow-xl"
            >
              <a href={PATH.DICH_VU_DETAIL.replace(':dichVuId', s.id)} className="block">
                <div className="relative">
                  <LazyImage
                    src={s.image}
                    alt={s.title}
                    className="h-48 w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/50 to-transparent" />
                </div>
                <div className="p-5">
                  <h3 className="text-lg font-semibold text-neutral-900 transition-colors group-hover:text-amber-600">
                    {s.title}
                  </h3>
                </div>
              </a>
            </motion.article>
          ))}
        </div>

      </section>

      {/* POSTS */}
      <section className="container-pad bg-gradient-to-b from-neutral-100 to-white py-16 sm:py-20">
        <div className="mb-10 flex items-end justify-between">
          <h2 className="text-3xl font-bold">
            <span className="bg-gradient-to-r from-neutral-900 to-neutral-700 bg-clip-text text-transparent">
              Tin tức
            </span>
          </h2>
        <a className="font-medium text-amber-600 hover:underline" href={PATH.TIN_TUC}>
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

          {!loadingPosts && (!posts || posts.length === 0) && (
            <div className="col-span-full rounded-2xl border border-dashed border-neutral-200 bg-white p-8 text-center">
              <Star className="mx-auto mb-3 size-8 text-neutral-400" />
              <div className="font-semibold">Chưa có bài viết</div>
              <p className="mt-1 text-sm text-neutral-600">
                Nội dung sẽ được cập nhật sớm. Vui lòng quay lại sau!
              </p>
            </div>
          )}

          {posts?.slice(0, 3).map((p, i) => (
            <motion.article
              key={p.id ?? i}
              {...fadeUp(i * 0.05)}
              className="group overflow-hidden rounded-2xl bg-white shadow-md ring-1 ring-neutral-100 transition-all hover:-translate-y-1 hover:shadow-xl"
            >
              <a href={PATH.TIN_TUC_DETAIL.replace(':tinTucId', p.id)} className="block">
                <div className="relative">
                  <LazyImage
                    src={p.image}
                    alt={p.title}
                    className="h-44 w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/50 to-transparent" />
                </div>
                <div className="p-5">
                  <h3 className="text-lg font-semibold text-neutral-900 transition-colors group-hover:text-amber-600">
                    {p.title}
                  </h3>
                </div>
              </a>
            </motion.article>
          ))}
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="container-pad pb-16">
        <div className="relative overflow-hidden rounded-2xl bg-neutral-900">
          <div className="absolute inset-0 bg-[radial-gradient(1200px_600px_at_100%_0%,rgba(251,191,36,0.18),transparent_60%)]" />
          <div className="relative flex flex-col items-start justify-between gap-6 p-8 sm:flex-row sm:items-center sm:p-10">
            <div>
              <h3 className="text-2xl font-bold text-white">
                Cần tư vấn nhanh từ {GARAGE_LOCAL}?
              </h3>
              <p className="mt-1 text-sm text-neutral-300">
                Gọi trực tiếp hoặc để lại thông tin – chúng tôi sẽ liên hệ ngay.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <a
                href={`tel:${PHONE.replace(/\s+/g, '')}`}
                className="inline-flex items-center gap-2 rounded-full bg-amber-500 px-5 py-3 font-semibold text-white transition-all hover:bg-amber-400"
              >
                <PhoneCall className="size-4" />
                {PHONE}
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
