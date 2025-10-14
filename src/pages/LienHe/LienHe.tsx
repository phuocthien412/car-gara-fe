import { motion } from 'framer-motion'
import { MapPin, Phone, Mail, Clock, Map, ExternalLink } from 'lucide-react'
import { useContact } from '@/hooks/useQueryData'

export default function LienHe() {
  const { data: contact } = useContact()
  const address = contact?.address || 'Địa chỉ đang cập nhật'
  const hotline = contact?.hotline || contact?.phone || '0123 456 789'
  const email = contact?.email || ''
  const workingHours = contact?.working_hours || 'Thứ 2 - Thứ 7: 08:00 - 18:00; Chủ nhật: Nghỉ'
  const mapEmbed = `https://www.google.com/maps?q=${encodeURIComponent(address)}&output=embed`
  const mapLink = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`

  // Chuẩn hóa số điện thoại -> tel:+84xxxx (bỏ ký tự không phải số và số 0 đầu)
  const telHref = (() => {
    const digits = String(hotline).replace(/\D/g, '')
    const withoutLeading0 = digits.replace(/^0/, '')
    return `tel:+84${withoutLeading0}`
  })()

  return (
    <section className="container-pad py-10">
      <h1 className="mb-6 text-3xl font-bold">Liên hệ</h1>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="mx-auto grid gap-6 md:grid-cols-2"
      >
        {/* Thông tin liên hệ */}
        <div className="rounded-xl border border-neutral-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-xl font-semibold">Thông tin liên hệ trực tiếp</h2>

          <ul className="space-y-4 text-sm">
            <li className="flex items-start gap-3">
              <span className="mt-0.5 inline-flex h-9 w-9 items-center justify-center rounded-full bg-neutral-100 ring-1 ring-neutral-200 text-brand">
                <MapPin size={18} />
              </span>
              <div>
                <div className="font-medium">Địa chỉ văn phòng</div>
                <div className="text-neutral-600">{address}</div>
                <a
                  className="mt-1 inline-flex items-center gap-1 text-brand hover:underline text-sm"
                  href={mapLink}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Xem trên Google Maps <ExternalLink size={14} />
                </a>
              </div>
            </li>

            <li className="flex items-start gap-3">
              <span className="mt-0.5 inline-flex h-9 w-9 items-center justify-center rounded-full bg-neutral-100 ring-1 ring-neutral-200 text-brand">
                <Phone size={18} />
              </span>
              <div>
                <div className="font-medium">Số điện thoại</div>
                <a className="text-neutral-600 hover:underline" href={telHref}>
                  {hotline}
                </a>
              </div>
            </li>

            {email && (
              <li className="flex items-start gap-3">
                <span className="mt-0.5 inline-flex h-9 w-9 items-center justify-center rounded-full bg-neutral-100 ring-1 ring-neutral-200 text-brand">
                  <Mail size={18} />
                </span>
                <div>
                  <div className="font-medium">Email</div>
                  <a className="text-neutral-600 hover:underline" href={`mailto:${email}`}>
                    {email}
                  </a>
                </div>
              </li>
            )}

            <li className="flex items-start gap-3">
              <span className="mt-0.5 inline-flex h-9 w-9 items-center justify-center rounded-full bg-neutral-100 ring-1 ring-neutral-200 text-brand">
                <Clock size={18} />
              </span>
              <div>
                <div className="font-medium">Giờ làm việc</div>
                <div className="text-neutral-600 whitespace-pre-line">{workingHours}</div>
              </div>
            </li>
          </ul>
        </div>

        {/* Bản đồ */}
        <div className="rounded-xl border border-neutral-200 bg-white overflow-hidden shadow-sm">
          <div className="flex items-center gap-2 border-b border-neutral-100 p-3 text-sm font-medium">
            <Map size={16} className="text-brand" />
            <span>Bản đồ</span>
          </div>
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
              className="inline-flex items-center gap-1 text-brand hover:underline"
            >
              Mở bản đồ lớn trên Google Maps <ExternalLink size={14} />
            </a>
          </div>
        </div>
      </motion.div>
    </section>
  )
}
