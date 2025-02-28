import { Link } from "react-router-dom";
import { assets } from "../../assets/assets";
import { useContext } from "react";
import { toast } from "react-toastify";
import { AppContext } from "../../context/AppContext";
import UserButton from "./UserButton";

const Navbar = () => {
  const isCourseListPage = location.pathname.includes("/course-list");
  const { navigate, user, setUser } = useContext(AppContext);

  const handleRole = async () => {
    if (user?.role === "educator") {
      navigate("/educator");
    } else if (user?.role === "user") {
      try {
        const response = await fetch("http://localhost:5000/api/updateRole", {
          method: "PUT",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        });
        const data = await response.json();

        if (data.user) {
          localStorage.setItem("user", JSON.stringify(data.user));
          setUser(data.user);
          toast.success("You are an Educator now, add courses you want !!");
        } else if (data.error) {
          toast.error(data.error);
        }
      } catch (err) {
        console.log(err);
        toast.error("Server error please try later !!");
      }
    }
  };

  return (
    <div
      className={`flex items-center justify-between px-4 sm:px-10 md:px-14 lg:px-36 border-b border-gray-500 py-4 ${
        isCourseListPage ? "bg-white" : "bg-cyan-100/70"
      }`}
    >
      <img
        src={assets.skillforge_logo}
        alt="logo_img"
        className="w-28 lg:w-32 cursor-pointer"
        onClick={() => navigate("/")}
      />
      <div className="hidden md:flex items-center gap-5 text-gray-500">
        <div className="flex items-center gap-5">
          {user && (
            <>
              <button onClick={handleRole}>
                {user.role === "educator"
                  ? "Educator Dashboard"
                  : "Become Educator"}
              </button>
              <Link to="/my-enrollments">My enrollments</Link>
            </>
          )}
        </div>
        {user ? (
          <UserButton />
        ) : (
          <button
            onClick={() => navigate("/register")}
            className="bg-blue-600 text-white px-5 py-2 rounded-full"
          >
            Create Account
          </button>
        )}
      </div>

      {/* for mobile screen */}
      <div className="md:hidden flex items-center gap-2 sm:gap-5 text-gray-500">
        <div className="flex items-center gap-1 sm:gap-2 max-sm:text-xs">
          {user && (
            <>
              <button onClick={handleRole}>
                {user.role === "educator"
                  ? "Educator Dashboard"
                  : "Become Educator"}
              </button>
              <Link to="/my-enrollments">My enrollments</Link>
            </>
          )}
        </div>
        {user ? (
          <UserButton />
        ) : (
          <button onClick={() => navigate("/register")}>
            <img src={assets.user_icon} alt="user_icon" />
          </button>
        )}
      </div>
    </div>
  );
};

export default Navbar;
