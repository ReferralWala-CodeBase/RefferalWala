/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [step, setStep] = useState(1); // Step 1: Request OTP, Step 2: Verify OTP & Reset Password
  const navigate = useNavigate();
  const Fronted_API_URL = process.env.REACT_APP_API_URL; // Frontend API
  const [resendTimer, setResendTimer] = useState(0);

  const handleEmailChange = (e) => setEmail(e.target.value);
  const handleOtpChange = (e) => setOtp(e.target.value);
  const handleNewPasswordChange = (e) => setNewPassword(e.target.value);

  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendTimer]);

  const handleResendOtp = async () => {
    setResendTimer(60);

    try {
      const bearerToken = localStorage.getItem('token');
      const response = await fetch(
        `${Fronted_API_URL}/user/resend-otp`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${bearerToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        toast.success("Resend OTP sent successfully!!!.");
      } else {
        toast.error(data.message || "OTP send failed. Please try again.");
      }
    } catch (error) {
      toast.error("An error occurred. Please try again.");
    }

  };

  // Step 1: Request OTP
  const handleRequestOtp = async (e) => {
    e.preventDefault();
    setResendTimer(30);
    try {
      const response = await fetch(
        `${Fronted_API_URL}/user/forgot-password`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email }),
        }
      );
      const data = await response.json();

      if (response.ok) {
        toast.success("OTP sent to your email!");
        setStep(2); // Move to OTP verification & password reset step
      } else {
        toast.error(data.message || "Failed to send OTP. Please try again.");
      }
    } catch (error) {
      toast.error("An error occurred. Please try again.");
    }
  };

  // Step 2: Verify OTP & Reset Password
  const handleResetPassword = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(
        `${Fronted_API_URL}/user/reset-password`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            otp,
            newPassword,
          }),
        }
      );
      const data = await response.json();

      if (response.ok) {
        toast.success("Password reset successfully! You can now log in.");
        navigate("/user-login");
      } else {
        toast.error(data.message || "Failed to reset password. Try again.");
      }
    } catch (error) {
      toast.error("An error occurred. Please try again.");
    }
  };

  return (
    <section className="min-h-screen bg-slate-200/90">
      <div className="flex min-h-full flex-1 flex-col justify-center py-12 sm:px-6 lg:px-8">
        {/* <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <img
            className="mx-auto h-10 w-auto"
            src="https://tailwindui.com/img/logos/mark.svg?color=blue&shade=600"
            alt="Referral Wala"
          />
        </div> */}

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-[480px]">
          <div className="bg-white px-6 py-12 shadow sm:rounded-lg sm:px-12">
            <h2 className="mb-3 text-start text-2xl font-bold leading-9 tracking-tight text-gray-900">
              {step === 1 ? "Forgot Password" : "Reset Password"}
            </h2>

            {step === 1 && (
              <form className="space-y-6" onSubmit={handleRequestOtp}>
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
                      value={email}
                      onChange={handleEmailChange}
                      required
                      placeholder="Enter your email address"
                      className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>

                <div>
                  <button
                    type="submit"
                    className="flex w-full justify-center rounded-md bg-blue-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
                  >
                    Send OTP
                  </button>
                </div>
              </form>
            )}

            {step === 2 && (
              <form className="space-y-6" onSubmit={handleResetPassword}>
                <div>
                  <label className="block text-sm font-medium text-gray-900">
                    OTP
                  </label>
                  <input
                    type="text"
                    value={otp}
                    onChange={handleOtpChange}
                    required
                    placeholder="Enter OTP sent to your email"
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-900">
                    New Password
                  </label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={handleNewPasswordChange}
                    required
                    placeholder="Enter your new password"
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-500"
                >
                  Reset Password
                </button>
                {resendTimer > 0 ? (
                  <p className="text-sm text-gray-600 mt-4"><span className="text-blue-600 cursor-pointer underline">Resend OTP</span> in {resendTimer}s</p>
                ) : (
                  <button
                    onClick={handleResendOtp}
                    className="mt-4 w-full bg-gray-500 text-white py-2 rounded-md hover:bg-gray-400"
                  >
                    Resend OTP
                  </button>
                )}
              </form>
            )}
          </div>
        </div>
      </div>

      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
    </section>
  );
}

export default ForgotPassword;
