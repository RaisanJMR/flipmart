import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import Message from '../components/Message'
import { login } from '../actions/userActions'
import FormContainer from '../components/FormContainer'
import Button from '../components/ui/Button'
import { TextField } from '../components/ui/Field'

const LoginScreen = ({ location, history }) => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const dispatch = useDispatch()
  const userLogin = useSelector((state) => state.userLogin)
  const { loading, error, userInfo } = userLogin
  const redirect = location.search ? location.search.split('=')[1] : '/'
  useEffect(() => {
    if (userInfo) {
      history.push(redirect)
    }
  }, [history, userInfo, redirect])
  const submitHandler = (e) => {
    e.preventDefault()
   dispatch(login(email,password))
  }
  return (
    <FormContainer auth>
      <div className='card card--padded'>
        <h1 className='card__title'>Welcome back</h1>
        <p className='card__subtitle'>Sign in to your Flipbay account to continue.</p>

        <form onSubmit={submitHandler} className='stack'>
          {error && <Message variant='danger'>{error}</Message>}
          <TextField
            id='email'
            label='Email address'
            type='email'
            autoComplete='email'
            placeholder='you@example.com'
            value={email}
            required
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            id='password'
            label='Password'
            type='password'
            autoComplete='current-password'
            placeholder='••••••••'
            value={password}
            required
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button type='submit' variant='primary' size='lg' block loading={loading}>
            Sign in
          </Button>
        </form>
      </div>
      <p className='form-footnote'>
        New to Flipbay?{' '}
        <Link to={redirect ? `/register?redirect=${redirect}` : '/register'}>
          Create an account
        </Link>
      </p>
    </FormContainer>
  )
}

export default LoginScreen
