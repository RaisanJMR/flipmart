import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { addToCart, removeFromCart } from '../actions/cartActions'
import PageHeader from '../components/ui/PageHeader'
import Button from '../components/ui/Button'
import EmptyState from '../components/ui/EmptyState'

const CartScreen = ({ match, location, history }) => {
  const productId = match.params.id
  const qty = location.search ? Number(location.search.split('=')[1]) : 1
  const dispatch = useDispatch()
  const cart = useSelector((state) => state.cart)
  const { cartItems } = cart
  useEffect(() => {
    if (productId) {
      dispatch(addToCart(productId, qty))
    }
  }, [dispatch, productId, qty])
  const removeFromCartHandler = (id) => {
    dispatch(removeFromCart(id))
  }
  const CheckOutHandler = () => {
    history.push('/login?redirect=shipping')
  }

  const itemCount = cartItems.reduce((acc, item) => acc + item.qty, 0)
  const subtotal = cartItems.reduce((acc, item) => acc + item.qty * item.price, 0).toFixed(2)

  if (cartItems.length === 0) {
    return (
      <>
        <PageHeader title='Shopping cart' />
        <EmptyState
          icon='fa-shopping-bag'
          title='Your cart is empty'
          description='Looks like you haven’t added anything yet. Explore the catalog to find something you love.'
          action={
            <Button to='/' variant='primary'>
              Continue shopping
            </Button>
          }
        />
      </>
    )
  }

  return (
    <>
      <PageHeader
        title='Shopping cart'
        description={`${itemCount} ${itemCount === 1 ? 'item' : 'items'} in your cart`}
      />
      <div className='split-layout'>
        <section className='card' aria-label='Cart items'>
          <ul className='line-items'>
            {cartItems.map((item) => (
              <li key={item.product} className='line-item'>
                <div className='line-item__media'>
                  <img src={item.image} alt='' />
                </div>
                <div>
                  <Link to={`/product/${item.product}`} className='line-item__name'>
                    {item.name}
                  </Link>
                  <p className='line-item__meta'>${item.price} each</p>
                </div>
                <div className='line-item__controls'>
                  <label htmlFor={`qty-${item.product}`} className='visually-hidden'>
                    Quantity for {item.name}
                  </label>
                  <select
                    id={`qty-${item.product}`}
                    className='select select--sm'
                    value={item.qty}
                    onChange={(e) =>
                      dispatch(addToCart(item.product, Number(e.target.value)))
                    }
                  >
                    {[...Array(item.countInStock).keys()].map((x) => (
                      <option key={x + 1} value={x + 1}>
                        {x + 1}
                      </option>
                    ))}
                  </select>
                  <span className='line-item__total'>
                    ${(item.qty * item.price).toFixed(2)}
                  </span>
                  <Button
                    variant='danger-ghost'
                    size='sm'
                    iconOnly
                    aria-label={`Remove ${item.name} from cart`}
                    data-tooltip='Remove'
                    onClick={() => removeFromCartHandler(item.product)}
                  >
                    <i className='fas fa-trash-alt' aria-hidden='true' />
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        </section>

        <aside className='split-layout__aside card' aria-label='Order summary'>
          <div className='card__header'>
            <h2>Summary</h2>
          </div>
          <div className='card__body stack'>
            <dl className='summary'>
              <div className='summary__row'>
                <dt>Items</dt>
                <dd>{itemCount}</dd>
              </div>
              <div className='summary__row summary__row--total'>
                <dt>Subtotal</dt>
                <dd>${subtotal}</dd>
              </div>
            </dl>
            <p className='text-xs text-subtle'>Shipping and taxes are calculated at checkout.</p>
            <Button
              variant='primary'
              size='lg'
              block
              disabled={cartItems.length === 0}
              onClick={CheckOutHandler}
            >
              Proceed to checkout
              <i className='fas fa-arrow-right' aria-hidden='true' />
            </Button>
            <Button to='/' variant='ghost' block>
              Continue shopping
            </Button>
          </div>
        </aside>
      </div>
    </>
  )
}

export default CartScreen
