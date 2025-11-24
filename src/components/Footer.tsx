import { Facebook, Instagram, Twitter, Clock } from 'lucide-react'
import { useContact } from '@/hooks/useQueryData'

export default function Footer() {
  const { data: contact } = useContact()
  const address = contact?.address || 'Địa chỉ đang cập nhật'
  const email = contact?.email || 'support@yourcompany.com'
  const hotline = contact?.hotline || contact?.phone || '0901 234 567'
  const workingHoursText = contact?.working_hours || 'Thứ 2 - Thứ 7: 08:00 - 18:00; Chủ nhật: Nghỉ'
  const workingHours = workingHoursText.split(';').map((s) => s.trim()).filter(Boolean)
  const mapEmbed = `https://www.google.com/maps?q=${encodeURIComponent(address)}&output=embed`
  const mapLink = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`

  return (
    <footer className="mt-20 border-t border-neutral-200/70 bg-neutral-50">
      <div className="container-pad grid gap-10 py-12 md:grid-cols-4">
        <div>
          <div className="text-lg font-semibold text-red-600">H86 THUẬN</div>
          <p className="mt-2 text-sm text-neutral-600">
            Dịch vụ bảo dưỡng, sửa chữa, độ xe và phụ tùng chính hãng. Uy tín – Chuyên nghiệp – Tận tâm.
          </p>
        </div>

        <div>
          <div className="font-semibold text-neutral-800">Liên hệ</div>
          <p className="mt-2 text-sm text-neutral-600">
            Hotline{' '}
            <a href={`tel:+84${hotline.replace(/\s+/g, '')}`} className="font-medium text-neutral-800 hover:text-amber-600">
              {hotline}
            </a>
          </p>
          <p className="text-sm text-neutral-600">
            Email{' '}
            <a href={`mailto:${email}`} className="text-neutral-800 hover:text-amber-600 hover:underline">
              {email}
            </a>
          </p>
          <p className="text-sm text-neutral-600">Địa chỉ: {address}</p>

          <div className="mt-3 text-xs text-neutral-600">
            <a href={mapLink} target="_blank" rel="noopener noreferrer" className="text-amber-600 hover:underline">
              Mở trên Google Maps
            </a>
          </div>
        </div>

        <div>
          <div className="flex items-center gap-2 font-semibold text-neutral-800">
            <Clock className="w-4 h-4" />
            Giờ làm việc
          </div>
          <ul className="mt-3 space-y-1 text-sm text-neutral-600">
            {workingHours.map((h) => (
              <li key={h}>{h}</li>
            ))}
          </ul>
        </div>

        <div>
          <div className="font-semibold text-neutral-800">Kết nối</div>
          <p className="mt-2 text-sm text-neutral-600">Theo dõi chúng tôi trên mạng xã hội:</p>
          <div className="mt-3 flex gap-4 text-neutral-600">
            <a
              aria-label="Facebook"
              href="https://www.facebook.com/truong.bui.minh.thuan"
              target="_blank"
              rel="noopener noreferrer"
              className="transition-colors hover:text-amber-600"
            >
              <Facebook className="w-5 h-5" />
            </a>
            <a
              aria-label="Instagram"
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="transition-colors hover:text-amber-600"
            >
              <Instagram className="w-5 h-5" />
            </a>
            <a
              aria-label="Twitter"
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              className="transition-colors hover:text-amber-600"
            >
              <Twitter className="w-5 h-5" />
            </a>
          </div>
        </div>
      </div>

      <div className="w-full px-0">
        <div className="mx-auto w-full">
          <div className="w-full h-56 md:h-80 lg:h-96">
            <iframe
              title="Bản đồ H86 THUẬN - toàn màn hình"
              src={mapEmbed}
              width="100%"
              height="100%"
              className="w-full h-full border-0"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
          <div className="text-center p-3 text-xs text-neutral-600 border-t border-neutral-100">
            <a href={mapLink} target="_blank" rel="noopener noreferrer" className="text-amber-600 hover:underline">
              Mở bản đồ lớn trên Google Maps
            </a>
          </div>
        </div>
      </div>

      <div className="border-t border-neutral-200 py-4 text-center text-xs text-neutral-500">
        © {new Date().getFullYear()} H86 THUẬN. All rights reserved.
      </div>
    </footer>
  )
}

