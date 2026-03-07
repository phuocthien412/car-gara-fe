import type { ReactNode } from 'react'

interface PageLayoutProps {
  children: ReactNode
  className?: string
}

/**
 * Standardized page layout wrapper for all admin pages
 * Provides consistent padding, background, and border styling
 */
export default function PageLayout({ children, className = '' }: PageLayoutProps) {
  return (
    <div 
      className={`min-h-[80vh] rounded-xl bg-neutral-950 text-neutral-100 p-4 sm:p-6 shadow-inner border border-neutral-800 ${className}`}
    >
      {children}
    </div>
  )
}
