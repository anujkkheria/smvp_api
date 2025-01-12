import { user } from '../Schema/userSchema.js'

export const getall = async (req, res) => {
  const page = req.query.page - 1
  const limit = req.query.limit * page || 5
  try {
    const users = await user
      .find()
      .skip(page * limit)
      .limit(limit)
    res.status(200).json(users)
  } catch (e) {
    res.status(400).json({ message: e.message })
  }
}

export const getUsersbyOrg = async (req, res) => {
  const organization = req.params.organization
  try {
    const users = await user
      .find({ organization })
      .skip(page * limit)
      .limit(limit)
    res.send(200).json(users)
  } catch (e) {
    res.status(400).json({ message: e.message })
  }
}

export const updateUser = async (req, res) => {
  const { name, email, role } = req.body
  const id = req.params.id
  console.log(id, req)
  try {
    const User = await user.findByIdAndUpdate(
      id,
      {
        name,
        email,
        role,
      },
      {
        new: true,
        runValidators: true,
      }
    )
    return res.status(201).json({ message: 'updated successfully', data: User })
  } catch (e) {
    res.status(400).json({ message: e.message })
  }
}
