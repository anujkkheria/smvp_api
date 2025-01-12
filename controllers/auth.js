import { user } from '../Schema/userSchema.js'
import jwt from 'jsonwebtoken'
import sgMail from '@sendgrid/mail'
sgMail.setApiKey(process.env.EMAIL_APIKEY)
export const Signup = async (req, res) => {
  try {
    const newUser = await user.create({ ...req.body })
    console.log('signup', newUser)
    const token = jwt.sign({ id: newUser.id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRESIN,
    })
    res.status(201).json({
      status: 'success',
      token,
      body: {
        user: newUser,
      },
    })
  } catch (e) {
    return res.status(500)
  }
}

export const Login = async (req, res) => {
  const { email, password } = req.body
  if (!email || !password) {
    return res.status(400)
  }
  try {
    const User = await user.findOne({ email }).select('+password')
    console.log(User)
    if (!User) {
      // throw new Error("Tests error");
      return res.status(401).json({ message: 'Invalid Credentials' })
    }
    const token = jwt.sign({ id: User.id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRESIN,
    })
    const authenticated = await User.comparePassword(User.password, password)

    if (!authenticated) {
      return res.status(401).json({
        message: 'Invalid Credentials',
      })
    }
    return res.status(200).json({
      message: 'Login Successful',
      data: {
        id: User._id,
        name: User.name,
        email: User.email,
        role: User.role,
        token,
      },
    })
  } catch (e) {
    return res.status(500)
  }
}

export const requestreset = async (req, res) => {
  const { email } = req.body
  if (!email) {
    return res.send(400).json({ message: 'bad request' })
  }
  try {
    const User = user.findOne({ email })
    if (!user) {
      return res.send(200)
    }
    const token = jwt.sign({ id: User._id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRESIN,
    })
    const resetUrl = `https://${process.env.BASE_URL}/resetpassword?id=${User._id}&token=${token}`
    const mailOptions = {
      to: email,
      from: process.env.RESET_EMAIL,
      subject: 'password reset request',
      text: `You are receiveing this email to reset password copy and paste the url ${resetUrl} \n ignore this mail if not requested by you`,
      html: `<p>You are receiveing this email to reset password copy and paste the url <a href="${resetUrl}" target="_blank">reset link</a> ignore this mail if not requested by you</p>`,
    }
    await sgMail.send(mailOptions)

    return res.status(200).json({ message: 'done' })
  } catch (e) {
    console.log(e, process.env.RESET_EMAIL, process.env.RESET_PASS)

    return res.Status(400)
  }
}
export const requestPassordVerification = async (req, res) => {
  const token = req.query.token
  const id = req.query.id
  if (!id) {
    return res.status(401).json({ message: 'could not verify user' })
  }
  try {
    const verify = jwt.verify(token, process.env.JWT_SECRET)
    if (!verify) {
      return res.status(401).json({ message: 'could not verify user' })
    }
    return res.redirect(302, `${CLIENT_URL}/reset-password/${id}`)
  } catch (e) {
    console.log(e)
    return res.status(500)
  }
}
export const updatePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body
    const { id } = req.query.id

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        status: 'error',
        message: 'Please provide both current and new password',
      })
    }

    // Get user with password
    const User = await user.findById(id).select('+password')
    if (!User) {
      return res.status(404).json({
        status: 'error',
        message: 'User not found',
      })
    }

    const isPasswordValid = await User.comparePassword(
      User.password,
      currentPassword
    )
    if (!isPasswordValid) {
      return res.status(401).json({
        status: 'error',
        message: 'Current password is incorrect',
      })
    }

    User.password = newPassword
    await User.save()

    const token = jwt.sign({ id: User.id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRESIN,
    })

    return res.status(200).json({
      status: 'success',
      message: 'Password updated successfully',
      token,
    })
  } catch (error) {
    console.error('Password update error:', error)
    return res.status(500).json({
      status: 'error',
      message: 'Internal server error',
    })
  }
}

export const InviteUser = async (req, res) => {
  try {
    const { email } = req.body

    if (!email) {
      return res.status(400).json({
        status: 'error',
        message: 'Please provide both email and role',
      })
    }

    // Check if user already exists
    const existingUser = await user.findOne({ email })
    if (existingUser) {
      return res.status(400).json({
        status: 'error',
        message: 'User with this email already exists',
      })
    }
    // Create invite URL
    const inviteUrl = `${process.env.CLIENT_URL}/Signup`

    // Send invite email
    const mailOptions = {
      to: email,
      from: process.env.RESET_EMAIL,
      subject: 'Invitation to Join',
      text: `
        Please click the following link to set up your account: ${inviteUrl}
        This link will expire in 24 hours.
      `,
      html: `
        <h3>Welcome!</h3>
        <p>Please click the following link to set up your account:</p>
        <a href="${inviteUrl}">Accept Invitation</a>
        <p>This link will expire in 24 hours.</p>
      `,
    }

    await sgMail.send(mailOptions)

    return res.status(200).json({
      status: 'success',
      message: 'Invitation sent successfully',
    })
  } catch (error) {
    console.error('Invite error:', error)
    return res.status(500).json({
      status: 'error',
      message: 'Failed to send invitation',
    })
  }
}
export const resetWithoutAuth = async (req, res) => {
  const { email, newpassword } = req.body

  if (!email || !newpassword) {
    return res
      .status(400)
      .json({ message: 'Please provide both email and password' })
  }

  try {
    const User = await user.findOne({ email })

    if (!User) {
      return res.status(404).json({ message: 'User not found' })
    }

    User.password = newpassword
    await User.save()

    return res.status(200).json({ message: 'Password update successful' })
  } catch (error) {
    console.error('Error updating password:', error)
    return res.status(500).json({ message: 'Internal server error' })
  }
}
