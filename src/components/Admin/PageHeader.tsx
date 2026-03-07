import type { ReactNode } from 'react'
import type { LucideIcon } from 'lucide-react'

interface PageHeaderProps {
  icon: LucideIcon
  title: string
  children?: ReactNode
}

/**
 * Standardized page header with icon, title, and optional actions (search, buttons)
 */
export default function PageHeader({ icon: Icon, title, children }: PageHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-3">
      <div className="flex items-center gap-2 text-lg sm:text-2xl font-semibold">
        <Icon className="text-red-500" />
        <span>{title}</span>
      </div>
      {children && (
        <div className="flex items-center gap-3 w-full sm:w-auto">
          {children}
        </div>
      )}
    </div>
  )
}
