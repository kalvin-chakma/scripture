import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useUserStore from "../store/useUserStore";
import { FcGoogle } from "react-icons/fc";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import Button from "../components/ui/Button";

const SignIn = () => {
  const [form, setForm] = useState({ username: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const { signIn } = useUserStore();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await signIn(form);
    alert(result.message);
    if (result.success) {
      navigate("/home");
    }
  };

  return (
    <div className="min-h-full bg-black flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-5">
          <h1 className="text-2xl font-medium text-gray-300 mb-2">Scripture</h1>
          <h2 className="text-3xl font-bold text-white">Welcome back</h2>
        </div>

        <div className="bg-black rounded-lg p-8">
          {/* Google Sign In */}
          <div className="space-y-4 mb-6">
            <Button
              onClick={() => {
                window.location.href =
                  "https://scripture-xi.vercel.app/user/google";
              }}
              className="w-full bg-gray-50 text-gray-900 flex items-center justify-center gap-3 hover:bg-gray-200"
            >
              <FcGoogle className="w-5 h-5" />
              Continue with Google
            </Button>
            <div className="text-center text-gray-500">or</div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-white text-sm mb-2">Email</label>
              <input
                type="email"
                className="w-full bg-gray-800 border border-gray-600 rounded-lg py-2 px-4 text-white placeholder-gray-400 focus:border-gray-400 focus:outline-none"
                placeholder="Email"
                value={form.username}
                onChange={(e) => setForm({ ...form, username: e.target.value })}
                required
              />
            </div>

            <div>
              <label className="block text-white text-sm mb-2">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  className="w-full bg-gray-800 border border-gray-600 rounded-lg py-2 px-4 pr-10 text-white placeholder-gray-400 focus:border-gray-400 focus:outline-none"
                  placeholder="•••••••••••••"
                  value={form.password}
                  autoComplete="current password"
                  onChange={(e) =>
                    setForm({ ...form, password: e.target.value })
                  }
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full bg-gray-700 hover:bg-gray-500 text-white"
            >
              Sign In
            </Button>
          </form>

          {/* Sign Up Link */}
          <div className="text-center mt-6">
            <p className="text-gray-400">
              Don't have an account?{" "}
              <Button
                type="button"
                className="text-white text-sm px-0 underline hover:no-underline"
                onClick={() => navigate("/user/signup")}
              >
                Create one
              </Button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
