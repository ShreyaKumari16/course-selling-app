const { Router } = require("express");
const { courseModel, purchaseModel } = require("../db");
const { userMiddleware } = require("../middleware/user");

const courseRouter = Router();


courseRouter.get("/preview", async (req, res) => {
  try {
    const courses = await courseModel.find({});
    res.json({ courses });
  } catch (e) {
    res.status(500).json({ message: "Failed to fetch courses", error: e.message });
  }
});


courseRouter.post("/purchase/:courseId", userMiddleware, async (req, res) => {
  const userId = req.userId;
  const { courseId } = req.params;

  try {
    const course = await courseModel.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }


    const alreadyPurchased = await purchaseModel.findOne({ userId, courseId });
    if (alreadyPurchased) {
      return res.status(409).json({ message: "Course already purchased" });
    }

    await purchaseModel.create({ userId, courseId });

    res.json({ message: "Course purchased successfully!" });
  } catch (e) {
    res.status(500).json({ message: "Purchase failed", error: e.message });
  }
});

courseRouter.get("/purchased", userMiddleware, async (req, res) => {
  const userId = req.userId;

  try {
    const purchases = await purchaseModel.find({ userId }).populate("courseId");
    const purchasedCourses = purchases.map(p => p.courseId);
    res.json({ purchasedCourses });
  } catch (e) {
    res.status(500).json({ message: "Failed to fetch purchased courses", error: e.message });
  }
});

module.exports = {
  courseRouter,
};