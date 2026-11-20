import React from 'react'
import { Link } from 'react-router-dom'

const Paginate = ({ pages, page, isAdmin = false, keyword = '' }) => {
  if (!pages || pages <= 1) return null

  const pageUrl = (number) =>
    isAdmin
      ? `/admin/productlist/${number}`
      : keyword
      ? `/search/${keyword}/page/${number}`
      : `/page/${number}`

  const current = Number(page)
  const atStart = current <= 1
  const atEnd = current >= pages

  return (
    <nav className='pagination' aria-label='Pagination'>
      <ul className='pagination__list'>
        <li>
          <Link
            to={pageUrl(Math.max(1, current - 1))}
            className='pagination__link'
            aria-label='Previous page'
            aria-disabled={atStart || undefined}
            tabIndex={atStart ? -1 : undefined}
          >
            <i className='fas fa-chevron-left' aria-hidden='true' />
          </Link>
        </li>
        {[...Array(pages).keys()].map((x) => (
          <li key={x + 1}>
            <Link
              to={pageUrl(x + 1)}
              className='pagination__link'
              aria-current={x + 1 === current ? 'page' : undefined}
              aria-label={`Page ${x + 1}`}
            >
              {x + 1}
            </Link>
          </li>
        ))}
        <li>
          <Link
            to={pageUrl(Math.min(pages, current + 1))}
            className='pagination__link'
            aria-label='Next page'
            aria-disabled={atEnd || undefined}
            tabIndex={atEnd ? -1 : undefined}
          >
            <i className='fas fa-chevron-right' aria-hidden='true' />
          </Link>
        </li>
      </ul>
    </nav>
  )
}

export default Paginate
