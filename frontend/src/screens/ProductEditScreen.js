import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Message from '../components/Message'
import Loader from '../components/Loader'
import FormContainer from '../components/FormContainer'
import BackLink from '../components/ui/BackLink'
import Button from '../components/ui/Button'
import { Field, TextField, TextAreaField } from '../components/ui/Field'
import { listProductDetails, updateProduct } from '../actions/productActions'
import { PRODUCT_UPDATE_RESET } from '../constants/productConstants'
import axios from 'axios'

const ProductEditScreen = ({ match, history }) => {
  const productId = match.params.id

  const [name, setName] = useState('')
  const [price, setPrice] = useState(0)
  const [image, setImage] = useState('')
  const [brand, setBrand] = useState('')
  const [category, setCategory] = useState('')
  const [countInStock, setCountInStock] = useState(0)
  const [description, setDescription] = useState('')
  const [uploading, setUploading] = useState(false)
  const [uploadError, setUploadError] = useState(null)
  const [fileName, setFileName] = useState('')

  const dispatch = useDispatch()

  const productDetails = useSelector((state) => state.productDetails)
  const { loading, error, product } = productDetails

  const productUpdate = useSelector((state) => state.productUpdate)
  const {
    loading: loadingUpdate,
    error: errorUpdate,
    success: successUpdate,
  } = productUpdate

  useEffect(() => {
    if (successUpdate) {
      dispatch({ type: PRODUCT_UPDATE_RESET })
      history.push('/admin/productlist')
    } else {
      if (!product.name || product._id !== productId) {
        dispatch(listProductDetails(productId))
      } else {
        setName(product.name)
        setPrice(product.price)
        setImage(product.image)
        setBrand(product.brand)
        setCategory(product.category)
        setCountInStock(product.countInStock)
        setDescription(product.description)
      }
    }
  }, [dispatch, history, productId, product, successUpdate])

  const uploadFileHandler = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    setFileName(file.name)
    setUploadError(null)
    const formData = new FormData()
    formData.append('image', file)
    setUploading(true)
    try {
      const config = {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
      const { data } = await axios.post('/api/upload', formData, config)
      setImage(data)
      setUploading(false)
    } catch (err) {
      console.error(err)
      setUploadError('Upload failed. Please try another image.')
      setUploading(false)
    }
  }

  const submitHandler = (e) => {
    e.preventDefault()
    dispatch(
      updateProduct({
        _id: productId,
        name,
        price,
        image,
        brand,
        category,
        countInStock,
        description,
      })
    )
  }

  return (
    <FormContainer wide>
      <BackLink to='/admin/productlist'>Back to products</BackLink>
      <div className='card card--padded'>
        <p className='eyebrow'>Admin</p>
        <h1 className='card__title'>Edit product</h1>
        <p className='card__subtitle'>Update how this product appears in your store.</p>
        {loading ? (
          <Loader />
        ) : error ? (
          <Message variant='danger'>{error}</Message>
        ) : (
          <form onSubmit={submitHandler} className='form-grid'>
            {errorUpdate && (
              <div className='form-grid__full'>
                <Message variant='danger'>{errorUpdate}</Message>
              </div>
            )}
            <TextField
              id='name'
              label='Name'
              className='form-grid__full'
              type='text'
              placeholder='Product name'
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <TextField
              id='price'
              label='Price (USD)'
              type='number'
              min='0'
              step='0.01'
              inputMode='decimal'
              placeholder='0.00'
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />
            <TextField
              id='countInStock'
              label='Stock'
              type='number'
              min='0'
              step='1'
              inputMode='numeric'
              placeholder='Units in stock'
              value={countInStock}
              onChange={(e) => setCountInStock(e.target.value)}
            />
            <TextField
              id='brand'
              label='Brand'
              type='text'
              placeholder='e.g. Apple'
              value={brand}
              onChange={(e) => setBrand(e.target.value)}
            />
            <TextField
              id='category'
              label='Category'
              type='text'
              placeholder='e.g. Electronics'
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            />

            <Field id='image' label='Image' className='form-grid__full'>
              <div className='media-field'>
                <div className='image-preview'>
                  {image ? (
                    <img src={image} alt='' />
                  ) : (
                    <i className='fas fa-image text-subtle' aria-hidden='true' />
                  )}
                </div>
                <div className='stack stack--sm w-full'>
                  <input
                    id='image'
                    type='text'
                    className='input'
                    placeholder='Image URL'
                    value={image}
                    onChange={(e) => setImage(e.target.value)}
                  />
                  <div className='file-input'>
                    <input
                      id='image-file'
                      type='file'
                      accept='image/*'
                      className='file-input__native'
                      onChange={uploadFileHandler}
                    />
                    <label htmlFor='image-file' className='button button--secondary button--sm'>
                      <i className='fas fa-upload' aria-hidden='true' />
                      Upload file
                    </label>
                    <span className='file-input__name'>{fileName || 'No file chosen'}</span>
                  </div>
                  {uploading && <Loader inline label='Uploading…' />}
                  {uploadError && <Message variant='danger'>{uploadError}</Message>}
                </div>
              </div>
            </Field>

            <TextAreaField
              id='description'
              label='Description'
              className='form-grid__full'
              rows={4}
              placeholder='Describe the product'
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />

            <div className='form-grid__full form-actions'>
              <Button to='/admin/productlist' variant='ghost'>
                Cancel
              </Button>
              <Button type='submit' variant='primary' loading={loadingUpdate}>
                Save product
              </Button>
            </div>
          </form>
        )}
      </div>
    </FormContainer>
  )
}

export default ProductEditScreen
