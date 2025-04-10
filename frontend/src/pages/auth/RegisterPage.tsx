import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { toast } from "react-hot-toast";
import {
  Mail,
  Lock,
  User as UserIcon,
  LogIn,
  Eye,
  EyeOff,
  AlertCircle,
  Check,
} from "lucide-react";

const RegisterPage: React.FC = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{
    firstName?: string;
    lastName?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
  }>({});
  const [touched, setTouched] = useState<{
    firstName: boolean;
    lastName: boolean;
    email: boolean;
    password: boolean;
    confirmPassword: boolean;
  }>({
    firstName: false,
    lastName: false,
    email: false,
    password: false,
    confirmPassword: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const { register, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Redirect if already logged in
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/"); // Redirect to home if already logged in
    }
  }, [isAuthenticated, navigate]);

  // Validate form on input changes
  useEffect(() => {
    const newErrors: { [key: string]: string } = {};

    // Only validate fields that have been touched
    if (touched.firstName && !firstName.trim()) {
      newErrors.firstName = "First name is required";
    }

    if (touched.lastName && !lastName.trim()) {
      newErrors.lastName = "Last name is required";
    }

    if (touched.email) {
      if (!email.trim()) {
        newErrors.email = "Email is required";
      } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(email)) {
        newErrors.email = "Invalid email address";
      }
    }

    if (touched.password) {
      if (!password) {
        newErrors.password = "Password is required";
      } else if (password.length < 8) {
        newErrors.password = "Password must be at least 8 characters";
      }
    }

    if (touched.confirmPassword) {
      if (!confirmPassword) {
        newErrors.confirmPassword = "Please confirm your password";
      } else if (password !== confirmPassword) {
        newErrors.confirmPassword = "Passwords do not match";
      }
    }

    setErrors(newErrors);
  }, [firstName, lastName, email, password, confirmPassword, touched]);

  const handleBlur = (field: keyof typeof touched) => {
    setTouched({ ...touched, [field]: true });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Mark all fields as touched for validation
    setTouched({
      firstName: true,
      lastName: true,
      email: true,
      password: true,
      confirmPassword: true,
    });

    // Check if there are any errors
    if (password !== confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }

    if (Object.keys(errors).length > 0) {
      toast.error("Please fix the errors before submitting");
      return;
    }

    setIsLoading(true);
    try {
      await register({ firstName, lastName, email, password });
      toast.success("Registration successful! Welcome!");
      navigate("/"); // Redirect to home after successful registration
    } catch (error: any) {
      toast.error(error.message || "Registration failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg transition-all duration-300">
        <div>
          <h2 className="mt-4 text-center text-3xl font-extrabold text-gray-900 dark:text-white">
            Create your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-medium text-brand hover:text-brand-600 dark:text-brand-400 dark:hover:text-brand-500 transition-colors duration-200"
            >
              Sign in here
            </Link>
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {/* Name fields - grouped visually */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* First Name */}
            <div className="space-y-1">
              <label
                htmlFor="first-name"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                First Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <UserIcon
                    className="h-5 w-5 text-gray-400"
                    aria-hidden="true"
                  />
                </div>
                <input
                  id="first-name"
                  name="firstName"
                  type="text"
                  autoComplete="given-name"
                  required
                  className={`appearance-none block w-full px-3 py-2 pl-10 border ${
                    errors.firstName
                      ? "border-red-500 dark:border-red-500"
                      : "border-gray-300 dark:border-gray-600"
                  } rounded-lg placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white bg-white dark:bg-gray-700 focus:outline-none focus:ring-brand-500 focus:border-brand-500 dark:focus:ring-brand-400 dark:focus:border-brand-400 sm:text-sm transition-colors duration-200`}
                  placeholder="First Name"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  onBlur={() => handleBlur("firstName")}
                />
                {touched.firstName && !errors.firstName && (
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                    <Check className="h-5 w-5 text-green-500" />
                  </div>
                )}
              </div>
              {errors.firstName && (
                <p className="text-sm text-red-600 dark:text-red-400 mt-1 flex items-center">
                  <AlertCircle className="h-4 w-4 mr-1" />
                  {errors.firstName}
                </p>
              )}
            </div>

            {/* Last Name */}
            <div className="space-y-1">
              <label
                htmlFor="last-name"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Last Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <UserIcon
                    className="h-5 w-5 text-gray-400"
                    aria-hidden="true"
                  />
                </div>
                <input
                  id="last-name"
                  name="lastName"
                  type="text"
                  autoComplete="family-name"
                  required
                  className={`appearance-none block w-full px-3 py-2 pl-10 border ${
                    errors.lastName
                      ? "border-red-500 dark:border-red-500"
                      : "border-gray-300 dark:border-gray-600"
                  } rounded-lg placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white bg-white dark:bg-gray-700 focus:outline-none focus:ring-brand-500 focus:border-brand-500 dark:focus:ring-brand-400 dark:focus:border-brand-400 sm:text-sm transition-colors duration-200`}
                  placeholder="Last Name"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  onBlur={() => handleBlur("lastName")}
                />
                {touched.lastName && !errors.lastName && (
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                    <Check className="h-5 w-5 text-green-500" />
                  </div>
                )}
              </div>
              {errors.lastName && (
                <p className="text-sm text-red-600 dark:text-red-400 mt-1 flex items-center">
                  <AlertCircle className="h-4 w-4 mr-1" />
                  {errors.lastName}
                </p>
              )}
            </div>
          </div>

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
                autoComplete="new-password"
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
            {touched.password && !errors.password && password && (
              <p className="text-sm text-green-600 dark:text-green-400 mt-1 flex items-center">
                <Check className="h-4 w-4 mr-1" />
                Password meets requirements
              </p>
            )}
            {errors.password && (
              <p className="text-sm text-red-600 dark:text-red-400 mt-1 flex items-center">
                <AlertCircle className="h-4 w-4 mr-1" />
                {errors.password}
              </p>
            )}
          </div>

          {/* Confirm Password */}
          <div className="space-y-1">
            <label
              htmlFor="confirm-password"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Confirm Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-gray-400" aria-hidden="true" />
              </div>
              <input
                id="confirm-password"
                name="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                autoComplete="new-password"
                required
                className={`appearance-none block w-full px-3 py-2 pl-10 pr-10 border ${
                  errors.confirmPassword
                    ? "border-red-500 dark:border-red-500"
                    : "border-gray-300 dark:border-gray-600"
                } rounded-lg placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white bg-white dark:bg-gray-700 focus:outline-none focus:ring-brand-500 focus:border-brand-500 dark:focus:ring-brand-400 dark:focus:border-brand-400 sm:text-sm transition-colors duration-200`}
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                onBlur={() => handleBlur("confirmPassword")}
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                onClick={toggleConfirmPasswordVisibility}
              >
                {showConfirmPassword ? (
                  <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300" />
                ) : (
                  <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300" />
                )}
              </button>
            </div>
            {touched.confirmPassword &&
              confirmPassword &&
              password === confirmPassword &&
              !errors.confirmPassword && (
                <p className="text-sm text-green-600 dark:text-green-400 mt-1 flex items-center">
                  <Check className="h-4 w-4 mr-1" />
                  Passwords match
                </p>
              )}
            {errors.confirmPassword && (
              <p className="text-sm text-red-600 dark:text-red-400 mt-1 flex items-center">
                <AlertCircle className="h-4 w-4 mr-1" />
                {errors.confirmPassword}
              </p>
            )}
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
              {isLoading ? "Creating account..." : "Create account"}
            </button>
          </div>

          <div className="text-center text-xs text-gray-500 dark:text-gray-400">
            By creating an account, you agree to our{" "}
            <Link to="/terms" className="text-brand hover:underline">
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link to="/privacy" className="text-brand hover:underline">
              Privacy Policy
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;
