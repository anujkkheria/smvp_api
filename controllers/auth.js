import { user } from "../Schema/userSchema.js";
import jwt from "jsonwebtoken";

export const Signup = async (req, res) => {
  try {
    const newUser = await user.create({ ...req.body });
    const token = jwt.sign({ id: newUser.id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRESIN,
    });
    res.status(201).json({
      status: "success",
      token,
      body: {
        user: newUser,
      },
    });
  } catch (e) {
    return res.status(500);
  }
};

export const Login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400);
  }
  try {
    const User = await user.findOne({ email }).select("+password");
    if (!User) {
      // throw new Error("Tests error");
      return res.status(401).json({ message: "Invalid Credentials" });
    }
    const token = jwt.sign({ id: User.id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRESIN,
    });
    const authenticated = await User.comparePassword(User.password, password);
    if (!authenticated) {
      return res.status(402).json({
        message: "Invalid Credentials",
      });
    }
    return res.status(200).json({
      message: "Login Successful",
      data: {
        id: User._id,
        name: User.name,
        email: User.email,
        token,
      },
    });
  } catch (e) {
    return res.status(500);
  }
};

export const requestreset = async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.send(400).json({ message: "bad request" });
  }
  try {
    const User = user.findOne({ email });
    if (!user) {
      return res.send(200);
    }
    const token = jwt.sign({ id: User._id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRESIN,
    });
    const resetUrl = `https://${process.env.BASE_URL}/resetpassword?id=${User._id}&token=${token}`;
    const mailOptions = {
      to: email,
      from: process.env.RESET_EMAIL,
      subject: "password reset request",
      text: `You are receiveing this email to reset password copy and paste the url ${resetUrl} \n ignore this mail if not requested by you`,
      html: `<p>You are receiveing this email to reset password copy and paste the url <a href="${resetUrl}" target="_blank">reset link</a> ignore this mail if not requested by you</p>`,
    };
    await sgMail.send(mailOptions);

    return res.status(200).json({ message: "done" });
  } catch (e) {
    console.log(e, process.env.RESET_EMAIL, process.env.RESET_PASS);

    return res.Status(400);
  }
};

const updatePassword = (req, res) => {};
