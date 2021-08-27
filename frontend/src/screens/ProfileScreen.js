import React, { useState, useEffect } from 'react'

import { Form, Button, Row, Col } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import Message from '../components/Message'
import Loader from '../components/Loader'
import { getUserDetails, updateUserProfile } from '../actions/userActions'
// import FormContainer from '../components/FormContainer'

const ProfileScreen = ({ location, history }) => {
  // console.log("location->",location)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [message, setMessage] = useState(null)

  const dispatch = useDispatch()
  const userDetails = useSelector((state) => state.userDetails)
  // console.log(userDetails);
  const { loading, error, user } = userDetails

  const userLogin = useSelector((state) => state.userLogin)
  // console.log(userLogin);
  const { userInfo } = userLogin
  // console.log(userInfo)

  const userUpdateProfile = useSelector((state) => state.userUpdateProfile)
  // console.log(userLogin);
  const { success } = userUpdateProfile
  // console.log(userInfo)

  // const redirect = location.search ? location.search.split('=')[1] : '/'
  // console.log('redirect->',redirect)
  useEffect(() => {
    if (!userInfo) {
      history.push('/login')
    } else {
      if (!user.name) {
        dispatch(getUserDetails('profile'))
      } else {
        setName(user.name)
        setEmail(user.email)
      }
    }
  }, [dispatch, history, userInfo, user])
  const submitHandler = (e) => {
    e.preventDefault()
    //   DISPATCH REGISTER
    if (password !== confirmPassword) {
      setMessage('Password do not match')
    } else {
      //  DISPATCH UPDATE PROFILE
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
    <Row>
      <Col md={3}>
        <h1>User Profile</h1>
        {message && <Message variant='danger'>{message}</Message>}
        {error && <Message variant='danger'>{error}</Message>}
        {success && <Message variant='success'>Profile Updated</Message>}
        {loading && <Loader />}

        <Form onSubmit={submitHandler}>
          <Form.Group controlId='name'>
            <Form.Label>Name </Form.Label>
            <Form.Control
              type='name'
              placeholder='Enter your name'
              value={name}
              onChange={(e) => setName(e.target.value)}
            ></Form.Control>
          </Form.Group>

          <Form.Group controlId='email'>
            <Form.Label>Email Address</Form.Label>
            <Form.Control
              type='email'
              placeholder='Enter email'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            ></Form.Control>
          </Form.Group>

          <Form.Group controlId='password'>
            <Form.Label>Password</Form.Label>
            <Form.Control
              type='password'
              placeholder='Enter password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            ></Form.Control>
          </Form.Group>

          <Form.Group controlId='confirmPassword'>
            <Form.Label>Confirm Password</Form.Label>
            <Form.Control
              type='password'
              placeholder='Confirm password'
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            ></Form.Control>
          </Form.Group>

          <Button type='submit' variant='primary' className='my-2'>
            Update
          </Button>
        </Form>
      </Col>
      <Col md={9}>
        <h2>My Odrers</h2>
      </Col>
    </Row>
  )
}

export default ProfileScreen
