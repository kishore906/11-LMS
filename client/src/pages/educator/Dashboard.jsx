import { useContext, useEffect, useState } from "react";
import { assets } from "../../assets/assets";
import { AppContext } from "../../context/AppContext";
import { toast } from "react-toastify";
import Loading from "../../components/student/Loading";

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const { currency, user } = useContext(AppContext);

  const fetchDashboardData = async () => {
    try {
      const response = await fetch(
        "http://localhost:5000/api/educator/dashboard",
        {
          method: "GET",
          credentials: "include",
        }
      );
      const data = await response.json();

      if (data.success) {
        setDashboardData(data.dashboardData);
      } else {
        toast.error(data.error);
      }
    } catch (err) {
      console.log(err);
      toast.error("Server error please try later!!");
    }
  };

  useEffect(() => {
    if (user?.role === "educator") {
      fetchDashboardData();
    }
  }, [user]);

  if (!dashboardData) return <Loading />;

  return (
    <div className="min-h-screen flex flex-col items-start justify-between gap-8 md:p-8 md:pb-0 p-4 pt-8 pb-0">
      <div className="space-y-5">
        <div className="flex flex-wrap gap-5 items-center">
          <div className="flex items-center gap-3 shadow-custom-card border border-blue-500 p-4 w-58 rounded-md">
            <img src={assets.patients_icon} alt="patient_icon" />
            <div>
              <p className="text-2xl font-medium text-gray-600">
                {dashboardData.enrolledStudentsData.length}
              </p>
              <p className="text-base text-gray-500">Total Enrollments</p>
            </div>
          </div>
          <div className="flex items-center gap-3 shadow-custom-card border border-blue-500 p-4 w-56 rounded-md">
            <img src={assets.appointments_icon} alt="patient_icon" />
            <div>
              <p className="text-2xl font-medium text-gray-600">
                {dashboardData.totalCourses}
              </p>
              <p className="text-base text-gray-500">Total Courses</p>
            </div>
          </div>
          <div className="flex items-center gap-3 shadow-custom-card border border-blue-500 p-4 w-56 rounded-md">
            <img src={assets.earning_icon} alt="patient_icon" />
            <div>
              <p className="text-2xl font-medium text-gray-600">
                {currency} {dashboardData.totalEarnings}
              </p>
              <p className="text-base text-gray-500">Total Earnings</p>
            </div>
          </div>
        </div>

        {/* enrolled candidates */}
        <div>
          <h2 className="pb-4 text-lg font-medium">Latest Enrollments</h2>
          <div className="flex flex-col items-center max-w-4xl w-full overflow-hidden rounded-md bg-white border border-gray-500/20">
            <table className="table-fixed md:table-auto w-full overflow-hidden">
              <thead className="text-gray-900 border-b border-gray-500/20 text-sm text-left">
                <tr>
                  <th className="px-4 py-3 font-semibold text-center hidden sm:table-cell">
                    #
                  </th>
                  <th className="px-4 py-3 font-semibold">Student Name</th>
                  <th className="px-4 py-3 font-semibold">Course Title</th>
                </tr>
              </thead>
              <tbody className="text-sm text-gray-500">
                {dashboardData.enrolledStudentsData.map((item, i) => (
                  <tr key={i} className="border-b border-gray-500/20">
                    <td className="px-4 py-3 text-center hidden sm:table-cell">
                      {i + 1}
                    </td>
                    <td className="md:px-4 px-2 py-3 flex items-center space-x-3">
                      <img
                        src={item.student.imageUrl || assets.default_avatar}
                        alt="profile"
                        className="w-9 h-9 rounded-full"
                      />
                      <span className="truncate">{item.student.name}</span>
                    </td>
                    <td className="px-4 py-3 truncate">{item.courseTitle}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
