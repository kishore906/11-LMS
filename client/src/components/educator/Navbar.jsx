import { Link } from "react-router-dom";
import { assets, dummyEducatorData } from "../../assets/assets";
import UserButton from "../student/UserButton";
import { useContext } from "react";
import { AppContext } from "../../context/AppContext";

const Navbar = () => {
  const educatorData = dummyEducatorData;
  const { user } = useContext(AppContext);

  return (
    <div className="flex items-center justify-between px-4 md:px-8 border-b border-gray-500 py-3">
      <Link to="/">
        <img src={assets.skillforge_logo} alt="logo" className="w-28 lg:w-32" />
      </Link>

      <div className="flex items-center gap-5 text-gray-500 relative">
        <p>Hi, {user ? user.name : "Developers"}</p>
        {user ? (
          <UserButton />
        ) : (
          <img src={assets.profile_img} alt="profile_img" className="max-w-8" />
        )}
      </div>
    </div>
  );
};

export default Navbar;
