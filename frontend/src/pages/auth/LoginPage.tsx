import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { toast } from "react-hot-toast";
import {
  Mail,
  Lock,
  LogIn,
  Eye,
  EyeOff,
  AlertCircle,
  Check,
} from "lucide-react";

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{
    email?: string;
    password?: string;
  }>({});
  const [touched, setTouched] = useState<{
    email: boolean;
    password: boolean;
  }>({
    email: false,
    password: false,
  });
  const [showPassword, setShowPassword] = useState(false);

  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const redirectPath = location.state?.from?.pathname || "/";

  // Redirect if already logged in
  useEffect(() => {
    if (isAuthenticated) {
      navigate(redirectPath, { replace: true });
    }
  }, [isAuthenticated, navigate, redirectPath]);

  // Validate form on input changes
  useEffect(() => {
    const newErrors: { [key: string]: string } = {};

    // Only validate fields that have been touched
    if (touched.email) {
      if (!email.trim()) {
        newErrors.email = "Email is required";
      } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(email)) {
        newErrors.email = "Invalid email address";
      }
    }

    if (touched.password && !password) {
      newErrors.password = "Password is required";
    }

    setErrors(newErrors);
  }, [email, password, touched]);

  const handleBlur = (field: keyof typeof touched) => {
    setTouched({ ...touched, [field]: true });
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Mark all fields as touched for validation
    setTouched({
      email: true,
      password: true,
    });

    // Check if there are any errors
    if (Object.keys(errors).length > 0) {
      toast.error("Please fix the errors before submitting");
      return;
    }

    setIsLoading(true);
    try {
      await login(email, password);
      toast.success("Logged in successfully!");
      navigate(redirectPath, { replace: true });
    } catch (error: any) {
      toast.error(
        error.message || "Login failed. Please check your credentials."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg transition-all duration-300">
        <div>
          <h2 className="mt-4 text-center text-3xl font-extrabold text-gray-900 dark:text-white">
            Sign in to your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
            Or{" "}
            <Link
              to="/register"
              className="font-medium text-brand hover:text-brand-600 dark:text-brand-400 dark:hover:text-brand-500 transition-colors duration-200"
            >
              create an account
            </Link>
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {/* Email */}
          <div className="space-y-1">
            <label
              htmlFor="email-address"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Email Address
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-gray-400" aria-hidden="true" />
              </div>
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                className={`appearance-none block w-full px-3 py-2 pl-10 border ${
                  errors.email
                    ? "border-red-500 dark:border-red-500"
                    : "border-gray-300 dark:border-gray-600"
                } rounded-lg placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white bg-white dark:bg-gray-700 focus:outline-none focus:ring-brand-500 focus:border-brand-500 dark:focus:ring-brand-400 dark:focus:border-brand-400 sm:text-sm transition-colors duration-200`}
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onBlur={() => handleBlur("email")}
              />
              {touched.email && !errors.email && (
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                  <Check className="h-5 w-5 text-green-500" />
                </div>
              )}
            </div>
            {errors.email && (
              <p className="text-sm text-red-600 dark:text-red-400 mt-1 flex items-center">
                <AlertCircle className="h-4 w-4 mr-1" />
                {errors.email}
              </p>
            )}
          </div>

          {/* Password */}
          <div className="space-y-1">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-gray-400" aria-hidden="true" />
              </div>
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                required
                className={`appearance-none block w-full px-3 py-2 pl-10 pr-10 border ${
                  errors.password
                    ? "border-red-500 dark:border-red-500"
                    : "border-gray-300 dark:border-gray-600"
                } rounded-lg placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white bg-white dark:bg-gray-700 focus:outline-none focus:ring-brand-500 focus:border-brand-500 dark:focus:ring-brand-400 dark:focus:border-brand-400 sm:text-sm transition-colors duration-200`}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onBlur={() => handleBlur("password")}
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                onClick={togglePasswordVisibility}
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300" />
                ) : (
                  <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300" />
                )}
              </button>
            </div>
            {errors.password && (
              <p className="text-sm text-red-600 dark:text-red-400 mt-1 flex items-center">
                <AlertCircle className="h-4 w-4 mr-1" />
                {errors.password}
              </p>
            )}
          </div>

          {/* Forgot Password Link */}
          <div className="flex items-center justify-end">
            <div className="text-sm">
              <Link
                to="/forgot-password"
                className="font-medium text-brand hover:text-brand-600 dark:text-brand-400 dark:hover:text-brand-500 transition-colors duration-200"
              >
                Forgot your password?
              </Link>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-brand hover:bg-brand-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500 dark:bg-brand-600 dark:hover:bg-brand-700 dark:focus:ring-offset-gray-800 disabled:opacity-70 disabled:cursor-not-allowed transition-all duration-200"
            >
              <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                {!isLoading && (
                  <LogIn
                    className="h-5 w-5 text-brand-300 group-hover:text-brand-400"
                    aria-hidden="true"
                  />
                )}
                {isLoading && (
                  <svg
                    className="animate-spin h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                )}
              </span>
              {isLoading ? "Signing in..." : "Sign in"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
