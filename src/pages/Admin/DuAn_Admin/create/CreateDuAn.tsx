import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import duanApi from '@/apis/duan'
import type { CreateDuAnReq } from '@/types/duan'
import ImageUrlOrFile from '@/components/ImageUrlOrFile'

export default function CreateDuAn() {
  const navigate = useNavigate()
  const qc = useQueryClient()

  const [form, setForm] = useState<CreateDuAnReq>({
    title: '',
    description: '',
    price: undefined,
    image: ''
  })

  const createMutation = useMutation({
    mutationFn: (payload: CreateDuAnReq) => duanApi.createDuAn(payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin', 'duan', 'list'] })
      navigate('/admin/du-an')
    }
  })

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    createMutation.mutate(form)
  }

  return (
    <div className="min-h-[80vh] rounded-xl bg-neutral-950 text-neutral-100 p-4 sm:p-6 shadow-inner border border-neutral-800">
      <div className="mb-4 text-xl sm:text-2xl font-semibold">Thêm dự án</div>

      <form onSubmit={onSubmit} className="space-y-4 rounded-lg border border-neutral-800 bg-neutral-900/60 p-4 sm:p-6">
        <div>
          <label className="mb-1 block text-sm text-neutral-300">Tiêu đề</label>
          <input
            className="w-full rounded border border-neutral-800 bg-neutral-800/60 px-3 py-2 text-neutral-100 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-red-500"
            value={form.title}
            onChange={(e) => setForm((s) => ({ ...s, title: e.target.value }))}
            required
            placeholder="Nhập tên dự án"
          />
        </div>

        <div className="grid grid-cols-1 gap-3">
          <ImageUrlOrFile value={form.image || ''} onChange={(url) => setForm((s) => ({ ...s, image: url }))} className="w-full" />

          <div>
            <label className="mb-1 block text-sm text-neutral-300">Mô tả</label>
            <textarea
              className="w-full rounded border border-neutral-800 bg-neutral-800/60 px-3 py-2 text-neutral-100 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-red-500"
              value={form.description || ''}
              onChange={(e) => setForm((s) => ({ ...s, description: e.target.value }))}
              placeholder="Mô tả ngắn cho dự án"
              rows={4}
            />
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <button type="submit" className="w-full sm:w-auto rounded-lg bg-gradient-to-r from-red-600 to-rose-700 px-4 py-2 text-white shadow hover:shadow-[0_0_15px_rgba(255,0,0,0.5)] transition-all">
            Thêm mới
          </button>
          <button type="button" onClick={() => navigate('/admin/du-an')} className="w-full sm:w-auto rounded-lg bg-neutral-800 px-4 py-2 text-neutral-200 border border-neutral-700 hover:bg-neutral-800/70">
            Hủy
          </button>
        </div>
      </form>
    </div>
  )
}
