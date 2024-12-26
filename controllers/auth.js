import { user } from '../Schema/userSchema.js'
import jwt from 'jsonwebtoken'

export const Signup = async (req, res, next) => {
  try {
    console.log({ ...req.body })
    const newUser = await user.create({ ...req.body })
    const token = jwt.sign({ id: newUser.id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRESIN,
    })
    console.log(newUser)
    res.status(201).json({
      status: 'success',
      token,
      body: {
        user: newUser,
      },
    })
  } catch (e) {
    console.log(e)
    console.log(req.body)
  }
}

export const Login = async (req, res, next) => {
  try {
    const { email, password } = req.body
    if (email && password) {
      const User = await user.findOne({ email }).select('+password')
      console.log(User)
      if (User) {
        const token = jwt.sign({ id: User.id }, process.env.JWT_SECRET, {
          expiresIn: process.env.JWT_EXPIRESIN,
        })
        console.log(User.id)
        const authenticated = await User.comparePassword(
          User.password,
          password
        )
        authenticated
          ? res.status(200).json({
              message: 'logged in',
              body: {
                id: User._id,
                name: User.name,
                email: User.email,
                token,
              },
            })
          : res.status(402).json({
              message: 'wrong email/password',
            })
      }
    }
  } catch (e) {
    console.log(e)
    res.end()
  }
}
