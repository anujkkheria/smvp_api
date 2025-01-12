import express from 'express'
const router = express.Router()
import {
  Signup,
  Login,
  resetWithoutAuth,
  InviteUser,
} from '../controllers/auth.js'
// import { protect, restrictTo } from '../middleware/auth.js'

router.route('/').get((req, res) => {
  res.status(200).json({ message: 'req recevied on auth' })
  console.log('you reached the route')
})
router.route('/Signup').post(Signup)
router.route('/Login').post(Login)
router.route('/forgot-password').put(resetWithoutAuth)
// router.route('/update-password').put()
router.post('/invite', InviteUser)

export default router
