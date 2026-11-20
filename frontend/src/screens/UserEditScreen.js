import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Message from '../components/Message'
import Loader from '../components/Loader'
import FormContainer from '../components/FormContainer'
import BackLink from '../components/ui/BackLink'
import Button from '../components/ui/Button'
import { TextField, Checkbox } from '../components/ui/Field'
import { getUserDetails, updateUser } from '../actions/userActions'
import { USER_UPDATE_RESET } from '../constants/userConstants'

const UserEditScreen = ({ match, history }) => {
  const userId = match.params.id

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [isAdmin, setIsAdmin] = useState(false)

  const dispatch = useDispatch()

  const userDetails = useSelector((state) => state.userDetails)
  const { loading, error, user } = userDetails

  const userUpdate = useSelector((state) => state.userUpdate)
  const {
    loading: loadingUpdate,
    error: errorUpdate,
    success: successUpdate,
  } = userUpdate

  useEffect(() => {
    if (successUpdate) {
      dispatch({ type: USER_UPDATE_RESET })
      history.push('/admin/userlist')
    } else {
      if (!user.name || user._id !== userId) {
        dispatch(getUserDetails(userId))
      } else {
        setName(user.name)
        setEmail(user.email)
        setIsAdmin(user.isAdmin)
      }
    }
  }, [dispatch, history, userId, user, successUpdate])

  const submitHandler = (e) => {
    e.preventDefault()
    dispatch(updateUser({ _id: userId, name, email, isAdmin }))
  }

  return (
    <FormContainer>
      <BackLink to='/admin/userlist'>Back to users</BackLink>
      <div className='card card--padded'>
        <p className='eyebrow'>Admin</p>
        <h1 className='card__title'>Edit user</h1>
        <p className='card__subtitle'>Update account details and permissions.</p>
        {loading ? (
          <Loader />
        ) : error ? (
          <Message variant='danger'>{error}</Message>
        ) : (
          <form onSubmit={submitHandler} className='stack'>
            {errorUpdate && <Message variant='danger'>{errorUpdate}</Message>}
            <TextField
              id='name'
              label='Full name'
              type='text'
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <TextField
              id='email'
              label='Email address'
              type='email'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Checkbox
              id='isadmin'
              label='Administrator'
              description='Admins can manage users, products and orders.'
              checked={isAdmin}
              onChange={(e) => setIsAdmin(e.target.checked)}
            />
            <div className='form-actions'>
              <Button to='/admin/userlist' variant='ghost'>
                Cancel
              </Button>
              <Button type='submit' variant='primary' loading={loadingUpdate}>
                Save changes
              </Button>
            </div>
          </form>
        )}
      </div>
    </FormContainer>
  )
}

export default UserEditScreen
