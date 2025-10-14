import { useEffect, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import lienheApi from '@/apis/lienhe'
import type { CreateLienHeReq, UpdateLienHeReq, lienhe } from '@/types/lienhe'

type FormValues = CreateLienHeReq & { _id?: string }

export default function ManageLienHe() {
  const qc = useQueryClient()

  const { data, isLoading } = useQuery<lienhe | undefined>({
    queryKey: ['admin', 'lienhe', 'single'],
    queryFn: async () => {
      const res = await lienheApi.lienheList({ page: '1', limit: '1' })
      const paginated = res.data.data
      const item = (paginated?.data || []).find((d: lienhe) => d && d._id) ?? paginated?.data?.[0]
      return item as unknown as lienhe | undefined
    }
  })

  const [form, setForm] = useState<FormValues>({} as FormValues)

  useEffect(() => {
    if (data) {
      setForm((prev) => ({
        ...prev,
        _id: data._id,
        name: data.name ?? '',
        hotline: data.hotline ?? '',
        email: data.email ?? '',
        phone: data.phone ?? '',
        address: data.address ?? '',
        working_hours: data.working_hours ?? ''
      }))
    }
  }, [data])

  // popup / confirmation state
  const [showConfirm, setShowConfirm] = useState(false)

  const createMutation = useMutation({
    mutationFn: (body: CreateLienHeReq) => lienheApi.createLienHe(body),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin', 'lienhe', 'single'] })
  })

  const updateMutation = useMutation({
    mutationFn: (body: UpdateLienHeReq) => lienheApi.updateLienHe(body),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin', 'lienhe', 'single'] })
  })

  // when form submitted, if updating show confirmation popup
  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const values = form
    if (values._id) {
      setShowConfirm(true) // show popup to confirm update
    } else {
      const body: CreateLienHeReq = {
        name: values.name,
        hotline: values.hotline,
        email: values.email,
        phone: values.phone,
        address: values.address,
        working_hours: values.working_hours
      }
      createMutation.mutate(body)
    }
  }

  const handleConfirmUpdate = () => {
    const values = form
    if (!values._id) {
      setShowConfirm(false)
      return
    }
    const { _id, ...rest } = values as Required<FormValues>
    updateMutation.mutate({ _id, ...rest } as UpdateLienHeReq)
    setShowConfirm(false)
  }

  const handleCancelUpdate = () => setShowConfirm(false)

  // use correct React Query flags
  const saving = createMutation.isPending || updateMutation.isPending

  return (
    <div className="min-h-[60vh] rounded-xl bg-neutral-950 text-neutral-100 p-4 sm:p-6 shadow-inner border border-neutral-800">
      <div className="mb-4 text-2xl font-semibold">Cấu hình Liên hệ</div>
      {isLoading && <div className="text-neutral-400 text-sm">Đang tải...</div>}

      <motion.form
        onSubmit={onSubmit}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid gap-4 sm:grid-cols-2"
      >
        <div className="sm:col-span-2">
          <label className="block text-sm mb-1 text-neutral-300">Tên garage</label>
          <input
            value={form.name || ''}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            className="w-full rounded-md border border-neutral-700 bg-neutral-900 p-2 text-sm outline-none focus:ring-1 focus:ring-red-500"
            placeholder="Gara AUTO BRO"
          />
        </div>

        <div>
          <label className="block text-sm mb-1 text-neutral-300">Hotline</label>
          <input
            value={form.hotline || ''}
            onChange={(e) => setForm((f) => ({ ...f, hotline: e.target.value }))}
            className="w-full rounded-md border border-neutral-700 bg-neutral-900 p-2 text-sm outline-none focus:ring-1 focus:ring-red-500"
            placeholder="0123 456 789"
          />
        </div>
        <div>
          <label className="block text-sm mb-1 text-neutral-300">Điện thoại</label>
          <input
            value={form.phone || ''}
            onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
            className="w-full rounded-md border border-neutral-700 bg-neutral-900 p-2 text-sm outline-none focus:ring-1 focus:ring-red-500"
            placeholder="090x xxx xxx"
          />
        </div>

        <div className="sm:col-span-2">
          <label className="block text-sm mb-1 text-neutral-300">Email</label>
          <input
            type="email"
            value={form.email || ''}
            onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
            className="w-full rounded-md border border-neutral-700 bg-neutral-900 p-2 text-sm outline-none focus:ring-1 focus:ring-red-500"
            placeholder="contact@example.com"
          />
        </div>

        <div className="sm:col-span-2">
          <label className="block text-sm mb-1 text-neutral-300">Địa chỉ</label>
          <input
            value={form.address || ''}
            onChange={(e) => setForm((f) => ({ ...f, address: e.target.value }))}
            className="w-full rounded-md border border-neutral-700 bg-neutral-900 p-2 text-sm outline-none focus:ring-1 focus:ring-red-500"
            placeholder="Số nhà, đường, phường/xã, quận/huyện, tỉnh/thành"
          />
        </div>

        <div className="sm:col-span-2">
          <label className="block text-sm mb-1 text-neutral-300">Giờ làm việc</label>
          <textarea
            value={form.working_hours || ''}
            onChange={(e) => setForm((f) => ({ ...f, working_hours: e.target.value }))}
            rows={3}
            className="w-full rounded-md border border-neutral-700 bg-neutral-900 p-2 text-sm outline-none focus:ring-1 focus:ring-red-500"
            placeholder="VD: Thứ 2 - Thứ 6: 08:00 - 18:00; Thứ 7: 08:00 - 12:00; Chủ nhật: Nghỉ"
          />
        </div>

        <div className="sm:col-span-2 flex items-center gap-3">
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 rounded-md bg-gradient-to-r from-red-600 to-rose-700 px-4 py-2 text-sm font-medium text-white disabled:opacity-60"
          >
            {data?._id ? 'Cập nhật' : 'Tạo mới'}
          </button>
          {saving && <span className="text-xs text-neutral-400">Đang lưu...</span>}
        </div>
      </motion.form>

      {/* 🧾 BẢNG QUAN SÁT - Dark mode */}
      <div className="mt-6 rounded-xl border border-neutral-800 bg-neutral-900 p-4 shadow-inner">
       

        {!data && <div className="text-sm text-neutral-400">Không có dữ liệu liên hệ.</div>}
        {data && (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-neutral-200">
              <tbody>
                <tr className="border-t border-neutral-800">
                  <td className="py-2 font-medium w-40 text-neutral-400">ID</td>
                  <td className="py-2">{data._id}</td>
                </tr>
                <tr className="border-t border-neutral-800">
                  <td className="py-2 font-medium text-neutral-400">Tên garage</td>
                  <td className="py-2">{data.name ?? '-'}</td>
                </tr>
                <tr className="border-t border-neutral-800">
                  <td className="py-2 font-medium text-neutral-400">Hotline</td>
                  <td className="py-2">{data.hotline ?? '-'}</td>
                </tr>
                <tr className="border-t border-neutral-800">
                  <td className="py-2 font-medium text-neutral-400">Email</td>
                  <td className="py-2">{data.email ?? '-'}</td>
                </tr>
                <tr className="border-t border-neutral-800">
                  <td className="py-2 font-medium text-neutral-400">Điện thoại</td>
                  <td className="py-2">{data.phone ?? '-'}</td>
                </tr>
                <tr className="border-t border-neutral-800">
                  <td className="py-2 font-medium text-neutral-400">Địa chỉ</td>
                  <td className="py-2">{data.address ?? '-'}</td>
                </tr>
                <tr className="border-t border-neutral-800">
                  <td className="py-2 font-medium text-neutral-400">Giờ làm việc</td>
                  <td className="py-2 whitespace-pre-line">{data.working_hours ?? '-'}</td>
                </tr>
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Confirmation popup */}
      {showConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50" onClick={handleCancelUpdate} />
          <div className="relative z-10 w-full max-w-md rounded-lg bg-white p-5 text-neutral-900 shadow-lg">
            <h3 className="mb-3 text-lg font-semibold">Xác nhận cập nhật</h3>
            <p className="mb-4 text-sm text-neutral-700">Bạn có chắc chắn muốn cập nhật thông tin liên hệ này?</p>
            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={handleCancelUpdate}
                className="rounded-md border px-3 py-1 text-sm text-neutral-700 hover:bg-neutral-100"
              >
                Hủy
              </button>
              <button
                type="button"
                onClick={handleConfirmUpdate}
                disabled={saving}
                className="rounded-md bg-red-600 px-3 py-1 text-sm font-medium text-white disabled:opacity-60"
              >
                Xác nhận
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
