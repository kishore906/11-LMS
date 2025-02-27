import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: [true, "Please enter your name"] },
    email: {
      type: String,
      required: [true, "Please enter your emailId"],
      unique: true,
    },
    password: {
      type: String,
      required: [true, "Please enter your password"],
      select: false,
    },
    imageUrl: { type: String, required: false },
    enrolledCourses: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course",
      },
    ],
    role: {
      type: String,
      enum: ["user", "educator"],
      default: "user",
    },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", userSchema);

export default User;
