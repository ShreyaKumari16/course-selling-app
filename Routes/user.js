const { Router } = require("express");
const bcrypt = require("bcrypt");
const { z } = require("zod");
const { userModel } = require("../db");
const { USER_JWT_SECRET } = require("../config");
const jwt = require("jsonwebtoken");
const { userMiddleware } = require("../middleware/user");

const userRouter = Router();

userRouter.post("/signup", async (req, res) => {
  const requireBody = z.object({
    email: z.string().email(),
    password: z.string().min(4).max(10).regex(/[A-Z]/, { message: "One uppercase is required!" }),
    fname: z.string(),
    lname: z.string(),
  });

  const parseData = requireBody.safeParse(req.body);

  if (!parseData.success) {
    return res.status(400).json({
      message: "Incorrect Format",
      error: parseData.error.format(),
    });
  }

  const { email, password, fname, lname } = req.body;

  try {
    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 5);

    await userModel.create({
      email,
      password: hashedPassword,
      fname,
      lname,
    });
    return res.status(201).json({
      message: "Signed Up Successfully!",
    });
  } catch (e) {
    return res.status(500).json({
      message: "Error creating user",
      error: e.message,
    });
  }
});

userRouter.post("/signin", async (req, res) => {
  const { email, password } = req.body;

  const user = await userModel.findOne({ email });

  if (!user) {
    return res.status(401).json({ message: "User not found!" });
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    return res.status(401).json({
      message: "Invalid Password",
    });
  }

  const token = jwt.sign({ id: user._id }, USER_JWT_SECRET, {
    expiresIn: "1h",
  });

  res.json({
    token,
    message: "Signed In!",
  });
});

module.exports = {
  userRouter,
};
