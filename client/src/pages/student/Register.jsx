import { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [btnDisable, setBtnDisable] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setBtnDisable(true);
    const newUser = {
      name: formData.name,
      email: formData.email,
      password: formData.password,
    };

    try {
      const repsonse = await fetch("http://localhost:5000/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newUser),
      });
      const data = await repsonse.json();
      console.log(data);
      if (data.message) {
        toast.success(data.message);
      } else if (data.error) {
        toast.error(data.error);
      }
    } catch (err) {
      console.log(err);
      toast.error("server error please try later!!");
    } finally {
      setFormData({ name: "", email: "", password: "" });
      setBtnDisable(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen">
      <form
        className="flex flex-col gap-3 w-sm shadow-custom-card p-5"
        onSubmit={handleRegister}
      >
        <h2 className="text-center font-bold text-3xl mb-5">Register</h2>
        <div>
          <label htmlFor="name">FullName:</label>
          <input
            type="text"
            id="name"
            name="name"
            placeholder="Enter Name.."
            value={formData.name}
            onChange={handleChange}
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
            placeholder="Enter Email.."
            value={formData.email}
            onChange={handleChange}
            className="w-full outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500"
            required
          />
        </div>
        <div>
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            name="password"
            placeholder="Enter Password.."
            value={formData.password}
            onChange={handleChange}
            className="w-full outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500"
            required
          />
        </div>
        <button
          type="submit"
          className="block bg-blue-600 text-white px-5 py-2 rounded-full w-32 ml-auto mr-auto mt-5"
          disabled={btnDisable}
        >
          Register
        </button>

        <p className="text-gray-500 mt-4">
          Already Registered?{" "}
          <Link to="/login" className="text-blue-500 underline">
            Login
          </Link>{" "}
          here
        </p>
      </form>
    </div>
  );
};

export default Register;
