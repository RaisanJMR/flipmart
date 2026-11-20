import React, { useEffect, useState } from 'react'
import Meta from '../components/Meta'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import Rating from '../components/Rating'
import {
  listProductDetails,
  createProductReview,
} from '../actions/productActions'
import Loader from '../components/Loader'
import Message from '../components/Message'
import BackLink from '../components/ui/BackLink'
import Button from '../components/ui/Button'
import Badge from '../components/ui/Badge'
import EmptyState from '../components/ui/EmptyState'
import { SelectField, TextAreaField } from '../components/ui/Field'
import { formatDate } from '../components/OrderStatus'
import { PRODUCT_CREATE_REVIEW_RESET } from '../constants/productConstants'

const ProductScreen = ({ history, match }) => {
  const [qty, setQty] = useState(1)
  const [rating, setRating] = useState(0)
  const [comment, setComment] = useState('')
  const [reviewSubmitted, setReviewSubmitted] = useState(false)

  const dispatch = useDispatch()

  const productDetails = useSelector((state) => state.productDetails)
  const { loading, error, product } = productDetails

  const userLogin = useSelector((state) => state.userLogin)
  const { userInfo } = userLogin

  const productReviewCreate = useSelector((state) => state.productReviewCreate)
  const {
    loading: loadingProductReview,
    error: errorProductReview,
    success: successProductReview,
  } = productReviewCreate

  useEffect(() => {
    if (successProductReview) {
      setReviewSubmitted(true)
      setRating(0)
      setComment('')
      dispatch({type: PRODUCT_CREATE_REVIEW_RESET})
    }
    dispatch(listProductDetails(match.params.id))
  }, [dispatch, match, successProductReview])

  const addToCartHandler = () => {
    history.push(`/cart/${match.params.id}?qty=${qty}`)
  }
  const submitHandler = (e) => {
    e.preventDefault()
    setReviewSubmitted(false)
    dispatch(
      createProductReview(match.params.id, {
        rating,
        comment,
      })
    )
  }

  const inStock = product.countInStock > 0

  return (
    <>
      <BackLink to='/'>Back to products</BackLink>
      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant='danger'>{error}</Message>
      ) : (
        <>
          <Meta title={product.name} />
          <div className='product-detail'>
            <div className='gallery'>
              <img src={product.image} alt={product.name} />
            </div>

            <div className='product-detail__info'>
              <div className='stack stack--sm'>
                <p className='eyebrow'>
                  {[product.brand, product.category].filter(Boolean).join(' · ')}
                </p>
                <h1 className='product-detail__title'>{product.name}</h1>
                <Rating value={product.rating} text={`${product.numReviews} reviews`} />
              </div>

              <p className='price product-detail__price'>${product.price}</p>

              <p className='product-detail__description'>{product.description}</p>

              <div className='card card__body purchase-panel'>
                <div className='purchase-panel__row'>
                  <span className='text-muted'>Availability</span>
                  {inStock ? (
                    <Badge tone='success' dot>
                      In stock
                    </Badge>
                  ) : (
                    <Badge tone='danger' dot>
                      Out of stock
                    </Badge>
                  )}
                </div>

                {inStock && (
                  <div className='purchase-panel__row'>
                    <label htmlFor='qty' className='text-muted'>
                      Quantity
                    </label>
                    <select
                      id='qty'
                      className='select purchase-panel__qty'
                      value={qty}
                      onChange={(e) => setQty(e.target.value)}
                    >
                      {[...Array(product.countInStock).keys()].map((x) => (
                        <option key={x + 1} value={x + 1}>
                          {x + 1}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                <Button
                  onClick={addToCartHandler}
                  variant='primary'
                  size='lg'
                  block
                  disabled={product.countInStock === 0}
                >
                  <i className='fas fa-shopping-bag' aria-hidden='true' />
                  Add to cart
                </Button>
              </div>
            </div>
          </div>

          <section className='section reviews' aria-labelledby='reviews-heading'>
            <div>
              <div className='section__header'>
                <h2 id='reviews-heading'>Customer reviews</h2>
                {product.reviews.length > 0 && (
                  <Rating value={product.rating} text={`${product.numReviews} reviews`} />
                )}
              </div>
              {product.reviews.length === 0 ? (
                <EmptyState
                  compact
                  icon='fa-comment-alt'
                  title='No reviews yet'
                  description='Be the first to share what you think about this product.'
                />
              ) : (
                <ul>
                  {product.reviews.map((review) => (
                    <li key={review._id} className='review'>
                      <div className='review__header'>
                        <span className='avatar' aria-hidden='true'>
                          {review.name.charAt(0)}
                        </span>
                        <div>
                          <p className='review__author'>{review.name}</p>
                          <p className='review__date'>
                            <time dateTime={review.createdAt}>
                              {formatDate(review.createdAt)}
                            </time>
                          </p>
                        </div>
                      </div>
                      <Rating value={review.rating} />
                      <p className='review__body'>{review.comment}</p>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className='card card--padded'>
              <h2 className='card__title'>Write a review</h2>
              <p className='card__subtitle'>Share your experience with other shoppers.</p>
              <div className='stack'>
                {reviewSubmitted && (
                  <Message variant='success'>Thanks! Your review has been submitted.</Message>
                )}
                {errorProductReview && (
                  <Message variant='danger'>{errorProductReview}</Message>
                )}
                {userInfo ? (
                  <form onSubmit={submitHandler} className='stack'>
                    <SelectField
                      id='rating'
                      label='Rating'
                      value={rating}
                      required
                      onChange={(e) => setRating(e.target.value)}
                    >
                      <option value=''>Select a rating…</option>
                      <option value='1'>1 — Poor</option>
                      <option value='2'>2 — Fair</option>
                      <option value='3'>3 — Good</option>
                      <option value='4'>4 — Very good</option>
                      <option value='5'>5 — Excellent</option>
                    </SelectField>
                    <TextAreaField
                      id='comment'
                      label='Comment'
                      rows={4}
                      placeholder='What did you like or dislike?'
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                    />
                    <div>
                      <Button type='submit' variant='primary' loading={loadingProductReview}>
                        Submit review
                      </Button>
                    </div>
                  </form>
                ) : (
                  <Message>
                    Please <Link to='/login'>sign in</Link>{' '}
                    to write a review.
                  </Message>
                )}
              </div>
            </div>
          </section>
        </>
      )}
    </>
  )
}

export default ProductScreen
