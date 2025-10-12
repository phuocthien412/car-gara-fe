import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { Menu, X, LogOut, Wrench, Package, FileText, LayoutDashboard, Moon, Sun, UserCog } from 'lucide-react'
import adminApi from '@/apis/admin'
import { getRefreshTokenFromLS } from '@/utils/common'
import { useTheme } from '@/contexts/ThemeContext'

export default function AdminLayout() {
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)
  const { theme, toggle } = useTheme()
  const isDark = theme === 'dark'

  const handleLogout = async () => {
    try {
      const refresh_token = getRefreshTokenFromLS()
      if (refresh_token) await adminApi.logout({ refresh_token })
    } finally {
      navigate('/admin/login', { replace: true })
    }
  }

  const navItems = [
    { path: '/admin', label: 'Tổng quan', icon: LayoutDashboard },
    { path: '/admin/dich-vu', label: 'Dịch vụ', icon: Wrench },
    { path: '/admin/san-pham', label: 'Sản phẩm', icon: Package },
    { path: '/admin/tin-tuc', label: 'Tin tức', icon: FileText },
    { path: '/admin/du-an', label: 'Dự án', icon: FileText }
  ]

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-all duration-200 ${
      isActive
        ? 'bg-red-600 text-white shadow-[0_0_10px_rgba(255,0,0,0.4)]'
        : isDark
          ? 'text-neutral-300 hover:bg-neutral-800 hover:text-white'
          : 'text-neutral-700 hover:bg-neutral-100 hover:text-neutral-900'
    }`

  return (
    <div className={`min-h-screen flex flex-col ${isDark ? 'bg-neutral-950 text-neutral-100' : 'bg-white text-neutral-900'}`}>
      <header className={`sticky top-0 z-20 backdrop-blur-md border-b ${isDark ? 'border-neutral-800 bg-neutral-900/80' : 'border-neutral-200 bg-white/80'}`}>
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 py-3">
          <div className="text-lg md:text-xl font-semibold flex items-center gap-2 text-red-500">
            <Wrench size={20} />
            <span>Garage Admin</span>
          </div>

          <nav className="hidden md:flex items-center gap-2">
            {navItems.map((item) => {
              const Icon = item.icon
              return (
                <NavLink key={item.path} to={item.path} end={item.path === '/admin'} className={linkClass}>
                  <Icon size={16} />
                  {item.label}
                </NavLink>
              )
            })}
          </nav>

          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/admin/change-password')}
              aria-label="Đổi mật khẩu"
              className={`inline-flex items-center gap-1 rounded-md border px-3 py-1.5 text-sm font-medium transition-colors ${isDark ? 'border-neutral-700 text-neutral-200 bg-neutral-900 hover:bg-neutral-800' : 'border-neutral-200 text-neutral-700 bg-white hover:bg-neutral-50'}`}
            >
              <UserCog size={16} />
              <span className="hidden sm:inline">Đổi mật khẩu</span>
            </button>
            <button
              onClick={toggle}
              className={`inline-flex items-center gap-2 rounded-md border px-3 py-1.5 text-sm font-medium transition-colors ${isDark ? 'border-neutral-700 text-neutral-200 bg-neutral-900 hover:bg-neutral-800' : 'border-neutral-200 text-neutral-700 bg-white hover:bg-neutral-50'}`}
            >
              {isDark ? <Sun size={15} /> : <Moon size={15} />}
              {isDark ? 'Sáng' : 'Tối'}
            </button>

            <button
              onClick={() => {
                setMenuOpen(false)
                handleLogout()
              }}
              className="hidden md:inline-flex items-center gap-1 rounded-md bg-gradient-to-r from-red-600 to-rose-700 px-3 py-1.5 text-sm font-medium text-white hover:shadow-[0_0_10px_rgba(255,0,0,0.5)] transition-all duration-200"
            >
              <LogOut size={15} /> Đăng xuất
            </button>

            <button
              onClick={() => setMenuOpen((v) => !v)}
              aria-label="Mở menu"
              className={`md:hidden inline-flex h-9 w-9 items-center justify-center rounded-md border transition-colors ${isDark ? 'border-neutral-700 bg-neutral-900 text-neutral-300 hover:bg-neutral-800' : 'border-neutral-200 bg-white text-neutral-700 hover:bg-neutral-50'}`}
            >
              {menuOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>

        {menuOpen && (
          <div className={`md:hidden border-t backdrop-blur-md shadow-lg animate-fadeInDown ${isDark ? 'border-neutral-800 bg-neutral-900/95' : 'border-neutral-200 bg-white/95'}`}>
            <nav className="flex flex-col p-3 space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon
                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    end={item.path === '/admin'}
                    className={linkClass}
                    onClick={() => setMenuOpen(false)}
                  >
                    <Icon size={16} />
                    {item.label}
                  </NavLink>
                )
              })}
              <button
                onClick={() => {
                  setMenuOpen(false)
                  handleLogout()
                }}
                className="mt-3 flex items-center gap-2 rounded-md bg-gradient-to-r from-red-600 to-rose-700 px-3 py-2 text-sm font-medium text-white hover:shadow-[0_0_15px_rgba(255,0,0,0.4)] transition-all duration-200"
              >
                <LogOut size={15} /> Đăng xuất
              </button>
            </nav>
          </div>
        )}
      </header>

      <main className="flex-1 w-full max-w-7xl mx-auto px-4 md:px-6 py-6">
        <Outlet />
      </main>

      <footer className={`py-3 text-center text-xs ${isDark ? 'border-t border-neutral-800 bg-neutral-900/80 text-neutral-500' : 'border-t border-neutral-200 bg-white/80 text-neutral-600'}`}>
        © {new Date().getFullYear()} Garage Management System
      </footer>
    </div>
  )
}
