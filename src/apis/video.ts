import type { video, CreatevideoReq, UpdatevideoReq, ListvideoReqParams, ListvideoResponsePagination } from '@/types/video'
import type { SuccessResponseApi } from '@/types/common'
import { httpAdminPortal } from '@/utils/httpAdminPortal'

const URL = 'video'
export const URL_CREATE_video = URL + '/create'
export const URL_LIST_video = URL + '/list_rows'
export const URL_DETAIL_video = URL + '/detail'
export const URL_UPDATE_video = URL + '/update'
export const URL_DELETE_video = URL + '/delete-one'

const videoApi = {
  createvideo(body: CreatevideoReq) {
    return httpAdminPortal.post<SuccessResponseApi<video>>(URL_CREATE_video, body)
  },
  videoList(params: ListvideoReqParams) {
    return httpAdminPortal.get<SuccessResponseApi<ListvideoResponsePagination>>(URL_LIST_video, { params })
  },
  videoDetail(id: string) {
    return httpAdminPortal.get<SuccessResponseApi<video>>(`${URL_DETAIL_video}/${id}`)
  },
  updatevideo(body: UpdatevideoReq) {
    const { _id, ...rest } = body
    return httpAdminPortal.put<SuccessResponseApi<video>>(URL_UPDATE_video, { id: _id, ...rest })
  },
  deletevideo(id: string) {
    return httpAdminPortal.delete<SuccessResponseApi<null>>(URL_DELETE_video, {
      data: { id }
    })
  }
}

export default videoApi

