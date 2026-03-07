import { useEffect, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Link, useSearchParams } from 'react-router-dom'
import { Film, PlusCircle, Edit3, Link2, Trash2 } from 'lucide-react'
import videoApi from '@/apis/video'
import type { video } from '@/types/video'
import type { SuccessResponseApi } from '@/types/common'
import type { ListvideoResponsePagination } from '@/types/video'
import Pagination from '@/components/Pagination'
import PATH from '@/constants/path'
import {
  PageLayout,
  PageHeader,
  ActionButton,
  CardWrapper,
  GridContainer,
  ImagePreviewModal,
  DeleteConfirmModal
} from '@/components/Admin'

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
    <PageLayout>
      <PageHeader icon={Film} title="Danh sách Video">
        <ActionButton to={PATH.ADMIN_VIDEO_CREATE} icon={PlusCircle} label="Thêm mới" />
      </PageHeader>

      <GridContainer
        isLoading={isLoading}
        isEmpty={items.length === 0}
        loadingMessage="Đang tải danh sách video..."
        emptyMessage="Không có video nào."
      >
        {items.map((item, index) => (
          <CardWrapper key={item._id} index={index}>
            <div className="flex items-start gap-3 col-span-10 sm:col-span-10">
              {item.image ? (
                <img
                  src={item.image}
                  alt={item.title || 'Video'}
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).style.display = 'none'
                  }}
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
                  <Link
                    to={PATH.ADMIN_VIDEO_UPDATE.replace(':id', item._id)}
                    className="inline-flex items-center gap-1 rounded-md bg-neutral-800 px-2 py-1 text-red-400"
                  >
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
          itemName={deleteTarget.title || 'Video'}
          onConfirm={() => deleteMutation.mutate(deleteTarget._id)}
          onCancel={() => setDeleteTarget(null)}
          isDeleting={deleteMutation.isPending}
        />
      )}
    </PageLayout>
  )
}