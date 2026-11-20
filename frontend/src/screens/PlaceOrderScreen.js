import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Message from '../components/Message'
import CheckoutSteps from '../components/CheckoutSteps'
import { createOrder } from '../actions/orderActions'
import Button from '../components/ui/Button'
import EmptyState from '../components/ui/EmptyState'
import { OrderItems, OrderTotals, formatAddress } from '../components/OrderSummary'

const PlaceOrderScreen = ({ history }) => {
  const dispatch = useDispatch()
  const cart = useSelector((state) => state.cart)
  // Calculate Price
  const addDecimals = (num) => {
    return (Math.round(num * 100) / 100).toFixed(2)
  }
  cart.itemsPrice = addDecimals(
    cart.cartItems.reduce((acc, item) => acc + item.price * item.qty, 0)
  )
  cart.shippingPrice = addDecimals(cart.itemsPrice > 100 ? 0 : 100)
  cart.taxPrice = addDecimals(Number((0.15 * cart.itemsPrice).toFixed(2)))
  cart.totalPrice = (
    Number(cart.itemsPrice) +
    Number(cart.shippingPrice) +
    Number(cart.taxPrice)
  ).toFixed(2)
  const orderCreate = useSelector((state) => state.orderCreate)

  const { order, success, error, loading } = orderCreate

  useEffect(() => {
    if (success) {
      history.push(`/order/${order._id}`)
    }
    // eslint-disable-next-line
  }, [history, success])
  const placeOrderHandler = () => {
    dispatch(
      createOrder({
        orderItems: cart.cartItems,
        shippingAddress: cart.shippingAddress,
        paymentMethod: cart.paymentMethod,
        itemsPrice: cart.itemsPrice,
        shippingPrice: cart.shippingPrice,
        taxPrice: cart.taxPrice,
        totalPrice: cart.totalPrice,
      })
    )
  }
  return (
    <>
      <CheckoutSteps step1 step2 step3 step4 />
      <div className='page-header'>
        <div className='page-header__titles'>
          <h1>Review your order</h1>
          <p className='page-header__description'>
            Check the details below before placing your order.
          </p>
        </div>
      </div>
      <div className='split-layout'>
        <div className='stack stack--lg'>
          <section className='card' aria-labelledby='shipping-heading'>
            <div className='card__header'>
              <h2 id='shipping-heading'>Shipping</h2>
              <Button to='/shipping' variant='ghost' size='sm'>
                Edit
              </Button>
            </div>
            <div className='card__body'>
              <dl className='detail-list'>
                <div className='detail-list__item'>
                  <dt>Address</dt>
                  <dd>{formatAddress(cart.shippingAddress)}</dd>
                </div>
              </dl>
            </div>
          </section>

          <section className='card' aria-labelledby='payment-heading'>
            <div className='card__header'>
              <h2 id='payment-heading'>Payment</h2>
              <Button to='/payment' variant='ghost' size='sm'>
                Edit
              </Button>
            </div>
            <div className='card__body'>
              <dl className='detail-list'>
                <div className='detail-list__item'>
                  <dt>Method</dt>
                  <dd>{cart.paymentMethod}</dd>
                </div>
              </dl>
            </div>
          </section>

          <section className='card' aria-labelledby='items-heading'>
            <div className='card__header'>
              <h2 id='items-heading'>Items</h2>
            </div>
            {cart.cartItems.length === 0 ? (
              <div className='card__body'>
                <EmptyState
                  compact
                  icon='fa-shopping-bag'
                  title='Your cart is empty'
                  action={
                    <Button to='/' variant='secondary'>
                      Browse products
                    </Button>
                  }
                />
              </div>
            ) : (
              <OrderItems items={cart.cartItems} />
            )}
          </section>
        </div>

        <aside className='split-layout__aside card' aria-labelledby='summary-heading'>
          <div className='card__header'>
            <h2 id='summary-heading'>Order summary</h2>
          </div>
          <div className='card__body stack'>
            <OrderTotals
              itemsPrice={cart.itemsPrice}
              shippingPrice={cart.shippingPrice}
              taxPrice={cart.taxPrice}
              totalPrice={cart.totalPrice}
            />
            {error && <Message variant='danger'>{error}</Message>}
            <Button
              variant='primary'
              size='lg'
              block
              loading={loading}
              disabled={cart.cartItems.length === 0}
              onClick={placeOrderHandler}
            >
              Place order
            </Button>
          </div>
        </aside>
      </div>
    </>
  )
}

export default PlaceOrderScreen
