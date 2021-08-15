import express from 'express'
import dotenv from 'dotenv'
import colors from 'colors'
import { notFound, errorHandler } from './middleware/errorMiddleware.js'
import connectDB from './config/db.js'
import productRoutes from './routes/productRoutes.js'

dotenv.config()

connectDB()

const app = express()

app.get('/', (req, res) => {
  res.send('api running..')
})
app.use('/api/products', productRoutes)
// NOT FOUND ERROR HANDLER
app.use(notFound)
//PRODUCT NOT FOUND ERROR HANDLER
app.use(errorHandler)

const PORT = process.env.PORT || 5000
app.listen(
  PORT,
  console.log(
    `Server running in ${process.env.NODE_ENV} mode on port ${5000}`.underline
      .yellow.bold
  )
)
