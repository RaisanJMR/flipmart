import React, { useState } from 'react'

const SearchBox = ({ history, id = 'site-search' }) => {
  const [keyword, setKeyword] = useState('')
  const submitHandler = (e) => {
    e.preventDefault()
    if (keyword.trim()) {
      history.push(`/search/${keyword}`)
    } else {
      history.push('/')
    }
  }
  return (
    <form onSubmit={submitHandler} role='search' className='w-full'>
      <label htmlFor={id} className='visually-hidden'>
        Search products
      </label>
      <div className='input-group input-group--with-addon'>
        <i className='fas fa-search input-group__icon' aria-hidden='true' />
        <input
          id={id}
          type='search'
          name='q'
          className='input'
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          placeholder='Search products…'
          autoComplete='off'
        />
        <span className='input-group__addon'>
          <button type='submit' className='button button--secondary button--sm'>
            Search
          </button>
        </span>
      </div>
    </form>
  )
}

export default SearchBox
