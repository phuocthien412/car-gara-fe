import httpStatusCode from '@/constants/httpStatusCode'
import axios, { AxiosError, type AxiosInstance } from 'axios'

class Http {
  instance: AxiosInstance
  constructor() {
    this.instance = axios.create({
      baseURL: import.meta.env.VITE_API_ENDPOINT,
      timeout: Number(import.meta.env.VITE_ENDPOINT_TIMEOUT),
      headers: {
        'Content-Type': 'application/json'
      }
    })
    // Http request
    this.instance.interceptors.request.use(
      (config) => config,
      (error) => Promise.reject(error)
    )

    // Http respone
    this.instance.interceptors.response.use(
      (response) => response,
      async (error: AxiosError) => {
        const status = error.response?.status
        const statusArr = [httpStatusCode.UnprocessableEntity, httpStatusCode.Unauthorized] as number[]
        if (!statusArr.includes(status as number)) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const data: any | undefined = error.response?.data
          const message = data?.message || error.message
          console.error(message)
        }
        return Promise.reject(error)
      }
    )
  }
}

const http = new Http().instance
export default http
