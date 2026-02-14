import httpStatusCode from '@/constants/httpStatusCode'
import axios, { AxiosError, type AxiosInstance, type InternalAxiosRequestConfig } from 'axios'
import {
  clearLS,
  getAccessTokenFromLS,
  getRefreshTokenFromLS,
  isAxiosExpiredTokenError,
  isAxiosUnauthorizedError,
  setAccessTokenToLS,
  setProfileToLS,
  setRefreshTokenToLS
} from '@/utils/common'
import type { ErrorResponseApi, SuccessResponseApi } from '@/types/common'
import type { LoginAdminResBody, RefreshTokenReponse } from '@/types/admin'
import { URL_LOGIN, URL_LOGOUT, URL_REFRESH_TOKEN } from '@/apis/admin'

class HttpAdminPortal {
  instance: AxiosInstance
  private accessToken: string
  private refreshToken: string
  private refreshTokenRequest: Promise<string> | null
  constructor() {
    this.accessToken = getAccessTokenFromLS()
    this.refreshToken = getRefreshTokenFromLS()
    this.refreshTokenRequest = null
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
        // Always get fresh token from localStorage
        const accessToken = getAccessTokenFromLS()
        if (accessToken && config.headers) {
          config.headers.authorization = `Bearer ${accessToken}`
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
        const status = error.response?.status
        const statusArr = [httpStatusCode.UnprocessableEntity, httpStatusCode.Unauthorized] as number[]
        if (!statusArr.includes(status as number)) {
          const data = error.response?.data as { message?: string } | undefined
          const message = data?.message || error.message
          console.error(message)
        }
        if (isAxiosUnauthorizedError<ErrorResponseApi<{ name: string; message: string }>>(error)) {
          const config = error.response?.config
          const url = config?.url
          if (isAxiosExpiredTokenError(error) && url !== URL_REFRESH_TOKEN) {
            this.refreshTokenRequest = this.refreshTokenRequest
              ? this.refreshTokenRequest
              : this.handleRefreshToken().finally(() => {
                  setTimeout(() => {
                    this.refreshTokenRequest = null
                  }, 10000)
                })
            return this.refreshTokenRequest.then((access_token) => {
              if (config?.headers) config.headers.authorization = access_token
              return this.instance({
                ...config,
                headers: { ...(config as InternalAxiosRequestConfig).headers, authorization: access_token }
              })
            })
          }
          clearLS()
          this.accessToken = ''
          this.refreshToken = ''
          console.error(error.response?.data.data?.message || error.response?.data.message)
        }
        return Promise.reject(error)
      }
    )
  }
  private async handleRefreshToken() {
    return this.instance
      .post<RefreshTokenReponse>(URL_REFRESH_TOKEN, {
        refresh_token: this.refreshToken
      })
      .then((res) => {
        const { access_token } = res.data.data
        setAccessTokenToLS(access_token)
        this.accessToken = access_token
        return access_token
      })
      .catch((error) => {
        clearLS()
        this.accessToken = ''
        this.refreshToken = ''
        throw error
      })
  }
}

export const httpAdminPortal = new HttpAdminPortal().instance
