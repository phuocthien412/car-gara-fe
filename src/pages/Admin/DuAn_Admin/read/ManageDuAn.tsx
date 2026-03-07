import { useEffect, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Link, useSearchParams, useNavigate, createSearchParams } from 'react-router-dom'
import { Building2, PlusCircle, Edit3, Tag, Trash2 } from 'lucide-react'
import duanApi from '@/apis/duan'
import type { duan } from '@/types/duan'
import type { SuccessResponseApi } from '@/types/common'
import type { ListDuAnResponsePagination } from '@/types/duan'
import Pagination from '@/components/Pagination'
import PATH from '@/constants/path'
import {
  PageLayout,
  PageHeader,
  SearchBar,
  ActionButton,
  CardWrapper,
  GridContainer,
  ImagePreviewModal,
  DeleteConfirmModal
} from '@/components/Admin'

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
  const [deleteTarget, setDeleteTarget] = useState<duan | null>(null)
  const qc = useQueryClient()

  const deleteMutation = useMutation({
    mutationFn: (id: string) => duanApi.deleteDuAn(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin', 'duan', 'list'] })
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
          ...Object.fromEntries([...Object.entries(queryConfig)].filter(([k]) => k !== 'title')),
          page: '1'
        }).toString()
      },
      { replace: false }
    )
  }

  return (
    <PageLayout>
      <PageHeader icon={Building2} title="Danh sách Dự án">
        <SearchBar
          value={q}
          onChange={setQ}
          onSubmit={handleSearch}
          onClear={handleClearSearch}
          placeholder="Tìm dự án theo tên..."
        />
        <ActionButton to={PATH.ADMIN_DU_AN_CREATE} icon={PlusCircle} label="Thêm mới" />
      </PageHeader>

      <GridContainer
        isLoading={isLoading}
        isEmpty={items.length === 0}
        loadingMessage="Đang tải danh sách dự án..."
        emptyMessage="Không có dự án nào."
      >
        {items.map((item, index) => (
          <CardWrapper key={item._id} index={index}>
            <div className="flex items-start gap-3 col-span-9 sm:col-span-9">
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

                {item.price && (
                  <div className="mt-2 text-xs text-emerald-400 font-medium sm:hidden">
                    {item.price.toLocaleString('vi-VN')}₫
                  </div>
                )}
              </div>
            </div>

            <div className="hidden sm:flex col-span-2 items-center text-xs md:text-sm text-emerald-400 font-medium">
              {item.price ? `${item.price.toLocaleString('vi-VN')}₫` : '-'}
            </div>

            <div className="col-span-1 mt-3 sm:mt-0 flex items-center justify-end gap-2">
              <Link
                to={PATH.ADMIN_DU_AN_UPDATE.replace('${item._id}', item._id)}
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
        <div className="mt-4 sm:mt-6">
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
