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

      navigate("/checkout");
    } catch (error) {
      console.log("ERROR:", error.message);
      
      alert(error.response?.data?.message || "Registration failed");
    }
  };
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-xl shadow w-full max-w-md">
        {/* TITLE */}
        <h2 className="text-2xl font-bold text-center mb-2">Create Account</h2>

        <p className="text-gray-500 text-center mb-6">
          Sign up to start shopping
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* NAME */}
          <div className="grid grid-cols-2 gap-3">
            <div className="flex items-center border rounded-lg px-3 py-2">
              <User size={16} className="text-gray-400 mr-2" />
              <input
                placeholder="John"
                className="w-full outline-none"
                value={form.firstName}
                onChange={(e) =>
                  setForm({ ...form, firstName: e.target.value })
                }
              />
            </div>

            <input
              placeholder="Doe"
              className="border rounded-lg px-3 py-2 outline-none"
              value={form.lastName}
              onChange={(e) => setForm({ ...form, lastName: e.target.value })}
            />
          </div>

          {/* EMAIL */}
          <div className="flex items-center border rounded-lg px-3 py-2">
            <Mail size={16} className="text-gray-400 mr-2" />
            <input
              placeholder="you@example.com"
              className="w-full outline-none"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
          </div>

          {/* PHONE */}
          <div className="flex items-center border rounded-lg px-3 py-2">
            <Phone size={16} className="text-gray-400 mr-2" />
            <input
              placeholder="+1 (555) 123-4567"
              className="w-full outline-none"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
            />
          </div>

          {/* PASSWORD */}
          <div className="flex items-center border rounded-lg px-3 py-2">
            <Lock size={16} className="text-gray-400 mr-2" />
            <input
              type="password"
              placeholder="••••••••"
              className="w-full outline-none"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />
          </div>

          {/* CONFIRM PASSWORD */}
          <div className="flex items-center border rounded-lg px-3 py-2">
            <Lock size={16} className="text-gray-400 mr-2" />
            <input
              type="password"
              placeholder="Confirm password"
              className="w-full outline-none"
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
            className="w-full bg-blue-600 text-white py-3 rounded-lg disabled:bg-gray-300"
          >
            Create Account
          </button>
        </form>

        {/* LINK */}
        <p className="text-sm text-center mt-6">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-600">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Register;
