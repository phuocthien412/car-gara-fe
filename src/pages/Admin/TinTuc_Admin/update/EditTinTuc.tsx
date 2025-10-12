import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import tintucApi from '@/apis/tintuc'
import type { CreatetintucReq, UpdatetintucReq, tintuc } from '@/types/tintuc'
import type { AxiosResponse } from 'axios'
import ImageUrlOrFile from '@/components/ImageUrlOrFile'
import type { SuccessResponseApi } from '@/types/common'

export default function EditTinTuc() {
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()
  const qc = useQueryClient()

  const { data } = useQuery<AxiosResponse<SuccessResponseApi<tintuc>> | null>({
    queryKey: ['admin', 'tintuc', 'detail', id],
    queryFn: () => (id ? tintucApi.tintucDetail(id) : Promise.resolve(null)),
    enabled: Boolean(id)
  })

  const [form, setForm] = useState<CreatetintucReq>({ title: '', description: '', price: undefined, image: '' })

  useEffect(() => {
    const item = (data?.data?.data as tintuc) || undefined
    if (item) {
      setForm({
        title: item.title || '',
        description: item.description || '',
        price: item.price,
        image: item.image || ''
      })
    }
  }, [data])

  const updateMutation = useMutation({
    mutationFn: (payload: UpdatetintucReq) => tintucApi.updatetintuc(payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin', 'tintuc', 'list'] })
      navigate('/admin/tin-tuc')
    }
  })

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (id) updateMutation.mutate({ _id: id, ...form })
  }

  return (
    <div className="min-h-[80vh] rounded-xl bg-neutral-950 text-neutral-100 p-6 shadow-inner border border-neutral-800">
      <div className="mb-4 text-2xl font-semibold">Sửa tin tức</div>
      <form onSubmit={onSubmit} className="space-y-4 rounded-lg border border-neutral-800 bg-neutral-900/60 p-4">
        <div>
          <label className="mb-1 block text-sm text-neutral-300">Tiêu đề</label>
          <input className="w-full rounded border border-neutral-800 bg-neutral-800/60 px-3 py-2 text-neutral-100 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-red-500" value={form.title} onChange={(e) => setForm((s) => ({ ...s, title: e.target.value }))} required />
        </div>
        <div>
          <label className="mb-1 block text-sm text-neutral-300">Mô tả</label>
          <textarea className="w-full rounded border border-neutral-800 bg-neutral-800/60 px-3 py-2 text-neutral-100 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-red-500" rows={4} value={form.description || ''} onChange={(e) => setForm((s) => ({ ...s, description: e.target.value }))} />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <ImageUrlOrFile value={form.image || ''} onChange={(url) => setForm((s) => ({ ...s, image: url }))} />
        </div>
        <div className="flex gap-2">
          <button type="submit" className="rounded-lg bg-gradient-to-r from-red-600 to-rose-700 px-4 py-2 text-white shadow hover:shadow-[0_0_15px_rgba(255,0,0,0.5)] transition-all">Cập nhật</button>
          <button type="button" onClick={() => navigate('/admin/tin-tuc')} className="rounded-lg bg-neutral-800 px-4 py-2 text-neutral-200 border border-neutral-700 hover:bg-neutral-800/70">Hủy</button>
        </div>
      </form>
    </div>
  )
}
