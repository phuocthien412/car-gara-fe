import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import dichvuApi from '@/apis/dichvu'
import type { CreateDichVuReq, UpdateDichVuReq, dichvu } from '@/types/dichvu'
import type { AxiosResponse } from 'axios'
import ImageUrlOrFile from '@/components/ImageUrlOrFile'
import type { SuccessResponseApi } from '@/types/common'
import PATH from '@/constants/path'

export default function EditDichVu() {
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()
  const qc = useQueryClient()

  const { data } = useQuery<AxiosResponse<SuccessResponseApi<dichvu>> | null>({
    queryKey: ['admin', 'dichvu', 'detail', id],
    queryFn: () => (id ? dichvuApi.dichvuDetail(id) : Promise.resolve(null)),
    enabled: Boolean(id)
  })

  const [form, setForm] = useState<CreateDichVuReq>({ title: '', description: '', price: undefined, image: '', quantity: undefined, in_stock: true })

  useEffect(() => {
    const item = (data?.data?.data as dichvu) || undefined
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
    mutationFn: (payload: UpdateDichVuReq) => dichvuApi.updateDichVu(payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin', 'dichvu', 'list'] })
      navigate(PATH.ADMIN_DICH_VU)
    }
  })

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (id) {
      updateMutation.mutate({ _id: id, ...form })
    }
  }

  return (
    <div className="min-h-[80vh] rounded-xl bg-neutral-950 text-neutral-100 p-4 sm:p-6 shadow-inner border border-neutral-800">
      <div className="mb-4 text-xl sm:text-2xl font-semibold">Sửa dịch vụ</div>

      <form onSubmit={onSubmit} className="space-y-4 rounded-lg border border-neutral-800 bg-neutral-900/60 p-4 sm:p-6">
        <div>
          <label className="mb-1 block text-sm text-neutral-300">Tiêu đề</label>
          <input
            className="w-full rounded border border-neutral-800 bg-neutral-800/60 px-3 py-2 text-neutral-100 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-red-500"
            value={form.title}
            onChange={(e) => setForm((s) => ({ ...s, title: e.target.value }))}
            required
          />
        </div>

        <div>
          <label className="mb-1 block text-sm text-neutral-300">Mô tả</label>
          <textarea
            className="w-full rounded border border-neutral-800 bg-neutral-800/60 px-3 py-2 text-neutral-100 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-red-500 min-h-[96px]"
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 items-start">
          <div className="w-full">
            <ImageUrlOrFile value={form.image || ''} onChange={(url) => setForm((s) => ({ ...s, image: url }))} className="w-full" />
          </div>

          <div className="flex items-center gap-2 pt-2 md:pt-6">
            <input id="inStock" type="checkbox" checked={!!form.in_stock} onChange={(e) => setForm((s) => ({ ...s, in_stock: e.target.checked }))} className="h-4 w-4 rounded border-neutral-700 bg-neutral-800 text-red-600 focus:ring-red-500" />
            <label htmlFor="inStock" className="text-sm text-neutral-300">Còn hàng (in_stock)</label>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-3 md:gap-2">
          <button type="submit" className="w-full md:w-auto rounded-lg bg-gradient-to-r from-red-600 to-rose-700 px-4 py-2 text-white shadow hover:shadow-[0_0_15px_rgba(255,0,0,0.5)] transition-all">
            Cập nhật
          </button>
          <button type="button" onClick={() => navigate('/admin/dich-vu')} className="w-full md:w-auto rounded-lg bg-neutral-800 px-4 py-2 text-neutral-200 border border-neutral-700 hover:bg-neutral-800/70">
            Hủy
          </button>
        </div>
      </form>
    </div>
  )
}
