import Course from "../models/Course.js";
import Purchase from "../models/Purchase.js";
import { v2 as cloudinary } from "cloudinary";

// addcourse: /api/educator/addcourse
const addCourse = async (req, res) => {
  try {
    const { courseData } = req.body;
    const imageFile = req.file;
    const { _id } = req.user;

    if (!imageFile) {
      return res
        .status(400)
        .json({ success: false, message: "Thumbnail not attached.." });
    }

    const parsedCourseData = await JSON.parse(courseData);
    parsedCourseData.educator = _id;

    const newCourse = await Course.create(parsedCourseData);
    const imageUpload = await cloudinary.uploader.upload(imageFile.path);
    newCourse.courseThumbnail = imageUpload.secure_url;
    await newCourse.save();

    res.status(201).json({ success: true, message: "Course added !!" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// getAllCourses of educator: /api/educator/getCourses
const getEducatorCourses = async (req, res) => {
  try {
    const { _id } = req.user;
    const courses = await Course.find({ educator: _id });
    res.status(200).json({ success: true, courses });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// get educator data: total earnings, enrolled students, no of courses
// endpoint: /api/educator/dashboard
const educatorDashboardData = async (req, res) => {
  try {
    const { _id } = req.user;
    const courses = await Course.find({ educator: _id });

    // total courses of the educator
    const totalCourses = courses.length;

    // getting all educator's course id's
    const courseIds = courses.map((course) => course._id);

    // calculating total earnings from purchases
    const purchases = await Purchase.find({
      courseId: { $in: courseIds },
      status: "completed",
    });

    const totalEarnings = purchases.reduce(
      (sum, purchase) => sum + purchase.amount,
      0
    );

    // get unique enrolled student id's with their course titles
    const enrolledStudentsData = [];
    for (const course of courses) {
      const students = await User.find(
        {
          _id: { $in: course.enrolledStudents },
        },
        "name imageUrl"
      );

      students.forEach((student) => {
        enrolledStudentsData.push({
          courseTitle: course.courseTitle,
          student,
        });
      });
    }

    res.status(200).json({
      success: true,
      dashboardData: { totalEarnings, enrolledStudentsData, totalCourses },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// get enrolled students data with purchase data
// endpoint: /api/educator/enrolledStudents
const getEnrolledStudentsData = async (req, res) => {
  try {
    const { _id } = req.user;
    const courses = await Course.find({ educator: _id });
    const courseIds = courses.map((course) => course._id);

    const purchases = await Purchase.find({
      courseId: { $in: courseIds },
      status: "completed",
    })
      .populate("userId", "name imageUrl")
      .populate("courseId", "courseTitle");

    const enrolledStudents = purchases.map((purchase) => ({
      student: purchase.userId,
      courseTitle: purchase.courseId.courseTitle,
      purchaseDate: purchase.createdAt,
    }));

    res.status(200).json({ success: true, enrolledStudents });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export {
  addCourse,
  getEducatorCourses,
  educatorDashboardData,
  getEnrolledStudentsData,
};
