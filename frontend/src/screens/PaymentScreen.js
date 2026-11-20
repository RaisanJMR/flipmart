import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import FormContainer from '../components/FormContainer'
import { savePaymentMethod } from '../actions/cartActions'
import CheckoutSteps from '../components/CheckoutSteps'
import Button from '../components/ui/Button'
import BackLink from '../components/ui/BackLink'

const PaymentScreen = ({ history }) => {
  const cart = useSelector((state) => state.cart)
  const { shippingAddress } = cart

  if (!shippingAddress) {
    history.push('/shipping')
  }

  const [paymentMethod, setPaymentMethod] = useState('PayPal')

  const dispatch = useDispatch()

  const submitHandler = (e) => {
    e.preventDefault()
    dispatch(savePaymentMethod(paymentMethod))
    history.push('/placeorder')
  }
  return (
    <FormContainer wide>
      <CheckoutSteps step1 step2 step3 />
      <div className='card card--padded'>
        <h1 className='card__title'>Payment method</h1>
        <p className='card__subtitle'>Choose how you’d like to pay. You won’t be charged yet.</p>
        <form onSubmit={submitHandler} className='stack stack--lg'>
          <fieldset className='stack'>
            <legend className='field__label mb-4'>Select a method</legend>
            <label htmlFor='PayPal' className='choice-card'>
              <input
                type='radio'
                id='PayPal'
                name='paymentMethod'
                value='PayPal'
                className='choice__input'
                checked={paymentMethod === 'PayPal'}
                onChange={(e) => setPaymentMethod(e.target.value)}
              />
              <span className='choice__text'>
                <strong className='text-sm'>PayPal or credit card</strong>
                <span className='choice__description'>
                  Pay securely with your PayPal account or any major card.
                </span>
              </span>
              <span className='choice-card__icon' aria-hidden='true'>
                <i className='fab fa-paypal' />
              </span>
            </label>
          </fieldset>
          <div className='cluster cluster--between'>
            <BackLink to='/shipping'>Back to shipping</BackLink>
            <Button type='submit' variant='primary' size='lg'>
              Review order
              <i className='fas fa-arrow-right' aria-hidden='true' />
            </Button>
          </div>
        </form>
      </div>
    </FormContainer>
  )
}

export default PaymentScreen
