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
import {
  listProducts,
  deleteProduct,
  createProduct,
} from '../actions/productActions'
import Paginate from '../components/Paginate'
import { PRODUCT_CREATE_RESET } from '../constants/productConstants'

function ProductListScreen({ history, match }) {
  const pageNumber = match.params.pageNumber || 1
  // { type: 'create' } | { type: 'delete', product }
  const [pendingAction, setPendingAction] = useState(null)

  const dispatch = useDispatch()

  const productList = useSelector((state) => state.productList)
  const { loading, error, products, page, pages } = productList

  const productDelete = useSelector((state) => state.productDelete)
  const {
    loading: loadingDelete,
    error: errorDelete,
    success: successDelete,
  } = productDelete
  const productCreate = useSelector((state) => state.productCreate)
  const {
    loading: loadingCreate,
    error: errorCreate,
    success: successCreate,
    product: createdProduct,
  } = productCreate

  const userLogin = useSelector((state) => state.userLogin)
  const { userInfo } = userLogin

  useEffect(() => {
    dispatch({ type: PRODUCT_CREATE_RESET })

    if (!userInfo.isAdmin) {
      history.push('/login')
    }
    if (successCreate) {
      history.push(`/admin/product/${createdProduct._id}/edit`)
    } else {
      dispatch(listProducts('', pageNumber))
    }
  }, [dispatch, history, userInfo, successDelete, successCreate, createdProduct, pageNumber])

  const confirmAction = () => {
    if (pendingAction.type === 'create') {
      dispatch(createProduct())
    } else {
      dispatch(deleteProduct(pendingAction.product._id))
    }
    setPendingAction(null)
  }

  const isDelete = pendingAction && pendingAction.type === 'delete'

  return (
    <>
      <PageHeader
        eyebrow='Admin'
        title='Products'
        description='Manage your catalog, pricing and inventory.'
        actions={
          <Button
            variant='primary'
            loading={loadingCreate}
            onClick={() => setPendingAction({ type: 'create' })}
          >
            <i className='fas fa-plus' aria-hidden='true' />
            New product
          </Button>
        }
      />
      <AdminNav />
      <div className='stack'>
        {loadingDelete && <Loader inline label='Deleting product…' />}
        {errorDelete && <Message variant='danger'>{errorDelete}</Message>}
        {errorCreate && <Message variant='danger'>{errorCreate}</Message>}
        {loading ? (
          <Loader />
        ) : error ? (
          <Message variant='danger'>{error}</Message>
        ) : products.length === 0 ? (
          <EmptyState
            icon='fa-box-open'
            title='No products yet'
            description='Create your first product to start selling.'
          />
        ) : (
          <div>
            <div className='table-wrap' tabIndex={0} role='region' aria-label='Products'>
              <table className='data-table'>
                <thead>
                  <tr>
                    <th scope='col'>Product</th>
                    <th scope='col' className='data-table__numeric'>Price</th>
                    <th scope='col'>Category</th>
                    <th scope='col'>Brand</th>
                    <th scope='col'>Stock</th>
                    <th scope='col'>
                      <span className='visually-hidden'>Actions</span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product) => (
                    <tr key={product._id}>
                      <td>
                        <span className='table-product'>
                          <img src={product.image} alt='' />
                          <span className='data-table__primary' title={product.name}>
                            {product.name}
                          </span>
                        </span>
                      </td>
                      <td className='data-table__numeric'>${product.price}</td>
                      <td>{product.category}</td>
                      <td>{product.brand}</td>
                      <td>
                        {product.countInStock > 0 ? (
                          <Badge tone='success'>{product.countInStock} in stock</Badge>
                        ) : (
                          <Badge tone='danger'>Out of stock</Badge>
                        )}
                      </td>
                      <td className='data-table__actions'>
                        <span className='cluster'>
                          <Button
                            to={`/admin/product/${product._id}/edit`}
                            variant='ghost'
                            size='sm'
                            iconOnly
                            aria-label={`Edit ${product.name}`}
                            data-tooltip='Edit'
                          >
                            <i className='fas fa-pen' aria-hidden='true' />
                          </Button>
                          <Button
                            variant='danger-ghost'
                            size='sm'
                            iconOnly
                            aria-label={`Delete ${product.name}`}
                            data-tooltip='Delete'
                            onClick={() => setPendingAction({ type: 'delete', product })}
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
            <Paginate pages={pages} page={page} isAdmin={true} />
          </div>
        )}
      </div>

      <ConfirmDialog
        open={Boolean(pendingAction)}
        tone={isDelete ? 'danger' : 'primary'}
        icon={isDelete ? undefined : 'fa-plus'}
        title={isDelete ? 'Delete product?' : 'Create a new product?'}
        description={
          isDelete
            ? `“${pendingAction.product.name}” will be permanently removed from the catalog.`
            : 'A sample product will be created and opened for editing.'
        }
        confirmLabel={isDelete ? 'Delete product' : 'Create product'}
        onConfirm={confirmAction}
        onCancel={() => setPendingAction(null)}
      />
    </>
  )
}

export default ProductListScreen
