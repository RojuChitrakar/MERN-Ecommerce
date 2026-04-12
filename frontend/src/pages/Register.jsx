import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { Mail, Lock, User, Phone } from "lucide-react";

function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !form.firstName ||
      !form.lastName ||
      !form.email ||
      !form.phone ||
      !form.password ||
      !form.confirmPassword
    ) {
      alert("Please fill all fields");
      return;
    }

    if (!form.email.includes("@")) {
      alert("Enter a valid email");
      return;
    }

    if (form.password.length < 6) {
      alert("Password must be at least 6 characters");
      return;
    }

    if (form.password !== form.confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      await register({
        fullName: form.firstName + " " + form.lastName,
        email: form.email,
        password: form.password,
        phone: form.phone,
      });

      navigate("/");
    } catch (error) {
      alert(error.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#fdf8f6] px-4">

      {/* CARD */}
      <div className="w-full max-w-md bg-white rounded-2xl shadow-sm p-8 animate-fadeIn">

        {/* TITLE */}
        <h2 className="text-3xl font-semibold text-gray-800 text-center mb-2">
          Create Account
        </h2>

        <p className="text-gray-500 text-center mb-6 text-sm">
          Join and start your handmade journey
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">

          {/* NAME */}
          <div className="grid grid-cols-2 gap-3">
            <div className="flex items-center border border-gray-200 rounded-full px-4 py-2 focus-within:border-[#c07c52] transition">
              <User size={16} className="text-gray-400 mr-2" />
              <input
                placeholder="First name"
                className="w-full outline-none text-sm"
                value={form.firstName}
                onChange={(e) =>
                  setForm({ ...form, firstName: e.target.value })
                }
              />
            </div>

            <input
              placeholder="Last name"
              className="border border-gray-200 rounded-full px-4 py-2 outline-none text-sm focus:border-[#c07c52]"
              value={form.lastName}
              onChange={(e) =>
                setForm({ ...form, lastName: e.target.value })
              }
            />
          </div>

          {/* EMAIL */}
          <div className="flex items-center border border-gray-200 rounded-full px-4 py-2 focus-within:border-[#c07c52] transition">
            <Mail size={16} className="text-gray-400 mr-2" />
            <input
              placeholder="you@example.com"
              className="w-full outline-none text-sm"
              value={form.email}
              onChange={(e) =>
                setForm({ ...form, email: e.target.value })
              }
            />
          </div>

          {/* PHONE */}
          <div className="flex items-center border border-gray-200 rounded-full px-4 py-2 focus-within:border-[#c07c52] transition">
            <Phone size={16} className="text-gray-400 mr-2" />
            <input
              placeholder="+91 9876543210"
              className="w-full outline-none text-sm"
              value={form.phone}
              onChange={(e) =>
                setForm({ ...form, phone: e.target.value })
              }
            />
          </div>

          {/* PASSWORD */}
          <div className="flex items-center border border-gray-200 rounded-full px-4 py-2 focus-within:border-[#c07c52] transition">
            <Lock size={16} className="text-gray-400 mr-2" />
            <input
              type="password"
              placeholder="Password"
              className="w-full outline-none text-sm"
              value={form.password}
              onChange={(e) =>
                setForm({ ...form, password: e.target.value })
              }
            />
          </div>

          {/* CONFIRM PASSWORD */}
          <div className="flex items-center border border-gray-200 rounded-full px-4 py-2 focus-within:border-[#c07c52] transition">
            <Lock size={16} className="text-gray-400 mr-2" />
            <input
              type="password"
              placeholder="Confirm password"
              className="w-full outline-none text-sm"
              value={form.confirmPassword}
              onChange={(e) =>
                setForm({ ...form, confirmPassword: e.target.value })
              }
            />
          </div>

          {/* BUTTON */}
          <button
            disabled={
              !form.firstName ||
              !form.lastName ||
              !form.email ||
              !form.password ||
              !form.confirmPassword
            }
            className="w-full bg-[#c07c52] text-white py-3 rounded-full hover:scale-[1.02] transition disabled:bg-gray-300"
          >
            Create Account
          </button>
        </form>

        {/* LINK */}
        <p className="text-sm text-center mt-6 text-gray-600">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-[#c07c52] font-medium"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Register;