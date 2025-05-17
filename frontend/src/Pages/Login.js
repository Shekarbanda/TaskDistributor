import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";

const Login = () => {
  const [email, setEmail] = useState("admin@gmail.com");
  const [password, setPassword] = useState("123456");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const apiurl = useSelector((state) => state.api.url);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post(apiurl + "/auth/login", {
        email,
        password,
      });
      localStorage.setItem("token", response?.data?.data?.token);
      toast.success("Login successful!");
      navigate("/");
    } catch (err) {
      toast.error(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-[#002f34] mb-6 text-center">
          Admin Login
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border p-3 rounded focus:outline-none focus:ring-2 focus:ring-blue-700 transition-colors duration-200"
              required
            />
          </div>
          <div className="mb-6">
            <label className="block text-sm font-medium mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border p-3 rounded focus:outline-none focus:ring-2 focus:ring-blue-700 transition-colors duration-200"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-[#002f34] text-white p-3 rounded hover:bg-[#002f30] transition-colors duration-200 flex items-center justify-center"
            disabled={loading}
          >
            {loading ? (
              <div
                className="w-7 h-7 border-4 border-white-300 mx-auto text-center border-t-[#002f34] rounded-full animate-spin"
                role="status"
                aria-live="polite"
                aria-label="Please wait"
              ></div>
            ) : null}
            {loading ? "" : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
