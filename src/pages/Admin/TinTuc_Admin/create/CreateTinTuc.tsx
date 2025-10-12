import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import tintucApi from '@/apis/tintuc'
import type { CreatetintucReq } from '@/types/tintuc'
import ImageUrlOrFile from '@/components/ImageUrlOrFile'

export default function CreateTinTuc() {
  const navigate = useNavigate()
  const qc = useQueryClient()

  const [form, setForm] = useState<CreatetintucReq>({
    title: '',
    description: '',
    price: undefined,
    image: ''
  })

  const createMutation = useMutation({
    mutationFn: (payload: CreatetintucReq) => tintucApi.createtintuc(payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin', 'tintuc', 'list'] })
      navigate('/admin/tin-tuc')
    }
  })

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    createMutation.mutate(form)
  }

  return (
    <div className="min-h-[80vh] rounded-xl bg-neutral-950 text-neutral-100 p-6 shadow-inner border border-neutral-800">
      <div className="mb-4 text-2xl font-semibold">Thêm tin tức</div>
      <form onSubmit={onSubmit} className="space-y-4 rounded-lg border border-neutral-800 bg-neutral-900/60 p-4">
        <div>
          <label className="mb-1 block text-sm text-neutral-300">Tiêu đề</label>
          <input
            className="w-full rounded border border-neutral-800 bg-neutral-800/60 px-3 py-2 text-neutral-100 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-red-500"
            value={form.title}
            onChange={(e) => setForm((s) => ({ ...s, title: e.target.value }))}
            required
            placeholder="Nhập tiêu đề tin tức"
          />
        </div>
        <ImageUrlOrFile value={form.image || ''} onChange={(url) => setForm((s) => ({ ...s, image: url }))} />
        <div>
          <label className="mb-1 block text-sm text-neutral-300">Mô tả</label>
          <textarea
            className="w-full rounded border border-neutral-800 bg-neutral-800/60 px-3 py-2 text-neutral-100 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-red-500"
            value={form.description || ''}
            onChange={(e) => setForm((s) => ({ ...s, description: e.target.value }))}
            placeholder="Mô tả ngắn cho bài viết"
            rows={4}
          />
        </div>
        <div className="flex gap-2">
          <button type="submit" className="rounded-lg bg-gradient-to-r from-red-600 to-rose-700 px-4 py-2 text-white shadow hover:shadow-[0_0_15px_rgba(255,0,0,0.5)] transition-all">Thêm mới</button>
          <button type="button" onClick={() => navigate('/admin/tin-tuc')} className="rounded-lg bg-neutral-800 px-4 py-2 text-neutral-200 border border-neutral-700 hover:bg-neutral-800/70">Hủy</button>
        </div>
      </form>
    </div>
  )
}
