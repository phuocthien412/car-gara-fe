export interface sanpham {
    _id: string
    title: string
    description?: string
    price?: number
    image?: string
    created_at: string
    updated_at: string
}

import type { SortOrderData, TQueryConfig } from '@/types/common'

export interface CreateSanPhamReq {
  title: string;
  description?: string;
  price?: number;
  image?: string;
}

export interface UpdateSanPhamReq {
  _id: string;
  title?: string;
  description?: string;
  price?: number;
  image?: string;
}

export interface ListSanPhamResponsePagination {
  data: sanpham[]
  page: number
  limit: number
  total_pages: number
}

export interface ListSanPhamReqParams extends Pick<TQueryConfig, 'page' | 'limit'> {
  q?: string;
  sort_order?: SortOrderData;
}
