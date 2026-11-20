import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Message from '../components/Message'
import Loader from '../components/Loader'
import AdminNav from '../components/AdminNav'
import PageHeader from '../components/ui/PageHeader'
import Button from '../components/ui/Button'
import Badge from '../components/ui/Badge'
import EmptyState from '../components/ui/EmptyState'
import ConfirmDialog from '../components/ui/ConfirmDialog'
import { listUsers, deleteUsers } from '../actions/userActions'

function UserListScreen({ history }) {
  const dispatch = useDispatch()
  const [pendingDelete, setPendingDelete] = useState(null)
  const userList = useSelector((state) => state.userList)
  const { loading, error, users } = userList
  const userLogin = useSelector((state) => state.userLogin)
  const { userInfo } = userLogin
  const userDelete = useSelector((state) => state.userDelete)
  const { success: successDelete } = userDelete

  useEffect(() => {
    if (userInfo && userInfo.isAdmin) {
      dispatch(listUsers())
    } else {
      history.push('/login')
    }
  }, [dispatch, history, userInfo, successDelete])

  const confirmDelete = () => {
    dispatch(deleteUsers(pendingDelete._id))
    setPendingDelete(null)
  }

  return (
    <>
      <PageHeader
        eyebrow='Admin'
        title='Users'
        description='View customer accounts and manage admin access.'
      />
      <AdminNav />
      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant='danger'>{error}</Message>
      ) : users.length === 0 ? (
        <EmptyState icon='fa-users' title='No users yet' />
      ) : (
        <div className='table-wrap' tabIndex={0} role='region' aria-label='Users'>
          <table className='data-table'>
            <thead>
              <tr>
                <th scope='col'>Name</th>
                <th scope='col'>Email</th>
                <th scope='col'>Role</th>
                <th scope='col'>ID</th>
                <th scope='col'>
                  <span className='visually-hidden'>Actions</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user._id}>
                  <td>
                    <span className='cluster'>
                      <span className='avatar' aria-hidden='true'>
                        {user.name.charAt(0)}
                      </span>
                      <span className='data-table__primary'>{user.name}</span>
                    </span>
                  </td>
                  <td>
                    <a href={`mailto:${user.email}`}>{user.email}</a>
                  </td>
                  <td>
                    {user.isAdmin ? (
                      <Badge tone='primary'>Admin</Badge>
                    ) : (
                      <Badge>Customer</Badge>
                    )}
                  </td>
                  <td className='data-table__id'>{user._id}</td>
                  <td className='data-table__actions'>
                    <span className='cluster'>
                      <Button
                        to={`/admin/user/${user._id}/edit`}
                        variant='ghost'
                        size='sm'
                        iconOnly
                        aria-label={`Edit ${user.name}`}
                        data-tooltip='Edit'
                      >
                        <i className='fas fa-pen' aria-hidden='true' />
                      </Button>
                      <Button
                        variant='danger-ghost'
                        size='sm'
                        iconOnly
                        aria-label={`Delete ${user.name}`}
                        data-tooltip='Delete'
                        onClick={() => setPendingDelete(user)}
                      >
                        <i className='fas fa-trash-alt' aria-hidden='true' />
                      </Button>
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <ConfirmDialog
        open={Boolean(pendingDelete)}
        tone='danger'
        title='Delete user?'
        description={
          pendingDelete
            ? `${pendingDelete.name} (${pendingDelete.email}) will be permanently removed. This can’t be undone.`
            : ''
        }
        confirmLabel='Delete user'
        onConfirm={confirmDelete}
        onCancel={() => setPendingDelete(null)}
      />
    </>
  )
}

export default UserListScreen
