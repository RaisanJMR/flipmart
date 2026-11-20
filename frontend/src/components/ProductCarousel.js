import React, { useCallback, useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Loader from './Loader'
import Message from './Message'
import Rating from './Rating'
import Button from './ui/Button'
import { listTopProducts } from '../actions/productActions'

const AUTOPLAY_MS = 6000

const prefersReducedMotion = () =>
  window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches

const ProductCarousel = () => {
  const dispatch = useDispatch()

  const productTopRated = useSelector((state) => state.productTopRated)
  const { loading, error, products } = productTopRated

  const [index, setIndex] = useState(0)
  const [playing, setPlaying] = useState(() => !prefersReducedMotion())
  const [hovering, setHovering] = useState(false)
  const rootRef = useRef(null)

  useEffect(() => {
    dispatch(listTopProducts())
  }, [dispatch])

  const count = products ? products.length : 0
  const go = useCallback((next) => setIndex((next + count) % count), [count])

  useEffect(() => {
    if (!playing || hovering || count < 2) return undefined
    const timer = setInterval(() => setIndex((i) => (i + 1) % count), AUTOPLAY_MS)
    return () => clearInterval(timer)
  }, [playing, hovering, count])

  const handleFocus = () => setHovering(true)
  const handleBlur = (e) => {
    if (rootRef.current && !rootRef.current.contains(e.relatedTarget)) setHovering(false)
  }

  if (loading) return <Loader />
  if (error) return <Message variant='danger'>{error}</Message>
  if (!count) return null

  return (
    <section
      ref={rootRef}
      className='hero'
      aria-roledescription='carousel'
      aria-label='Top rated products'
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
      onFocus={handleFocus}
      onBlur={handleBlur}
    >
      <div aria-live={playing && !hovering ? 'off' : 'polite'}>
        {products.map((product, i) => (
          <div
            key={product._id}
            className='hero__slide'
            role='group'
            aria-roledescription='slide'
            aria-label={`${i + 1} of ${count}`}
            hidden={i !== index}
          >
            <div className='hero__content'>
              <p className='eyebrow'>Top rated · {product.brand}</p>
              <h2 className='text-display hero__title'>{product.name}</h2>
              <Rating value={product.rating} text={`${product.numReviews} reviews`} />
              <p className='price hero__price'>${product.price}</p>
              <Button to={`/product/${product._id}`} variant='primary' size='lg'>
                Shop now
                <i className='fas fa-arrow-right' aria-hidden='true' />
              </Button>
            </div>
            <div className='hero__media'>
              <img src={product.image} alt={product.name} />
            </div>
          </div>
        ))}
      </div>

      {count > 1 && (
        <div className='hero__controls'>
          <div className='hero__dots'>
            {products.map((product, i) => (
              <button
                key={product._id}
                type='button'
                className='hero__dot'
                aria-label={`Show slide ${i + 1}: ${product.name}`}
                aria-current={i === index ? 'true' : undefined}
                onClick={() => go(i)}
              />
            ))}
          </div>
          <div className='hero__nav'>
            <Button
              variant='ghost'
              size='sm'
              iconOnly
              aria-label={playing ? 'Pause slideshow' : 'Play slideshow'}
              onClick={() => setPlaying((p) => !p)}
            >
              <i className={playing ? 'fas fa-pause' : 'fas fa-play'} aria-hidden='true' />
            </Button>
            <Button
              variant='secondary'
              size='sm'
              iconOnly
              aria-label='Previous slide'
              onClick={() => go(index - 1)}
            >
              <i className='fas fa-chevron-left' aria-hidden='true' />
            </Button>
            <Button
              variant='secondary'
              size='sm'
              iconOnly
              aria-label='Next slide'
              onClick={() => go(index + 1)}
            >
              <i className='fas fa-chevron-right' aria-hidden='true' />
            </Button>
          </div>
        </div>
      )}
    </section>
  )
}

export default ProductCarousel
