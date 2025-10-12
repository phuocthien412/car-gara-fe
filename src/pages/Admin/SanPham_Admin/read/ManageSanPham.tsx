import { useEffect, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Package, PlusCircle, Edit3, Tag, X } from 'lucide-react'
import sanphamApi from '@/apis/sanpham'
import type { sanpham } from '@/types/sanpham'

export default function ManageSanPham() {
  const { data, isLoading } = useQuery({
    queryKey: ['admin', 'sanpham', 'list'],
    queryFn: () => sanphamApi.sanphamList({ page: '1', limit: '50' })
  })

  const items: sanpham[] = (data?.data?.data?.data as sanpham[]) ?? []

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
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2 text-2xl font-semibold">
          <Package className="text-red-500" />
          <span>Danh sách Sản phẩm</span>
        </div>
        <Link
          to="/admin/san-pham/create"
          className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-red-600 to-rose-700 px-4 py-2 text-sm font-medium text-white shadow hover:shadow-[0_0_15px_rgba(255,0,0,0.5)] transition-all duration-200"
        >
          <PlusCircle size={18} />
          Thêm mới
        </Link>
      </div>

      {/* Table container */}
      <div className="overflow-hidden rounded-lg border border-neutral-800 bg-neutral-900/60 backdrop-blur-md shadow">
        {/* Table header */}
        {items.length > 0 && (
          <div className="grid grid-cols-12 gap-3 bg-neutral-800/70 p-3 text-xs md:text-sm font-semibold text-neutral-300 border-b border-neutral-700">
            <div className="col-span-5">Tiêu đề / Mô tả</div>
            <div className="col-span-2">Giá</div>
            <div className="col-span-2">Số lượng</div>
            <div className="col-span-2">Trạng thái</div>
            <div className="col-span-1 text-right">Thao tác</div>
          </div>
        )}

        {/* Loading / Empty state */}
        {isLoading && (
          <div className="p-6 text-sm text-neutral-500 animate-pulse">
            Đang tải danh sách sản phẩm...
          </div>
        )}
        {!isLoading && items.length === 0 && (
          <div className="p-6 text-sm text-neutral-500 text-center">
            Không có sản phẩm nào.
          </div>
        )}

        {/* Table rows */}
        {!isLoading &&
          items.map((item, index) => {
            return (
            <motion.div
              key={item._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="grid grid-cols-12 items-center gap-3 p-4 hover:bg-neutral-800/60 transition-all duration-200 border-b border-neutral-800 last:border-b-0"
            >
              <div className="col-span-5 flex items-start gap-3">
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
                  <div className="text-xs text-neutral-400 line-clamp-2">
                    {item.description || 'Không có mô tả'}
                  </div>
                </div>
              </div>

              <div className="col-span-2 text-xs md:text-sm text-neutral-300">
                {item.price ? `${item.price.toLocaleString('vi-VN')} đ` : '-'}
              </div>

              <div className="col-span-2 text-xs md:text-sm text-neutral-300">
                {item.quantity ?? '-'}
              </div>

              <div className="col-span-2">
                {(item.quantity ?? 0) > 0 ? (
                  <span className="inline-flex items-center rounded-full bg-green-500/20 px-3 py-0.5 text-[11px] md:text-xs font-medium text-green-400">
                    Còn hàng
                  </span>
                ) : (
                  <span className="inline-flex items-center rounded-full bg-red-500/20 px-3 py-0.5 text-[11px] md:text-xs font-medium text-red-400">
                    Hết hàng
                  </span>
                )}
              </div>

              <div className="col-span-1 text-right">
                <Link
                  to={`/admin/san-pham/update/${item._id}`}
                  className="inline-flex items-center gap-1 text-sm text-red-400 hover:text-red-300 transition-colors"
                >
                  <Edit3 size={14} /> Sửa
                </Link>
              </div>
            </motion.div>
          )})}
      </div>

      {/* Image preview modal */}
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
            {/* fallback */}
            <div className="mt-2 text-center text-sm text-neutral-300">
              Nếu ảnh không hiển thị, kiểm tra URL hoặc thử mở trong tab mới.
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
