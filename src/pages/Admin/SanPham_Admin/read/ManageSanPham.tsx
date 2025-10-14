import { useEffect, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Link, useSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Package, PlusCircle, Edit3, Tag, X, Trash2 } from 'lucide-react'
import sanphamApi from '@/apis/sanpham'
import type { sanpham } from '@/types/sanpham'
import type { SuccessResponseApi } from '@/types/common'
import type { ListSanPhamResponsePagination } from '@/types/sanpham'
import Pagination from '@/components/Pagination'

export default function ManageSanPham() {
  const [searchParams] = useSearchParams()
  const page = Number(searchParams.get('page') || '1')
  const limit = 12

  const { data, isLoading } = useQuery({
    queryKey: ['admin', 'sanpham', 'list', page, limit],
    queryFn: () => sanphamApi.sanphamList({ page: String(page), limit: String(limit) })
  })

  const payload = (data?.data as SuccessResponseApi<ListSanPhamResponsePagination> | undefined)?.data
  const items: sanpham[] = payload?.data ?? []
  const totalPage = payload?.total_pages ?? 0

  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const qc = useQueryClient()

  const deleteMutation = useMutation({
    mutationFn: (id: string) => sanphamApi.deleteSanPham(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin', 'sanpham', 'list'] })
  })

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setPreviewUrl(null)
    }
    if (previewUrl) document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [previewUrl])

  return (
    <div className="min-h-[80vh] rounded-xl bg-neutral-950 text-neutral-100 p-4 sm:p-6 shadow-inner border border-neutral-800">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2 text-lg sm:text-2xl font-semibold">
          <Package className="text-red-500" />
          <span>Danh sách Sản phẩm</span>
        </div>
        <Link
          to="/admin/san-pham/create"
          className="hidden sm:flex items-center gap-2 rounded-lg bg-gradient-to-r from-red-600 to-rose-700 px-4 py-2 text-sm font-medium text-white shadow transition"
        >
          <PlusCircle size={18} />
          Thêm mới
        </Link>
        <Link to="/admin/san-pham/create" className="sm:hidden inline-flex items-center justify-center h-10 w-10 rounded-full bg-red-600 text-white">
          <PlusCircle size={18} />
        </Link>
      </div>

      <div className="space-y-3">
        {isLoading && <div className="p-4 text-sm text-neutral-500 animate-pulse">Đang tải danh sách sản phẩm...</div>}
        {!isLoading && items.length === 0 && <div className="p-4 text-sm text-neutral-500 text-center">Không có sản phẩm nào.</div>}

        {!isLoading &&
          items.map((item, index) => (
            <motion.div
              key={item._id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.03 }}
              className="group flex flex-col sm:grid sm:grid-cols-12 gap-3 p-3 sm:p-4 bg-neutral-900/30 rounded-lg border border-neutral-800 hover:shadow hover:bg-neutral-900/50 transition"
            >
              <div className="flex items-start gap-3 col-span-5 sm:col-span-5">
                {item.image ? (
                  <img
                    src={item.image}
                    alt={item.title}
                    onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none' }}
                    className="h-14 w-14 rounded-md object-cover border border-neutral-700 cursor-pointer"
                    onClick={() => setPreviewUrl(item.image || null)}
                  />
                ) : (
                  <div className="h-14 w-14 rounded-md bg-neutral-800 border border-neutral-700 flex items-center justify-center text-neutral-500">
                    <Tag size={18} />
                  </div>
                )}
                <div className="flex-1">
                  <div className="font-medium text-white text-sm sm:text-base">{item.title}</div>
                  <div className="text-xs text-neutral-400 line-clamp-2">{item.description || 'Không có mô tả'}</div>

                  <div className="mt-2 flex items-center gap-2 text-xs sm:hidden">
                    <div className="inline-flex items-center rounded-full bg-neutral-800/60 px-2 py-0.5 text-neutral-300">
                      Giá: <span className="ml-1 font-medium text-white">{item.price ? `${item.price.toLocaleString('vi-VN')} đ` : '-'}</span>
                    </div>
                    <div className="inline-flex items-center rounded-full bg-neutral-800/60 px-2 py-0.5 text-neutral-300">
                      SL: <span className="ml-1 font-medium text-white">{item.quantity ?? '-'}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="hidden sm:flex col-span-2 items-center text-xs md:text-sm text-neutral-300">{item.price ? `${item.price.toLocaleString('vi-VN')} đ` : '-'}</div>

              <div className="hidden sm:flex col-span-2 items-center text-xs md:text-sm text-neutral-300">{item.quantity ?? '-'}</div>

              <div className="hidden sm:flex col-span-2 items-center">
                {(item.quantity ?? 0) > 0 ? (
                  <span className="inline-flex items-center rounded-full bg-green-500/20 px-3 py-0.5 text-[11px] md:text-xs font-medium text-green-400">Còn hàng</span>
                ) : (
                  <span className="inline-flex items-center rounded-full bg-red-500/20 px-3 py-0.5 text-[11px] md:text-xs font-medium text-red-400">Hết hàng</span>
                )}
              </div>

              <div className="col-span-1 mt-3 sm:mt-0 flex items-center justify-end gap-2">
                <Link to={`/admin/san-pham/update/${item._id}`} className="inline-flex h-9 w-9 items-center justify-center rounded-md bg-neutral-800 hover:bg-neutral-700 text-red-400 transition-colors">
                  <Edit3 size={14} />
                </Link>
                <button
                  type="button"
                  onClick={() => { if (confirm('Bạn có chắc muốn xóa sản phẩm này?')) deleteMutation.mutate(item._id) }}
                  className="inline-flex h-9 w-9 items-center justify-center rounded-md bg-neutral-800 hover:bg-red-700 text-red-400 hover:text-white transition-colors"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </motion.div>
          ))}
      </div>

      {totalPage > 1 && (
        <div className="mt-6">
          <Pagination page={page} totalPage={totalPage} />
        </div>
      )}

      {/* preview modal */}
      {previewUrl && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4" onClick={() => setPreviewUrl(null)} role="dialog" aria-modal="true">
          <div className="relative max-h-[90vh] max-w-[90vw]" onClick={(e) => e.stopPropagation()}>
            <button onClick={() => setPreviewUrl(null)} className="absolute right-2 top-2 z-10 inline-flex h-8 w-8 items-center justify-center rounded-full bg-black/40 text-white hover:bg-black/60" aria-label="Đóng xem ảnh">
              <X size={16} />
            </button>
            <img src={previewUrl} alt="preview" onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none' }} className="max-h-[80vh] max-w-full rounded-md object-contain shadow-lg bg-neutral-900" />
          </div>
        </div>
      )}
    </div>
  )
}
