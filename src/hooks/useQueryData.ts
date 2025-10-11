import { useQuery } from '@tanstack/react-query'
import dichvuApi from '@/apis/dichvu'
import sanphamApi from '@/apis/sanpham'
import duanApi from '@/apis/duan'
import tintucApi from '@/apis/tintuc'
import type { SuccessResponseApi } from '@/types/common'
import type { ListDichVuResponsePagination } from '@/types/dichvu'
import type { ListSanPhamResponsePagination } from '@/types/sanpham'
import type { ListDuAnResponsePagination } from '@/types/duan'
import type { ListtintucResponsePagination } from '@/types/tintuc'
import type { dichvu } from '@/types/dichvu'
import type { sanpham } from '@/types/sanpham'
import type { duan } from '@/types/duan'
import type { tintuc } from '@/types/tintuc'

export type CardItem = { id: string; title: string; description?: string; price?: number; image?: string }



export function useProjects() {
  return useQuery<CardItem[]>({
    queryKey: ['projects'],
    queryFn: async () => {
      const res = await duanApi.duanList({ page: '1', limit: '8' })
      const data = (res.data as SuccessResponseApi<ListDuAnResponsePagination>).data
      return data.data.map((d) => ({
        id: d._id,
        title: d.title,
        description: d.description,
        image: d.image
      }))
    }
  })
}

export function useProducts() {
  return useQuery<CardItem[]>({
    queryKey: ['products'],
    queryFn: async () => {
      const res = await sanphamApi.sanphamList({ page: '1', limit: '9' })
      const data = (res.data as SuccessResponseApi<ListSanPhamResponsePagination>).data
      return data.data.map((p) => ({
        id: p._id,
        title: p.title,
        description: p.description,
        price: p.price,
        image: p.image
      }))
    }
  })
}

export function usePosts() {
  return useQuery<CardItem[]>({
    queryKey: ['posts'],
    queryFn: async () => {
      const res = await tintucApi.tintucList({ page: '1', limit: '6' })
      const data = (res.data as SuccessResponseApi<ListtintucResponsePagination>).data
      return data.data.map((p) => ({
        id: p._id,
        title: p.title,
        description: p.description,
        image: p.image
      }))
    }
  })
}

export function useServices() {
  return useQuery<CardItem[]>({
    queryKey: ['services'],
    queryFn: async () => {
      const res = await dichvuApi.dichvuList({ page: '1', limit: '12' })
      const data = (res.data as SuccessResponseApi<ListDichVuResponsePagination>).data
      return data.data.map((s) => ({
        id: s._id,
        title: s.title,
        description: s.description,
        price: s.price,
        image: s.image
      }))
    }
  })
}

export function useServiceDetail(id?: string) {
  return useQuery<dichvu | undefined>({
    queryKey: ['service', id],
    enabled: Boolean(id),
    queryFn: async () => {
      if (!id) return undefined
      const res = await dichvuApi.dichvuDetail(id)
      const data = res.data as SuccessResponseApi<dichvu>
      return data.data
    }
  })
}

export function useProductDetail(id?: string) {
  return useQuery<sanpham | undefined>({
    queryKey: ['product', id],
    enabled: Boolean(id),
    queryFn: async () => {
      if (!id) return undefined
      const res = await sanphamApi.sanphamDetail(id)
      const data = res.data as SuccessResponseApi<sanpham>
      return data.data
    }
  })
}

export function useProjectDetail(id?: string) {
  return useQuery<duan | undefined>({
    queryKey: ['project', id],
    enabled: Boolean(id),
    queryFn: async () => {
      if (!id) return undefined
      const res = await duanApi.duanDetail(id)
      const data = res.data as SuccessResponseApi<duan>
      return data.data
    }
  })
}

export function usePostDetail(id?: string) {
  return useQuery<tintuc | undefined>({
    queryKey: ['post', id],
    enabled: Boolean(id),
    queryFn: async () => {
      if (!id) return undefined
      const res = await tintucApi.tintucDetail(id)
      const data = res.data as SuccessResponseApi<tintuc>
      return data.data
    }
  })
}
