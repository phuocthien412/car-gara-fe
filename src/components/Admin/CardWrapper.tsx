import type { ReactNode } from 'react'
import { motion } from 'framer-motion'

interface CardWrapperProps {
  children: ReactNode
  index?: number
  className?: string
}

/**
 * Reusable card wrapper with hover effects and animations
 * Used for grid items in admin pages
 */
export default function CardWrapper({ children, index = 0, className = '' }: CardWrapperProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.03 }}
      className={`group flex flex-col sm:grid sm:grid-cols-12 gap-3 p-3 sm:p-4 bg-neutral-900/30 rounded-lg border border-neutral-800 hover:shadow hover:bg-neutral-900/50 transition ${className}`}
    >
      {children}
    </motion.div>
  )
}
