import { useEffect, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Link, useSearchParams, useNavigate, createSearchParams } from 'react-router-dom'
import { FileText, PlusCircle, Edit3, Tag, Trash2 } from 'lucide-react'
import tintucApi from '@/apis/tintuc'
import type { tintuc } from '@/types/tintuc'
import type { SuccessResponseApi } from '@/types/common'
import type { ListtintucResponsePagination } from '@/types/tintuc'
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

export default function ManageTinTuc() {
  const [searchParams] = useSearchParams()
  const page = Number(searchParams.get('page') || '1')
  const queryConfig = Object.fromEntries(
    [...searchParams].filter(([k]) => k !== 'page')
  ) as Record<string, string>
  const limit = 5

  const { data, isLoading } = useQuery({
    queryKey: ['admin', 'tintuc', 'list', page, limit, queryConfig],
    queryFn: () =>
      tintucApi.tintucList({
        page: String(page),
        limit: String(limit),
        ...(queryConfig ?? {})
      })
  })

  const payload = (data?.data as SuccessResponseApi<ListtintucResponsePagination> | undefined)?.data
  const items: tintuc[] = payload?.data ?? []
  const totalPage = payload?.total_pages ?? 0

  const searchValue = searchParams.get('title') ?? ''

  // local search input state (sync with url)
  const [q, setQ] = useState(searchValue)
  useEffect(() => {
    setQ(searchValue)
  }, [searchValue])

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
  const [deleteTarget, setDeleteTarget] = useState<tintuc | null>(null)
  const qc = useQueryClient()

  const deleteMutation = useMutation({
    mutationFn: (id: string) => tintucApi.deletetintuc(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin', 'tintuc', 'list'] })
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
      <PageHeader icon={FileText} title="Danh sách Tin tức">
        <SearchBar
          value={q}
          onChange={setQ}
          onSubmit={handleSearch}
          onClear={handleClearSearch}
          placeholder="Tìm tin tức theo tên..."
        />
        <ActionButton to={PATH.ADMIN_TIN_TUC_CREATE} icon={PlusCircle} label="Thêm mới" />
      </PageHeader>

      <GridContainer
        isLoading={isLoading}
        isEmpty={items.length === 0}
        loadingMessage="Đang tải danh sách tin tức..."
        emptyMessage="Không có tin tức nào."
      >
        {items.map((item, index) => (
          <CardWrapper key={item._id} index={index}>
              <div className="flex items-start gap-3 col-span-10 sm:col-span-10">
                {item.image ? (
                  <img
                    src={item.image}
                    alt={item.title}
                    onError={(e) => { ; (e.currentTarget as HTMLImageElement).style.display = 'none' }}
                    className="h-12 w-12 rounded-md object-cover border border-neutral-700 cursor-pointer"
                    onClick={() => setPreviewUrl(item.image || null)}
                  />
                ) : (
                  <div className="h-12 w-12 rounded-md bg-neutral-800 border border-neutral-700 flex items-center justify-center text-neutral-500">
                    <Tag size={16} />
                  </div>
                )}

                <div className="flex-1 min-w-0">
                  <div className="font-medium text-white truncate">{item.title}</div>
                  <div className="text-xs text-neutral-400 line-clamp-2">{item.description || 'Không có mô tả'}</div>

                  {/* mobile meta / quick actions */}
                  <div className="mt-2 flex items-center gap-2 text-xs sm:hidden">
                    <button
                      type="button"
                      onClick={() => setPreviewUrl(item.image || null)}
                      className="inline-flex items-center gap-1 rounded-md bg-neutral-800 px-2 py-1 text-neutral-300"
                    >
                      Xem ảnh
                    </button>
                    <Link to={PATH.ADMIN_TIN_TUC_UPDATE.replace(':id', item._id)} className="inline-flex items-center gap-1 rounded-md bg-neutral-800 px-2 py-1 text-red-400">
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
                  to={PATH.ADMIN_TIN_TUC_UPDATE.replace(':id', item._id)}
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
