import mongoose from 'mongoose'

const userSchema = mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    isAdmin: { type: Boolean, required: true, default: false },
    // when a user registers it should not be ADMIN,so default: false
  },
  { timestamps: true }
)

// create model from this schema
const User = mongoose.model('User', userSchema)
export default User
