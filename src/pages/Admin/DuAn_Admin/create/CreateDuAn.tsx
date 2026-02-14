import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Building2, ArrowLeft } from 'lucide-react'
import duanApi from '@/apis/duan'
import type { CreateDuAnReq } from '@/types/duan'
import ImageUrlOrFile from '@/components/ImageUrlOrFile'
import PATH from '@/constants/path'

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
      navigate(PATH.ADMIN_DU_AN)
    }
  })

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    createMutation.mutate(form)
  }

  return (
    <div className="min-h-[80vh] rounded-xl bg-neutral-950 text-neutral-100 p-3 sm:p-6 shadow-inner border border-neutral-800">
      {/* Header */}
      <div className="flex items-center gap-3 mb-4 sm:mb-6">
        <button
          onClick={() => navigate(PATH.ADMIN_DU_AN)}
          className="inline-flex items-center justify-center h-9 w-9 rounded-lg bg-neutral-900 border border-neutral-800 text-neutral-300 hover:text-white hover:border-neutral-700 transition-colors"
          aria-label="Quay lại"
        >
          <ArrowLeft size={18} />
        </button>
        <div className="flex items-center gap-2">
          <Building2 className="text-red-500" size={24} />
          <h1 className="text-xl sm:text-2xl font-semibold">Thêm dự án mới</h1>
        </div>
      </div>

      <form onSubmit={onSubmit} className="space-y-5 rounded-lg border border-neutral-800 bg-neutral-900/60 p-4 sm:p-6">
        {/* Title */}
        <div>
          <label className="mb-2 block text-sm font-medium text-neutral-300">
            Tiêu đề <span className="text-red-500">*</span>
          </label>
          <input
            className="w-full rounded-lg border border-neutral-700 bg-neutral-800/60 px-4 py-2.5 text-neutral-100 placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
            value={form.title}
            onChange={(e) => setForm((s) => ({ ...s, title: e.target.value }))}
            required
            placeholder="Nhập tên dự án"
          />
        </div>

        {/* Price */}
        <div>
          <label className="mb-2 block text-sm font-medium text-neutral-300">Giá trị dự án</label>
          <input
            type="number"
            className="w-full rounded-lg border border-neutral-700 bg-neutral-800/60 px-4 py-2.5 text-neutral-100 placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
            value={form.price || ''}
            onChange={(e) => {
              const val = e.target.value
              setForm((s) => ({ ...s, price: val ? Number(val) : undefined }))
            }}
            placeholder="VD: 50000000"
            min="0"
          />
          <p className="mt-1 text-xs text-neutral-500">Để trống nếu không muốn hiển thị giá</p>
        </div>

        {/* Image */}
        <div>
          <label className="mb-2 block text-sm font-medium text-neutral-300">Hình ảnh</label>
          <ImageUrlOrFile 
            value={form.image || ''} 
            onChange={(url) => setForm((s) => ({ ...s, image: url }))} 
            className="w-full" 
          />
        </div>

        {/* Description */}
        <div>
          <label className="mb-2 block text-sm font-medium text-neutral-300">Mô tả</label>
          <textarea
            className="w-full rounded-lg border border-neutral-700 bg-neutral-800/60 px-4 py-2.5 text-neutral-100 placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all resize-none"
            value={form.description || ''}
            onChange={(e) => setForm((s) => ({ ...s, description: e.target.value }))}
            placeholder="Mô tả ngắn về dự án"
            rows={5}
          />
        </div>

        {/* Actions */}
        <div className="flex flex-col-reverse sm:flex-row gap-3 pt-2">
          <button 
            type="button" 
            onClick={() => navigate(PATH.ADMIN_DU_AN)} 
            className="w-full sm:w-auto px-6 py-2.5 rounded-lg bg-neutral-800 text-neutral-200 border border-neutral-700 hover:bg-neutral-700 transition-colors font-medium"
          >
            Hủy bỏ
          </button>
          <button 
            type="submit" 
            disabled={createMutation.isPending}
            className="w-full sm:w-auto px-6 py-2.5 rounded-lg bg-gradient-to-r from-red-600 to-rose-700 text-white shadow-lg hover:shadow-red-500/25 hover:scale-[1.02] active:scale-[0.98] transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {createMutation.isPending ? 'Đang xử lý...' : 'Thêm mới'}
          </button>
        </div>
      </form>
    </div>
  )
}
