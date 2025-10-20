import { useEffect, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Link, useSearchParams, createSearchParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Wrench, PlusCircle, Edit3, Tag, X, Trash2 } from 'lucide-react'
import dichvuApi from '@/apis/dichvu'
import type { dichvu } from '@/types/dichvu'
import type { SuccessResponseApi } from '@/types/common'
import type { ListDichVuResponsePagination } from '@/types/dichvu'
import Pagination from '@/components/Pagination'
import PATH from '@/constants/path'

export default function ManageDichVu() {
  const [searchParams] = useSearchParams()
  const page = Number(searchParams.get('page') || '1')
  const limit = 5

  // build queryConfig preserving existing params except page
  const queryConfig = Object.fromEntries(
    [...searchParams].filter(([k]) => k !== 'page')
  ) as Record<string, string>

  const searchValue = searchParams.get('title') ?? ''

  // local search input state (sync with url)
  const [q, setQ] = useState(searchValue)
  useEffect(() => {
    setQ(searchValue)
  }, [searchValue])

  const { data, isLoading } = useQuery({
    queryKey: ['admin', 'dichvu', 'list', page, limit, queryConfig],
    queryFn: () =>
      dichvuApi.dichvuList({
        page: String(page),
        limit: String(limit),
        ...(queryConfig ?? {})
      })
  })
 
  const payload = (data?.data as SuccessResponseApi<ListDichVuResponsePagination> | undefined)?.data
  const items: dichvu[] = payload?.data ?? []
  const totalPage = Number(
    payload?.total_pages ??
      0
  )

  const navigate = useNavigate()

  useEffect(() => {
    if (payload && totalPage > 0 && page > totalPage) {
      navigate(
        {
          pathname: '',
          search: createSearchParams({
            ...queryConfig,
            page: '1'
          }).toString()
        },
        { replace: true }
      )
    }
  }, [payload, totalPage, page, queryConfig, navigate])

  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<dichvu | null>(null)
  const qc = useQueryClient()

  const deleteMutation = useMutation({
    mutationFn: (id: string) => dichvuApi.deleteDichVu(id),
    onSuccess: () => {
      // đảm bảo invalidate tất cả query list có cùng prefix để refetch đúng list + pagination
      qc.invalidateQueries({
        predicate: (query) =>
          Array.isArray(query.queryKey) &&
          query.queryKey[0] === 'admin' &&
          query.queryKey[1] === 'dichvu' &&
          query.queryKey[2] === 'list'
      })
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
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-3">
        <div className="flex items-center gap-2 text-lg sm:text-2xl font-semibold">
          <Wrench className="text-red-500" />
          <span>Danh sách Dịch vụ</span>
        </div>

        {/* search + actions */}
        <div className="flex items-center gap-3 w-full sm:w-auto">
          {/* Inline search form (search by title, reset page = 1) */}
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
            className="flex items-center gap-2"
          >
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Tìm dịch vụ theo tên..."
              className="w-[220px] sm:w-[320px] rounded-md bg-neutral-800/60 px-3 py-2 text-sm text-neutral-100 placeholder:text-neutral-500 focus:outline-none"
              aria-label="Tìm theo tên dịch vụ"
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
                      ...Object.fromEntries(
                        [...Object.entries(queryConfig)].filter(([k]) => k !== 'title')
                      ),
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

          <Link
            to={PATH.ADMIN_DICH_VU_CREATE}
            className="hidden sm:inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-red-600 to-rose-700 px-4 py-2 text-sm font-medium text-white shadow hover:shadow-[0_0_15px_rgba(255,0,0,0.5)] transition-all duration-200"
          >
            <PlusCircle size={18} />
            Thêm mới
          </Link>

          {/* mobile add button */}
          <Link
            to={PATH.ADMIN_DICH_VU_CREATE}
            className="inline-flex sm:hidden items-center justify-center h-10 w-10 rounded-full bg-red-600 text-white shadow"
            title="Thêm mới"
          >
            <PlusCircle size={18} />
          </Link>
        </div>
      </div>

      {/* Table / Cards container */}
      <div className="space-y-3">
        {isLoading && (
          <div className="p-4 text-sm text-neutral-500 animate-pulse">Đang tải danh sách dịch vụ...</div>
        )}

        {!isLoading && items.length === 0 && (
          <div className="p-4 text-sm text-neutral-500 text-center">Không có dịch vụ nào.</div>
        )}

        {!isLoading &&
          items.map((item, index) => (
            <motion.div
              key={item._id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.03 }}
              className="group flex flex-col sm:grid sm:grid-cols-12 gap-3 p-3 sm:p-4 bg-neutral-900/30 rounded-lg border border-neutral-800 hover:shadow hover:bg-neutral-900/50 transition"
            >
              {/* Left: image */}
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
                  <div className="text-xs text-neutral-400 line-clamp-2 sm:line-clamp-3">{item.description || 'Không có mô tả'}</div>

                  {/* mobile meta row */}
                  <div className="mt-2 flex items-center gap-2 text-xs sm:hidden">
                    <div className="inline-flex items-center rounded-full bg-neutral-800/60 px-2 py-0.5 text-neutral-300">
                      Số lượng: <span className="ml-1 font-medium text-white">{item.quantity ?? '-'}</span>
                    </div>
                    <div className={`inline-flex items-center rounded-full px-2 py-0.5 ${((item.quantity ?? 0) > 0) ? 'bg-green-500/20 text-green-300' : 'bg-red-500/20 text-red-300'}`}>
                      {(item.quantity ?? 0) > 0 ? 'Còn hàng' : 'Hết hàng'}
                    </div>
                  </div>
                </div>
              </div>

              {/* Middle (desktop): price / quantity / status */}
              <div className="hidden sm:flex col-span-2 items-center text-xs md:text-sm text-neutral-300">
                {item.price ? `${item.price.toLocaleString('vi-VN')} đ` : '-'}
              </div>

              <div className="hidden sm:flex col-span-2 items-center text-xs md:text-sm text-neutral-300">
                {item.quantity ?? '-'}
              </div>

              <div className="hidden sm:flex col-span-2 items-center">
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

              {/* Actions */}
              <div className="col-span-1 mt-3 sm:mt-0 flex items-center justify-end gap-2">
                <Link
                  to={PATH.ADMIN_DICH_VU_UPDATE.replace('${item._id}', item._id)}
                  title="Sửa"
                  className="inline-flex h-9 w-9 items-center justify-center rounded-md bg-neutral-800 hover:bg-neutral-700 text-red-400 transition-colors"
                >
                  <Edit3 size={14} />
                </Link>

                <button
                  type="button"
                  title="Xóa"
                  onClick={() => setDeleteTarget(item)}
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
          <div className="w-full max-w-md rounded-lg bg-neutral-900 p-5" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-lg font-semibold">Xác nhận xóa</h3>
            <p className="mt-2 text-sm text-neutral-400">Bạn có chắc muốn xóa dịch vụ: <strong className="text-white">{deleteTarget.title}</strong>?</p>

            <div className="mt-5 flex justify-end gap-3">
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

