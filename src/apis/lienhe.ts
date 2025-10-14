import type {
  lienhe,
  CreateLienHeReq,
  UpdateLienHeReq,
  ListLienHeResponsePagination,
  ListLienHeReqParams
} from '@/types/lienhe'
import type { SuccessResponseApi } from '@/types/common'
import { httpAdminPortal } from '@/utils/httpAdminPortal'

const URL = 'lienhe'
export const URL_CREATE_LIENHE = URL + '/create'
export const URL_LIST_LIENHE = URL + '/list_rows'
export const URL_DETAIL_LIENHE = URL + '/detail'
export const URL_UPDATE_LIENHE = URL + '/update'
export const URL_DELETE_LIENHE = URL + '/delete-one'

const lienheApi = {
  createLienHe(body: CreateLienHeReq) {
    return httpAdminPortal.post<SuccessResponseApi<lienhe>>(URL_CREATE_LIENHE, body)
  },
  lienheList(params: ListLienHeReqParams) {
    // Public fetch for contact used on client pages
    return httpAdminPortal.get<SuccessResponseApi<ListLienHeResponsePagination>>(URL_LIST_LIENHE, { params })
  },
  lienheDetail(id: string) {
    // Public fetch for contact detail
    return httpAdminPortal.get<SuccessResponseApi<lienhe>>(`${URL_DETAIL_LIENHE}/${id}`)
  },
  updateLienHe(body: UpdateLienHeReq) {
    const { _id, ...rest } = body
    return httpAdminPortal.put<SuccessResponseApi<lienhe>>(URL_UPDATE_LIENHE, { id: _id, ...rest })
  },
  deleteLienHe(id: string) {
    return httpAdminPortal.delete<SuccessResponseApi<null>>(URL_DELETE_LIENHE, {
      data: { id }
    })
  }
}

export default lienheApi
