import type { SortOrderData, TQueryConfig } from '@/types/common'

export interface video {
  _id: string
  title?: string
  url?: string
  image?: string
  description?: string
  created_at?: string
  updated_at?: string
}

export interface CreatevideoReq {
  title?: string
  url?: string
  image?: string
  description?: string
}

export interface UpdatevideoReq {
  _id: string
  title?: string
  url?: string
  image?: string
  description?: string
}

export interface ListvideoResponsePagination {
  data: video[]
  page: number
  limit: number
  total_pages: number
}

export interface ListvideoReqParams extends Pick<TQueryConfig, 'page' | 'limit'> {
  q?: string
  sort_order?: SortOrderData
}

