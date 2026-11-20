import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import FormContainer from '../components/FormContainer'
import CheckoutSteps from '../components/CheckoutSteps'
import { saveShippingAddress } from '../actions/cartActions'
import Button from '../components/ui/Button'
import { TextField } from '../components/ui/Field'

const ShippingScreen = ({ history }) => {
  const cart = useSelector((state) => state.cart)
  const { shippingAddress } = cart
  const [address, setAddress] = useState(shippingAddress.address)
  const [city, setCity] = useState(shippingAddress.city)
  const [postalCode, setPostalCode] = useState(shippingAddress.postalCode)
  const [country, setCountry] = useState(shippingAddress.country)
  const dispatch = useDispatch()

  const submitHandler = (e) => {
    e.preventDefault()
    dispatch(saveShippingAddress({ address, city, postalCode, country }))
    history.push('/payment')
  }
  return (
    <FormContainer wide>
      <CheckoutSteps step1 step2 />
      <div className='card card--padded'>
        <h1 className='card__title'>Shipping address</h1>
        <p className='card__subtitle'>Where should we deliver your order?</p>
        <form onSubmit={submitHandler} className='form-grid'>
          <TextField
            id='address'
            label='Street address'
            className='form-grid__full'
            type='text'
            autoComplete='street-address'
            placeholder='123 Main Street'
            value={address || ''}
            required
            onChange={(e) => setAddress(e.target.value)}
          />
          <TextField
            id='city'
            label='City'
            type='text'
            autoComplete='address-level2'
            placeholder='City'
            value={city || ''}
            required
            onChange={(e) => setCity(e.target.value)}
          />
          <TextField
            id='postalCode'
            label='Postal code'
            type='text'
            autoComplete='postal-code'
            placeholder='Postal code'
            value={postalCode || ''}
            required
            onChange={(e) => setPostalCode(e.target.value)}
          />
          <TextField
            id='country'
            label='Country'
            className='form-grid__full'
            type='text'
            autoComplete='country-name'
            placeholder='Country'
            value={country || ''}
            required
            onChange={(e) => setCountry(e.target.value)}
          />
          <div className='form-grid__full form-actions'>
            <Button type='submit' variant='primary' size='lg'>
              Continue to payment
              <i className='fas fa-arrow-right' aria-hidden='true' />
            </Button>
          </div>
        </form>
      </div>
    </FormContainer>
  )
}

export default ShippingScreen
