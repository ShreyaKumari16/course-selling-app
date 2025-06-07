const mongoose = require("mongoose");

mongoose.connect(process.env.MONGO_URL);

const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    fname: { type: String, required: true },
    lname: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
  },
  { timestamps: true }
);

const adminSchema = new Schema(
  {
    fname: { type: String, required: true },
    lname: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
  },
  { timestamps: true }
);

const courseSchema = new Schema(
  {
    title: { type: String, required: true },
    price: { type: Number, required: true },
    CreatorId: { type: Schema.Types.ObjectId, required: true, ref: "Admin" },
    description: String,
    imageUrl: String,
  },
  { timestamps: true }
);

const purchaseSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, required: true, ref: "User" },
    courseId: { type: Schema.Types.ObjectId, required: true, ref: "Course" },
  },
  { timestamps: true }
);

const userModel = mongoose.model("User", userSchema);
const adminModel = mongoose.model("Admin", adminSchema);
const courseModel = mongoose.model("Course", courseSchema);
const purchaseModel = mongoose.model("Purchase", purchaseSchema);

module.exports = {
  userModel,
  adminModel,
  courseModel,
  purchaseModel,
};