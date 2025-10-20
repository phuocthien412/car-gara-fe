import { useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import adminApi from '@/apis/admin'
import { getProfileFromLS, filterPayload, isAxiosError } from '@/utils/common'
import type { ErrorResponseApi } from '@/types/common'

export default function ChangePassword() {
  const navigate = useNavigate()
  const profile = getProfileFromLS()
  const userId: string | undefined = profile?._id

  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const mutation = useMutation({
    mutationFn: async () => {
      if (!userId) throw new Error('Không tìm thấy tài khoản hiện tại')
      const body = filterPayload({ id: userId, password: newPassword })
      return adminApi.updateUser(body)
    },
    onSuccess: () => {
      setSuccess('Đổi mật khẩu thành công')
      setError(null)
      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
      setTimeout(() => navigate('/admin'), 1000)
    },
    onError: (err: unknown) => {
      let msg = 'Có lỗi xảy ra'
      if (isAxiosError<ErrorResponseApi<unknown>>(err)) {
        msg = err.response?.data?.message || msg
      } else if (err instanceof Error) {
        msg = err.message
      }
      setError(msg)
      setSuccess(null)
    }
  })

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccess(null)
    if (!currentPassword || !newPassword || !confirmPassword) {
      setError('Vui lòng điền đầy đủ thông tin')
      return
    }
    if (newPassword.length < 6) {
      setError('Mật khẩu mới phải từ 6 ký tự')
      return
    }
    if (newPassword !== confirmPassword) {
      setError('Xác nhận mật khẩu không khớp')
      return
    }
    // Lưu ý: API updateUser không xác thực mật khẩu hiện tại trên server
    // Nếu cần xác thực, có thể gọi login để kiểm tra currentPassword trước khi đổi.
    mutation.mutate()
  }

  return (
    <div className="max-w-md">
      <h2 className="mb-3 text-xl font-semibold">Đổi mật khẩu</h2>
      <form onSubmit={onSubmit} className="space-y-3 rounded-lg border border-neutral-800 bg-neutral-900/60 p-4">
        <div>
          <label className="mb-1 block text-sm text-neutral-300">Mật khẩu hiện tại</label>
          <input
            type="password"
            className="w-full rounded border border-neutral-800 bg-neutral-800/60 px-3 py-2 text-neutral-100 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-red-500"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            placeholder="Nhập mật khẩu hiện tại"
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <label className="mb-1 block text-sm text-neutral-300">Mật khẩu mới</label>
            <input
              type="password"
              className="w-full rounded border border-neutral-800 bg-neutral-800/60 px-3 py-2 text-neutral-100 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-red-500"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Ít nhất 6 ký tự"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm text-neutral-300">Xác nhận mật khẩu</label>
            <input
              type="password"
              className="w-full rounded border border-neutral-800 bg-neutral-800/60 px-3 py-2 text-neutral-100 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-red-500"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Nhập lại mật khẩu mới"
            />
          </div>
        </div>
        {error && <div className="text-sm text-red-400">{error}</div>}
        {success && <div className="text-sm text-green-400">{success}</div>}
        <div className="flex gap-2">
          <button
            type="submit"
            disabled={mutation.isPending}
            className="rounded-lg bg-gradient-to-r from-red-600 to-rose-700 px-4 py-2 text-white disabled:opacity-60"
          >
            {mutation.isPending ? 'Đang lưu...' : 'Cập nhật'}
          </button>
          <button type="button" onClick={() => navigate(-1)} className="rounded-lg border border-neutral-700 bg-neutral-800 px-4 py-2 text-neutral-200">Hủy</button>
        </div>
      </form>
    </div>
  )
}
