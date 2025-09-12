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

/*
==> upload.single("image");
==> This middleware handles uploading a single file with the field name "image" (from the form data).
==> After the file is uploaded, the file info will be available as req.file in the next middleware/controller.
*/
router.post("/addcourse", upload.single("image"), isAuthenticated, addCourse);
router.get("/getCourses", isAuthenticated, getEducatorCourses);
router.get("/dashboard", isAuthenticated, educatorDashboardData);
router.get("/enrolledStudents", isAuthenticated, getEnrolledStudentsData);

export default router;
