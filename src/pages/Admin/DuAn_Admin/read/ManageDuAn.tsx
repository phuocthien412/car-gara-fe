import { useEffect, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Link, useSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Building2, PlusCircle, Edit3, Tag, X, Trash2 } from 'lucide-react'
import duanApi from '@/apis/duan'
import type { duan } from '@/types/duan'
import type { SuccessResponseApi } from '@/types/common'
import type { ListDuAnResponsePagination } from '@/types/duan'
import Pagination from '@/components/Pagination'

export default function ManageDuAn() {
  const [searchParams] = useSearchParams()
  const page = Number(searchParams.get('page') || '1')
  const limit = 12

  const { data, isLoading } = useQuery({
    queryKey: ['admin', 'duan', 'list', page, limit],
    queryFn: () => duanApi.duanList({ page: String(page), limit: String(limit) })
  })

  const payload = (data?.data as SuccessResponseApi<ListDuAnResponsePagination> | undefined)?.data
  const items: duan[] = payload?.data ?? []
  const totalPage = payload?.total_pages ?? 0

  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const qc = useQueryClient()

  const deleteMutation = useMutation({
    mutationFn: (id: string) => duanApi.deleteDuAn(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin', 'duan', 'list'] })
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
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2 text-lg sm:text-2xl font-semibold">
          <Building2 className="text-red-500" />
          <span>Danh sách Dự án</span>
        </div>

        <Link
          to="/admin/du-an/create"
          className="hidden sm:inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-red-600 to-rose-700 px-4 py-2 text-sm font-medium text-white shadow transition"
        >
          <PlusCircle size={18} />
          Thêm mới
        </Link>

        <Link to="/admin/du-an/create" className="sm:hidden inline-flex items-center justify-center h-10 w-10 rounded-full bg-red-600 text-white" title="Thêm mới">
          <PlusCircle size={18} />
        </Link>
      </div>

      <div className="space-y-3">
        {isLoading && <div className="p-4 text-sm text-neutral-500 animate-pulse">Đang tải danh sách dự án...</div>}
        {!isLoading && items.length === 0 && <div className="p-4 text-sm text-neutral-500 text-center">Không có dự án nào.</div>}

        {!isLoading &&
          items.map((item, index) => (
            <motion.div
              key={item._id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.03 }}
              className="group flex flex-col sm:grid sm:grid-cols-12 gap-3 p-3 sm:p-4 bg-neutral-900/30 rounded-lg border border-neutral-800 hover:shadow hover:bg-neutral-900/50 transition"
            >
              <div className="flex items-start gap-3 col-span-10 sm:col-span-10">
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
                      Mô tả ngắn
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-span-2 mt-3 sm:mt-0 text-right flex items-center justify-end gap-3">
                <Link
                  to={`/admin/du-an/update/${item._id}`}
                  className="inline-flex items-center gap-1 text-sm text-red-400 hover:text-red-300 transition-colors"
                  title="Sửa"
                >
                  <Edit3 size={14} />
                </Link>
                <button
                  type="button"
                  onClick={() => {
                    if (confirm('Bạn có chắc muốn xóa dự án này?')) deleteMutation.mutate(item._id)
                  }}
                  className="inline-flex items-center gap-1 text-sm text-red-500 hover:text-red-300 transition-colors"
                  title="Xóa"
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
            <div className="mt-2 text-center text-sm text-neutral-300">
              Nếu ảnh không hiển thị, kiểm tra URL hoặc thử mở trong tab mới.
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
