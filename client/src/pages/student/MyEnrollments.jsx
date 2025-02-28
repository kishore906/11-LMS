import { useCallback, useContext, useEffect, useState } from "react";
import { AppContext } from "../../context/AppContext";
import { Line } from "rc-progress";
import { toast } from "react-toastify";
import Footer from "../../components/student/Footer";

const MyEnrollments = () => {
  const {
    enrolledCourses,
    calculateTotalCourseDuration,
    calculateNoOfLectures,
    navigate,
    user,
    fetchUserEnrolledCourses,
  } = useContext(AppContext);

  const [progressArr, setProgressArr] = useState([]);

  const getCourseProgress = useCallback(async () => {
    try {
      const tempProgressArray = await Promise.all(
        enrolledCourses.map(async (course) => {
          const res = await fetch(
            "http://localhost:5000/api/get-course-progress",
            {
              method: "POST",
              credentials: "include",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ courseId: course._id }),
            }
          );
          const data = await res.json();
          let totalLectures = calculateNoOfLectures(course);
          const lectureCompleted = data.progressData
            ? data.progressData.lectureCompleted.length
            : 0;
          return { totalLectures, lectureCompleted };
        })
      );
      setProgressArr(tempProgressArray);
    } catch (err) {
      console.log(err);
      toast.error("Server error please try later..");
    }
  }, [calculateNoOfLectures, enrolledCourses]);

  useEffect(() => {
    if (user) {
      fetchUserEnrolledCourses();
    }
  }, [user, fetchUserEnrolledCourses]);

  useEffect(() => {
    if (enrolledCourses.length > 0) {
      getCourseProgress();
    }
  }, [user, enrolledCourses, getCourseProgress]);

  return (
    <>
      <div className="md:px-36 px-8 pt-10">
        <h1 className="text-2xl font-semibold">My Enrollments</h1>
        <table className="md:table-auto table-fixed w-full overflow-hidden border border-gray-500/20 mt-10">
          <thead className="text-gray-900 border-b border-gray-500/20 text-sm text-left max-sm:hidden">
            <tr>
              <th className="px-4 py-3 font-semibold truncate">Course</th>
              <th className="px-4 py-3 font-semibold truncate">Duration</th>
              <th className="px-4 py-3 font-semibold truncate">Completed</th>
              <th className="px-4 py-3 font-semibold truncate">Status</th>
            </tr>
          </thead>
          <tbody className="text-gray-700">
            {enrolledCourses.map((course, index) => (
              <tr key={index} className="border-b border-gray-500/20">
                <td className="md:px-4 pl-2 md:pl-4 py-3 flex items-center space-x-3">
                  <img
                    src={course.courseThumbnail}
                    alt=""
                    className="w-14 sm:w-24 md:w-28"
                  />
                  <div className="flex-1">
                    <p className="mb-1 max-sm:text-sm">{course.courseTitle}</p>
                    <Line
                      strokeWidth={2}
                      percent={
                        progressArr[index]
                          ? (progressArr[index].lectureCompleted * 100) /
                            progressArr[index].totalLectures
                          : 0
                      }
                      className="bg-gray-300 rounded-full"
                    />
                  </div>
                </td>
                <td className="px-4 py-3 max-sm:hidden">
                  {calculateTotalCourseDuration(course)}
                </td>
                <td className="px-4 py-3 max-sm:hidden">
                  {progressArr[index] &&
                    `${progressArr[index].lectureCompleted} / ${progressArr[index].totalLectures}`}{" "}
                  <span>Lectures</span>
                </td>
                <td className="px-4 py-3 max-sm:text-right">
                  <button
                    className="px-3 sm:px-5 py-1.5 sm:py-2 bg-blue-600 max-sm:text-xs text-white"
                    onClick={() => navigate("/courseplayer/" + course._id)}
                  >
                    {progressArr[index] &&
                    progressArr[index].lectureCompleted /
                      progressArr[index].totalLectures ===
                      1
                      ? "Completed"
                      : "On going"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Footer />
    </>
  );
};

export default MyEnrollments;
