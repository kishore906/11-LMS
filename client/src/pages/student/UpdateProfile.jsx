import { useContext, useEffect, useState } from "react";
import { AppContext } from "../../context/AppContext";
import { toast } from "react-toastify";

const UpdateProfile = () => {
  const { navigate, user } = useContext(AppContext);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [btnDisable, setBtnDisable] = useState(false);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setBtnDisable(true);

    try {
      const response = await fetch(
        `http://localhost:5000/api/updateProfile/${user._id}`,
        {
          method: "PUT",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ name, email }),
        }
      );
      const data = await response.json();

      if (data.user) {
        navigate("/");
        toast.success("Details Updated Successfully");
      } else if (data.error) {
        toast.error(data.error);
      }
    } catch (err) {
      console.log(err);
      toast.error("Server error please try later!!");
    } finally {
      setBtnDisable(false);
    }
  };

  useEffect(() => {
    if (user?._id) {
      async function getUser() {
        try {
          const response = await fetch(
            `http://localhost:5000/api/user/${user?._id}`,
            {
              credentials: "include", // Include cookies (including the JWT token)
              header: {
                "Content-Type": "application/json",
              },
            }
          );
          const data = await response.json();

          if (data.user) {
            setName(data.user.name);
            setEmail(data.user.email);
          } else if (data.error) {
            toast.error(data.error);
          }
        } catch (err) {
          console.log(err);
          toast.error("Server error please try later!!");
        }
      }
      getUser();
    }
  }, [user?._id]);

  return (
    <div className="flex justify-center items-center min-h-screen">
      <form
        className="flex flex-col gap-3 w-sm shadow-custom-card p-5"
        onSubmit={handleUpdate}
      >
        <h2 className="text-center font-bold text-3xl mb-5">Update Profile</h2>
        <div>
          <label htmlFor="name">FullName:</label>
          <input
            type="text"
            id="name"
            name="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500"
            required
          />
        </div>
        <div>
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
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

export default UpdateProfile;
