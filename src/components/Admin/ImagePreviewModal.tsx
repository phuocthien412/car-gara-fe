import { X } from 'lucide-react'

interface ImagePreviewModalProps {
  imageUrl: string
  onClose: () => void
}

/**
 * Reusable image preview modal
 */
export default function ImagePreviewModal({ imageUrl, onClose }: ImagePreviewModalProps) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div className="relative max-h-[90vh] max-w-[90vw]" onClick={(e) => e.stopPropagation()}>
        <button
          onClick={onClose}
          className="absolute right-2 top-2 z-10 inline-flex h-8 w-8 items-center justify-center rounded-full bg-black/40 text-white hover:bg-black/60"
          aria-label="Đóng xem ảnh"
        >
          <X size={16} />
        </button>
        <img
          src={imageUrl}
          alt="preview"
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).style.display = 'none'
          }}
          className="max-h-[80vh] max-w-full rounded-md object-contain shadow-lg bg-neutral-900"
        />
      </div>
    </div>
  )
}
