import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import videoApi from '@/apis/video'
import type { CreatevideoReq, UpdatevideoReq, video } from '@/types/video'
import type { AxiosResponse } from 'axios'
import ImageUrlOrFile from '@/components/ImageUrlOrFile'
import type { SuccessResponseApi } from '@/types/common'
import PATH from '@/constants/path'

export default function EditVideo() {
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()
  const qc = useQueryClient()

  const { data } = useQuery<AxiosResponse<SuccessResponseApi<video>> | null>({
    queryKey: ['admin', 'video', 'detail', id],
    queryFn: () => (id ? videoApi.videoDetail(id) : Promise.resolve(null)),
    enabled: Boolean(id)
  })

  const [form, setForm] = useState<CreatevideoReq>({ title: '', url: '', image: '', description: '' })

  useEffect(() => {
    const item = (data?.data?.data as video) || undefined
    if (item) {
      setForm({
        title: item.title || '',
        url: item.url || '',
        image: item.image || '',
        description: item.description || ''
      })
    }
  }, [data])

  const updateMutation = useMutation({
    mutationFn: (payload: UpdatevideoReq) => videoApi.updatevideo(payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin', 'video', 'list'] })
      navigate(PATH.ADMIN_VIDEO)
    }
  })

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (id) updateMutation.mutate({ _id: id, ...form })
  }

  return (
    <div className="min-h-[80vh] rounded-xl bg-neutral-950 text-neutral-100 p-4 sm:p-6 shadow-inner border border-neutral-800">
      <div className="mb-4 text-lg sm:text-2xl font-semibold">Sửa video</div>

      <form onSubmit={onSubmit} className="space-y-4 rounded-lg border border-neutral-800 bg-neutral-900/60 p-4 sm:p-6">
        <div>
          <label className="mb-1 block text-sm text-neutral-300">Tiêu đề</label>
          <input
            className="w-full rounded border border-neutral-800 bg-neutral-800/60 px-3 py-2 text-neutral-100 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-red-500"
            value={form.title || ''}
            onChange={(e) => setForm((s) => ({ ...s, title: e.target.value }))}
            placeholder="Tiêu đề video"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <label className="mb-1 block text-sm text-neutral-300">Liên kết video (URL)</label>
            <input
              className="w-full rounded border border-neutral-800 bg-neutral-800/60 px-3 py-2 text-neutral-100 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-red-500"
              value={form.url || ''}
              onChange={(e) => setForm((s) => ({ ...s, url: e.target.value }))}
              placeholder="https://..."
            />
          </div>

          <div>
            <ImageUrlOrFile value={form.image || ''} onChange={(url) => setForm((s) => ({ ...s, image: url }))} className="w-full" />
          </div>
        </div>

        <div>
          <label className="mb-1 block text-sm text-neutral-300">Mô tả</label>
          <textarea
            className="w-full h-full min-h-[120px] rounded border border-neutral-800 bg-neutral-800/60 px-3 py-2 text-neutral-100 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-red-500 resize-vertical"
            rows={6}
            value={form.description || ''}
            onChange={(e) => setForm((s) => ({ ...s, description: e.target.value }))}
            placeholder="Mô tả ngắn cho video"
          />
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <button
            type="submit"
            className="w-full sm:w-auto rounded-lg bg-gradient-to-r from-red-600 to-rose-700 px-4 py-2 text-white shadow hover:shadow-[0_0_15px_rgba(255,0,0,0.5)] transition-all"
            disabled={updateMutation.isPending}
          >
            {updateMutation.isPending ? 'Đang cập nhật...' : 'Cập nhật'}
          </button>

          <button
            type="button"
            onClick={() => navigate(PATH.ADMIN_VIDEO)}
            className="w-full sm:w-auto rounded-lg bg-neutral-800 px-4 py-2 text-neutral-200 border border-neutral-700 hover:bg-neutral-800/70"
          >
            Hủy
          </button>
        </div>
      </form>
    </div>
  )
}

