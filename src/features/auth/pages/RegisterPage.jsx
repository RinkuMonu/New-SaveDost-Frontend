import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { ArrowLeft } from "lucide-react";
import Swal from "sweetalert2";
import MobileVerification from "../components/MobileVerification";
import OtpVerification from "../components/OtpVerification";
import RegistrationForm from "../components/RegistrationForm";
import SideIframeVideo from "../components/SideIframeVideo";
import "../login.css";

/**
 * SaveDost Register Page
 * Preserves the exact 3-step registration layout, stepper, styling, and YouTube floating widget from reference.
 */
export const RegisterPage = () => {
  const [registrationStep, setRegistrationStep] = useState(1);
  const [shake, setShake] = useState(false);
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [, setIsOtpVerified] = useState(false);
  const [, setUserId] = useState(null);
  const [youtube, setYoutube] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    trigger,
  } = useForm({
    defaultValues: {
      name: "",
      email: "",
      mobileNumber: "",
      mpin: "",
      password: "",
      aadhaarNumber: "",
      panNumber: "",
      bankAccount: "",
      ifsc: "",
      terms: false,
    },
  });

  const handleApiError = (error) => {
    let errorMessage = "Something went wrong! Please try again.";
    if (error.response?.data?.message) {
      errorMessage = error.response.data.message;
    } else if (error.message) {
      errorMessage = error.message;
    }

    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: errorMessage,
    });
  };

  const getStepTitle = () => {
    switch (registrationStep) {
      case 1:
        return "Verify Mobile";
      case 2:
        return "Verify OTP";
      case 3:
        return "Personal & Business Details";
      default:
        return "Register";
    }
  };

  const getStepDescription = () => {
    switch (registrationStep) {
      case 1:
        return "Enter your mobile number to get started";
      case 2:
        return "Enter the 6-digit verification code sent to your phone";
      case 3:
        return "Fill in your account details to complete registration";
      default:
        return "";
    }
  };

  return (
    <>
      <div className="min-h-screen bg-white flex flex-col justify-center py-6 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl w-full mx-auto bg-white rounded-3xl border border-gray-100 shadow-xl overflow-hidden p-6 sm:p-10">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">
            {/* Left Panel - Stepper & Information */}
            <div className="lg:col-span-2 space-y-6 lg:border-r lg:border-gray-100 lg:pr-8">
              {/* Tag */}
              <div className="inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-sky-50 text-[#027da8] border border-sky-100">
                New Registration
              </div>

              {/* Title & Info */}
              <div>
                <h1 className="text-3xl sm:text-4xl font-extrabold text-[#0C3D4C] tracking-tight leading-tight">
                  Complete your registration in minutes
                </h1>
                <p className="mt-3 text-sm text-gray-500 leading-relaxed">
                  Verify your details, complete your KYC, and start using the platform.
                </p>
              </div>

              {/* 3-Step Stepper Box */}
              <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
                {[
                  { step: 1, title: "Verify Mobile Number" },
                  { step: 2, title: "Enter OTP" },
                  { step: 3, title: "Fill in Your Details" },
                ].map(({ step, title }) => (
                  <div key={step} className="flex items-center gap-3">
                    <div
                      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 text-xs font-bold transition-all ${
                        step <= registrationStep
                          ? "border-[#027DA7] bg-[#027DA7] text-white shadow-sm"
                          : "border-[#DCE7EA] bg-white text-[#9AAEB4]"
                      }`}
                    >
                      {step}
                    </div>
                    <p
                      className={`text-sm transition-colors ${
                        step === registrationStep
                          ? "font-bold text-[#027DA7]"
                          : step < registrationStep
                          ? "font-semibold text-[#0C3D4C]"
                          : "text-[#9AAEB4]"
                      }`}
                    >
                      {title}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Panel - Form Flow */}
            <div className="lg:col-span-3 space-y-4">
              {/* Header Row */}
              <div className="flex items-center justify-between">
                <h2 className="text-[#8F8E8E] text-xl font-bold ps-1">Register</h2>
                <button
                  type="button"
                  onClick={() => setYoutube(true)}
                  className="text-[#027da8] font-semibold hover:underline animate-pulse flex items-center gap-1.5 text-xs sm:text-sm"
                >
                  <svg
                    className="w-6 h-6 text-red-600 shrink-0"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                  </svg>
                  <span>How to register</span>
                  <span className="inline-block animate-bounce font-bold">?</span>
                </button>
              </div>

              {/* Main Card Container */}
              <div className="border border-gray-100 bg-gray-50/80 rounded-2xl p-5 sm:p-7 shadow-inner">
                {/* Step Sub-Header */}
                <div
                  className={`flex items-center gap-3 mb-4 ${
                    registrationStep === 1 ? "justify-start" : "justify-between"
                  }`}
                >
                  <div>
                    <h3 className="text-xl font-bold text-[#0C3D4C]">
                      {getStepTitle()}
                    </h3>
                    <p className="text-sm text-[#8F8E8E]">{getStepDescription()}</p>
                  </div>

                  {registrationStep > 1 && (
                    <button
                      type="button"
                      onClick={() => setRegistrationStep((prev) => prev - 1)}
                      className="p-2 text-gray-500 hover:text-gray-800 bg-white shadow-sm rounded-full border border-gray-200 transition-colors"
                      title="Back to previous step"
                    >
                      <ArrowLeft className="w-5 h-5" />
                    </button>
                  )}
                </div>

                {/* Step Components */}
                <div>
                  {registrationStep === 1 && (
                    <MobileVerification
                      register={register}
                      errors={errors}
                      shake={shake}
                      loading={loading}
                      setLoading={setLoading}
                      setRegistrationStep={setRegistrationStep}
                      setShake={setShake}
                      trigger={trigger}
                      watch={watch}
                      handleApiError={handleApiError}
                    />
                  )}

                  {registrationStep === 2 && (
                    <OtpVerification
                      otp={otp}
                      setOtp={setOtp}
                      shake={shake}
                      loading={loading}
                      setLoading={setLoading}
                      setRegistrationStep={setRegistrationStep}
                      setIsOtpVerified={setIsOtpVerified}
                      setShake={setShake}
                      watch={watch}
                      handleApiError={handleApiError}
                      setUserId={setUserId}
                    />
                  )}

                  {registrationStep === 3 && (
                    <RegistrationForm
                      register={register}
                      errors={errors}
                      shake={shake}
                      loading={loading}
                      setLoading={setLoading}
                      setShake={setShake}
                      watch={watch}
                      handleSubmit={handleSubmit}
                      handleApiError={handleApiError}
                      setUserId={setUserId}
                    />
                  )}

                  {/* Footer link to login */}
                  <div className="mt-8 pt-4 border-t border-gray-200/60 text-sm text-[#8F8E8E]">
                    Already have an account?{" "}
                    <Link
                      to="/login"
                      className="text-[#027da8] hover:text-[#027da8]/90 font-semibold hover:underline"
                    >
                      Login here
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Side Video */}
      <SideIframeVideo
        src="https://www.youtube.com/embed/LsLV1Emkb-Q?si=EepaHlUk19iWeB4B&autoplay=1&controls=0&loop=1&mute=1"
        heading="रजिस्ट्रेशन का आसान तरीका — वीडियो में देखें"
        youtube={youtube}
      />

      {/* Full-Screen YouTube Video Modal */}
      {youtube && (
        <>
          <div
            className="fixed inset-0 backdrop-blur-md bg-black/60 z-50 transition-opacity"
            onClick={() => setYoutube(false)}
          />
          <div className="fixed inset-0 flex items-center justify-center z-50 p-4 pointer-events-none">
            <div className="bg-black rounded-2xl overflow-hidden shadow-2xl w-full max-w-3xl pointer-events-auto relative">
              <button
                type="button"
                onClick={() => setYoutube(false)}
                className="absolute top-3 right-3 text-white text-2xl z-50 hover:text-red-400 p-1"
              >
                ✕
              </button>
              <div className="relative pb-[56.25%] h-0">
                <iframe
                  className="absolute top-0 left-0 w-full h-full"
                  src="https://www.youtube.com/embed/LsLV1Emkb-Q?si=EepaHlUk19iWeB4B&autoplay=1"
                  title="How to register video"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default RegisterPage;
