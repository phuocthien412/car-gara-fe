import { useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Pie, Line } from 'react-chartjs-2'
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
import type { dichvu } from '@/types/dichvu'
import type { sanpham } from '@/types/sanpham'
import type { duan } from '@/types/duan'
import type { tintuc } from '@/types/tintuc'

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

  const { data: dvData } = useQuery({ queryKey: ['admin', 'dichvu', 'list'], queryFn: () => dichvuApi.dichvuList({ page: '1', limit: '200' }) })
  const { data: spData } = useQuery({ queryKey: ['admin', 'sanpham', 'list'], queryFn: () => sanphamApi.sanphamList({ page: '1', limit: '200' }) })
  const { data: daData } = useQuery({ queryKey: ['admin', 'duan', 'list'], queryFn: () => duanApi.duanList({ page: '1', limit: '200' }) })
  const { data: ttData } = useQuery({ queryKey: ['admin', 'tintuc', 'list'], queryFn: () => tintucApi.tintucList({ page: '1', limit: '200' }) })

  const services: dichvu[] = (dvData?.data?.data?.data as dichvu[]) ?? []
  const products: sanpham[] = (spData?.data?.data?.data as sanpham[]) ?? []
  const projects: duan[] = (daData?.data?.data?.data as duan[]) ?? []
  const news: tintuc[] = (ttData?.data?.data?.data as tintuc[]) ?? []

  const totalCounts = useMemo(
    () => ({
      services: services.length,
      products: products.length,
      projects: projects.length,
      news: news.length
    }),
    [services.length, products.length, projects.length, news.length]
  )

  const textColor = isDark ? '#e6edf3' : '#0f172a'
  const gridColor = isDark ? 'rgba(255,255,255,0.08)' : 'rgba(15,23,42,0.06)'

  const pieData = useMemo(
    () => ({
      labels: ['Dịch vụ', 'Sản phẩm', 'Dự án', 'Tin tức'],
      datasets: [
        {
          data: [totalCounts.services, totalCounts.products, totalCounts.projects, totalCounts.news],
          backgroundColor: ['#ef4444', '#f97316', '#06b6d4', '#8b5cf6'],
          hoverOffset: 6
        }
      ]
    }),
    [totalCounts]
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

    return {
      labels,
      datasets: [
        { label: 'Dịch vụ', data: servicesCounts, borderColor: '#ef4444', backgroundColor: 'rgba(239,68,68,0.12)', tension: 0.3 },
        { label: 'Sản phẩm', data: productsCounts, borderColor: '#f97316', backgroundColor: 'rgba(249,115,22,0.12)', tension: 0.3 },
        { label: 'Dự án', data: projectsCounts, borderColor: '#06b6d4', backgroundColor: 'rgba(6,182,212,0.12)', tension: 0.3 },
        { label: 'Tin tức', data: newsCounts, borderColor: '#8b5cf6', backgroundColor: 'rgba(139,92,246,0.12)', tension: 0.3 }
      ]
    }
  }, [services, products, projects, news])

  const commonOptions = useMemo(
    () => ({
      responsive: true,
      plugins: {
        legend: { position: 'bottom' as const, labels: { color: textColor } },
        title: { display: false, color: textColor }
      },
      scales: {
        x: { ticks: { color: textColor }, grid: { color: gridColor } },
        y: { ticks: { color: textColor }, grid: { color: gridColor } }
      }
    }),
    [textColor, gridColor]
  )

  const cardStatClass = isDark
    ? 'rounded-lg border border-neutral-800 bg-neutral-900/40 p-4'
    : 'rounded-lg border border-neutral-200 bg-white/80 p-4'

  const panelClass = isDark
    ? 'rounded-lg border border-neutral-800 bg-neutral-900/60 p-4'
    : 'rounded-lg border border-neutral-200 bg-white/80 p-4'

  return (
    <div className="space-y-6">
      <div>
        <h1 className="mb-2 text-2xl font-semibold">Tổng quan</h1>
        <p className={`text-sm ${isDark ? 'text-neutral-400' : 'text-neutral-600'}`}>Thống kê nhanh: Dịch vụ, Sản phẩm, Dự án, Tin tức.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className={cardStatClass}>
          <div className={`text-sm ${isDark ? 'text-neutral-400' : 'text-neutral-500'}`}>Dịch vụ</div>
          <div className="mt-2 text-2xl font-semibold">{totalCounts.services}</div>
        </div>
        <div className={cardStatClass}>
          <div className={`text-sm ${isDark ? 'text-neutral-400' : 'text-neutral-500'}`}>Sản phẩm</div>
          <div className="mt-2 text-2xl font-semibold">{totalCounts.products}</div>
        </div>
        <div className={cardStatClass}>
          <div className={`text-sm ${isDark ? 'text-neutral-400' : 'text-neutral-500'}`}>Dự án</div>
          <div className="mt-2 text-2xl font-semibold">{totalCounts.projects}</div>
        </div>
        <div className={cardStatClass}>
          <div className={`text-sm ${isDark ? 'text-neutral-400' : 'text-neutral-500'}`}>Tin tức</div>
          <div className="mt-2 text-2xl font-semibold">{totalCounts.news}</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className={`col-span-2 ${panelClass}`}>
          <h3 className={`mb-3 text-sm font-medium ${isDark ? 'text-neutral-300' : 'text-neutral-700'}`}>Xu hướng trong 7 ngày</h3>
          <Line data={lineData} options={commonOptions} />
        </div>

        <div className={panelClass}>
          <h3 className={`mb-3 text-sm font-medium ${isDark ? 'text-neutral-300' : 'text-neutral-700'}`}>Phân bố nội dung</h3>
          <Pie data={pieData} options={commonOptions} />
        </div>
      </div>
    </div>
  )
}

