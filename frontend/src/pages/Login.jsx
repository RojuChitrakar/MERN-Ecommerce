import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { Mail, Lock , Eye, EyeOff} from "lucide-react";

function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [showPassword, setShowPassword] = useState(false);
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
      const data = await login(form.email, form.password);

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
    <div className="min-h-screen flex items-center justify-center bg-[#fdf8f6] px-4">

      {/* CARD */}
      <div className="w-full max-w-md bg-white rounded-2xl shadow-sm p-8 animate-fadeIn">

        {/* TITLE */}
        <h2 className="text-3xl font-semibold text-gray-800 text-center mb-2">
          Welcome Back
        </h2>

        <p className="text-gray-500 text-center mb-6 text-sm">
          Sign in to continue your handmade journey
        </p>

        {/* FORM */}
        <form onSubmit={handleSubmit} className="space-y-4">

          {/* EMAIL */}
          <div>
            <label className="text-sm text-gray-600">Email</label>

            <div className="flex items-center border border-gray-200 rounded-full px-4 py-2 mt-1 focus-within:border-[#c07c52] transition">
              <Mail size={16} className="text-gray-400 mr-2" />
              <input
                type="email"
                placeholder="you@example.com"
                className="w-full outline-none bg-transparent text-sm"
                value={form.email}
                onChange={(e) =>
                  setForm({ ...form, email: e.target.value })
                }
              />
            </div>
          </div>

          {/* PASSWORD */}
          {/* <div>
            <label className="text-sm text-gray-600">Password</label>

            <div className="flex items-center border border-gray-200 rounded-full px-4 py-2 mt-1 focus-within:border-[#c07c52] transition">
              <Lock size={16} className="text-gray-400 mr-2" />
              <input
                type="password"
                placeholder="••••••••"
                className="w-full outline-none bg-transparent text-sm"
                value={form.password}
                onChange={(e) =>
                  setForm({ ...form, password: e.target.value })
                }
              />
            </div>
          </div> */}

          <div>
  <label className="text-sm text-gray-600">Password</label>

  <div className="flex items-center border border-gray-200 rounded-full px-4 py-2 mt-1 focus-within:border-[#c07c52] transition">
    <Lock size={16} className="text-gray-400 mr-2" />

    <input
      type={showPassword ? "text" : "password"}
      placeholder="••••••••"
      className="w-full outline-none bg-transparent text-sm"
      value={form.password}
      onChange={(e) =>
        setForm({ ...form, password: e.target.value })
      }
    />

    {/* 👁️ TOGGLE */}
    <button
      type="button"
      onClick={() => setShowPassword(!showPassword)}
      className="ml-2 text-gray-400 hover:text-[#c07c52]"
    >
      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
    </button>
  </div>
</div>

          {/* BUTTON */}
          <button
            disabled={!form.email || !form.password}
            className="w-full bg-[#c07c52] text-white py-3 rounded-full hover:scale-[1.02] transition disabled:bg-gray-300"
          >
            Sign In
          </button>
        </form>

        {/* LINK */}
        <p className="text-sm text-center mt-6 text-gray-600">
          Don’t have an account?{" "}
          <Link
            to="/register"
            className="text-[#c07c52] font-medium"
          >
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Login;