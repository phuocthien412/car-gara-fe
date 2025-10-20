import { useMemo, useState } from 'react'
import { X, Search as SearchIcon } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { PAGE } from '@/constants/pagination'
import type { TQueryConfig } from '@/types/common'

interface Props {
  queryConfig?: TQueryConfig
  value?: string
  field?: string
  placeholderSearch?: string
}

export default function Search({ queryConfig, value, field = 'q', placeholderSearch }: Props) {
  const navigate = useNavigate()
  const isControlled = useMemo(() => typeof value !== 'undefined', [value])
  const [localValue, setLocalValue] = useState<string>(value ?? '')

  const currentValue = isControlled ? (value as string) : localValue

  const go = (nextValue: string) => {
    const params = new URLSearchParams(queryConfig as Record<string, string> | undefined)
    if (nextValue.trim()) {
      params.set(field, nextValue.trim())
    } else {
      params.delete(field)
    }
    params.set('page', PAGE.toString())
    navigate({ pathname: window.location.pathname, search: params.toString() })
  }

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    go(currentValue)
  }

  const onClear = () => {
    if (!isControlled) setLocalValue('')
    go('')
  }

  return (
    <form className='w-full min-w-0 sm:w-auto sm:min-w-[280px] lg:w-[400px]' onSubmit={onSubmit}>
      <div className='flex items-center border rounded-md overflow-hidden'>
        <input
          type='text'
          placeholder={placeholderSearch || 'Tìm kiếm'}
          value={currentValue}
          onChange={(e) => setLocalValue(e.target.value)}
          className='border-0 focus-visible:ring-0 focus-visible:ring-offset-0 min-w-0 px-3 py-2 flex-1'
        />
        {currentValue && (
          <button
            type='button'
            aria-label='Clear search'
            className='px-2 text-neutral-500 hover:text-neutral-700'
            onClick={onClear}
          >
            <X className='h-4 w-4' />
          </button>
        )}
        <button type='submit' className='rounded-none border-l flex-shrink-0 px-3 py-2 bg-transparent'>
          <SearchIcon className='h-4 w-4 text-muted-foreground' />
        </button>
      </div>
    </form>
  )
}

