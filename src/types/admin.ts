import type { SortOrderData, SuccessResponseApi, TQueryConfig } from '@/types/common'
export interface Admin {
  _id: string
  email: string
  is_master: boolean
  forgot_password_token: string | null
  trang_thai: string
  ho_va_ten?: string
  sdt?: string
  password?: string
  vai_tro?: string
  ngay_sinh?: string | Date
  ngay_tao_tai_khoan?: string | Date
  ngay_cap_nhat_tai_khoan?: string | Date
  permissions?: Permissions[]
}

export interface AdminAlias extends Omit<Admin, '_id'> {
  id: string
}

export interface CreateAdminReqBody  {
  email?: string
  trang_thai?: string
  ho_va_ten?: string
  sdt?: string
  vai_tro?: string
  ngay_sinh?: string | Date
  password?: string
}

export type UpdateAdminReqBody = { id: string } & CreateAdminReqBody


export interface UpdateAdminProfileReqBody {
  ho_va_ten?: string
  email?: string
  trang_thai?: string
  password?: string
  new_password?: string
  sdt?: string
  vai_tro?: string
  ngay_sinh?: string | Date
  ngay_cap_nhat_tai_khoan?: string | Date
}


export interface DeleteOneAdminReqBody {
  id: string
}

export interface DeleteOneAdminResponse {
  msg: string
}
export interface DeleteManyAdminResponse {
  msg: string
}

export interface LoginAdminReqBody {
  email: string
  password: string
}

export interface LogoutAdminReqBody {
  refresh_token: string
}

export interface LogoutAdminResBody {
  msg: string
}

export interface LoginAdminResBody {
  access_token: string
  refresh_token: string
  expires_access_token: number
  expires_refresh_token: number
  admin: Admin
}

export interface ForgotPasswordReqBody {
  email: string
}

export interface ForgotPasswordResponse {
  msg: string
}

export interface ResetPasswordReqBody {
  forgot_password_token: string
  password: string
}

export interface ResetPasswordResponse {
  msg: string
}

export interface ListAdminResponsePagination {
  data: Admin[]
  page: number
  limit: number
  total_pages: number
}

export interface ListAdminReqParams extends Pick<TQueryConfig, 'page' | 'limit'> {
  email?: string
  sort_order?: SortOrderData
}

export type RefreshTokenReponse = SuccessResponseApi<{
  access_token: string
  refresh_token: string
  expires_access_token: number
  expires_refresh_token: number
  admin: Admin
}>

