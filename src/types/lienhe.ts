import type { SortOrderData, TQueryConfig } from '@/types/common'

export interface lienhe {
  _id?: string
  name?: string
  hotline?: string
  email?: string
  phone?: string
  address?: string
  working_hours?: string
  created_at?: string
  updated_at?: string 
}

export interface CreateLienHeReq {
  name?: string
  hotline?: string
  email?: string
  phone?: string
  address?: string
  working_hours?: string
}

export interface UpdateLienHeReq extends CreateLienHeReq {
  _id: string
}

export interface ListLienHeResponsePagination {
  data: lienhe[]
  page: number
  limit: number
  total_pages: number
}

export interface ListLienHeReqParams extends Pick<TQueryConfig, 'page' | 'limit'> {
  q?: string
  sort_order?: SortOrderData;
}
