import type { 
    dichvu, 
    CreateDichVuReq, 
    UpdateDichVuReq, 
    ListDichVuResponsePagination,
    ListDichVuReqParams
} from "@/types/dichvu";
import type { SuccessResponseApi } from '@/types/common'
import { httpAdminPortal } from '@/utils/httpAdminPortal'

const URL = 'dichvu'
export const URL_CREATE_DICHVU = URL + '/create'
export const URL_LIST_DICHVU = URL + '/list_rows'
export const URL_DETAIL_DICHVU = URL + '/detail'
export const URL_UPDATE_DICHVU = URL + '/update'
export const URL_UPLOAD_IMAGES = URL + '/upload-images'
export const URL_DELETE_SANPHAM = URL + '/delete-one'

const dichvuApi = {
    createDichVu(body: CreateDichVuReq) {
        return httpAdminPortal.post<SuccessResponseApi<dichvu>>(URL_CREATE_DICHVU, body)
    },
    dichvuList(params: ListDichVuReqParams) {
        return httpAdminPortal.get<SuccessResponseApi<ListDichVuResponsePagination>>(URL_LIST_DICHVU, { params })
    },
    dichvuDetail(id: string) {
        return httpAdminPortal.get<SuccessResponseApi<dichvu>>(`${URL_DETAIL_DICHVU}/${id}`)
    },
  updateDichVu(body: UpdateDichVuReq) {
        const { _id, ...rest } = body
        return httpAdminPortal.put<SuccessResponseApi<dichvu>>(URL_UPDATE_DICHVU, { id: _id, ...rest })
    },
    deleteDichVu(id: string) {
       return httpAdminPortal.delete<SuccessResponseApi<null>>(URL_DELETE_SANPHAM, {
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

export default dichvuApi
