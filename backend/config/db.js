import mongoose from 'mongoose'

// connecting to MONGODB is async

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      useUnifiedTopology: true,
      useNewUrlParser: true,
      useCreateIndex: true,
    })
    console.log(`MongoDB connected: ${conn.connection.host}`.underline.cyan)
  } catch (error) {
    console.error(`Error ${error.message}`.red.underline.bold)
    process.exit(1)
  }
}

export default connectDB
