import Course from "../models/Course.js";

// getAllCourses: /api/course/getAllCourses
const getAllCourses = async (req, res) => {
  try {
    const allCourses = await Course.find({ isPublished: true })
      .select(["-courseContent", "-enrolledStudents"])
      .populate({ path: "educator" });
    res.status(200).json({ success: true, courses: allCourses });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// get course by id: /api/course/:id
const getCourseById = async (req, res) => {
  const { id } = req.params;
  try {
    const course = await Course.findById(id).populate({ path: "educator" });

    // remove lectureUrl if isPreviewFree is false
    course.courseContent.forEach((chapter) => {
      chapter.chapterContent.forEach((lecture) => {
        if (!lecture.isPreviewFree) {
          lecture.lectureUrl = "";
        }
      });
    });
    res.status(200).json({ success: true, course });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export { getAllCourses, getCourseById };
