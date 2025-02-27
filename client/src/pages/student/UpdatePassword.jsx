import { useContext, useState } from "react";
import { AppContext } from "../../context/AppContext";
import { toast } from "react-toastify";

const UpdatePassword = () => {
  const { navigate, user } = useContext(AppContext);
  const [password, setPassword] = useState("");
  const [btnDisable, setBtnDisable] = useState(false);

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    setBtnDisable(true);

    try {
      const response = await fetch(
        `http://localhost:5000/api/updatePassword/${user._id}`,
        {
          method: "PUT",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ password }),
        }
      );

      const data = await response.json();

      if (data.message) {
        navigate("/");
        toast.success(data.message);
      } else if (data.error) {
        toast.error(data.error);
      }
    } catch (err) {
      console.log(err);
      toast.error("Server error please try later !!");
    } finally {
      setBtnDisable(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen">
      <form
        className="flex flex-col gap-3 w-sm shadow-custom-card p-5"
        onSubmit={handlePasswordUpdate}
      >
        <h2 className="text-center font-bold text-3xl mb-5">Update Password</h2>
        <div>
          <label htmlFor="password">New Password:</label>
          <input
            type="password"
            id="password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500"
            required
          />
        </div>
        <button
          type="submit"
          className="block bg-blue-600 text-white px-5 py-2 rounded-full w-32 ml-auto mr-auto mt-5"
          disabled={btnDisable}
        >
          Update
        </button>
      </form>
    </div>
  );
};

export default UpdatePassword;
