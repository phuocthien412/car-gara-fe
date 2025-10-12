import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import adminApi from '@/apis/admin'
import type { LoginAdminReqBody } from '@/types/admin'
import { isAxiosUnprocessableEntityError } from '@/utils/common'
import { CarFront } from 'lucide-react'
import { validateEmail, validatePassword } from '@/utils/validation'

export default function AdminLogin() {
  const navigate = useNavigate()
  const location = useLocation() as { state?: { from?: Location } }
  const [form, setForm] = useState<LoginAdminReqBody>({ email: '', password: '' })
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string>('')
  const [fieldErrors, setFieldErrors] = useState<{ email?: string; password?: string }>({})

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setForm((s) => ({ ...s, [name]: value }))

    if (name === 'email') {
      setFieldErrors((p) => ({ ...p, email: validateEmail(value) || '' }))
    } else if (name === 'password') {
      setFieldErrors((p) => ({ ...p, password: validatePassword(value) || '' }))
    }
  }

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setError('')

    const emailErr = validateEmail(form.email)
    const passwordErr = validatePassword(form.password)
    if (emailErr || passwordErr) {
      setFieldErrors({ email: emailErr || '', password: passwordErr || '' })
      setSubmitting(false)
      return
    }

    try {
      await adminApi.login(form)
      const redirectTo = location.state?.from?.pathname || '/admin'
      navigate(redirectTo, { replace: true })
    } catch (err) {
      if (isAxiosUnprocessableEntityError(err)) {
        // @ts-expect-error any
        setError(err.response?.data?.message || 'Đăng nhập thất bại')
      } else {
        setError('Đăng nhập thất bại, vui lòng thử lại')
      }
    } finally {
      setSubmitting(false)
    }
  }

  const hasFieldErrors = Boolean(fieldErrors.email || fieldErrors.password)

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-neutral-900 overflow-hidden">
      {/* 🔥 Background gradient + overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-black via-neutral-900 to-red-900 opacity-95"></div>
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1502877338535-766e1452684a?auto=format&fit=crop&w=1600&q=80')] bg-cover bg-center opacity-25"></div>

      {/* Card container */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="relative z-10 w-full max-w-md rounded-2xl bg-neutral-900/80 backdrop-blur-md p-8 shadow-[0_0_30px_rgba(255,0,0,0.4)] border border-red-700/30"
      >
        <div className="flex flex-col items-center mb-6">
          <div className="flex items-center gap-2 text-3xl font-bold text-red-500">
            <CarFront className="h-8 w-8 text-red-500" />
            <span>Garage Admin</span>
          </div>
          <p className="text-sm text-neutral-400 mt-1">
            Đăng nhập để quản lý hệ thống gara
          </p>
        </div>

        {error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mb-4 rounded-lg bg-red-100/10 border border-red-600 px-4 py-2 text-sm text-red-400"
          >
            {error}
          </motion.div>
        )}

        <form onSubmit={onSubmit} className="space-y-5">
          <div>
            <label
              htmlFor="email"
              className="mb-1 block text-sm font-medium text-neutral-300"
            >
              Email đăng nhập
            </label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={onChange}
              required
              className="w-full rounded-lg border border-neutral-700 px-3 py-2.5 bg-neutral-800/70 text-neutral-100 placeholder-neutral-500 focus:ring-2 focus:ring-red-600 focus:border-red-600 outline-none transition-all duration-200"
            />
            {fieldErrors.email && (
              <p className="mt-1 text-sm text-red-500">{fieldErrors.email}</p>
            )}
          </div>

          <div>
            <label
              htmlFor="password"
              className="mb-1 block text-sm font-medium text-neutral-300"
            >
              Mật khẩu
            </label>
            <input
              id="password"
              name="password"
              type="password"
              placeholder="••••••••"
              value={form.password}
              onChange={onChange}
              required
              className="w-full rounded-lg border border-neutral-700 px-3 py-2.5 bg-neutral-800/70 text-neutral-100 placeholder-neutral-500 focus:ring-2 focus:ring-red-600 focus:border-red-600 outline-none transition-all duration-200"
            />
            {fieldErrors.password && (
              <p className="mt-1 text-sm text-red-500">{fieldErrors.password}</p>
            )}
          </div>

          <motion.button
            type="submit"
            disabled={submitting || hasFieldErrors}
            whileTap={{ scale: 0.97 }}
            className="w-full rounded-lg bg-gradient-to-r from-red-600 to-rose-700 py-2.5 text-white font-semibold shadow-lg hover:shadow-[0_0_15px_rgba(255,0,0,0.5)] transition-all duration-200 disabled:opacity-70"
          >
            {submitting ? 'Đang đăng nhập...' : 'Đăng nhập'}
          </motion.button>
        </form>

        <div className="mt-6 text-center text-xs text-neutral-500">
          © {new Date().getFullYear()} <span className="text-red-500">Garage Management System</span>
        </div>
      </motion.div>
    </div>
  )
}
