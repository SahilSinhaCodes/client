import { useState, useContext } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import toast from "react-hot-toast"; // ✅ import

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", formData);
      const { token, user } = res.data;

      // Save login state globally
      login(token, user);

      toast.success("Logged in successfully!"); // ✅ use toast
      navigate("/home");
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || "Login failed";
      setError(errorMsg);
      toast.error(errorMsg); // ✅ use toast
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center">
      <form onSubmit={handleSubmit} className="space-y-4 bg-gray-900 p-8 rounded-lg shadow-xl w-full max-w-sm">
        <h2 className="text-xl font-bold">Login</h2>
        <p className="text-sm text-gray-400 mt-2">
          Don't have an account?{" "}
          <Link to="/register" className="text-indigo-400 underline hover:text-indigo-600">
            Register
          </Link>
        </p>

        <input
          type="email"
          name="email"
          placeholder="Email"
          className="w-full p-2 rounded bg-gray-800 text-white"
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          className="w-full p-2 rounded bg-gray-800 text-white"
          onChange={handleChange}
          required
        />
        <button type="submit" className="bg-indigo-600 px-4 py-2 rounded hover:bg-indigo-700 w-full">
          Login
        </button>
        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
      </form>
    </div>
  );
};

export default Login;
