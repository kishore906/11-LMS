import { useState, useContext } from "react";
import { toast } from "react-toastify";
import { AppContext } from "../../context/AppContext";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [btnDisable, setBtnDisable] = useState(false);
  const { navigate, setUser } = useContext(AppContext);

  const handleLogin = async (e) => {
    e.preventDefault();
    setBtnDisable(true);

    try {
      const response = await fetch("http://localhost:5000/api/login", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();

      if (data.user) {
        toast.success("Login Successful..");
        localStorage.setItem("user", JSON.stringify(data.user));
        setUser(data.user);
        navigate("/");
      } else if (data.message) {
        toast.error(data.message);
      }
    } catch (err) {
      console.log(err);
      toast.error("Server error please try later!!");
    } finally {
      setEmail("");
      setPassword("");
      setBtnDisable(false);
    }
  };
  return (
    <div className="flex justify-center items-center min-h-screen">
      <form
        className="flex flex-col gap-3 w-sm shadow-custom-card p-5"
        onSubmit={handleLogin}
      >
        <h2 className="text-center font-bold text-3xl mb-5">Login</h2>
        <div>
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            placeholder="Enter Email.."
            value={email}
            onChange={(e) => setEmail(e.target.value)}
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
          Login
        </button>
      </form>
    </div>
  );
};

export default Login;
