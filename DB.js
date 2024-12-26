import mongoose from 'mongoose'
import dotenv from 'dotenv'

dotenv.config()

const Password = process.env.DB_PASS
const DB = process.env.DB_URI.replace('<password>', Password)

try {
  await mongoose.connect(DB, { useNewUrlParser: true })
  console.log('DB connection Successful ')
} catch (e) {
  console.log(e)
}

export default DB
