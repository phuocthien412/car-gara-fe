import { motion } from 'framer-motion'

export default function LienHe() {
  const address = '189 Đường Tân Liêm, Phong Phú, Bình Chánh, Hồ Chí Minh'
  const mapEmbed = `https://www.google.com/maps?q=${encodeURIComponent(address)}&output=embed`
  const mapLink = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`

  return (
    <section className="container-pad py-10">
      <h1 className="mb-6 text-3xl font-bold">Liên hệ</h1>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="mx-auto grid gap-6 md:grid-cols-2"
      >
        <div className="rounded-xl border border-neutral-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-xl font-semibold">Thông tin liên hệ trực tiếp</h2>

          <ul className="space-y-4 text-sm">
            <li className="flex items-start gap-3">
              <span className="text-2xl">📍</span>
              <div>
                <div className="font-medium">Địa chỉ văn phòng</div>
                <div className="text-neutral-600">{address}</div>
                <a
                  className="mt-1 inline-block text-brand hover:underline text-sm"
                  href={mapLink}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Mở trên Google Maps
                </a>
              </div>
            </li>

            <li className="flex items-start gap-3">
              <span className="text-2xl">📞</span>
              <div>
                <div className="font-medium">Số điện thoại</div>
                <a className="text-neutral-600 hover:underline" href="tel:+840123456789">
                  +84 0123 456 789
                </a>
              </div>
            </li>

            <li className="flex items-start gap-3">
              <span className="text-2xl">📧</span>
              <div>
                <div className="font-medium">Email hỗ trợ</div>
                <a className="text-neutral-600 hover:underline" href="mailto:support@yourcompany.com">
                  support@yourcompany.com
                </a>
              </div>
            </li>

            <li className="flex items-start gap-3">
              <span className="text-2xl">🕒</span>
              <div>
                <div className="font-medium">Giờ làm việc</div>
                <div className="text-neutral-600">Thứ 2 - Thứ 7: 08:00 - 18:00</div>
                <div className="text-neutral-600">Chủ nhật: Nghỉ / Hỗ trợ online theo lịch hẹn</div>
              </div>
            </li>
          </ul>
        </div>

        <div className="rounded-xl border border-neutral-200 bg-white overflow-hidden shadow-sm">
          <div className="h-64 sm:h-80 md:h-full">
            <iframe
              title="Bản đồ công ty"
              src={mapEmbed}
              width="100%"
              height="100%"
              className="min-h-[16rem] w-full"
              style={{ border: 0 }}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
          <div className="p-3 border-t border-neutral-100 text-sm">
            <a
              href={mapLink}
              target="_blank"
              rel="noopener noreferrer"
              className="text-brand hover:underline"
            >
              Mở bản đồ lớn trên Google Maps
            </a>
          </div>
        </div>
      </motion.div>
    </section>
  )
}
