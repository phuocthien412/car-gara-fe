import { useEffect, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FileText, PlusCircle, Edit3, Tag, X } from 'lucide-react'
import tintucApi from '@/apis/tintuc'
import type { tintuc } from '@/types/tintuc'

export default function ManageTinTuc() {
  const { data, isLoading } = useQuery({
    queryKey: ['admin', 'tintuc', 'list'],
    queryFn: () => tintucApi.tintucList({ page: '1', limit: '50' })
  })

  const items: tintuc[] = (data?.data?.data?.data as tintuc[]) ?? []

  const [previewUrl, setPreviewUrl] = useState<string | null>(null)

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setPreviewUrl(null)
    }
    if (previewUrl) document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [previewUrl])

  return (
    <div className="min-h-[80vh] rounded-xl bg-neutral-950 text-neutral-100 p-6 shadow-inner border border-neutral-800">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2 text-2xl font-semibold">
          <FileText className="text-red-500" />
          <span>Danh sách Tin tức</span>
        </div>
        <Link
          to="/admin/tin-tuc/create"
          className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-red-600 to-rose-700 px-4 py-2 text-sm font-medium text-white shadow hover:shadow-[0_0_15px_rgba(255,0,0,0.5)] transition-all duration-200"
        >
          <PlusCircle size={18} />
          Thêm mới
        </Link>
      </div>

      <div className="overflow-hidden rounded-lg border border-neutral-800 bg-neutral-900/60 backdrop-blur-md shadow">
        {items.length > 0 && (
          <div className="grid grid-cols-12 gap-3 bg-neutral-800/70 p-3 text-xs md:text-sm font-semibold text-neutral-300 border-b border-neutral-700">
            <div className="col-span-10">Tiêu đề / Mô tả</div>
            <div className="col-span-2 text-right">Thao tác</div>
          </div>
        )}

        {isLoading && (
          <div className="p-6 text-sm text-neutral-500 animate-pulse">Đang tải danh sách tin tức...</div>
        )}
        {!isLoading && items.length === 0 && (
          <div className="p-6 text-sm text-neutral-500 text-center">Không có tin tức nào.</div>
        )}

        {!isLoading &&
          items.map((item, index) => (
            <motion.div
              key={item._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="grid grid-cols-12 items-center gap-3 p-4 hover:bg-neutral-800/60 transition-all duration-200 border-b border-neutral-800 last:border-b-0"
            >
              <div className="col-span-10 flex items-start gap-3">
                {item.image ? (
                  <img
                    src={item.image}
                    alt={item.title}
                    onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none' }}
                    className="h-12 w-12 rounded-md object-cover border border-neutral-700 cursor-pointer"
                    onClick={() => setPreviewUrl(item.image || null)}
                  />
                ) : (
                  <div className="h-12 w-12 rounded-md bg-neutral-800 border border-neutral-700 flex items-center justify-center text-neutral-500">
                    <Tag size={16} />
                  </div>
                )}
                <div>
                  <div className="font-medium text-white">{item.title}</div>
                  <div className="text-xs text-neutral-400 line-clamp-1">{item.description || 'Không có mô tả'}</div>
                </div>
              </div>

              <div className="col-span-2 text-right">
                <Link to={`/admin/tin-tuc/update/${item._id}`} className="inline-flex items-center gap-1 text-sm text-red-400 hover:text-red-300 transition-colors">
                  <Edit3 size={14} /> Sửa
                </Link>
              </div>
            </motion.div>
          ))}
      </div>

      {previewUrl && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
          onClick={() => setPreviewUrl(null)}
          role="dialog"
          aria-modal="true"
        >
          <div className="relative max-h-[90vh] max-w-[90vw]" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setPreviewUrl(null)}
              className="absolute right-2 top-2 z-10 inline-flex h-8 w-8 items-center justify-center rounded-full bg-black/40 text-white hover:bg-black/60"
              aria-label="Đóng xem ảnh"
            >
              <X size={16} />
            </button>
            <img
              src={previewUrl}
              alt="preview"
              onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none' }}
              className="max-h-[80vh] max-w-full rounded-md object-contain shadow-lg bg-neutral-900"
            />
            <div className="mt-2 text-center text-sm text-neutral-300">
              Nếu ảnh không hiển thị, kiểm tra URL hoặc thử mở trong tab mới.
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

