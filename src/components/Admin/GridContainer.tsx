import type { ReactNode } from 'react'

interface GridContainerProps {
  children: ReactNode
  isEmpty?: boolean
  isLoading?: boolean
  emptyMessage?: string
  loadingMessage?: string
}

/**
 * Grid container for displaying items
 * Handles loading and empty states
 */
export default function GridContainer({
  children,
  isEmpty = false,
  isLoading = false,
  emptyMessage = 'Không có dữ liệu.',
  loadingMessage = 'Đang tải...'
}: GridContainerProps) {
  if (isLoading) {
    return (
      <div className="p-4 text-sm text-neutral-500 animate-pulse">
        {loadingMessage}
      </div>
    )
  }

  if (isEmpty) {
    return (
      <div className="p-4 text-sm text-neutral-500 text-center">
        {emptyMessage}
      </div>
    )
  }

  return <div className="space-y-3">{children}</div>
}
