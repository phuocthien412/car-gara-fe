import httpStatusCode from '@/constants/httpStatusCode'
import axios, { AxiosError, type AxiosInstance } from 'axios'
import {
  clearLS,
  getAccessTokenFromLS,
  getRefreshTokenFromLS,
  setAccessTokenToLS,
  setProfileToLS,
  setRefreshTokenToLS
} from '@/utils/common'
import type { SuccessResponseApi } from '@/types/common'
import type { LoginAdminResBody } from '@/types/admin'
import { URL_LOGIN, URL_LOGOUT } from '@/apis/admin'
import { toast } from 'sonner'

class HttpAdminPortal {
  instance: AxiosInstance
  private accessToken: string
  private refreshToken: string
  // private refreshTokenRequest: Promise<string> | null
  constructor() {
    this.accessToken = getAccessTokenFromLS()
    this.refreshToken = getRefreshTokenFromLS()
    this.instance = axios.create({
      baseURL: import.meta.env.VITE_API_ENDPOINT,
      timeout: Number(import.meta.env.VITE_ENDPOINT_TIMEOUT),
      headers: {
        'Content-Type': 'application/json'
      }
    })
    // Http request interceptors
    this.instance.interceptors.request.use(
      (config) => {
        if (this.accessToken && config.headers) {
          config.headers.authorization = `Bearer ${this.accessToken}`
          return config
        }
        return config
      },
      (error) => {
        return Promise.reject(error)
      }
    )

    // Http respone interceptors
    this.instance.interceptors.response.use(
      (response) => {
        const { url } = response.config
        if (url === URL_LOGIN) {
          const data = response.data as SuccessResponseApi<LoginAdminResBody>
          this.accessToken = data.data.access_token
          this.refreshToken = data.data.refresh_token
          setAccessTokenToLS(this.accessToken)
          setRefreshTokenToLS(this.refreshToken)
          setProfileToLS(data.data.admin)
        } else if (url === URL_LOGOUT) {
          this.accessToken = ''
          this.refreshToken = ''
          clearLS()
        }
        return response
      },
      async (error: AxiosError) => {
        // console.log('AxiosError', error)
        const status = error.response?.status
        const statusArr = [httpStatusCode.UnprocessableEntity, httpStatusCode.Unauthorized] as number[]
        if (!statusArr.includes(status as number)) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const data: any | undefined = error.response?.data
          const message = data?.message || error.message
          toast.error(message)
        }
        // if (isAxiosUnauthorizedError<ErrorResponseApi<{ name: string; message: string }>>(error)) {
        //   const config = error.response?.config
        //   const url = config?.url
        //   if (isAxiosExpiredTokenError(error) && url !== URL_REFRESH_TOKEN) {
        //     this.refreshTokenRequest = this.refreshTokenRequest
        //       ? this.refreshTokenRequest
        //       : this.handleRefreshToken().finally(() => {
        //           setTimeout(() => {
        //             this.refreshTokenRequest = null
        //           }, 10000)
        //         })
        //     return this.refreshTokenRequest.then((access_token) => {
        //       if (config?.headers) config.headers.authorization = access_token
        //       return this.instance({
        //         ...config,
        //         // eslint-disable-next-line @typescript-eslint/no-explicit-any
        //         headers: { ...(config as InternalAxiosRequestConfig<any>).headers, authorization: access_token }
        //       })
        //     })
        //   }
        //   clearLS()
        //   this.accessToken = ''
        //   this.refreshToken = ''
        //   toast.error(error.response?.data.data?.message || error.response?.data.message)
        // }
        return Promise.reject(error)
      }
    )
  }
}

export const httpAdminPortal = new HttpAdminPortal().instance
