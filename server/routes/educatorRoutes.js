import express from "express";
import upload from "../config/multer.js";
import { isAuthenticated } from "../middlewares/auth.js";
import {
  addCourse,
  educatorDashboardData,
  getEducatorCourses,
  getEnrolledStudentsData,
} from "../controllers/educatorController.js";

const router = express.Router();

router.post("/addcourse", upload.single("image"), isAuthenticated, addCourse);
router.get("/getCourses", isAuthenticated, getEducatorCourses);
router.get("/dashboard", isAuthenticated, educatorDashboardData);
router.get("/enrolledStudents", isAuthenticated, getEnrolledStudentsData);

export default router;
