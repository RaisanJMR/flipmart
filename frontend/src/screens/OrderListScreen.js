import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Message from '../components/Message'
import Loader from '../components/Loader'
import AdminNav from '../components/AdminNav'
import PageHeader from '../components/ui/PageHeader'
import Button from '../components/ui/Button'
import EmptyState from '../components/ui/EmptyState'
import { PaidStatus, DeliveryStatus, formatDate } from '../components/OrderStatus'
import { listOrders } from '../actions/orderActions'

function OrderListScreen({ history }) {
  const dispatch = useDispatch()

  const orderList = useSelector((state) => state.orderList)
  const { loading, error, orders } = orderList

  const userLogin = useSelector((state) => state.userLogin)
  const { userInfo } = userLogin

  useEffect(() => {
    if (userInfo && userInfo.isAdmin) {
      dispatch(listOrders())
    } else {
      history.push('/login')
    }
  }, [dispatch, history, userInfo])

  return (
    <>
      <PageHeader
        eyebrow='Admin'
        title='Orders'
        description='Track payments and fulfilment across all customer orders.'
      />
      <AdminNav />
      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant='danger'>{error}</Message>
      ) : orders.length === 0 ? (
        <EmptyState icon='fa-receipt' title='No orders yet' />
      ) : (
        <div className='table-wrap' tabIndex={0} role='region' aria-label='Orders'>
          <table className='data-table'>
            <thead>
              <tr>
                <th scope='col'>Order</th>
                <th scope='col'>Customer</th>
                <th scope='col'>Date</th>
                <th scope='col' className='data-table__numeric'>Total</th>
                <th scope='col'>Payment</th>
                <th scope='col'>Delivery</th>
                <th scope='col'>
                  <span className='visually-hidden'>Actions</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order._id}>
                  <td className='data-table__id' title={order._id}>
                    #{order._id.slice(-8)}
                  </td>
                  <td className='data-table__primary'>{order.user && order.user.name}</td>
                  <td>{formatDate(order.createdAt)}</td>
                  <td className='data-table__numeric'>${order.totalPrice}</td>
                  <td>
                    <PaidStatus isPaid={order.isPaid} paidAt={order.paidAt} />
                  </td>
                  <td>
                    <DeliveryStatus
                      isDelivered={order.isDelivered}
                      deliveredAt={order.deliveredAt}
                    />
                  </td>
                  <td className='data-table__actions'>
                    <Button to={`/order/${order._id}`} size='sm'>
                      Details
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  )
}

export default OrderListScreen
