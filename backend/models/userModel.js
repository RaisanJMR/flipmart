import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'
// SCHEMA
const userSchema = mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    isAdmin: { type: Boolean, required: true, default: false },
    // when a user registers it should not be ADMIN,so {default: false}
  },
  { timestamps: true }
)

userSchema.methods.matchPassword = async function(enteredPassword) {
 return await bcrypt.compare(enteredPassword, this.password)
}

userSchema.pre('save',async function (next) {
  if (!this.isModified('password')) {
    next()
  }
  const salt = await bcrypt.genSalt(10)
  this.password = await bcrypt.hash(this.password,salt)
})
// create MODEL from this SCHEMA
const User = mongoose.model('User', userSchema)
export default User
