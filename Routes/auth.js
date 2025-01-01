import express from "express";
const router = express.Router();
import { Signup, Login } from "../controllers/auth.js";

router.route("/").get((req, res) => {
  res.status(200).json({ message: "req recevied on auth" });
  console.log("you reached the route");
});
router.route("/Signup").post(Signup);

router.route("/Login").post(Login);

export default router;
