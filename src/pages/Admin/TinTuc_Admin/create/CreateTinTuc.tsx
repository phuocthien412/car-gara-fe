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
    <div className="min-h-[80vh] rounded-xl bg-neutral-950 text-neutral-100 p-4 sm:p-6 md:p-8 shadow-inner border border-neutral-800">
      {/* Tiêu đề */}
      <div className="mb-6 text-xl sm:text-2xl font-semibold text-center sm:text-left">
        Thêm tin tức
      </div>

      {/* Form */}
      <form
        onSubmit={onSubmit}
        className="space-y-5 rounded-lg border border-neutral-800 bg-neutral-900/60 p-4 sm:p-6"
      >
        {/* Tiêu đề */}
        <div>
          <label className="mb-1 block text-sm sm:text-base text-neutral-300">
            Tiêu đề
          </label>
          <input
            className="w-full rounded-md border border-neutral-800 bg-neutral-800/60 px-3 py-2 sm:py-2.5 text-neutral-100 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-red-500 transition"
            value={form.title}
            onChange={(e) => setForm((s) => ({ ...s, title: e.target.value }))}
            required
            placeholder="Nhập tiêu đề tin tức"
          />
        </div>

        {/* Ảnh */}
        <ImageUrlOrFile
          value={form.image || ''}
          onChange={(url) => setForm((s) => ({ ...s, image: url }))}
          className="w-full"
        />

        {/* Mô tả */}
        <div>
          <label className="mb-1 block text-sm sm:text-base text-neutral-300">
            Mô tả
          </label>
          <textarea
            className="w-full rounded-md border border-neutral-800 bg-neutral-800/60 px-3 py-2 sm:py-2.5 text-neutral-100 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-red-500 transition"
            value={form.description || ''}
            onChange={(e) => setForm((s) => ({ ...s, description: e.target.value }))}
            placeholder="Mô tả ngắn cho bài viết"
            rows={4}
          />
        </div>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-2 justify-center sm:justify-start pt-2">
          <button
            type="submit"
            className="rounded-lg bg-gradient-to-r from-red-600 to-rose-700 px-4 sm:px-5 py-2 sm:py-2.5 text-white font-medium shadow hover:shadow-[0_0_15px_rgba(255,0,0,0.5)] transition-all disabled:opacity-60"
            disabled={createMutation.isPending}
          >
            {createMutation.isPending ? 'Đang thêm...' : 'Thêm mới'}
          </button>

          <button
            type="button"
            onClick={() => navigate('/admin/tin-tuc')}
            className="rounded-lg bg-neutral-800 px-4 sm:px-5 py-2 sm:py-2.5 text-neutral-200 border border-neutral-700 hover:bg-neutral-800/70 font-medium transition-all"
          >
            Hủy
          </button>
        </div>
      </form>
    </div>
  )
}
