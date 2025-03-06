import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useGoogleLogin } from "@react-oauth/google";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Eye, EyeOff } from "lucide-react";
import SectorSelectionModal from "../components/Profile/SectorSelectionModal";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [showSectorModal, setShowSectorModal] = useState(false);
  const navigate = useNavigate();
  const Fronted_API_URL = process.env.REACT_APP_API_URL; // Frontend API

  useEffect(() => {
    const rememberedEmail = localStorage.getItem("rememberedEmail");
    const rememberedPassword = localStorage.getItem("rememberedPassword");

    if (rememberedEmail && rememberedPassword) {
      setEmail(rememberedEmail);
      setPassword(rememberedPassword);
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await axios.post(`${Fronted_API_URL}/user/login`, {
        email,
        password,
      });

      const { token, isOTPVerified, userId } = response.data;

      localStorage.setItem("token", token);
      localStorage.setItem("userId", userId);

      const rememberMe = document.getElementById("remember-me").checked;

      if (rememberMe) {
        localStorage.setItem("rememberedEmail", email);
        localStorage.setItem("rememberedPassword", password);
      }

      if (isOTPVerified) {
        if (
          localStorage.getItem("firstTimeLogin") !== null &&
          localStorage.getItem("firstTimeLogin") === "true"
        ) {
          setShowSectorModal(true);
        } else {
          navigate("/");
        }
      } else {
        setError("OTP verification is pending.");
      }
    } catch (error) {
      console.error("Login failed:", error);
      setError("Invalid email or password");
    }
  };

  const updatePreferredSectors = async (selectedSectors) => {
    try {
      const userId = localStorage.getItem("userId");
      const token = localStorage.getItem("token");

      await axios.put(
        `${Fronted_API_URL}/user/profile/${userId}`,
        { preferredSectors: selectedSectors },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success("Preferred sectors updated successfully");
      setShowSectorModal(false);
      navigate("/viewprofile"); // Redirect after modal closes
    } catch (error) {
      console.error("Error updating preferred sectors:", error);
      toast.error("Failed to update sectors");
    }
  };

  const handleGoogleAuth = useGoogleLogin({
    onSuccess: async (authResult) => {
      try {
        if (authResult["code"]) {
          const response = await fetch(
            `${Fronted_API_URL}/googleauth/googleLogin`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ code: authResult.code }),
            }
          );

          const data = await response.json();

          if (!response.ok) {
            toast.error(
              data.message || "An error occurred during signup/login"
            );
            return;
          }

          const { token, userId } = data;
          console.log(token);

          // Store token in localStorage and navigate to profile
          localStorage.setItem("token", token);
          localStorage.setItem("userId", userId);
          toast.success("Login successfully");
          navigate("/viewprofile");
        }
      } catch (error) {
        console.error("Error during Google authentication:", error);
      }
    },
    onError: () =>
      toast.error("Google Sign In was unsuccessful. Try again later."),
    flow: "auth-code",
  });

  return (
    <section className="min-h-screen bg-slate-200/90">
      <div className="flex min-h-full flex-1 flex-col justify-center pt-0 md:pt-4 sm:px-6 lg:px-8">
        <div className="mt-4 sm:mx-auto sm:w-full sm:max-w-[480px]">
          <div className="bg-white px-6 py-12 shadow sm:rounded-lg sm:px-12 mt-4">
            <h2 className="mb-3 text-start text-2xl font-bold leading-9 tracking-tight text-gray-900">
              Sign in to your account
            </h2>
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Email address
                </label>
                <div className="mt-2">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="Enter your email address"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Password
                </label>
                <div className="mt-2 relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    autoComplete="current-password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="block w-full rounded-md border-0 py-1.5 pr-10 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              {error && <p className="text-red-600">{error}</p>}

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-600"
                  />
                  <label
                    htmlFor="remember-me"
                    className="ml-3 block text-sm leading-6 text-gray-900"
                  >
                    Remember me
                  </label>
                </div>

                <div className="text-sm leading-6">
                  <Link
                    to="/forgot-password"
                    className="font-semibold text-blue-600 hover:text-blue-500"
                  >
                    Forgot password?
                  </Link>
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  className="flex w-full justify-center rounded-md bg-blue-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
                >
                  Sign in
                </button>
              </div>
            </form>

            <div>
              <div className="relative mt-4">
                <div
                  className="absolute inset-0 flex items-center"
                  aria-hidden="true"
                >
                  <div className="w-full border-t border-gray-200" />
                </div>
                <div className="relative flex justify-center text-sm font-medium leading-6">
                  <span className="bg-white px-6 text-gray-900">
                    Or continue with
                  </span>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-1">
                <div
                  onClick={handleGoogleAuth}
                  className="flex w-full items-center justify-center gap-3 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus-visible:ring-transparent cursor-pointer"
                >
                  <svg
                    className="h-5 w-5"
                    aria-hidden="true"
                    viewBox="0 0 24 24"
                  >
                    <path
                      d="M12.0003 4.75C13.7703 4.75 15.3553 5.36002 16.6053 6.54998L20.0303 3.125C17.9502 1.19 15.2353 0 12.0003 0C7.31028 0 3.25527 2.69 1.28027 6.60998L5.27028 9.70498C6.21525 6.86002 8.87028 4.75 12.0003 4.75Z"
                      fill="#EA4335"
                    />
                    <path
                      d="M23.49 12.275C23.49 11.49 23.415 10.73 23.3 10H12V14.51H18.47C18.18 15.99 17.34 17.25 16.08 18.1L19.945 21.1C22.2 19.01 23.49 15.92 23.49 12.275Z"
                      fill="#4285F4"
                    />
                    <path
                      d="M5.26498 14.2949C5.02498 13.5699 4.88501 12.7999 4.88501 11.9999C4.88501 11.1999 5.01998 10.4299 5.26498 9.7049L1.275 6.60986C0.46 8.22986 0 10.0599 0 11.9999C0 13.9399 0.46 15.7699 1.28 17.3899L5.26498 14.2949Z"
                      fill="#FBBC05"
                    />
                    <path
                      d="M12.0004 24.0001C15.2404 24.0001 17.9654 22.935 19.9454 21.095L16.0804 18.095C15.0054 18.82 13.6204 19.245 12.0004 19.245C8.8704 19.245 6.21537 17.135 5.2654 14.29L1.27539 17.385C3.25539 21.31 7.3104 24.0001 12.0004 24.0001Z"
                      fill="#34A853"
                    />
                  </svg>
                  <span className="text-sm font-semibold leading-6">
                    Google
                  </span>
                </div>
              </div>

              <p className="mt-5 text-center text-sm text-gray-500">
                Not a member Yet?{" "}
                <Link
                  to="/signup"
                  className="font-semibold leading-6 text-blue-600 hover:text-blue-500"
                >
                  Register
                </Link>
              </p>

              <p className="text-center text-xs text-gray-700">
                Continue without login ?{" "}
                <Link
                  to={`/`}
                  className="font-semibold leading-6 text-blue-600 hover:text-blue-500"
                >
                  Click Here
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>

      {showSectorModal && (
  <SectorSelectionModal
    onSave={(selectedSectors) => updatePreferredSectors(selectedSectors)}
    onClose={() => setShowSectorModal(false)}
  />
)}
    </section>


  );
}

export default Login;
