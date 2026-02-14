import { useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Pie, Line, Bar } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
} from 'chart.js'
import { useTheme } from '@/contexts/ThemeContext'
import dichvuApi from '@/apis/dichvu'
import sanphamApi from '@/apis/sanpham'
import duanApi from '@/apis/duan'
import tintucApi from '@/apis/tintuc'
import videoApi from '@/apis/video'
import lienheApi from '@/apis/lienhe'
import type { dichvu } from '@/types/dichvu'
import type { sanpham } from '@/types/sanpham'
import type { duan } from '@/types/duan'
import type { tintuc } from '@/types/tintuc'
import type { video } from '@/types/video'
import type { lienhe } from '@/types/lienhe'
import { useNavigate } from 'react-router-dom'
import { Home, Wrench, Package, FolderKanban, Newspaper, Video, Mail, TrendingUp, Boxes, DollarSign } from 'lucide-react'

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
)

export default function AdminDashboard() {
  const { theme } = useTheme()
  const isDark = theme === 'dark'
  const navigate = useNavigate()

  const { data: dvData } = useQuery({ queryKey: ['admin', 'dichvu', 'list'], queryFn: () => dichvuApi.dichvuList({ page: '1', limit: '200' }) })
  const { data: spData } = useQuery({ queryKey: ['admin', 'sanpham', 'list'], queryFn: () => sanphamApi.sanphamList({ page: '1', limit: '200' }) })
  const { data: daData } = useQuery({ queryKey: ['admin', 'duan', 'list'], queryFn: () => duanApi.duanList({ page: '1', limit: '200' }) })
  const { data: ttData } = useQuery({ queryKey: ['admin', 'tintuc', 'list'], queryFn: () => tintucApi.tintucList({ page: '1', limit: '200' }) })
  const { data: vdData } = useQuery({ queryKey: ['admin', 'video', 'list'], queryFn: () => videoApi.videoList({ page: '1', limit: '200' }) })
  const { data: lhData } = useQuery({ queryKey: ['admin', 'lienhe', 'list'], queryFn: () => lienheApi.lienheList({ page: '1', limit: '200' }) })

  const services: dichvu[] = (dvData?.data?.data?.data as dichvu[]) ?? []
  const products: sanpham[] = (spData?.data?.data?.data as sanpham[]) ?? []
  const projects: duan[] = (daData?.data?.data?.data as duan[]) ?? []
  const news: tintuc[] = (ttData?.data?.data?.data as tintuc[]) ?? []
  const videos: video[] = (vdData?.data?.data?.data as video[]) ?? []
  const contacts: lienhe[] = (lhData?.data?.data?.data as lienhe[]) ?? []

  const totalCounts = useMemo(
    () => ({
      services: services.length,
      products: products.length,
      projects: projects.length,
      news: news.length,
      videos: videos.length,
      contacts: contacts.length
    }),
    [services.length, products.length, projects.length, news.length, videos.length, contacts.length]
  )

  // Calculate revenue and inventory stats
  const stats = useMemo(() => {
    const serviceRevenue = services.reduce((sum, item) => sum + (item.price || 0), 0)
    const productRevenue = products.reduce((sum, item) => sum + (item.price || 0) * (item.quantity || 0), 0)
    const projectRevenue = projects.reduce((sum, item) => sum + (item.price || 0), 0)
    const totalRevenue = serviceRevenue + productRevenue + projectRevenue

    const inStockProducts = products.filter((p) => p.in_stock).length
    const inStockServices = services.filter((s) => s.in_stock).length

    return {
      totalRevenue,
      serviceRevenue,
      productRevenue,
      projectRevenue,
      inStockProducts,
      inStockServices
    }
  }, [services, products, projects])

  const textColor = isDark ? '#e6edf3' : '#0f172a'
  const gridColor = isDark ? 'rgba(255,255,255,0.08)' : 'rgba(15,23,42,0.06)'

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value)
  }

  const pieData = useMemo(
    () => ({
      labels: ['Dịch vụ', 'Sản phẩm', 'Dự án', 'Tin tức', 'Video', 'Liên hệ'],
      datasets: [
        {
          data: [totalCounts.services, totalCounts.products, totalCounts.projects, totalCounts.news, totalCounts.videos, totalCounts.contacts],
          backgroundColor: ['#ef4444', '#f97316', '#06b6d4', '#8b5cf6', '#ec4899', '#10b981'],
          hoverOffset: 8,
          borderWidth: 0
        }
      ]
    }),
    [totalCounts]
  )

  const revenueBarData = useMemo(
    () => ({
      labels: ['Dịch vụ', 'Sản phẩm', 'Dự án'],
      datasets: [
        {
          label: 'Giá trị (VNĐ)',
          data: [stats.serviceRevenue, stats.productRevenue, stats.projectRevenue],
          backgroundColor: ['rgba(239, 68, 68, 0.8)', 'rgba(249, 115, 22, 0.8)', 'rgba(6, 182, 212, 0.8)'],
          borderColor: ['#ef4444', '#f97316', '#06b6d4'],
          borderWidth: 2,
          borderRadius: 6
        }
      ]
    }),
    [stats]
  )

  const lineData = useMemo(() => {
    const days = 7
    const labels: string[] = []
    const now = new Date()
    for (let i = days - 1; i >= 0; i--) {
      const d = new Date(now)
      d.setDate(now.getDate() - i)
      labels.push(d.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' }))
    }

    const countFor = (items: Array<{ createdAt?: string | null | undefined }>) => {
      const map = new Array<number>(days).fill(0)
      items.forEach((it) => {
        const cd = it.createdAt ? new Date(it.createdAt) : null
        if (cd && !isNaN(cd.getTime())) {
          const diff = Math.floor((+new Date() - +cd) / (1000 * 60 * 60 * 24))
          const idx = days - 1 - diff
          if (idx >= 0 && idx < days) map[idx]++
        } else {
          map[days - 1]++
        }
      })
      return map
    }

    const servicesCounts = countFor(services as Array<{ createdAt?: string | null | undefined }>)
    const productsCounts = countFor(products as Array<{ createdAt?: string | null | undefined }>)
    const projectsCounts = countFor(projects as Array<{ createdAt?: string | null | undefined }>)
    const newsCounts = countFor(news as Array<{ createdAt?: string | null | undefined }>)
    const videosCounts = countFor(videos as Array<{ createdAt?: string | null | undefined }>)

    return {
      labels,
      datasets: [
        { label: 'Dịch vụ', data: servicesCounts, borderColor: '#ef4444', backgroundColor: 'rgba(239,68,68,0.12)', tension: 0.4, fill: true },
        { label: 'Sản phẩm', data: productsCounts, borderColor: '#f97316', backgroundColor: 'rgba(249,115,22,0.12)', tension: 0.4, fill: true },
        { label: 'Dự án', data: projectsCounts, borderColor: '#06b6d4', backgroundColor: 'rgba(6,182,212,0.12)', tension: 0.4, fill: true },
        { label: 'Tin tức', data: newsCounts, borderColor: '#8b5cf6', backgroundColor: 'rgba(139,92,246,0.12)', tension: 0.4, fill: true },
        { label: 'Video', data: videosCounts, borderColor: '#ec4899', backgroundColor: 'rgba(236,72,153,0.12)', tension: 0.4, fill: true }
      ]
    }
  }, [services, products, projects, news, videos])

  const commonOptions = useMemo(
    () => ({
      responsive: true,
      maintainAspectRatio: true,
      plugins: {
        legend: { 
          position: 'bottom' as const, 
          labels: { 
            color: textColor, 
            padding: 10, 
            font: { size: 11 },
            boxWidth: 12
          } 
        },
        title: { display: false }
      },
      scales: {
        x: { 
          ticks: { 
            color: textColor,
            font: { size: 10 }
          }, 
          grid: { color: gridColor, display: false } 
        },
        y: { 
          ticks: { 
            color: textColor,
            font: { size: 10 }
          }, 
          grid: { color: gridColor } 
        }
      }
    }),
    [textColor, gridColor]
  )

  const revenueBarOptions = useMemo(
    () => ({
      responsive: true,
      maintainAspectRatio: true,
      plugins: {
        legend: { display: false },
        title: { display: false },
        tooltip: {
          callbacks: {
            label: function (context: any) {
              return formatCurrency(context.parsed.y)
            }
          }
        }
      },
      scales: {
        x: { 
          ticks: { 
            color: textColor,
            font: { size: 10 }
          }, 
          grid: { color: gridColor, display: false } 
        },
        y: {
          ticks: {
            color: textColor,
            font: { size: 10 },
            callback: function (value: any) {
              return (value / 1000000).toFixed(0) + 'tr'
            }
          },
          grid: { color: gridColor }
        }
      }
    }),
    [textColor, gridColor]
  )

  return (
    <div className="space-y-4 sm:space-y-5 p-1 sm:p-2">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent">
            Tổng quan Hệ thống
          </h1>
          <p className={`mt-0.5 text-xs ${isDark ? 'text-neutral-400' : 'text-neutral-600'}`}>
            Dashboard quản lý dịch vụ Garage Ô tô
          </p>
        </div>
        <button
          onClick={() => navigate('/')}
          aria-label="Về trang chủ"
          className={`inline-flex items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm font-medium shadow-md transition-all hover:shadow-lg sm:w-auto w-full ${
            isDark
              ? 'bg-gradient-to-r from-neutral-800 to-neutral-700 text-white hover:from-neutral-700 hover:to-neutral-600'
              : 'bg-gradient-to-r from-white to-neutral-50 text-neutral-700 hover:from-neutral-50 hover:to-neutral-100'
          }`}
        >
          <Home size={16} />
          <span>Trang chủ</span>
        </button>
      </div>

      {/* Stats Overview - Compact */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {/* Dịch vụ */}
        <div
          className={`rounded-lg p-3 shadow transition-all hover:shadow-md ${
            isDark ? 'bg-neutral-900/90' : 'bg-white'
          }`}
        >
          <div className="flex items-center gap-2 mb-1">
            <div className="p-1.5 rounded bg-gradient-to-br from-red-500 to-red-600">
              <Wrench className="w-3.5 h-3.5 text-white" />
            </div>
            <span className={`text-xs font-medium ${isDark ? 'text-neutral-400' : 'text-neutral-600'}`}>Dịch vụ</span>
          </div>
          <div className="text-xl font-bold">{totalCounts.services}</div>
          <div className={`text-[10px] ${isDark ? 'text-neutral-500' : 'text-neutral-500'}`}>{stats.inStockServices} khả dụng</div>
        </div>

        {/* Sản phẩm */}
        <div
          className={`rounded-lg p-3 shadow transition-all hover:shadow-md ${
            isDark ? 'bg-neutral-900/90' : 'bg-white'
          }`}
        >
          <div className="flex items-center gap-2 mb-1">
            <div className="p-1.5 rounded bg-gradient-to-br from-orange-500 to-orange-600">
              <Package className="w-3.5 h-3.5 text-white" />
            </div>
            <span className={`text-xs font-medium ${isDark ? 'text-neutral-400' : 'text-neutral-600'}`}>Sản phẩm</span>
          </div>
          <div className="text-xl font-bold">{totalCounts.products}</div>
          <div className={`text-[10px] ${isDark ? 'text-neutral-500' : 'text-neutral-500'}`}>{stats.inStockProducts} còn hàng</div>
        </div>

        {/* Dự án */}
        <div
          className={`rounded-lg p-3 shadow transition-all hover:shadow-md ${
            isDark ? 'bg-neutral-900/90' : 'bg-white'
          }`}
        >
          <div className="flex items-center gap-2 mb-1">
            <div className="p-1.5 rounded bg-gradient-to-br from-cyan-500 to-cyan-600">
              <FolderKanban className="w-3.5 h-3.5 text-white" />
            </div>
            <span className={`text-xs font-medium ${isDark ? 'text-neutral-400' : 'text-neutral-600'}`}>Dự án</span>
          </div>
          <div className="text-xl font-bold">{totalCounts.projects}</div>
          <div className={`text-[10px] ${isDark ? 'text-neutral-500' : 'text-neutral-500'}`}>Đã thực hiện</div>
        </div>

        {/* Tin tức */}
        <div
          className={`rounded-lg p-3 shadow transition-all hover:shadow-md ${
            isDark ? 'bg-neutral-900/90' : 'bg-white'
          }`}
        >
          <div className="flex items-center gap-2 mb-1">
            <div className="p-1.5 rounded bg-gradient-to-br from-purple-500 to-purple-600">
              <Newspaper className="w-3.5 h-3.5 text-white" />
            </div>
            <span className={`text-xs font-medium ${isDark ? 'text-neutral-400' : 'text-neutral-600'}`}>Tin tức</span>
          </div>
          <div className="text-xl font-bold">{totalCounts.news}</div>
          <div className={`text-[10px] ${isDark ? 'text-neutral-500' : 'text-neutral-500'}`}>Bài viết</div>
        </div>

        {/* Video */}
        <div
          className={`rounded-lg p-3 shadow transition-all hover:shadow-md ${
            isDark ? 'bg-neutral-900/90' : 'bg-white'
          }`}
        >
          <div className="flex items-center gap-2 mb-1">
            <div className="p-1.5 rounded bg-gradient-to-br from-pink-500 to-pink-600">
              <Video className="w-3.5 h-3.5 text-white" />
            </div>
            <span className={`text-xs font-medium ${isDark ? 'text-neutral-400' : 'text-neutral-600'}`}>Video</span>
          </div>
          <div className="text-xl font-bold">{totalCounts.videos}</div>
          <div className={`text-[10px] ${isDark ? 'text-neutral-500' : 'text-neutral-500'}`}>Hướng dẫn</div>
        </div>

        {/* Liên hệ */}
        <div
          className={`rounded-lg p-3 shadow transition-all hover:shadow-md ${
            isDark ? 'bg-neutral-900/90' : 'bg-white'
          }`}
        >
          <div className="flex items-center gap-2 mb-1">
            <div className="p-1.5 rounded bg-gradient-to-br from-emerald-500 to-emerald-600">
              <Mail className="w-3.5 h-3.5 text-white" />
            </div>
            <span className={`text-xs font-medium ${isDark ? 'text-neutral-400' : 'text-neutral-600'}`}>Liên hệ</span>
          </div>
          <div className="text-xl font-bold">{totalCounts.contacts}</div>
          <div className={`text-[10px] ${isDark ? 'text-neutral-500' : 'text-neutral-500'}`}>Thông tin</div>
        </div>
      </div>

      {/* Revenue Chart */}
      <div
        className={`rounded-xl p-4 sm:p-5 shadow-lg ${
          isDark ? 'bg-neutral-900/60' : 'bg-white'
        }`}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-3 gap-2">
          <h3 className={`text-sm sm:text-base font-semibold flex items-center gap-2 ${isDark ? 'text-neutral-200' : 'text-neutral-800'}`}>
            <DollarSign className="w-4 h-4" />
            <span className="hidden sm:inline">Tổng giá trị: {formatCurrency(stats.totalRevenue)}</span>
            <span className="sm:hidden">Giá trị: {formatCurrency(stats.totalRevenue)}</span>
          </h3>
        </div>
        <div className="overflow-x-auto">
          <Bar data={revenueBarData} options={revenueBarOptions} />
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div
          className={`lg:col-span-2 rounded-xl p-4 sm:p-5 shadow-lg ${
            isDark ? 'bg-neutral-900/60' : 'bg-white'
          }`}
        >
          <h3 className={`mb-3 text-sm sm:text-base font-semibold flex items-center gap-2 ${isDark ? 'text-neutral-200' : 'text-neutral-800'}`}>
            <TrendingUp className="w-4 h-4" />
            <span className="hidden sm:inline">Xu hướng 7 ngày</span>
            <span className="sm:hidden">Xu hướng</span>
          </h3>
          <Line data={lineData} options={commonOptions} />
        </div>

        <div
          className={`rounded-xl p-4 sm:p-5 shadow-lg ${
            isDark ? 'bg-neutral-900/60' : 'bg-white'
          }`}
        >
          <h3 className={`mb-3 text-sm sm:text-base font-semibold flex items-center gap-2 ${isDark ? 'text-neutral-200' : 'text-neutral-800'}`}>
            <Boxes className="w-4 h-4" />
            Phân bố
          </h3>
          <Pie data={pieData} options={commonOptions} />
        </div>
      </div>
    </div>
  )
}