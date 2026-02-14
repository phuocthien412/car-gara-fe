import httpStatusCode from '@/constants/httpStatusCode'
import type { Admin } from '@/types/admin'
import type { ErrorResponseApi } from '@/types/common'
import axios, { AxiosError } from 'axios'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function filterPayload<T extends Record<string, any>>(payload: T): T {
  for (const key in payload) {
    const value = payload[key]
    if (value === undefined || value === null || value === '') {
      delete payload[key]
    }
  }
  return payload
}

export const eventTargetLS = new EventTarget()

export const getAccessTokenFromLS = () => localStorage.getItem('access_token') || ''

export const getRefreshTokenFromLS = () => localStorage.getItem('refresh_token') || ''

export const setAccessTokenToLS = (access_token: string) => {
  localStorage.setItem('access_token', access_token)
}

export const setRefreshTokenToLS = (access_token: string) => {
  localStorage.setItem('refresh_token', access_token)
}

export const getProfileFromLS = () => {
  const result = localStorage.getItem('profile')
  return result ? JSON.parse(result) : null
}

export const setProfileToLS = (profile: Admin) => localStorage.setItem('profile', JSON.stringify(profile))

export const clearLS = () => {
  localStorage.removeItem('access_token')
  localStorage.removeItem('refresh_token')
  localStorage.removeItem('profile')
  const event = new Event('clearLS')
  eventTargetLS.dispatchEvent(event)
}

// New: common formatter for UTC+7 with fallback
function formatInUTC7(date: Date, options: Intl.DateTimeFormatOptions): string {
  try {
    return new Intl.DateTimeFormat('vi-VN', { ...options, timeZone: 'Asia/Ho_Chi_Minh' }).format(date)
  } catch {
    // Fallback thủ công: chuyển UTC -> UTC+7 rồi format local
    const utcMs = date.getTime() - date.getTimezoneOffset() * 60000
    const vnDate = new Date(utcMs + 7 * 60 * 60000)
    return new Intl.DateTimeFormat('vi-VN', options).format(vnDate)
  }
}

export function formatedTime(isoDate?: string) {
  const date = isoDate ? parseIsoToDate(isoDate) : null
  return date
    ? formatInUTC7(date, {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
      })
    : ''
}

export function formatedDate(isoDate?: string) {
  const date = isoDate ? parseIsoToDate(isoDate) : null
  return date
    ? formatInUTC7(date, {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      })
    : ''
}

// New: HH:mm theo UTC+7 (dùng cho UI chat)
export function formatTimeHHmmUTC7(isoDate?: string) {
  const date = isoDate ? parseIsoToDate(isoDate) : null
  return date
    ? formatInUTC7(date, {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
      })
    : ''
}

// New: Định dạng ngày giờ đầy đủ theo UTC+7 (dùng cho finalized_at)
export function formatDateTimeUTC7(isoDate?: string) {
  const date = isoDate ? parseIsoToDate(isoDate) : null
  return date
    ? formatInUTC7(date, {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
      })
    : ''
}

export function isAxiosError<TypeError>(error: unknown): error is AxiosError<TypeError> {
  return axios.isAxiosError(error)
}
export function isAxiosUnprocessableEntityError<UnprocessableEntityError>(
  error: unknown
): error is AxiosError<UnprocessableEntityError> {
  return isAxiosError(error) && error.response?.status === httpStatusCode.UnprocessableEntity
}
export function isAxiosUnauthorizedError<UnauthorizedError>(error: unknown): error is AxiosError<UnauthorizedError> {
  return isAxiosError(error) && error.response?.status === httpStatusCode.Unauthorized
}

export function isAxiosExpiredTokenError<ExpiredTokenError>(error: unknown): error is AxiosError<ExpiredTokenError> {
  if (!isAxiosUnauthorizedError(error)) return false
  
  // Check both formats: nested object or direct string
  const data = error.response?.data as any
  return (
    data?.data?.name === 'EXPIRED_TOKEN' ||
    data?.detail === 'Token hết hạn' ||
    data?.message === 'Token hết hạn'
  )
}

// helper: normalize ISO-like string and parse to Date.
function parseIsoToDate(input: string): Date | null {
  try {
    // trim
    let s = input.trim()

    // Hỗ trợ chuỗi có khoảng trắng thay vì "T"
    // e.g. "2025-09-27 06:55:44" -> "2025-09-27T06:55:44"
    if (/^\d{4}-\d{2}-\d{2}\s+\d{2}:\d{2}/.test(s)) {
      s = s.replace(' ', 'T')
    }

    // Nếu microseconds > 3 chữ số, cắt về milliseconds
    s = s.replace(/(\.\d{3})\d+/, '$1')

   

    const d = new Date(s)
    return isNaN(d.getTime()) ? null : d
  } catch {
    return null
  }
}
