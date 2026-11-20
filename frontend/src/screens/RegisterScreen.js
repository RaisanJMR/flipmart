import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import Message from '../components/Message'
import { register } from '../actions/userActions'
import FormContainer from '../components/FormContainer'
import Button from '../components/ui/Button'
import { TextField } from '../components/ui/Field'

const RegisterScreen = ({ location, history }) => {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [message, setMessage] = useState(null)

  const dispatch = useDispatch()
  const userRegister = useSelector((state) => state.userRegister)
  const { loading, error, userInfo } = userRegister

  const redirect = location.search ? location.search.split('=')[1] : '/'
  useEffect(() => {
    if (userInfo) {
      history.push(redirect)
    }
  }, [history, userInfo, redirect])
  const submitHandler = (e) => {
    e.preventDefault()
    if (password !== confirmPassword) {
      setMessage('Passwords do not match')
    } else {
      setMessage(null)
      dispatch(register(name, email, password))
    }
  }

  return (
    <FormContainer auth>
      <div className='card card--padded'>
        <h1 className='card__title'>Create your account</h1>
        <p className='card__subtitle'>It only takes a minute to get started.</p>

        <form onSubmit={submitHandler} className='stack'>
          {message && <Message variant='danger'>{message}</Message>}
          {error && <Message variant='danger'>{error}</Message>}
          <TextField
            id='name'
            label='Full name'
            type='text'
            autoComplete='name'
            placeholder='Jane Doe'
            value={name}
            required
            onChange={(e) => setName(e.target.value)}
          />
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
            autoComplete='new-password'
            placeholder='Create a password'
            value={password}
            required
            onChange={(e) => setPassword(e.target.value)}
          />
          <TextField
            id='confirmPassword'
            label='Confirm password'
            type='password'
            autoComplete='new-password'
            placeholder='Repeat your password'
            value={confirmPassword}
            required
            aria-invalid={message ? true : undefined}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          <Button type='submit' variant='primary' size='lg' block loading={loading}>
            Create account
          </Button>
        </form>
      </div>
      <p className='form-footnote'>
        Already have an account?{' '}
        <Link to={redirect ? `/login?redirect=${redirect}` : '/login'}>Sign in</Link>
      </p>
    </FormContainer>
  )
}

export default RegisterScreen
