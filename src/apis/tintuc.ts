import type { tintuc, CreatetintucReq, UpdatetintucReq, ListtintucReqParams, ListtintucResponsePagination } from '@/types/tintuc'
import type { SuccessResponseApi } from '@/types/common'
import { httpAdminPortal } from '@/utils/httpAdminPortal'

const URL = 'tintuc'
export const URL_CREATE_tintuc = URL + '/create'
export const URL_LIST_tintuc = URL + '/list_rows'
export const URL_DETAIL_tintuc = URL + '/detail'
export const URL_UPDATE_tintuc = URL + '/update'
export const URL_UPLOAD_IMAGES = URL + '/upload-images'
export const URL_DELETE_TINTUC = URL + '/delete-one'

const tintucApi = {
  createtintuc(body: CreatetintucReq) {
    return httpAdminPortal.post<SuccessResponseApi<tintuc>>(URL_CREATE_tintuc, body)
  },
  tintucList(params: ListtintucReqParams) {
    return httpAdminPortal.get<SuccessResponseApi<ListtintucResponsePagination>>(URL_LIST_tintuc, { params })
  },
  tintucDetail(id: string) {
    return httpAdminPortal.get<SuccessResponseApi<tintuc>>(`${URL_DETAIL_tintuc}/${id}`)
  },
  updatetintuc(body: UpdatetintucReq) {
    const { _id, ...rest } = body
    return httpAdminPortal.put<SuccessResponseApi<tintuc>>(URL_UPDATE_tintuc, { id: _id, ...rest })
  },
  deletetintuc(id: string) {
    return httpAdminPortal.delete<SuccessResponseApi<null>>(URL_DELETE_TINTUC, {
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

export default tintucApi
