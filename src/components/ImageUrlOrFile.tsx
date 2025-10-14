import { useState, useMemo } from 'react'
import adminApi from '@/apis/admin'

interface Props {
  label?: string
  value?: string
  onChange: (url: string) => void
  className?: string
  targetFolder?: string
}

type UploadItem = {
  http?: string
  url?: string
  filename?: string
  upload_folder?: string
}

type UploadObject = {
  urls?: string[]
  url?: string
  filename?: string
}

function isUploadArray(v: unknown): v is UploadItem[] {
  return Array.isArray(v) && (v.length === 0 || typeof v[0] === 'object')
}

function isUploadObject(v: unknown): v is UploadObject {
  if (!v || typeof v !== 'object') return false
  const obj = v as Record<string, unknown>
  return Array.isArray(obj.urls) || typeof obj.url === 'string' || typeof obj.filename === 'string'
}

export default function ImageUrlOrFile({
  label = 'Ảnh xem trước (URL hoặc chọn file)',
  value,
  onChange,
  className,
  targetFolder = 'uploads/documents'
}: Props) {
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [uploadedFilename, setUploadedFilename] = useState<string | null>(null)

  const onFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    try {
      setUploading(true)
      setError(null)
      const form = new FormData()
      form.append('files', file)
      form.append('upload_folder', targetFolder)
      const res = await adminApi.uploadImages(form)
      const raw = res.data?.data as unknown

      let firstUrl: string | undefined
      let filenameFromRes: string | undefined

      if (isUploadArray(raw)) {
        const item = raw[0] as UploadItem
        filenameFromRes = item?.filename
        if (item?.url) {
          firstUrl = item.url
        } else {
          const httpBase = (item?.http || '').trim()
          const envBase = ((import.meta as unknown as { env?: { VITE_API_ENDPOINT?: string } }).env?.VITE_API_ENDPOINT as string) ||
            window.location.origin
          const base = (httpBase || envBase).replace(/\/+$/, '')
          const folder = (item?.upload_folder || '').replace(/^\/+/, '')
          if (filenameFromRes) {
            firstUrl = folder ? `${base}/${folder}/${filenameFromRes}` : `${base}/${filenameFromRes}`
          } else if (httpBase) {
            firstUrl = httpBase
          }
        }
      } else if (isUploadObject(raw)) {
        const d = raw as UploadObject
        firstUrl = d.urls?.[0] || d.url
        filenameFromRes = d.filename
      }

      if (firstUrl) {
        onChange(firstUrl)
        setUploadedFilename(filenameFromRes || file.name)
      } else {
        setError('Không lấy được URL ảnh trả về từ server.')
      }
    } catch {
      setError('Tải ảnh thất bại. Vui lòng thử lại.')
    } finally {
      setUploading(false)
      // reset input value to allow selecting the same file again
      e.target.value = ''
    }
  }

  const displayName = useMemo(() => {
    // ưu tiên filename trả về từ server sau upload
    if (uploadedFilename) return uploadedFilename
    if (!value) return ''

    try {
      const u = new URL(value, window.location.origin)
      const parts = u.pathname.split('/').filter(Boolean)

      // Nếu có path và phần cuối không rỗng -> đó là tên file
      if (parts.length) return decodeURIComponent(parts[parts.length - 1])

      // Không có path (server trả base URL như http://localhost:9000) -> không biết tên file
      return 'Không có tên file (server trả base URL)'
    } catch {
      // fallback: nếu value chứa '/', lấy phần cuối; nếu không, trả value raw
      const parts = value.split('/').filter(Boolean)
      if (parts.length) return decodeURIComponent(parts[parts.length - 1])
      return value
    }
  }, [value, uploadedFilename])

  return (
    <div className={className}>
      <label className="mb-1 block text-sm text-neutral-300">{label}</label>
      <div className="flex items-center gap-2">
        <input
          className="flex-1 rounded border border-neutral-800 bg-neutral-800/60 px-3 py-2 text-neutral-100 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-red-500"
          value={value || ''}
          onChange={(e) => {
            // clear uploadedFilename khi user nhập URL thủ công
            setUploadedFilename(null)
            onChange(e.target.value)
          }}
          placeholder="https://..."
        />
        <label
          className={`inline-flex items-center gap-2 rounded-md border px-3 py-2 text-sm font-medium transition-colors ${uploading ? 'opacity-60' : ''} border-neutral-700 text-neutral-200 bg-neutral-900 hover:bg-neutral-800 cursor-pointer`}
        >
          <input type="file" accept="image/*" className="hidden" onChange={onFileChange} disabled={uploading} />
          {uploading ? 'Đang tải...' : 'Chọn file'}
        </label>
      </div>
      {error && <div className="mt-1 text-xs text-red-400">{error}</div>}
      {value && (
        <div className="mt-2">
          <img src={value} alt="preview" className="h-24 w-auto rounded border border-neutral-800 object-cover" />
          {displayName && <div className="mt-1 text-xs text-neutral-400">Tên ảnh: {displayName}</div>}
        </div>
      )}
    </div>
  )
}
