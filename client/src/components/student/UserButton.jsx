import { useContext, useState } from "react";
import { assets } from "../../assets/assets";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { AppContext } from "../../context/AppContext";

const UserButton = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { navigate, setUser } = useContext(AppContext);

  const handleLogout = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/logout");
      const data = await response.json();
      if (data.message) {
        localStorage.removeItem("user");
        setUser(null);
        toast.success(data.message);
        navigate("/");
      } else if (data.error) {
        toast.error(data.error);
      }
    } catch (err) {
      console.log(err);
      toast.error("Server Error Please try later!!");
    }
  };

  return (
    <div className="relative">
      <img
        src={assets.default_avatar}
        alt="avatar_img"
        className="w-[30px] h-[30px] border-1 border-black rounded-full"
        onClick={() => setIsDropdownOpen((prev) => !prev)}
      />

      {isDropdownOpen && (
        <div className="flex flex-col justify-center gap-3 absolute w-[180px] top-12 right-1 shadow-custom-card p-5 z-20">
          <Link
            to="/updateProfile"
            onClick={() => setIsDropdownOpen((prev) => !prev)}
          >
            Update Profile
          </Link>
          <Link
            to="/updatePassword"
            onClick={() => setIsDropdownOpen((prev) => !prev)}
          >
            Change Password
          </Link>
          <button
            className="bg-blue-600 text-white px-5 py-1 rounded-full"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );
};

export default UserButton;
