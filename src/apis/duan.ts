import type { duan, CreateDuAnReq, UpdateDuAnReq, ListDuAnReqParams, ListDuAnResponsePagination } from '@/types/duan'
import type { SuccessResponseApi } from '@/types/common'
import { httpAdminPortal } from '@/utils/httpAdminPortal'

const URL = 'duan'
export const URL_CREATE_DUAN = URL + '/create'
export const URL_LIST_DUAN = URL + '/list_rows'
export const URL_DETAIL_DUAN = URL + '/detail'
export const URL_UPDATE_DUAN = URL + '/update'
export const URL_UPLOAD_IMAGES = URL + '/upload-images'
export const URL_DELETE_DUAN = URL + '/delete-one'

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
    const { _id, ...rest } = body
    return httpAdminPortal.put<SuccessResponseApi<duan>>(URL_UPDATE_DUAN, { id: _id, ...rest })
  },
  deleteDuAn(id: string) {
    return httpAdminPortal.delete<SuccessResponseApi<null>>(URL_DELETE_DUAN, {
          data: { id }
      })
  },
  uploadImages(form: FormData) {
      return httpAdminPortal.post<SuccessResponseApi<{ urls?: string[]; url?: string }>>(
        URL_UPLOAD_IMAGES,
        form,
        { headers: { 'Content-Type': undefined } }
      )
    }
}

export default duanApi
