import type { sanpham, CreateSanPhamReq, UpdateSanPhamReq, ListSanPhamReqParams, ListSanPhamResponsePagination } from '@/types/sanpham'
import type { SuccessResponseApi } from '@/types/common'
import { httpAdminPortal } from '@/utils/httpAdminPortal'

const URL = 'sanpham'
export const URL_CREATE_SANPHAM = URL + '/create'
export const URL_LIST_SANPHAM = URL + '/list_rows'
export const URL_DETAIL_SANPHAM = URL + '/detail'
export const URL_UPDATE_SANPHAM = URL + '/update'
export const URL_UPLOAD_IMAGES = URL + '/upload-images'

const sanphamApi = {
  createSanPham(body: CreateSanPhamReq) {
    return httpAdminPortal.post<SuccessResponseApi<sanpham>>(URL_CREATE_SANPHAM, body)
  },
  sanphamList(params: ListSanPhamReqParams) {
    return httpAdminPortal.get<SuccessResponseApi<ListSanPhamResponsePagination>>(URL_LIST_SANPHAM, { params })
  },
  sanphamDetail(id: string) {
    return httpAdminPortal.get<SuccessResponseApi<sanpham>>(`${URL_DETAIL_SANPHAM}/${id}`)
  },
  updateSanPham(body: UpdateSanPhamReq) {
    const { _id, ...rest } = body
    return httpAdminPortal.put<SuccessResponseApi<sanpham>>(URL_UPDATE_SANPHAM, { id: _id, ...rest })
  },
  uploadImages(form: FormData) {
      return httpAdminPortal.post<SuccessResponseApi<{ urls?: string[]; url?: string }>>(
        URL_UPLOAD_IMAGES,
        form,
        { headers: { 'Content-Type': undefined } }
      )
    }
}

export default sanphamApi
