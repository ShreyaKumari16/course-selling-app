const { Router } = require("express");
const bcrypt = require("bcrypt");
const { z } = require("zod");
const { adminModel, courseModel } = require("../db");
const { ADMIN_JWT_SECRET } = require("../config");
const { adminMiddleware } = require("../middleware/admin");
const jwt = require("jsonwebtoken");

const adminRouter = Router();

adminRouter.post("/signup", async (req, res) => {
  const requireBody = z.object({
    email: z.string().email(),
    password: z
      .string()
      .min(4)
      .max(10)
      .regex(/[A-Z]/, { message: "One uppercase is required" }),
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
    const existingAdmin = await adminModel.findOne({ email });
    if (existingAdmin) {
      return res.status(409).json({ message: "Admin already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 5);

    await adminModel.create({
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
      message: "Error creating admin",
      error: e.message,
    });
  }
});

adminRouter.post("/signin", async (req, res) => {
  const { email, password } = req.body;

  const admin = await adminModel.findOne({ email });

  if (!admin) {
    return res.status(401).json({ message: "Admin Not Found!" });
  }

  const isMatch = await bcrypt.compare(password, admin.password);

  if (!isMatch) {
    return res.status(401).json({
      message: "Invalid Password",
    });
  }

  const token = jwt.sign({ id: admin._id }, ADMIN_JWT_SECRET, {
    expiresIn: "1h",
  });

  res.json({
    token,
    message: "Signed In!",
  });
});

adminRouter.post("/course", adminMiddleware, async (req, res) => {
  const adminId = req.userId;
  const { title, price, imageUrl, description } = req.body;

  if (!title || !price) {
    return res.status(400).json({ message: "Title and Price are required" });
  }

  try {
    const course = await courseModel.create({
      title,
      price,
      imageUrl,
      description,
      CreatorId: adminId,
    });

    res.status(201).json({
      message: "Course Created!",
      courseId: course._id,
    });
  } catch (e) {
    res.status(500).json({
      message: "Course creation failed",
      error: e.message,
    });
  }
});

adminRouter.delete("/course/:id", adminMiddleware, async (req, res) => {
  const { id } = req.params;

  try {
    const result = await courseModel.findByIdAndDelete(id);
    if (!result) {
      return res.status(404).json({ message: "Course not found" });
    }
    res.json({ message: "Course deleted successfully!" });
  } catch (e) {
    res.status(500).json({ message: "Deletion failed", error: e.message });
  }
});

adminRouter.get("/course/bulk", adminMiddleware, async (req, res) => {
  try {
    const courses = await courseModel.find({});
    res.json({ courses });
  } catch (e) {
    res.status(500).json({ message: "Failed to fetch courses", error: e.message });
  }
});

module.exports = {
  adminRouter,
};