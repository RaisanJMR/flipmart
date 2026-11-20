import mongoose from 'mongoose'
import dotenv from 'dotenv'
import colors from 'colors'
import users from './data/users.js'
import products from './data/products.js'
import User from './models/userModel.js'
import Product from './models/productModel.js'
import Order from './models/orderModel.js'
import connectDB from './config/db.js'

dotenv.config()

await connectDB()

const buildOrder = ({ user, email, product, qty, paid, delivered }) => {
  const itemsPrice = product.price * qty
  const shippingPrice = itemsPrice > 100 ? 0 : 10
  const taxPrice = Number((0.15 * itemsPrice).toFixed(2))
  const totalPrice = Number((itemsPrice + shippingPrice + taxPrice).toFixed(2))
  const now = new Date()

  return {
    user,
    orderItems: [
      {
        name: product.name,
        qty,
        image: product.image,
        price: product.price,
        product: product._id,
      },
    ],
    shippingAddress: {
      address: '123 Main St',
      city: 'Boston',
      postalCode: '02101',
      country: 'USA',
    },
    paymentMethod: 'PayPal',
    taxPrice,
    shippingPrice,
    totalPrice,
    isPaid: paid,
    paidAt: paid ? now : undefined,
    isDelivered: delivered,
    deliveredAt: delivered ? now : undefined,
    paymentResult: paid
      ? {
          id: 'SEED',
          status: 'COMPLETED',
          update_time: now.toISOString(),
          email_address: email,
        }
      : undefined,
  }
}

const importData = async () => {
  try {
    await Order.deleteMany()
    await Product.deleteMany()
    await User.deleteMany()

    const createdUsers = await User.insertMany(users)

    const adminUser = createdUsers[0]._id

    const sampleProducts = products.map((product) => {
      return { ...product, user: adminUser }
    })

    const createdProducts = await Product.insertMany(sampleProducts)

    const buyer = createdUsers[1]._id
    const sampleOrders = [
      buildOrder({
        user: buyer,
        email: 'john@example.com',
        product: createdProducts[0],
        qty: 2,
        paid: true,
        delivered: true,
      }),
      buildOrder({
        user: buyer,
        email: 'john@example.com',
        product: createdProducts[1],
        qty: 1,
        paid: true,
        delivered: false,
      }),
      buildOrder({
        user: createdUsers[2]._id,
        email: 'jane@example.com',
        product: createdProducts[3],
        qty: 1,
        paid: false,
        delivered: false,
      }),
    ]

    await Order.insertMany(sampleOrders)

    console.log('Data Imported!'.green.inverse)
    process.exit()
  } catch (error) {
    console.error(`${error}`.red.inverse)
    process.exit(1)
  }
}

const destroyData = async () => {
  try {
    await Order.deleteMany()
    await Product.deleteMany()
    await User.deleteMany()

    console.log('Data Destroyed!'.red.inverse)
    process.exit()
  } catch (error) {
    console.error(`${error}`.red.inverse)
    process.exit(1)
  }
}

if (process.argv[2] === '-d') {
  destroyData()
} else {
  importData()
}