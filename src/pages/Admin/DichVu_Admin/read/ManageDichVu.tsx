import { useEffect, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Link, useSearchParams, createSearchParams, useNavigate } from 'react-router-dom'
import { Wrench, PlusCircle, Edit3, Tag, Trash2 } from 'lucide-react'
import dichvuApi from '@/apis/dichvu'
import type { dichvu } from '@/types/dichvu'
import type { SuccessResponseApi } from '@/types/common'
import type { ListDichVuResponsePagination } from '@/types/dichvu'
import Pagination from '@/components/Pagination'
import PATH from '@/constants/path'
import {
  PageLayout,
  PageHeader,
  SearchBar,
  ActionButton,
  StatusBadge,
  CardWrapper,
  GridContainer,
  ImagePreviewModal,
  DeleteConfirmModal
} from '@/components/Admin'

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

  const handleSearch = () => {
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
  }

  const handleClearSearch = () => {
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
  }

  return (
    <PageLayout>
      <PageHeader icon={Wrench} title="Danh sách Dịch vụ">
        <SearchBar
          value={q}
          onChange={setQ}
          onSubmit={handleSearch}
          onClear={handleClearSearch}
          placeholder="Tìm dịch vụ theo tên..."
        />
        <ActionButton to={PATH.ADMIN_DICH_VU_CREATE} icon={PlusCircle} label="Thêm mới" />
      </PageHeader>

      <GridContainer
        isLoading={isLoading}
        isEmpty={items.length === 0}
        loadingMessage="Đang tải danh sách dịch vụ..."
        emptyMessage="Không có dịch vụ nào."
      >
        {items.map((item, index) => (
          <CardWrapper key={item._id} index={index}>
            {/* Left: image */}
            <div className="flex items-start gap-3 col-span-5 sm:col-span-5">
              {item.image ? (
                <img
                  src={item.image}
                  alt={item.title}
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).style.display = 'none'
                  }}
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
                <div className="text-xs text-neutral-400 line-clamp-2 sm:line-clamp-3">
                  {item.description || 'Không có mô tả'}
                </div>

                {/* mobile meta row */}
                <div className="mt-2 flex items-center gap-2 text-xs sm:hidden">
                  <div className="inline-flex items-center rounded-full bg-neutral-800/60 px-2 py-0.5 text-neutral-300">
                    Số lượng: <span className="ml-1 font-medium text-white">{item.quantity ?? '-'}</span>
                  </div>
                  <StatusBadge
                    status={item.quantity && item.quantity > 0 ? 'success' : 'error'}
                    label={item.quantity && item.quantity > 0 ? 'Còn hàng' : 'Hết hàng'}
                  />
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
              <StatusBadge
                status={item.quantity && item.quantity > 0 ? 'success' : 'error'}
                label={item.quantity && item.quantity > 0 ? 'Còn hàng' : 'Hết hàng'}
              />
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
          </CardWrapper>
        ))}
      </GridContainer>

      {totalPage > 1 && (
        <div className="mt-6">
          <Pagination page={page} totalPage={totalPage} />
        </div>
      )}

      {previewUrl && <ImagePreviewModal imageUrl={previewUrl} onClose={() => setPreviewUrl(null)} />}

      {deleteTarget && (
        <DeleteConfirmModal
          itemName={deleteTarget.title}
          onConfirm={() => deleteMutation.mutate(deleteTarget._id)}
          onCancel={() => setDeleteTarget(null)}
          isDeleting={deleteMutation.isPending}
        />
      )}
    </PageLayout>
  )
}

