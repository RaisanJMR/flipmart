import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { PayPalButton } from 'react-paypal-button-v2'
import { useDispatch, useSelector } from 'react-redux'
import Message from '../components/Message'
import Loader from '../components/Loader'
import {
  getOrderDetails,
  payOrder,
  deliverOrder,
} from '../actions/orderActions'
import {
  ORDER_PAY_RESET,
  ORDER_DELIVER_RESET,
} from '../constants/orderConstants'
import Button from '../components/ui/Button'
import EmptyState from '../components/ui/EmptyState'
import { OrderItems, OrderTotals, formatAddress } from '../components/OrderSummary'
import { PaidStatus, DeliveryStatus, formatDate } from '../components/OrderStatus'

const formatDateTime = (value) =>
  new Date(value).toLocaleString('en-GB', {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  })

const OrderScreen = ({ match, history }) => {
  const orderId = match.params.id
  const [sdkReady, setSdkReady] = useState(false)
  const dispatch = useDispatch()

  const orderDetails = useSelector((state) => state.orderDetails)
  const { order, loading, error } = orderDetails

  const orderPay = useSelector((state) => state.orderPay)
  const { loading: loadingPay, success: successPay } = orderPay

  const orderDeliver = useSelector((state) => state.orderDeliver)
  const { loading: loadingDeliver, success: successDeliver } = orderDeliver

  const userLogin = useSelector((state) => state.userLogin)
  const { userInfo } = userLogin
  //   calculate prices
  if (!loading && order) {
    const addDecimals = (num) => {
      return (Math.round(num * 100) / 100).toFixed(2)
    }
    order.itemsPrice = addDecimals(
      order.orderItems.reduce((acc, item) => acc + item.price * item.qty, 0)
    )
  }

  useEffect(() => {
    if (!userInfo) {
      history.push('/login')
    }
    const addPayPalScript = async () => {
      const { data: clientId } = await axios.get('/api/config/paypal')
      const script = document.createElement('script')
      script.type = 'text/javascript'
      script.src = `https://www.paypal.com/sdk/js?client-id=${clientId}`
      script.async = true
      script.onload = () => {
        setSdkReady(true)
      }
      document.body.appendChild(script)
    }
    if (!order || successPay || order._id !== orderId || successDeliver) {
      dispatch({ type: ORDER_PAY_RESET })
      dispatch({ type: ORDER_DELIVER_RESET })
      dispatch(getOrderDetails(orderId))
    } else if (!order.isPaid) {
      addPayPalScript()
    } else {
      setSdkReady(true)
    }
  }, [order, orderId, dispatch, successPay, successDeliver, history, userInfo])

  const successPaymentHandler = (paymentResult) => {
    dispatch(payOrder(orderId, paymentResult))
  }
  const deliverHandler = () => {
    dispatch(deliverOrder(order))
  }

  if (loading) return <Loader />
  if (error) return <Message variant='danger'>{error}</Message>

  return (
    <>
      <div className='page-header'>
        <div className='page-header__titles'>
          <p className='eyebrow'>Order</p>
          <h1 className='truncate'>#{order._id}</h1>
          {order.createdAt && (
            <p className='page-header__description'>Placed on {formatDate(order.createdAt)}</p>
          )}
        </div>
        <div className='page-header__actions'>
          <PaidStatus isPaid={order.isPaid} paidAt={order.paidAt} />
          <DeliveryStatus isDelivered={order.isDelivered} deliveredAt={order.deliveredAt} />
        </div>
      </div>

      <div className='split-layout'>
        <div className='stack stack--lg'>
          <section className='card' aria-labelledby='shipping-heading'>
            <div className='card__header'>
              <h2 id='shipping-heading'>Shipping</h2>
            </div>
            <div className='card__body stack'>
              <dl className='detail-list'>
                <div className='detail-list__item'>
                  <dt>Name</dt>
                  <dd>{order.user.name}</dd>
                </div>
                <div className='detail-list__item'>
                  <dt>Email</dt>
                  <dd>
                    <a href={`mailto:${order.user.email}`}>{order.user.email}</a>
                  </dd>
                </div>
                <div className='detail-list__item'>
                  <dt>Address</dt>
                  <dd>{formatAddress(order.shippingAddress)}</dd>
                </div>
              </dl>
              {order.isDelivered ? (
                <Message variant='success'>Delivered on {formatDateTime(order.deliveredAt)}</Message>
              ) : (
                <Message variant='info'>Not delivered yet</Message>
              )}
            </div>
          </section>

          <section className='card' aria-labelledby='payment-heading'>
            <div className='card__header'>
              <h2 id='payment-heading'>Payment</h2>
            </div>
            <div className='card__body stack'>
              <dl className='detail-list'>
                <div className='detail-list__item'>
                  <dt>Method</dt>
                  <dd>{order.paymentMethod}</dd>
                </div>
              </dl>
              {order.isPaid ? (
                <Message variant='success'>Paid on {formatDateTime(order.paidAt)}</Message>
              ) : (
                <Message variant='warning'>Awaiting payment</Message>
              )}
            </div>
          </section>

          <section className='card' aria-labelledby='items-heading'>
            <div className='card__header'>
              <h2 id='items-heading'>Items</h2>
            </div>
            {order.orderItems.length === 0 ? (
              <div className='card__body'>
                <EmptyState compact icon='fa-shopping-bag' title='This order has no items' />
              </div>
            ) : (
              <OrderItems items={order.orderItems} />
            )}
          </section>
        </div>

        <aside className='split-layout__aside card' aria-labelledby='summary-heading'>
          <div className='card__header'>
            <h2 id='summary-heading'>Order summary</h2>
          </div>
          <div className='card__body stack'>
            <OrderTotals
              itemsPrice={order.itemsPrice}
              shippingPrice={order.shippingPrice}
              taxPrice={order.taxPrice}
              totalPrice={order.totalPrice}
            />
            {!order.isPaid && (
              <div className='stack stack--sm'>
                {loadingPay && <Loader inline label='Processing payment…' />}
                {!sdkReady ? (
                  <Loader inline label='Loading payment options…' />
                ) : (
                  <PayPalButton amount={order.totalPrice} onSuccess={successPaymentHandler} />
                )}
              </div>
            )}
            {loadingDeliver && <Loader inline label='Updating…' />}
            {userInfo && userInfo.isAdmin && order.isPaid && !order.isDelivered && (
              <Button variant='primary' block onClick={deliverHandler}>
                <i className='fas fa-truck' aria-hidden='true' />
                Mark as delivered
              </Button>
            )}
          </div>
        </aside>
      </div>
    </>
  )
}

export default OrderScreen
