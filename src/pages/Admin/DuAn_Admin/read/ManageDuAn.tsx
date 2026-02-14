import { useEffect, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Link, useSearchParams, useNavigate, createSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Building2, PlusCircle, Edit3, Tag, X, Trash2 } from 'lucide-react'
import duanApi from '@/apis/duan'
import type { duan } from '@/types/duan'
import type { SuccessResponseApi } from '@/types/common'
import type { ListDuAnResponsePagination } from '@/types/duan'
import Pagination from '@/components/Pagination'
import PATH from '@/constants/path'

export default function ManageDuAn() {
  const [searchParams] = useSearchParams()
  const page = Number(searchParams.get('page') || '1')
  const queryConfig = Object.fromEntries([...searchParams].filter(([k]) => k !== 'page')) as Record<string, string>
  const limit = 5

  const { data, isLoading } = useQuery({
    queryKey: ['admin', 'duan', 'list', page, limit, queryConfig],
    queryFn: () =>
      duanApi.duanList({
        page: String(page),
        limit: String(limit),
        ...(queryConfig ?? {})
      })
  })

  const searchValue = searchParams.get('title') ?? ''
  const [q, setQ] = useState(searchValue)
  useEffect(() => setQ(searchValue), [searchValue])

  const payload = (data?.data as SuccessResponseApi<ListDuAnResponsePagination> | undefined)?.data
  const items: duan[] = payload?.data ?? []
  const totalPage = payload?.total_pages ?? 0
  const navigate = useNavigate()

  useEffect(() => {
    if (payload && totalPage > 0 && page > totalPage) {
      navigate(
        {
          pathname: '',
          search: createSearchParams({ ...queryConfig, page: '1' }).toString()
        },
        { replace: true }
      )
    }
  }, [payload, totalPage, page, queryConfig, navigate])

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
    <div className="min-h-[80vh] rounded-xl bg-neutral-950 text-neutral-100 p-3 sm:p-6 shadow-inner border border-neutral-800">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 mb-4">
        <div className="flex items-center gap-2 text-lg sm:text-2xl font-semibold">
          <Building2 className="text-red-500 shrink-0" />
          <span>Danh sách Dự án</span>
        </div>

        {/* Search + Add */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full sm:w-auto">
          <form
            onSubmit={(e) => {
              e.preventDefault()
              navigate(
                {
                  pathname: '',
                  search: createSearchParams({
                    ...queryConfig,
                    ...(q ? { title: q } : {}),
                    page: '1'
                  }).toString()
                },
                { replace: false }
              )
            }}
            className="flex items-center gap-2 w-full sm:w-auto"
          >
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Tìm dự án theo tên..."
              className="flex-1 sm:w-[280px] rounded-md bg-neutral-800/60 px-3 py-2 text-sm text-neutral-100 placeholder:text-neutral-500 focus:outline-none"
            />
            <button
              type="submit"
              className="hidden sm:inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-red-600 to-rose-700 px-3 py-2 text-sm font-medium text-white"
            >
              Tìm
            </button>
            <button
              type="button"
              onClick={() => {
                setQ('')
                navigate(
                  {
                    pathname: '',
                    search: createSearchParams({
                      ...Object.fromEntries([...Object.entries(queryConfig)].filter(([k]) => k !== 'title')),
                      page: '1'
                    }).toString()
                  },
                  { replace: false }
                )
              }}
              title="Xóa tìm kiếm"
              className="inline-flex items-center justify-center h-9 w-9 rounded-md bg-neutral-800 hover:bg-neutral-700 text-red-400 transition-colors"
            >
              <X size={14} />
            </button>
          </form>

          {/* Add button */}
          <Link
            to={PATH.ADMIN_DU_AN_CREATE}
            className="inline-flex items-center justify-center sm:justify-start gap-2 rounded-lg bg-gradient-to-r from-red-600 to-rose-700 px-3 sm:px-4 py-2 text-sm font-medium text-white shadow"
            title="Thêm mới"
          >
            <PlusCircle size={18} />
            <span className="hidden sm:inline">Thêm mới</span>
          </Link>
        </div>
      </div>

      {/* Loading & Empty States */}
      {isLoading && <div className="p-6 text-center text-neutral-500 animate-pulse">Đang tải danh sách dự án...</div>}
      {!isLoading && items.length === 0 && (
        <div className="p-8 text-center">
          <Building2 className="mx-auto mb-2 text-neutral-700" size={48} />
          <p className="text-neutral-500">Không có dự án nào.</p>
        </div>
      )}

      {/* Desktop Table View (lg+) */}
      {!isLoading && items.length > 0 && (
        <div className="hidden lg:block overflow-x-auto rounded-lg border border-neutral-800">
          <table className="w-full text-sm">
            <thead className="bg-neutral-900/80 border-b border-neutral-800">
              <tr>
                <th className="px-4 py-3 text-left font-medium text-neutral-300">Hình ảnh</th>
                <th className="px-4 py-3 text-left font-medium text-neutral-300">Tiêu đề</th>
                <th className="px-4 py-3 text-left font-medium text-neutral-300">Mô tả</th>
                <th className="px-4 py-3 text-right font-medium text-neutral-300">Giá trị</th>
                <th className="px-4 py-3 text-right font-medium text-neutral-300">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-800">
              {items.map((item, index) => (
                <motion.tr
                  key={item._id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.03 }}
                  className="bg-neutral-900/30 hover:bg-neutral-900/50 transition-colors"
                >
                  <td className="px-4 py-3">
                    {item.image ? (
                      <img
                        src={item.image}
                        alt={item.title}
                        onError={(e) => {
                          (e.currentTarget as HTMLImageElement).style.display = 'none'
                        }}
                        className="h-12 w-12 rounded-md object-cover border border-neutral-700 cursor-pointer hover:scale-110 transition-transform"
                        onClick={() => setPreviewUrl(item.image || null)}
                      />
                    ) : (
                      <div className="h-12 w-12 rounded-md bg-neutral-800 border border-neutral-700 flex items-center justify-center text-neutral-600">
                        <Building2 size={16} />
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-3 font-medium text-white max-w-[200px]">
                    <div className="line-clamp-2">{item.title}</div>
                  </td>
                  <td className="px-4 py-3 text-neutral-400 max-w-[300px]">
                    <div className="line-clamp-2">{item.description || 'Không có mô tả'}</div>
                  </td>
                  <td className="px-4 py-3 text-right text-emerald-400 font-medium whitespace-nowrap">
                    {item.price ? `${item.price.toLocaleString('vi-VN')}₫` : '—'}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        to={PATH.ADMIN_DU_AN_UPDATE.replace('${item._id}', item._id)}
                        className="inline-flex items-center gap-1 px-2 py-1 rounded text-xs text-red-400 hover:bg-red-500/10 transition-colors"
                      >
                        <Edit3 size={14} />
                      </Link>
                      <button
                        type="button"
                        onClick={() => {
                          if (confirm('Bạn có chắc muốn xóa dự án này?')) deleteMutation.mutate(item._id)
                        }}
                        className="inline-flex items-center gap-1 px-2 py-1 rounded text-xs text-red-500 hover:bg-red-500/10 transition-colors"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Mobile Card View (<lg) */}
      {!isLoading && items.length > 0 && (
        <div className="lg:hidden space-y-3">
          {items.map((item, index) => (
            <motion.div
              key={item._id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.03 }}
              className="relative bg-neutral-900/40 rounded-lg border border-neutral-800 overflow-hidden hover:border-neutral-700 transition-colors"
            >
              <div className="p-4">
                <div className="flex gap-3 mb-3">
                  {item.image ? (
                    <img
                      src={item.image}
                      alt={item.title}
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).style.display = 'none'
                      }}
                      className="h-20 w-20 sm:h-24 sm:w-24 rounded-md object-cover border border-neutral-700 cursor-pointer shrink-0"
                      onClick={() => setPreviewUrl(item.image || null)}
                    />
                  ) : (
                    <div className="h-20 w-20 sm:h-24 sm:w-24 rounded-md bg-neutral-800 border border-neutral-700 flex items-center justify-center text-neutral-600 shrink-0">
                      <Building2 size={24} />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-white text-base mb-1 line-clamp-2">{item.title}</h3>
                    {item.price && (
                      <div className="text-emerald-400 font-semibold text-sm mb-1">
                        {item.price.toLocaleString('vi-VN')}₫
                      </div>
                    )}
                    <p className="text-xs text-neutral-400 line-clamp-2">{item.description || 'Không có mô tả'}</p>
                  </div>
                </div>

                <div className="flex gap-2 pt-3 border-t border-neutral-800">
                  <Link
                    to={PATH.ADMIN_DU_AN_UPDATE.replace('${item._id}', item._id)}
                    className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-md text-sm font-medium text-red-400 bg-red-500/10 hover:bg-red-500/20 transition-colors"
                  >
                    <Edit3 size={16} />
                    Chỉnh sửa
                  </Link>
                  <button
                    type="button"
                    onClick={() => {
                      if (confirm('Bạn có chắc muốn xóa dự án này?')) deleteMutation.mutate(item._id)
                    }}
                    className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-md text-sm font-medium text-red-500 bg-red-500/10 hover:bg-red-500/20 transition-colors"
                  >
                    <Trash2 size={16} />
                    Xóa
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {totalPage > 1 && (
        <div className="mt-4 sm:mt-6">
          <Pagination page={page} totalPage={totalPage} />
        </div>
      )}

      {/* Image preview modal */}
      {previewUrl && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-3 sm:p-6"
          onClick={() => setPreviewUrl(null)}
          role="dialog"
          aria-modal="true"
        >
          <div
            className="relative max-h-[90vh] max-w-[90vw] bg-neutral-900 rounded-lg p-2 sm:p-3"
            onClick={(e) => e.stopPropagation()}
          >
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
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).style.display = 'none'
              }}
              className="max-h-[80vh] max-w-full rounded-md object-contain shadow-lg"
            />
            <div className="mt-2 text-center text-xs sm:text-sm text-neutral-400">
              Nếu ảnh không hiển thị, kiểm tra URL hoặc mở trong tab mới.
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
