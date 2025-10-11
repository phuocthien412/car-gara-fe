export type SortOrderData = 'asc' | 'desc'

export interface SuccessResponseApi<Data> {
  msg: string
  data: Data
}

export interface ValidationErrorResponse<FormData> {
  detail: {
    [K in keyof FormData]?: string
  }
}

export interface ErrorResponseApi<Data> {
  message: string
  data?: Data
}

export interface QueryConfig {
  page?: number | string
  limit?: number | string
}

export type TQueryConfig = {
  [key in keyof QueryConfig]: string | string[]
}

export type ActionType = 'confirm' | 'cancel'
