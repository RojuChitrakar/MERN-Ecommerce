import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { Mail, Lock } from "lucide-react";

function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.email || !form.password) {
      alert("Please fill all fields");
      return;
    }

    try {
      const data = await login(form.email, form.password); // ✅ get user
      console.log("LOGIN DATA:", data);
      // 🔥 ADMIN REDIRECT
      if (data.isAdmin) {
        navigate("/admin");
      } else {
        const redirect = location.state?.from?.pathname || "/";
        navigate(redirect);
      }

      
    } catch (error) {
      alert(error.response?.data?.message || "Login failed");
    }
  };
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-xl shadow w-full max-w-md">
        {/* TITLE */}
        <h2 className="text-2xl font-bold text-center mb-2">Welcome Back</h2>

        <p className="text-gray-500 text-center mb-6">
          Sign in to your account to continue
        </p>

        {/* FORM */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* EMAIL */}
          <div>
            <label className="text-sm text-gray-600">Email Address</label>

            <div className="flex items-center border rounded-lg px-3 py-2 mt-1">
              <Mail size={16} className="text-gray-400 mr-2" />
              <input
                type="email"
                placeholder="you@example.com"
                className="w-full outline-none"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
            </div>
          </div>

          {/* PASSWORD */}
          <div>
            <label className="text-sm text-gray-600">Password</label>

            <div className="flex items-center border rounded-lg px-3 py-2 mt-1">
              <Lock size={16} className="text-gray-400 mr-2" />
              <input
                type="password"
                placeholder="••••••••"
                className="w-full outline-none"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
              />
            </div>
          </div>

          {/* BUTTON */}
          <button
            disabled={!form.email || !form.password}
            className="w-full bg-blue-600 text-white py-3 rounded-lg disabled:bg-gray-300"
          >
            Sign In
          </button>
        </form>

        {/* LINK */}
        <p className="text-sm text-center mt-6">
          Don’t have an account?{" "}
          <Link to="/register" className="text-blue-600">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
