import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Message from '../components/Message'
import Loader from '../components/Loader'
import { getUserDetails, updateUserProfile } from '../actions/userActions'
import { listMyOrders } from '../actions/orderActions'
import PageHeader from '../components/ui/PageHeader'
import Button from '../components/ui/Button'
import EmptyState from '../components/ui/EmptyState'
import { TextField } from '../components/ui/Field'
import { PaidStatus, DeliveryStatus, formatDate } from '../components/OrderStatus'

const ProfileScreen = ({ location, history }) => {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [message, setMessage] = useState(null)

  const dispatch = useDispatch()
  const userDetails = useSelector((state) => state.userDetails)
  const { loading, error, user } = userDetails

  const userLogin = useSelector((state) => state.userLogin)
  const { userInfo } = userLogin

  const userUpdateProfile = useSelector((state) => state.userUpdateProfile)
  const { success } = userUpdateProfile

  const orderListMy = useSelector((state) => state.orderListMy)
  const { loading: loadingOrders, error: errorOrders, orders } = orderListMy

  useEffect(() => {
    if (!userInfo) {
      history.push('/login')
    } else {
      if (!user.name) {
        dispatch(getUserDetails('profile'))
        dispatch(listMyOrders())
      } else {
        setName(user.name)
        setEmail(user.email)
      }
    }
  }, [dispatch, history, userInfo, user])
  const submitHandler = (e) => {
    e.preventDefault()
    if (password !== confirmPassword) {
      setMessage('Passwords do not match')
    } else {
      setMessage(null)
      dispatch(
        updateUserProfile({
          id: user._id,
          name: name,
          email: email,
          password: password,
        })
      )
    }
  }

  return (
    <>
      <PageHeader
        eyebrow='Account'
        title='Your profile'
        description='Manage your personal details and review your order history.'
      />
      <div className='split-layout split-layout--aside-start'>
        <section className='card' aria-labelledby='profile-heading'>
          <div className='card__header'>
            <h2 id='profile-heading'>Personal details</h2>
          </div>
          <div className='card__body'>
            <form onSubmit={submitHandler} className='stack'>
              {message && <Message variant='danger'>{message}</Message>}
              {error && <Message variant='danger'>{error}</Message>}
              {success && <Message variant='success'>Profile updated</Message>}
              {loading && <Loader inline />}
              <TextField
                id='name'
                label='Full name'
                type='text'
                autoComplete='name'
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <TextField
                id='email'
                label='Email address'
                type='email'
                autoComplete='email'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <TextField
                id='password'
                label='New password'
                type='password'
                autoComplete='new-password'
                placeholder='Leave blank to keep current'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <TextField
                id='confirmPassword'
                label='Confirm new password'
                type='password'
                autoComplete='new-password'
                value={confirmPassword}
                aria-invalid={message ? true : undefined}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              <Button type='submit' variant='primary' block>
                Save changes
              </Button>
            </form>
          </div>
        </section>

        <section aria-labelledby='orders-heading'>
          <div className='section__header'>
            <h2 id='orders-heading'>Order history</h2>
          </div>
          {loadingOrders ? (
            <Loader />
          ) : errorOrders ? (
            <Message variant='danger'>{errorOrders}</Message>
          ) : orders.length === 0 ? (
            <EmptyState
              icon='fa-receipt'
              title='No orders yet'
              description='When you place an order, it will show up here.'
              action={
                <Button to='/' variant='secondary'>
                  Start shopping
                </Button>
              }
            />
          ) : (
            <div className='table-wrap' tabIndex={0} role='region' aria-labelledby='orders-heading'>
              <table className='data-table'>
                <thead>
                  <tr>
                    <th scope='col'>Order</th>
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
        </section>
      </div>
    </>
  )
}

export default ProfileScreen
