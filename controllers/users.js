import { user } from '../Schema/userSchema.js'

export const getall = async (req, res) => {
  try {
    const users = await user.find()
    res.status(200).json(users)
  } catch (e) {
    res.status(400).json({ message: e.message })
  }
}

export const getUsersbyOrg = async (req, res) => {
  const organization = req.params.organization
  try {
    const users = await user.find({ organization })
    res.send(200).json(users)
  } catch (e) {
    res.send(400).json({ message: e.message })
  }
}

export const updateUser = async (req, res) => {
  const { name, email, organization, role } = req.body
  const id = req.params.id
  try {
    const user = user.findbyIdAndUpdate(
      id,
      {
        name,
        email,
        organization,
        role,
      },
      {
        new: true,
        runValidators: true,
      }
    )
  } catch (e) {
    res.send(400).json({ message: e.message })
  }
}
