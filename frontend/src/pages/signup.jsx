import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useUserStore from "../store/useUserStore";
import { FcGoogle } from "react-icons/fc";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import Button from "../components/ui/Button";

const SignUp = () => {
  const [form, setForm] = useState({ username: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const { signUp, error, clearError } = useUserStore();
  const navigate = useNavigate();

  useEffect(() => {
    clearError();
  }, [form, clearError]);

  const rules = [
    { rule: /(?=.*[a-z])(?=.*[A-Z])/, label: "Upper & lowercase" },
    { rule: /.{7,}/, label: "Min 7 characters" },
    { rule: /(?=.*\d)/, label: "At least 1 number" },
  ];

  const isPasswordValid = rules.every((r) => r.rule.test(form.password));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isPasswordValid) return;
    const result = await signUp(form);
    alert(result.message);
    if (result.success) navigate("/user/signin");
  };

  return (
    <div className="min-h-full bg-black flex items-center justify-center px-4">
      <div className="max-w-sm w-full space-y-6">
        <div className="text-center">
          <h1 className="text-3xl lg:text-4xl font-bold text-white">
            Create your account
          </h1>
          <p className="text-gray-400">Free for everyone.</p>
        </div>

        <Button className="w-[35vh] mx-auto lg:w-full bg-white text-gray-900 flex items-center justify-center gap-3 hover:bg-gray-50">
          <FcGoogle className="w-5 h-5" /> Continue with Google
        </Button>

        <div className="text-center text-gray-500">or</div>

        <form
          onSubmit={handleSubmit}
          className="space-y-6 w-[35vh] mx-auto lg:w-full"
        >
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
                className="w-full bg-gray-800 border border-gray-600 rounded-lg py-2 px-4 pr-12 text-white placeholder-gray-400 focus:border-gray-400 focus:outline-none"
                placeholder="•••••••••••••"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
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
            <div className="mt-2 space-y-1 text-sm">
              {rules.map(({ rule, label }, i) => {
                const valid = rule.test(form.password);
                return (
                  <div key={i} className="flex items-center gap-2">
                    <span
                      className={`w-2 h-2 rounded-full ${
                        valid ? "bg-green-500" : "bg-gray-400"
                      }`}
                    ></span>
                    <span
                      className={valid ? "text-green-400" : "text-gray-400"}
                    >
                      {label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="terms"
              checked={agreeToTerms}
              onChange={(e) => setAgreeToTerms(e.target.checked)}
              className="w-4 h-4 rounded text-blue-600 border-gray-600 bg-gray-800"
            />
            <label
              htmlFor="terms"
              className={`text-sm ${
                agreeToTerms ? "text-green-400" : "text-gray-300"
              }`}
            >
              I agree to the privacy policy and cookie usage
            </label>
          </div>

          <Button
            type="submit"
            disabled={!agreeToTerms || !isPasswordValid}
            className={`w-full ${
              agreeToTerms && isPasswordValid
                ? "bg-gray-600 hover:bg-gray-500 text-white"
                : "bg-gray-700 text-gray-500 cursor-not-allowed"
            }`}
          >
            Create Account
          </Button>
        </form>

        <div className="text-center">
          <p className="text-gray-400">
            Already have an account?{" "}
            <Button
              className="text-white text-sm  underline hover:no-underline"
              onClick={() => navigate("/user/signin")}
            >
              Sign in
            </Button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
