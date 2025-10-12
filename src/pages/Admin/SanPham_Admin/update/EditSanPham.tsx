import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import sanphamApi from '@/apis/sanpham'
import type { CreateSanPhamReq, UpdateSanPhamReq, sanpham } from '@/types/sanpham'
import type { AxiosResponse } from 'axios'
import ImageUrlOrFile from '@/components/ImageUrlOrFile'
import type { SuccessResponseApi } from '@/types/common'

export default function EditSanPham() {
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()
  const qc = useQueryClient()

  const { data } = useQuery<AxiosResponse<SuccessResponseApi<sanpham>> | null>({
    queryKey: ['admin', 'sanpham', 'detail', id],
    queryFn: () => (id ? sanphamApi.sanphamDetail(id) : Promise.resolve(null)),
    enabled: Boolean(id)
  })

  const [form, setForm] = useState<CreateSanPhamReq>({
    title: '',
    description: '',
    price: undefined,
    image: '',
    quantity: undefined,
    in_stock: true
  })

  useEffect(() => {
    const item = (data?.data?.data as sanpham) || undefined
    if (item) {
      setForm({
        title: item.title || '',
        description: item.description || '',
        price: item.price,
        image: item.image || '',
        quantity: item.quantity,
        in_stock: item.in_stock ?? true
      })
    }
  }, [data])

  const updateMutation = useMutation({
    mutationFn: (payload: UpdateSanPhamReq) => sanphamApi.updateSanPham(payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin', 'sanpham', 'list'] })
      navigate('/admin/san-pham')
    }
  })

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (id) {
      updateMutation.mutate({ _id: id, ...form })
    }
  }

  return (
    <div className="min-h-[80vh] rounded-xl bg-neutral-950 text-neutral-100 p-6 shadow-inner border border-neutral-800">
      <div className="mb-4 text-2xl font-semibold">Sửa sản phẩm</div>
      <form onSubmit={onSubmit} className="space-y-4 rounded-lg border border-neutral-800 bg-neutral-900/60 p-4">
        <div>
          <label className="mb-1 block text-sm text-neutral-300">Tiêu đề</label>
          <input
            className="w-full rounded border border-neutral-800 bg-neutral-800/60 px-3 py-2 text-neutral-100 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-red-500"
            value={form.title}
            onChange={(e) => setForm((s) => ({ ...s, title: e.target.value }))}
            required
          />
        </div>
        <ImageUrlOrFile value={form.image || ''} onChange={(url) => setForm((s) => ({ ...s, image: url }))} />

        <div>
          <label className="mb-1 block text-sm text-neutral-300">Mô tả</label>
          <textarea
            className="w-full rounded border border-neutral-800 bg-neutral-800/60 px-3 py-2 text-neutral-100 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-red-500"
            value={form.description || ''}
            onChange={(e) => setForm((s) => ({ ...s, description: e.target.value }))}
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
            />
          </div>

          <div>
            <label className="mb-1 block text-sm text-neutral-300">Số lượng (quantity)</label>
            <input
              type="number"
              className="w-full rounded border border-neutral-800 bg-neutral-800/60 px-3 py-2 text-neutral-100 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-red-500"
              value={form.quantity ?? ''}
              onChange={(e) => setForm((s) => ({ ...s, quantity: e.target.value ? Number(e.target.value) : undefined }))}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <label className="mb-1 block text-sm text-neutral-300">Ảnh (URL)</label>
            <input
              className="w-full rounded border border-neutral-800 bg-neutral-800/60 px-3 py-2 text-neutral-100 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-red-500"
              value={form.image || ''}
              onChange={(e) => setForm((s) => ({ ...s, image: e.target.value }))}
            />
          </div>

          <div className="flex items-center gap-2 pt-6">
            <input
              id="inStock"
              type="checkbox"
              checked={!!form.in_stock}
              onChange={(e) => setForm((s) => ({ ...s, in_stock: e.target.checked }))}
              className="h-4 w-4 rounded border-neutral-700 bg-neutral-800 text-red-600 focus:ring-red-500"
            />
            <label htmlFor="inStock" className="text-sm text-neutral-300">Còn hàng (in_stock)</label>
          </div>
        </div>

        <div className="flex gap-2">
          <button
            type="submit"
            className="rounded-lg bg-gradient-to-r from-red-600 to-rose-700 px-4 py-2 text-white shadow hover:shadow-[0_0_15px_rgba(255,0,0,0.5)] transition-all"
          >
            Cập nhật
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
