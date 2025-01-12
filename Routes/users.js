import express from 'express'
import { getall, updateUser } from '../controllers/users.js'
const router = express.Router()
router.route('/').get((req, res) => {
  res.status(200).json({
    message: 'you have reached /users',
  })
})
router.route('/getall').get(getall)
router.route('/update/:id').put(updateUser)
export default router
