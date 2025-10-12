import type { SortOrderData, TQueryConfig } from '@/types/common'
export interface dichvu {
    _id: string
    title: string
    description?: string
    price?: number
    image?: string
    quantity?: number
    in_stock?: boolean
    created_at: string
    updated_at: string
}

export interface CreateDichVuReq {
  title: string;
  description?: string;
  price?: number;
  image?: string; 
  quantity?: number;
  in_stock?: boolean;
}

export interface UpdateDichVuReq {
  _id: string;
  title?: string;
  description?: string;
  price?: number;
  image?: string;
  quantity?: number;
  in_stock?: boolean;
}

export interface ListDichVuResponsePagination {
  data: dichvu[]
  page: number
  limit: number
  total_pages: number
}

export interface ListDichVuReqParams extends Pick<TQueryConfig, 'page' | 'limit'> {
  q?: string;
  sort_order?: SortOrderData;
}
