import { user } from "../Schema/userSchema.js";

export const getall = async (req, res) => {
  const page = req.query.page - 1;
  const limit = req.query.limit || 5;
  try {
    const users = await user
      .find()
      .skip(page * limit)
      .limit(limit);
    res.status(200).json(users);
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
};

export const getUsersbyOrg = async (req, res) => {
  const organization = req.params.organization;
  try {
    const users = await user
      .find({ organization })
      .skip(page * limit)
      .limit(limit);
    res.send(200).json(users);
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
};

export const updateUser = async (req, res) => {
  const { name, email, role } = req.body;
  const id = req.params.id;
  try {
    const user = await user.findbyIdAndUpdate(
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
    );
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
};
