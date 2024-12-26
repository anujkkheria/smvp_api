import bcrypt from 'bcryptjs'
import validator from 'validator'
import mongoose from 'mongoose'

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, 'please enter an email'],
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
    select: false,
  },
  confirmPassword: {
    type: String,
    Selection: false,
    validate: {
      validator: function (el) {
        return el === this.password
      },
    },
    message: 'please enter the same password',
  },
  role: {
    type: String,
    required: true,
    minlength: 8,
  },
  organization: {
    type: String,
    required: true,
  },
})

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next()
  this.password = await bcrypt.hash(this.password, 12)
  this.confirmPassword = undefined
  next()
})

userSchema.methods.comparePassword = async function (Recpass, correctpass) {
  const auth = await bcrypt.compare(correctpass, Recpass)
  return auth
}

export const user = mongoose.model('user', userSchema)
