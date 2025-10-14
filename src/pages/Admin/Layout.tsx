import { NavLink, Outlet, useNavigate, useLocation } from 'react-router-dom'
import { useState, useEffect } from 'react'
import {
  Menu,
  X,
  LogOut,
  Truck,
  Package,
  Newspaper,
  Folder,
  Mail,
  Sun,
  Moon,
  User,
  ChevronLeft,
  ChevronRight,
  LayoutDashboard
} from 'lucide-react'
import adminApi from '@/apis/admin'
import { getRefreshTokenFromLS } from '@/utils/common'
import { useTheme } from '@/contexts/ThemeContext'

export default function AdminLayout() {
  const navigate = useNavigate()
  const location = useLocation()
  const [menuOpen, setMenuOpen] = useState(false) // mobile dropdown
  const { theme, toggle } = useTheme()
  const isDark = theme === 'dark'

  // Thu gọn sidebar (desktop), nhớ trạng thái
  const [collapsed, setCollapsed] = useState<boolean>(() => {
    return typeof window !== 'undefined' && window.localStorage.getItem('adminSidebarCollapsed') === '1'
  })
  useEffect(() => {
    window.localStorage.setItem('adminSidebarCollapsed', collapsed ? '1' : '0')
  }, [collapsed])

  useEffect(() => {
    setMenuOpen(false) // đóng mobile menu khi route đổi
  }, [location.pathname])

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
    { path: '/admin/dich-vu', label: 'Dịch vụ', icon: Truck },
    { path: '/admin/san-pham', label: 'Sản phẩm', icon: Package },
    { path: '/admin/tin-tuc', label: 'Tin tức', icon: Newspaper },
    { path: '/admin/du-an', label: 'Dự án', icon: Folder },
    { path: '/admin/lien-he', label: 'Liên hệ', icon: Mail }
  ]

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    [
      'w-full flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-all duration-200',
      collapsed ? 'justify-center' : 'justify-start text-left',
      isActive
        ? 'bg-red-600 text-white shadow-[0_0_10px_rgba(255,0,0,0.4)]'
        : isDark
          ? 'text-neutral-300 hover:bg-neutral-800 hover:text-white'
          : 'text-neutral-700 hover:bg-neutral-100 hover:text-neutral-900'
    ].join(' ')

  const mobileLinkClass = ({ isActive }: { isActive: boolean }) =>
    `w-full text-left flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-all duration-200 ${
      isActive
        ? 'bg-red-600 text-white shadow-[0_0_10px_rgba(255,0,0,0.4)]'
        : isDark
          ? 'text-neutral-300 hover:bg-neutral-800 hover:text-white'
          : 'text-neutral-700 hover:bg-neutral-100 hover:text-neutral-900'
    }`

  return (
    <div className={`min-h-screen flex ${isDark ? 'bg-neutral-950 text-neutral-100' : 'bg-white text-neutral-900'}`}>
      {/* Sidebar */}
      <aside
        className={[
          'hidden md:flex flex-col shrink-0',
          collapsed ? 'w-16' : 'w-64',
          isDark ? 'bg-neutral-900 border-r border-neutral-800 text-neutral-100' : 'bg-white border-r border-neutral-200 text-neutral-900'
        ].join(' ')}
      >
        <div className={`p-4 flex items-center gap-2 text-lg font-semibold text-red-500 ${collapsed ? 'justify-center' : ''}`}>
          <Truck size={20} />
          <span className={collapsed ? 'sr-only' : 'inline'}>Garage Admin</span>
        </div>

        <nav className="flex-1 px-3 py-2 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon
            return (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === '/admin'}
                className={linkClass}
                title={collapsed ? item.label : undefined}
              >
                <Icon size={18} />
                <span className={collapsed ? 'sr-only' : 'inline'}>{item.label}</span>
              </NavLink>
            )
          })}
        </nav>

      </aside>

      {/* Nội dung + HEADER CHUNG (desktop + mobile) */}
      <div className="flex-1 flex flex-col min-h-screen">
        <header className={`sticky top-0 z-20 backdrop-blur-md border-b ${isDark ? 'border-neutral-800 bg-neutral-900/80' : 'border-neutral-200 bg-white/80'}`}>
          <div className="flex items-center justify-between px-4 py-3">
            {/* Trái: Logo + nút ẩn/hiện tab bar */}
            <div className="flex items-center gap-2 text-lg font-semibold text-red-500">
              <div className="flex items-center">
                {/* Desktop toggle collapse */}
                <button
                  onClick={() => setCollapsed(v => !v)}
                  aria-label={collapsed ? 'Mở sidebar' : 'Thu gọn sidebar'}
                  title={collapsed ? 'Mở sidebar' : 'Thu gọn sidebar'}
                  className={`hidden md:inline-flex h-9 w-9 items-center justify-center rounded-md transition-colors mr-2 ${
                    isDark ? 'text-neutral-300 hover:bg-neutral-800' : 'text-neutral-700 hover:bg-neutral-100'
                  }`}
                >
                  {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
                </button>

                {/* Mobile toggle menu */}
                <button
                  onClick={() => setMenuOpen(v => !v)}
                  aria-label="Mở menu"
                  aria-expanded={menuOpen}
                  className={`inline-flex md:hidden h-9 w-9 items-center justify-center rounded-md transition-colors mr-2 ${
                    isDark ? 'text-neutral-300 hover:bg-neutral-800' : 'text-neutral-700 hover:bg-neutral-100'
                  }`}
                >
                  {menuOpen ? <X size={18} /> : <Menu size={18} />}
                </button>
              </div>

              <Truck size={20} />
              <span>Garage Admin</span>
            </div>

            {/* Phải: Đổi mật khẩu | Sáng/Tối | Đăng xuất */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => navigate('/admin/change-password')}
                aria-label="Đổi mật khẩu"
                className={`inline-flex items-center gap-1 rounded-md border px-3 py-1.5 text-sm font-medium transition-colors ${
                  isDark ? 'border-neutral-700 text-neutral-200 bg-neutral-900 hover:bg-neutral-800' : 'border-neutral-200 text-neutral-700 bg-white hover:bg-neutral-50'
                }`}
              >
                <User size={16} />
                <span className="hidden sm:inline">Đổi mật khẩu</span>
              </button>

              <button
                onClick={toggle}
                className={`inline-flex items-center gap-2 rounded-md border px-3 py-1.5 text-sm font-medium transition-colors ${
                  isDark ? 'border-neutral-700 text-neutral-200 bg-neutral-900 hover:bg-neutral-800' : 'border-neutral-200 text-neutral-700 bg-white hover:bg-neutral-50'
                }`}
              >
                {isDark ? <Sun size={15} /> : <Moon size={15} />}
                <span className="hidden sm:inline">{isDark ? 'Sáng' : 'Tối'}</span>
              </button>

              <button
                onClick={handleLogout}
                className="flex items-center gap-2 rounded-md bg-gradient-to-r from-red-600 to-rose-700 px-3 py-1.5 text-sm font-medium text-white hover:shadow-[0_0_15px_rgba(255,0,0,0.4)] transition-all duration-200"
              >
                <LogOut size={15} />
                <span className="hidden sm:inline">Đăng xuất</span>
              </button>
            </div>
          </div>

          {/* Mobile dropdown menu */}
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
                      className={mobileLinkClass}
                      onClick={() => setMenuOpen(false)}
                    >
                      <Icon size={16} />
                      {item.label}
                    </NavLink>
                  )
                })}
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
    </div>
  )
}
