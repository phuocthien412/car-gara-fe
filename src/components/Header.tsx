import { useState, useEffect } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { Car } from 'lucide-react'
import { useTheme } from '@/contexts/ThemeContext'

export default function Header() {
  const nav = [
    { to: '/', label: 'Trang chủ' },
    { to: '/dich-vu', label: 'Dịch vụ' },
    { to: '/du-an', label: 'Dự án' },
    { to: '/san-pham', label: 'Sản phẩm' },
    // { to: '/kien-thuc', label: 'Kiến thức' },
    { to: '/tin-tuc', label: 'Tin tức' },
    { to: '/lien-he', label: 'Liên hệ' }
  ]

  const [open, setOpen] = useState(false)
  const location = useLocation()
  useEffect(() => setOpen(false), [location.pathname])
  const { theme } = useTheme()
  const isDark = theme === 'dark'

  return (
    <header className={`sticky top-0 z-50 border-b backdrop-blur supports-[backdrop-filter]:bg-white/60 ${isDark ? 'border-neutral-800 bg-neutral-900/80' : 'border-neutral-200 bg-white/80'}`}>
      <div className="container-pad flex h-16 items-center justify-between">
        <NavLink to="/" className="flex items-center gap-3 text-xl font-bold text-brand">
          <Car className="h-6 w-6" aria-hidden />
          Gara Auto Pro
        </NavLink>

        <nav className="hidden gap-6 md:flex">
          {nav.map((n) => (
            <NavLink
              key={n.to}
              to={n.to}
              className={({ isActive }) => `group relative text-sm font-medium transition-colors hover:text-brand ${isActive ? 'text-brand' : isDark ? 'text-neutral-200' : 'text-neutral-700'}`}
            >
              {({ isActive }) => (
                <span className="inline-flex items-center gap-2">
                  <span>{n.label}</span>
                  <span
                    aria-hidden
                    className={`absolute -bottom-1 left-0 h-0.5 w-full origin-left scale-x-0 rounded bg-brand transition-transform duration-300 ${isActive ? 'scale-x-100' : 'group-hover:scale-x-100'}`}
                  />
                </span>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <button
            aria-label="Mở menu"
            onClick={() => setOpen((s) => !s)}
            className={`inline-flex h-10 w-10 items-center justify-center rounded-md md:hidden ${isDark ? 'border border-neutral-700 bg-neutral-900 text-neutral-200' : 'bg-neutral-100 text-neutral-700'}`}
          >
            <span className="sr-only">Toggle menu</span>
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" aria-hidden>
              {open ? (
                <path d="M6 18L18 6M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              ) : (
                <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              )}
            </svg>
          </button>
        </div>
      </div>

      <div className={`md:hidden ${open ? 'block' : 'hidden'} border-t ${isDark ? 'border-neutral-800 bg-neutral-900/95' : 'border-neutral-100 bg-white/95'}`}>
        <div className="flex flex-col gap-1 py-3 px-4">
          {nav.map((n) => (
            <NavLink
              key={n.to}
              to={n.to}
              className={({ isActive }) => `py-2 text-sm font-medium rounded-md px-2 transition-colors ${isActive ? 'text-brand bg-brand/5' : isDark ? 'text-neutral-200 hover:bg-neutral-800' : 'text-neutral-700 hover:bg-neutral-100'}`}
            >
              {n.label}
            </NavLink>
          ))}
        </div>
      </div>
    </header>
  )
}
