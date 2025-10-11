import type { duan, CreateDuAnReq, UpdateDuAnReq, ListDuAnReqParams, ListDuAnResponsePagination } from '@/types/duan'
import type { SuccessResponseApi } from '@/types/common'
import { httpAdminPortal } from '@/utils/httpAdminPortal'

const URL = 'duan'
export const URL_CREATE_DUAN = URL + '/create'
export const URL_LIST_DUAN = URL + '/list_rows'
export const URL_DETAIL_DUAN = URL + '/detail'
export const URL_UPDATE_DUAN = URL + '/update'

const duanApi = {
  createDuAn(body: CreateDuAnReq) {
    return httpAdminPortal.post<SuccessResponseApi<duan>>(URL_CREATE_DUAN, body)
  },
  duanList(params: ListDuAnReqParams) {
    return httpAdminPortal.get<SuccessResponseApi<ListDuAnResponsePagination>>(URL_LIST_DUAN, { params })
  },
  duanDetail(id: string) {
    return httpAdminPortal.get<SuccessResponseApi<duan>>(`${URL_DETAIL_DUAN}/${id}`)
  },
  updateDuAn(body: UpdateDuAnReq) {
    return httpAdminPortal.put<SuccessResponseApi<duan>>(URL_UPDATE_DUAN, body)
  }
}

export default duanApi
