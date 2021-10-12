import asyncHandler from 'express-async-handler'
import Product from '../models/productModel.js'

// @desc   Fetch all products
// @route  GET /api/products
// @access  Public
const getProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({})
  // res.status(401)
  // throw new Error('not authorized')
  res.json(products)
})

// @desc   Fetch single product
// @route  GET /api/products/:id
// @access  Public
const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id)
  // console.log(product)
  if (product) {
    res.json(product)
  } else {
    res.status(404)
    throw new Error('Product not found')
  }
})

// @desc   DELETE product
// @route  DELETE /api/products/:id
// @access  Private/ADMIN
const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id)
  // console.log(product)
  if (product) {
    await product.remove()
    res.json({ message: 'Product removed' })
  } else {
    res.status(404)
    throw new Error('Product not found')
  }
})

// @desc   CREATE product
// @route  POST /api/products
// @access  Private/ADMIN
const createProduct = asyncHandler(async (req, res) => {
  const product = new Product({
    name: 'Smaple name',
    price: 0,
    user: req.user._id,
    image: '/images/sample.jpg',
    brand: 'Sample Brand',
    category: 'Sample category',
    countInStock: 0,
    numReviews: 0,
    description: 'Sample description',
  })
  const createdProduct = await product.save()
  res.status(200).json(createdProduct)
})

// @desc   UPDATE product
// @route  PUT /api/products/:id
// @access  Private/ADMIN
const updateProduct = asyncHandler(async (req, res) => {
  const { name, price, description, image, brand, category, countInStock } =
    req.body
  const product = await Product.findById(req.params.id)
  if (product) {
    product.name = name
    product.price = price
    product.description = description
    product.image = image
    product.brand = brand
    product.category = category
    product.countInStock = countInStock
    const updatedProduct = await product.save()
    res.json(updatedProduct)
  } else {
    res.status(404)
    throw new Error('Product not found')
  }
})
export {
  getProducts,
  getProductById,
  deleteProduct,
  createProduct,
  updateProduct,
}
