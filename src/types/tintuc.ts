import type { SortOrderData, TQueryConfig } from '@/types/common'
export interface tintuc {
    _id: string
    title: string
    description?: string
    price?: number
    image?: string
    created_at: string
    updated_at: string
}

export interface CreatetintucReq {
  title: string;
  description?: string;
  price?: number;
  image?: string; 
}

export interface UpdatetintucReq {
  _id: string;
  title?: string;
  description?: string;
  price?: number;
  image?: string;
}

export interface ListtintucResponsePagination {
  data: tintuc[]
  page: number
  limit: number
  total_pages: number
}

export interface ListtintucReqParams extends Pick<TQueryConfig, 'page' | 'limit'> {
  q?: string;
  sort_order?: SortOrderData;
}