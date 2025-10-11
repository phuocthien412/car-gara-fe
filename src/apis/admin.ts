import type {
  Admin,
  CreateAdminReqBody,
  ForgotPasswordReqBody,
  ForgotPasswordResponse,
  ListAdminReqParams,
  ListAdminResponsePagination,
  LoginAdminReqBody,
  LoginAdminResBody,
  LogoutAdminReqBody,
  LogoutAdminResBody,
  ResetPasswordReqBody,
  ResetPasswordResponse,
  UpdateAdminReqBody,
  UpdateAdminProfileReqBody
} from '@/types/admin'
import type { SuccessResponseApi } from '@/types/common'
import { httpAdminPortal } from '@/utils/httpAdminPortal'

const URL = 'admin'
export const URL_LOGIN = URL + '/login'
export const URL_LOGOUT = URL + '/logout'
export const URL_FORGOT_PASSWORD = URL + '/forgot-password'
export const URL_RESET_PASSWORD = URL + '/reset-password'
export const URL_CREATE_USER = URL + '/create'
export const URL_REFRESH_TOKEN = URL + '/refresh-token'
export const URL_LIST_USER = URL + '/list_rows'
export const URL_DETAIL_USER = URL + '/detail'
export const URL_UPDATE_USER = URL + '/update'
export const URL_UPLOAD_IMAGES = URL + '/upload-images'
export const URL_UPDATE_PROFILE = URL + '/update-profile'

const adminApi = {
  login(body: LoginAdminReqBody) {
    return httpAdminPortal.post<SuccessResponseApi<LoginAdminResBody>>(URL_LOGIN, body)
  },
  logout(body: LogoutAdminReqBody) {
    return httpAdminPortal.post<LogoutAdminResBody>(URL_LOGOUT, body)
  },
  refreshToken(body: { refresh_token: string }) {
    return httpAdminPortal.post<SuccessResponseApi<LoginAdminResBody>>(URL_REFRESH_TOKEN, body)
  },
  forgotPassword(body: ForgotPasswordReqBody) {
    return httpAdminPortal.post<ForgotPasswordResponse>(URL_FORGOT_PASSWORD, body)
  },
  resetPassword(body: ResetPasswordReqBody) {
    return httpAdminPortal.post<ResetPasswordResponse>(URL_RESET_PASSWORD, body)
  },
  createUser(payload: CreateAdminReqBody) {
    return httpAdminPortal.post<SuccessResponseApi<Admin>>(URL_CREATE_USER, payload)
  },
  userList(params: ListAdminReqParams) {
    return httpAdminPortal.get<SuccessResponseApi<ListAdminResponsePagination>>(URL_LIST_USER, { params })
  },
  userDetail(id: string) {
    return httpAdminPortal.get<SuccessResponseApi<Admin>>(`${URL_DETAIL_USER}/${id}`)
  },
  updateUser(body: UpdateAdminReqBody) {
    return httpAdminPortal.put<SuccessResponseApi<Admin>>(URL_UPDATE_USER, body)
  },
  updateProfile(body: UpdateAdminProfileReqBody) {
    return httpAdminPortal.post<SuccessResponseApi<Admin>>(URL_UPDATE_PROFILE, body)
  }
} as const

export default adminApi
