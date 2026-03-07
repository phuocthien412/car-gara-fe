import { Link } from 'react-router-dom'
import type { LucideIcon } from 'lucide-react'

interface ActionButtonProps {
  to: string
  icon: LucideIcon
  label: string
  variant?: 'primary' | 'secondary'
  className?: string
}

/**
 * Reusable action button (desktop & mobile responsive)
 * Desktop: shows icon + label, Mobile: shows icon only in circular button
 */
export default function ActionButton({ 
  to, 
  icon: Icon, 
  label, 
  variant = 'primary',
  className = ''
}: ActionButtonProps) {
  const baseClasses = variant === 'primary'
    ? 'bg-gradient-to-r from-red-600 to-rose-700 hover:shadow-[0_0_15px_rgba(255,0,0,0.5)]'
    : 'bg-neutral-800 hover:bg-neutral-700'

  return (
    <>
      {/* Desktop button */}
      <Link
        to={to}
        className={`hidden sm:inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-white shadow transition-all duration-200 ${baseClasses} ${className}`}
      >
        <Icon size={18} />
        {label}
      </Link>

      {/* Mobile button */}
      <Link
        to={to}
        className={`inline-flex sm:hidden items-center justify-center h-10 w-10 rounded-full text-white shadow ${variant === 'primary' ? 'bg-red-600' : 'bg-neutral-700'} ${className}`}
        title={label}
      >
        <Icon size={18} />
      </Link>
    </>
  )
}
