import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import DB from './DB.js'
import authRouter from './Routes/auth.js'
import userRouter from './Routes/users.js'
// import friendsRouter from './Routes/users.js'

const app = express()
app.use(express.json())
dotenv.config()
app.use(cors())

app.get('/', (req, res) => {
  console.log('got it man')
  res.status(200).json({
    status: 'success',
    message: 'your api is working',
  })
})

app.use('/auth', authRouter)
app.use('/users', userRouter)
// app.use('/friends', friendsRouter)

const port = process.env.PORT

app.listen(port, () => {
  console.log(`listenning on port ${port}`)
})
