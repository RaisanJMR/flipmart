import React from 'react'
import { Link } from 'react-router-dom'
import Rating from './Rating'
import Badge from './ui/Badge'

const Product = ({ product }) => {
  return (
    <article className='product-card'>
      <div className='product-card__media'>
        <img src={product.image} alt='' loading='lazy' />
      </div>

      <div className='product-card__body'>
        {product.brand && <p className='product-card__brand'>{product.brand}</p>}
        <h3 className='product-card__title'>
          <Link to={`/product/${product._id}`} className='product-card__link'>
            {product.name}
          </Link>
        </h3>
        <Rating value={product.rating} text={`${product.numReviews} reviews`} />
        <div className='product-card__footer'>
          <span className='price product-card__price'>${product.price}</span>
          {product.countInStock === 0 && <Badge>Sold out</Badge>}
        </div>
      </div>
    </article>
  )
}

export const ProductSkeleton = () => (
  <div className='product-card product-card--skeleton' aria-hidden='true'>
    <span className='product-card__media skeleton' />
    <div className='product-card__body'>
      <span className='skeleton skeleton--text' style={{ width: '30%' }} />
      <span className='skeleton skeleton--text' style={{ width: '90%' }} />
      <span className='skeleton skeleton--text' style={{ width: '60%' }} />
      <span className='skeleton' style={{ width: '40%', height: '1.4rem', marginTop: '0.5rem' }} />
    </div>
  </div>
)

export default Product
