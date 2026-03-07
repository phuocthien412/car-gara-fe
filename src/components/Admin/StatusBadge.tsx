interface StatusBadgeProps {
  status: 'success' | 'error' | 'warning' | 'info'
  label: string
  className?: string
}

/**
 * Reusable status badge component with color variants
 */
export default function StatusBadge({ status, label, className = '' }: StatusBadgeProps) {
  const statusClasses = {
    success: 'bg-green-500/20 text-green-400',
    error: 'bg-red-500/20 text-red-400',
    warning: 'bg-yellow-500/20 text-yellow-400',
    info: 'bg-blue-500/20 text-blue-400'
  }

  return (
    <span 
      className={`inline-flex items-center rounded-full px-3 py-0.5 text-[11px] md:text-xs font-medium ${statusClasses[status]} ${className}`}
    >
      {label}
    </span>
  )
}
