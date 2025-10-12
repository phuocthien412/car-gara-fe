import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import sanphamApi from '@/apis/sanpham'
import type { CreateSanPhamReq } from '@/types/sanpham'
import ImageUrlOrFile from '@/components/ImageUrlOrFile'

export default function CreateSanPham() {
  const navigate = useNavigate()
  const qc = useQueryClient()

  const [form, setForm] = useState<CreateSanPhamReq>({
    title: '',
    description: '',
    price: undefined,
    image: '',
    quantity: undefined,
    in_stock: true
  })

  const createMutation = useMutation({
    mutationFn: (payload: CreateSanPhamReq) => sanphamApi.createSanPham(payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin', 'sanpham', 'list'] })
      navigate('/admin/san-pham')
    }
  })

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    createMutation.mutate(form)
  }

  return (
    <div className="min-h-[80vh] rounded-xl bg-neutral-950 text-neutral-100 p-6 shadow-inner border border-neutral-800">
      <div className="mb-4 text-2xl font-semibold">Thêm sản phẩm</div>
      <form onSubmit={onSubmit} className="space-y-4 rounded-lg border border-neutral-800 bg-neutral-900/60 p-4">
        <div>
          <label className="mb-1 block text-sm text-neutral-300">Tiêu đề</label>
          <input
            className="w-full rounded border border-neutral-800 bg-neutral-800/60 px-3 py-2 text-neutral-100 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-red-500"
            value={form.title}
            onChange={(e) => setForm((s) => ({ ...s, title: e.target.value }))}
            required
            placeholder="Nhập tiêu đề sản phẩm"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm text-neutral-300">Mô tả</label>
          <textarea
            className="w-full rounded border border-neutral-800 bg-neutral-800/60 px-3 py-2 text-neutral-100 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-red-500"
            value={form.description || ''}
            onChange={(e) => setForm((s) => ({ ...s, description: e.target.value }))}
            placeholder="Mô tả ngắn về sản phẩm"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <label className="mb-1 block text-sm text-neutral-300">Giá</label>
            <input
              type="number"
              className="w-full rounded border border-neutral-800 bg-neutral-800/60 px-3 py-2 text-neutral-100 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-red-500"
              value={form.price ?? ''}
              onChange={(e) => setForm((s) => ({ ...s, price: e.target.value ? Number(e.target.value) : undefined }))}
              placeholder="VD: 500000"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm text-neutral-300">Số lượng</label>
            <input
              type="number"
              className="w-full rounded border border-neutral-800 bg-neutral-800/60 px-3 py-2 text-neutral-100 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-red-500"
              value={form.quantity ?? ''}
              onChange={(e) => setForm((s) => ({ ...s, quantity: e.target.value ? Number(e.target.value) : undefined }))}
              placeholder="VD: 10"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <ImageUrlOrFile value={form.image || ''} onChange={(url) => setForm((s) => ({ ...s, image: url }))} />
          <div className="flex items-center gap-2 pt-6">
            <input
              id="inStock"
              type="checkbox"
              checked={!!form.in_stock}
              onChange={(e) => setForm((s) => ({ ...s, in_stock: e.target.checked }))}
              className="h-4 w-4 rounded border-neutral-700 bg-neutral-800 text-red-600 focus:ring-red-500"
            />
            <label htmlFor="inStock" className="text-sm text-neutral-300">Còn hàng</label>
          </div>
        </div>

        <div className="flex gap-2">
          <button type="submit" className="rounded-lg bg-gradient-to-r from-red-600 to-rose-700 px-4 py-2 text-white shadow hover:shadow-[0_0_15px_rgba(255,0,0,0.5)] transition-all">
            Thêm mới
          </button>
          <button
            type="button"
            onClick={() => navigate('/admin/san-pham')}
            className="rounded-lg bg-neutral-800 px-4 py-2 text-neutral-200 border border-neutral-700 hover:bg-neutral-800/70"
          >
            Hủy
          </button>
        </div>
      </form>
    </div>
  )
}

