import mongoose from "mongoose";

const courseProgressSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true },
    courseId: { type: String, required: true },
    completed: { type: Boolean, default: false },
    lectureCompleted: [],
  },
  { minimize: false }
);

const CourseProgressSchema = mongoose.model(
  "CourseProgress",
  courseProgressSchema
);

export default CourseProgressSchema;
