export interface duan {
    _id: string
    title: string
    description?: string
    price?: number
    image?: string
    created_at: string
    updated_at: string
}

import type { SortOrderData, TQueryConfig } from '@/types/common'

export interface CreateDuAnReq {
  title: string;
  description?: string;
  price?: number;
  image?: string;
}

export interface UpdateDuAnReq {
  _id: string;
  title?: string;
  description?: string;
  price?: number;
  image?: string;
}

export interface ListDuAnResponsePagination {
  data: duan[]
  page: number
  limit: number
  total_pages: number
}

export interface ListDuAnReqParams extends Pick<TQueryConfig, 'page' | 'limit'> {
  q?: string;
  title?: string;
  sort_order?: SortOrderData;
}
