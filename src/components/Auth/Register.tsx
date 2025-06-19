import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: ""
  });

  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      const res = await axios.post("http://localhost:5000/api/auth/register", formData);
      toast.success("Registered Successfully!");
      navigate("/login");
    } catch (err: any) {
      // 👇 More defensive check
      const errorMsg =
        err?.response?.data?.message || "Registration failed";
      setError(errorMsg);
      toast.error(errorMsg);
    }
  };
  

  return (
    <div className="min-h-screen bg-stone-900 text-white flex items-center justify-center">
      <form onSubmit={handleSubmit} className="space-y-4 bg-gray-900 p-8 rounded-lg shadow-xl w-full max-w-sm">
        <h2 className="text-xl font-bold">Register</h2>
        <p className="text-sm text-gray-400 mt-2">
          Already have an account?{" "}
          <Link to="/login" className="text-indigo-400 underline hover:text-indigo-600">
            Login
          </Link>
        </p>

        <input
          type="text"
          name="name"
          placeholder="Name"
          className="w-full p-2 rounded bg-gray-800 text-white"
          onChange={handleChange}
          required
        />
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
          Register
        </button>
        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
      </form>
    </div>
  );
};

export default Register;
