import { useEffect, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Link, useSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Film, PlusCircle, Edit3, Link2, X, Trash2 } from 'lucide-react'
import videoApi from '@/apis/video'
import type { video } from '@/types/video'
import type { SuccessResponseApi } from '@/types/common'
import type { ListvideoResponsePagination } from '@/types/video'
import Pagination from '@/components/Pagination'
import PATH from '@/constants/path'

export default function ManageVideo() {
  const [searchParams] = useSearchParams()
  const page = Number(searchParams.get('page') || '1')
  const limit = 12

  const { data, isLoading } = useQuery({
    queryKey: ['admin', 'video', 'list', page, limit],
    queryFn: () => videoApi.videoList({ page: String(page), limit: String(limit) })
  })

  const payload = (data?.data as SuccessResponseApi<ListvideoResponsePagination> | undefined)?.data
  const items: video[] = payload?.data ?? []
  const totalPage = payload?.total_pages ?? 0

  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<video | null>(null)
  const qc = useQueryClient()

  const deleteMutation = useMutation({
    mutationFn: (id: string) => videoApi.deletevideo(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin', 'video', 'list'] })
      setDeleteTarget(null)
    }
  })

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setPreviewUrl(null)
        setDeleteTarget(null)
      }
    }
    if (previewUrl || deleteTarget) document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [previewUrl, deleteTarget])

  return (
    <div className="min-h-[80vh] rounded-xl bg-neutral-950 text-neutral-100 p-4 sm:p-6 shadow-inner border border-neutral-800">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2 text-lg sm:text-2xl font-semibold">
          <Film className="text-red-500" />
          <span>Danh sách Video</span>
        </div>

        <Link
          to={PATH.ADMIN_VIDEO_CREATE}
          className="hidden sm:inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-red-600 to-rose-700 px-4 py-2 text-sm font-medium text-white shadow transition"
        >
          <PlusCircle size={18} />
          Thêm mới
        </Link>

        <Link
          to={PATH.ADMIN_VIDEO_CREATE}
          className="sm:hidden inline-flex items-center justify-center h-10 w-10 rounded-full bg-red-600 text-white"
          title="Thêm mới"
        >
          <PlusCircle size={18} />
        </Link>
      </div>

      {/* List */}
      <div className="space-y-3">
        {isLoading && <div className="p-4 text-sm text-neutral-500 animate-pulse">Đang tải danh sách video...</div>}
        {!isLoading && items.length === 0 && <div className="p-4 text-sm text-neutral-500 text-center">Không có video nào.</div>}

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
                    alt={item.title || 'Video'}
                    onError={(e) => { ; (e.currentTarget as HTMLImageElement).style.display = 'none' }}
                    className="h-12 w-12 rounded-md object-cover border border-neutral-700 cursor-pointer"
                    onClick={() => setPreviewUrl(item.image || null)}
                  />
                ) : (
                  <div className="h-12 w-12 rounded-md bg-neutral-800 border border-neutral-700 flex items-center justify-center text-neutral-500">
                    <Film size={16} />
                  </div>
                )}

                <div className="flex-1 min-w-0">
                  <div className="font-medium text-white truncate">{item.title || 'Video'}</div>
                  <div className="text-xs text-neutral-400 line-clamp-2">{item.description || 'Không có mô tả'}</div>

                  {/* mobile meta / quick actions */}
                  <div className="mt-2 flex items-center gap-2 text-xs sm:hidden">
                    {item.url && (
                      <a
                        href={item.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 rounded-md bg-neutral-800 px-2 py-1 text-neutral-300"
                      >
                        <Link2 size={14} /> Xem video
                      </a>
                    )}
                    <Link to={PATH.ADMIN_VIDEO_UPDATE.replace(':id', item._id)} className="inline-flex items-center gap-1 rounded-md bg-neutral-800 px-2 py-1 text-red-400">
                      Sửa
                    </Link>
                    <button
                      type="button"
                      onClick={() => setDeleteTarget(item)}
                      className="inline-flex items-center gap-1 rounded-md bg-neutral-800 px-2 py-1 text-red-400"
                    >
                      Xóa
                    </button>
                  </div>
                </div>
              </div>

              <div className="col-span-2 mt-3 sm:mt-0 text-right flex items-center justify-end gap-2">
                <Link
                  to={PATH.ADMIN_VIDEO_UPDATE.replace(':id', item._id)}
                  title="Sửa"
                  className="inline-flex h-8 w-8 items-center justify-center rounded-md bg-neutral-800 hover:bg-neutral-700 text-red-400 transition-colors"
                >
                  <Edit3 size={14} />
                </Link>

                <button
                  type="button"
                  title="Xóa"
                  onClick={() => setDeleteTarget(item)}
                  className="inline-flex h-8 w-8 items-center justify-center rounded-md bg-neutral-800 hover:bg-red-700 text-red-400 hover:text-white transition-colors"
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
              onError={(e) => { ; (e.currentTarget as HTMLImageElement).style.display = 'none' }}
              className="max-h-[80vh] max-w-full rounded-md object-contain shadow-lg bg-neutral-900"
            />
            <div className="mt-2 text-center text-sm text-neutral-300">
              Nếu ảnh không hiển thị, kiểm tra URL hoặc thử mở trong tab mới.
            </div>
          </div>
        </div>
      )}

      {/* Delete confirmation modal */}
      {deleteTarget && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onClick={() => setDeleteTarget(null)}
          role="dialog"
          aria-modal="true"
        >
          <div className="w-full max-w-lg rounded-lg bg-neutral-900 p-6" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-lg font-semibold">Xác nhận xóa</h3>
            <p className="mt-2 text-sm text-neutral-400">Bạn có chắc muốn xóa video: <strong className="text-white">{deleteTarget.title || 'Video'}</strong>?</p>

            <div className="mt-4 flex justify-end gap-3">
              <button
                onClick={() => setDeleteTarget(null)}
                className="rounded-md px-4 py-2 bg-neutral-800 text-neutral-200 hover:bg-neutral-700"
              >
                Hủy
              </button>
              <button
                onClick={() => deleteMutation.mutate(deleteTarget._id)}
                disabled={deleteMutation.isPending}
                className="rounded-md px-4 py-2 bg-red-600 text-white hover:bg-red-500 disabled:opacity-60"
              >
                {deleteMutation.isPending ? 'Đang xóa...' : 'Xóa'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

