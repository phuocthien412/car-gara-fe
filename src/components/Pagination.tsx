import { Link, useLocation } from 'react-router-dom'
import clsx from 'clsx'

interface Props {
  page: number
  totalPage: number
  pageKey?: string
}

const RANGE = 2

export default function Pagination({ page, totalPage, pageKey = 'page' }: Props) {
  const location = useLocation()
  let dotAfter = false
  let dotBefore = false
  const getUpdatedSearch = (value: number) => {
    const params = new URLSearchParams(location.search)
    params.set(pageKey, value.toString())
    return params.toString()
  }

  const renderDotAfter = (index: number) => {
    if (!dotAfter) {
      dotAfter = true
      return (
        <li className='w-fit' key={index}>
          <span className='flex items-center justify-center w-[36px] h-[36px] rounded-sm border border-gray-300 cursor-not-allowed'>
            ...
          </span>
        </li>
      )
    }
    return null
  }
  const renderDotBefore = (index: number) => {
    if (!dotBefore) {
      dotBefore = true
      return (
        <li className='w-fit' key={index}>
          <span className='flex items-center justify-center w-[36px] h-[36px] rounded-sm border cursor-not-allowed'>
            ...
          </span>
        </li>
      )
    }
    return null
  }
  const renderPagination = () => {
    return Array(totalPage)
      .fill(0)
      .map((_, index) => {
        const pageNumber = index + 1
        if (page <= RANGE * 2 + 1 && pageNumber > page + RANGE && pageNumber < totalPage - RANGE + 1) {
          return renderDotAfter(index)
        } else if (page > RANGE * 2 + 1 && page < totalPage - RANGE * 2) {
          if (pageNumber > RANGE && pageNumber < page - RANGE) {
            return renderDotBefore(index)
          } else if (pageNumber > page + RANGE && pageNumber < totalPage - RANGE + 1) {
            return renderDotAfter(index)
          }
        } else if (page >= totalPage - RANGE * 2 && pageNumber > RANGE && pageNumber < totalPage - RANGE) {
          return renderDotBefore(index)
        }
        return (
          <li className='w-fit' key={index}>
            <Link
              to={{
                search: getUpdatedSearch(pageNumber)
              }}
              className={clsx('flex items-center justify-center w-[36px] h-[36px] rounded-sm border border-gray-300', {
                '!border-[#0866ff] text-[#0866ff]': page === pageNumber
              })}
            >
              {pageNumber}
            </Link>
          </li>
        )
      })
  }
  return (
    <div className='lg:mt-5 mn:mt-4'>
      <ul className='flex flex-wrap justify-center gap-2'>
        {page > 1 && (
          <li className='w-fit'>
            <Link
              to={{
                search: getUpdatedSearch(page - 1)
              }}
              className='flex h-[36px] items-center justify-center border border-gray-300 w-[36px] rounded-sm'
            >
              <svg
                xmlns='http://www.w3.org/2000/svg'
                fill='none'
                viewBox='0 0 24 24'
                strokeWidth='1.5'
                stroke='currentColor'
                className='size-4'
              >
                <path strokeLinecap='round' strokeLinejoin='round' d='M15.75 19.5 8.25 12l7.5-7.5' />
              </svg>
            </Link>
          </li>
        )}
        {renderPagination()}
        {page < totalPage && (
          <li className='w-fit'>
            <Link
              to={{
                search: getUpdatedSearch(page + 1)
              }}
              className='flex h-[36px] items-center justify-center border border-gray-300 w-[36px] rounded-sm'
            >
              <svg
                xmlns='http://www.w3.org/2000/svg'
                fill='none'
                viewBox='0 0 24 24'
                strokeWidth='1.5'
                stroke='currentColor'
                className='size-4'
              >
                <path strokeLinecap='round' strokeLinejoin='round' d='m8.25 4.5 7.5 7.5-7.5 7.5' />
              </svg>
            </Link>
          </li>
        )}
      </ul>
    </div>
  )
}