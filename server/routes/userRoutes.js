import express from "express";
import {
  register,
  login,
  logout,
  getUser,
  updateProfile,
  updatePassword,
  updateRole,
  userEnrolledCourses,
  purchaseCourse,
  updateUserCourseProgress,
  getUserCourseProgress,
  addUserRating,
} from "../controllers/userControllers.js";
import { isAuthenticated } from "../middlewares/auth.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/logout", logout);

router.get("/user/:id", isAuthenticated, getUser);
router.put("/updateProfile/:id", isAuthenticated, updateProfile);
router.put("/updatePassword/:id", isAuthenticated, updatePassword);
router.put("/updateRole", isAuthenticated, updateRole);

router.get("/enrolledCourses", isAuthenticated, userEnrolledCourses);
router.post(
  "/update-course-progress",
  isAuthenticated,
  updateUserCourseProgress
);
router.get("/get-course-progress", isAuthenticated, getUserCourseProgress);
router.post("/add-rating", isAuthenticated, addUserRating);

router.post("/purchase", isAuthenticated, purchaseCourse);

export default router;
