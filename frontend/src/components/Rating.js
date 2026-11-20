import React from 'react'

const starClass = (value, position) =>
  value >= position
    ? 'fas fa-star'
    : value >= position - 0.5
    ? 'fas fa-star-half-alt'
    : 'far fa-star'

const Rating = ({ value, text, color }) => {
  const rounded = Math.round((Number(value) || 0) * 2) / 2

  return (
    <div className='rating'>
      <span
        className='rating__stars'
        role='img'
        aria-label={`Rated ${rounded} out of 5`}
        style={color ? { color } : undefined}
      >
        {[1, 2, 3, 4, 5].map((position) => (
          <i key={position} className={starClass(value, position)} aria-hidden='true' />
        ))}
      </span>
      {text && <span className='rating__text'>{text}</span>}
    </div>
  )
}

export default Rating
