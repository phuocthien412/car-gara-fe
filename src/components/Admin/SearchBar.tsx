import { X } from 'lucide-react'

interface SearchBarProps {
  value: string
  onChange: (value: string) => void
  onSubmit: () => void
  onClear: () => void
  placeholder?: string
  className?: string
}

/**
 * Reusable search bar component with submit and clear actions
 */
export default function SearchBar({
  value,
  onChange,
  onSubmit,
  onClear,
  placeholder = 'Tìm kiếm...',
  className = ''
}: SearchBarProps) {
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        onSubmit()
      }}
      className={`flex items-center gap-2 ${className}`}
    >
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-[220px] sm:w-[320px] rounded-md bg-neutral-800/60 px-3 py-2 text-sm text-neutral-100 placeholder:text-neutral-500 focus:outline-none"
        aria-label={placeholder}
      />
      <button
        type="submit"
        className="hidden sm:inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-red-600 to-rose-700 px-3 py-2 text-sm font-medium text-white"
      >
        Tìm
      </button>
      <button
        type="button"
        onClick={onClear}
        title="Xóa tìm kiếm"
        className="inline-flex items-center justify-center h-9 w-9 rounded-md bg-neutral-800 hover:bg-neutral-700 text-red-400 transition-colors"
      >
        <X size={14} />
      </button>
    </form>
  )
}
