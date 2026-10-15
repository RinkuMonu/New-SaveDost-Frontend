import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Phone, Shield, Lock, Key, CheckCircle, Eye, EyeOff } from "lucide-react";
import Swal from "sweetalert2";
import { useAuth } from "../../../app/providers/AuthContext";
import apiClient from "../../../services/apiClient";
import { getRoleDashboardPath } from "../../../utils/constants";
import SideIframeVideo from "../components/SideIframeVideo";
import TermsModal from "../components/TermsModal";
import PrivacyPolicyModal from "../components/PrivacyPolicyModal";
import "../login.css";

/**
 * SaveDost Login Page
 * Preserves the exact UI, styling, colors, Finunique logo, and floating cards from the reference project.
 */
export const LoginPage = () => {
  const [formData, setFormData] = useState({
    mobileNumber: "",
    password: "",
  });
  const [otp, setOtp] = useState("");
  const [showOtpField, setShowOtpField] = useState(false);
  const [showOtp, setShowOtp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isTermsAccepted, setIsTermsAccepted] = useState(false);
  const [loadingPass, setLoadingPass] = useState(false);
  const [loadingOtp, setLoadingOtp] = useState(false);
  const [showTerms, setShowTerms] = useState(false);
  const [showPrivacy, setShowPrivacy] = useState(false);
  const [youtube, setYoutube] = useState(false);

  // Ensure form fields start completely empty on mount and reload
  useEffect(() => {
    setFormData({
      mobileNumber: "",
      password: "",
    });
    setOtp("");
    setShowOtpField(false);
    setShowPassword(false);
  }, []);

  const handleMobileChange = (e) => {
    let val = e.target.value.replace(/\D/g, "");
    if (val.length > 10) val = val.slice(0, 10);
    if (val.length === 1 && !/[6-9]/.test(val)) val = "";
    setFormData((prev) => ({ ...prev, mobileNumber: val }));
  };

  const handlePasswordChange = (e) => {
    const val = e.target.value;
    setFormData((prev) => ({ ...prev, password: val }));
  };

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Send OTP
  const sendOtp = async (e) => {
    e.preventDefault();

    if (!isTermsAccepted) {
      Swal.fire({
        icon: "warning",
        title: "Terms Required",
        text: "Please agree to the Terms and Privacy Policy to continue!",
      });
      return;
    }
    if (formData.mobileNumber.length !== 10) {
      Swal.fire({
        icon: "warning",
        title: "Invalid Mobile",
        text: "Please enter a 10-digit mobile number to send OTP!",
      });
      return;
    }

    setLoadingOtp(true);
    try {
      const response = await apiClient.post("/auth/send-otp", {
        mobileNumber: formData.mobileNumber,
        ifLogin: true,
        type: "login",
      });

      Swal.fire({
        title: response.data?.message || "OTP sent successfully!",
        icon: "success",
      });
      setShowOtpField(true);
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to send OTP. Please try again.";

      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: errorMessage,
      });
    } finally {
      setLoadingOtp(false);
    }
  };

  // Handle Login (Supports Password or OTP)
  const handleLogin = async (e) => {
    e.preventDefault();

    if (!isTermsAccepted) {
      Swal.fire({
        icon: "warning",
        title: "Terms Required",
        text: "Please agree to the Terms and Privacy Policy to login!",
      });
      return;
    }
    if (formData.mobileNumber.length !== 10) {
      Swal.fire({
        icon: "warning",
        title: "Invalid Mobile",
        text: "Please enter a 10-digit mobile number to login!",
      });
      return;
    }
    if (showOtpField && otp?.length !== 6) {
      Swal.fire({
        icon: "warning",
        title: "Invalid OTP",
        text: "Please enter the 6-digit OTP sent to your mobile number!",
      });
      return;
    }

    setLoadingPass(true);
    try {
      const payload = {
        mobile: formData.mobileNumber,
        mobileNumber: formData.mobileNumber,
      };

      if (showOtpField && otp) {
        payload.otp = otp;
      } else if (formData.password) {
        payload.password = formData.password;
      } else {
        Swal.fire({
          icon: "warning",
          title: "Missing Credentials",
          text: "Please enter password or request OTP to log in!",
        });
        setLoadingPass(false);
        return;
      }

      // Execute login via centralized AuthContext
      const userResult = await login(payload);

      Swal.fire({
        title: "Login Successful!",
        text: `Welcome back, ${userResult?.name || "User"}!`,
        icon: "success",
      }).then(() => {
        const dest = getRoleDashboardPath(userResult?.role);
        navigate(dest, { replace: true });
      });
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Invalid login credentials. Please check your details.";

      Swal.fire({
        icon: "error",
        title: "Login Failed",
        text: errorMessage,
      });
    } finally {
      setLoadingPass(false);
    }
  };

  return (
    <>
      <div className="min-h-screen flex bg-white overflow-x-hidden overflow-y-auto">
        {/* Left Panel - Form */}
        <div className="flex-1 p-6 sm:p-8 flex flex-col justify-center max-w-xl mx-auto w-full">
          {/* Top Brand Header */}
          <div className="mb-6">
            <div className="flex items-center justify-between my-4">
              <div>
                <img
                  src="/7unique.png"
                  alt="Finunique Logo"
                  width={110}
                  className="object-contain"
                />
              </div>

              <div className="text-right">
                <div className="text-sm text-gray-600">
                  {"Don't have an account? "}
                  <button
                    type="button"
                    className="p-0 text-[#027da8] hover:underline font-semibold"
                    onClick={() => navigate("/register")}
                  >
                    Register
                  </button>
                </div>
                <div className="mt-1">
                  <button
                    type="button"
                    onClick={() => setYoutube(true)}
                    className="text-[#027da8] font-semibold hover:underline animate-pulse inline-flex items-center gap-1.5 text-xs sm:text-sm"
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
              </div>
            </div>

            {/* Page Heading */}
            <h1 className="text-4xl sm:text-5xl text-center font-bold text-[#027da8] mb-1">
              Welcome Back!
            </h1>
            <p className="text-gray-600 text-sm sm:text-base text-center">
              Please Enter Your Login Details
            </p>
          </div>

          {/* Form */}
          <div className="space-y-5">
            <form onSubmit={handleLogin} autoComplete="off">
              <div className="space-y-4">
                {/* Mobile Number Field */}
                <div className="space-y-1">
                  <label
                    htmlFor="mobileNumber"
                    className="text-sm sm:text-base font-medium text-gray-800"
                  >
                    Mobile Number
                  </label>
                  <div className="relative">
                    <div className="flex items-center border-2 border-[#027da8]/30 rounded-xl px-3 py-3 focus-within:border-[#027da8] bg-white transition-colors">
                      <Phone className="w-5 h-5 text-[#027da8] mr-3 shrink-0" />
                      <span className="text-gray-600 font-medium mr-2 select-none">
                        +91
                      </span>
                      <input
                        type="tel"
                        id="mobileNumber"
                        name="mobileNumber"
                        value={formData.mobileNumber}
                        onChange={handleMobileChange}
                        placeholder="Enter Mobile Number"
                        className="w-full border-0 p-0 focus:outline-none text-sm sm:text-base text-gray-800 bg-transparent"
                        required
                        inputMode="numeric"
                        maxLength={10}
                        autoComplete="off"
                        disabled={showOtpField}
                      />
                    </div>
                  </div>
                </div>

                {/* Password Field (When not showing OTP) */}
                {!showOtpField && (
                  <div className="space-y-1">
                    <label
                      htmlFor="password"
                      className="text-sm sm:text-base font-medium text-gray-800"
                    >
                      Password
                    </label>
                    <div className="relative">
                      <div className="flex items-center border-2 border-[#027da8]/30 rounded-xl px-3 py-3 focus-within:border-[#027da8] bg-white transition-colors">
                        <Lock className="w-5 h-5 text-[#027da8] mr-3 shrink-0" />
                        <input
                          type={showPassword ? "text" : "password"}
                          id="password"
                          name="password"
                          value={formData.password}
                          onChange={handlePasswordChange}
                          autoComplete="current-password"
                          placeholder="Enter Password"
                          className="w-full border-0 p-0 focus:outline-none text-sm sm:text-base text-gray-800 bg-transparent"
                          disabled={showOtpField}
                          required={!showOtpField}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="ml-2 text-[#027da8] focus:outline-none p-1"
                        >
                          {showPassword ? (
                            <EyeOff className="w-5 h-5" />
                          ) : (
                            <Eye className="w-5 h-5" />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* OTP Verification Boxes (When showOtpField is true) */}
                {showOtpField && (
                  <div className="space-y-3 pt-2">
                    <label
                      htmlFor="otp"
                      className="text-slate-700 text-sm sm:text-base font-medium block"
                    >
                      Enter 6-Digit OTP
                    </label>
                    <div className="flex items-center border-2 border-gray-200 rounded-xl px-2.5 sm:px-3 py-2 bg-slate-50 focus-within:border-[#027da8]">
                      <Lock className="w-5 h-5 text-gray-400 mr-2 sm:mr-3 shrink-0" />
                      <div className="flex space-x-1.5 sm:space-x-2 flex-1 justify-center">
                        {[...Array(6)].map((_, i) => (
                          <input
                            key={i}
                            type={showOtp ? "text" : "password"}
                            inputMode="numeric"
                            maxLength={1}
                            value={otp[i] || ""}
                            onChange={(e) => {
                              const val = e.target.value.replace(/\D/g, "");
                              const newOtp = otp.split("");
                              if (val) {
                                newOtp[i] = val;
                                setOtp(newOtp.join(""));
                                if (i < 5 && e.target.nextSibling) {
                                  e.target.nextSibling.focus();
                                }
                              } else {
                                newOtp[i] = "";
                                setOtp(newOtp.join(""));
                              }
                            }}
                            onKeyDown={(e) => {
                              if (e.key === "Backspace") {
                                const newOtp = otp.split("");
                                if (otp[i]) {
                                  newOtp[i] = "";
                                  setOtp(newOtp.join(""));
                                  e.preventDefault();
                                } else if (i > 0) {
                                  const prev = e.target.previousSibling;
                                  newOtp[i - 1] = "";
                                  setOtp(newOtp.join(""));
                                  if (prev) prev.focus();
                                  e.preventDefault();
                                }
                              }
                            }}
                            className="w-8 h-9 sm:w-12 sm:h-12 text-center text-base sm:text-lg font-bold border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#027da8] bg-white border-gray-300"
                          />
                        ))}
                      </div>
                      <button
                        type="button"
                        onClick={() => setShowOtp(!showOtp)}
                        className="ml-2 text-gray-500 hover:text-gray-700 p-1"
                      >
                        {showOtp ? (
                          <EyeOff className="w-5 h-5" />
                        ) : (
                          <Eye className="w-5 h-5" />
                        )}
                      </button>
                    </div>

                    <div className="flex flex-col gap-2 pt-2">
                      <button
                        type="button"
                        onClick={handleLogin}
                        disabled={loadingPass || !isTermsAccepted || otp.length < 6}
                        className={`w-full py-3 rounded-xl font-medium transition-colors ${
                          !isTermsAccepted || otp.length < 6
                            ? "bg-gray-400 cursor-not-allowed text-white"
                            : "bg-[#018EDE] hover:bg-[#018EDE]/90 text-white"
                        }`}
                      >
                        {loadingPass ? "Verifying..." : "Login"}
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setShowOtpField(false);
                          setOtp("");
                        }}
                        className="w-full py-3 rounded-xl font-medium text-white bg-[#686a6d] hover:bg-[#686a6d]/90 transition-colors"
                      >
                        Login with Password
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Terms & Privacy Policy Checkbox */}
              <div className="flex items-start gap-2 mt-4 text-sm text-slate-600">
                <input
                  type="checkbox"
                  id="terms"
                  checked={isTermsAccepted}
                  onChange={(e) => setIsTermsAccepted(e.target.checked)}
                  className="mt-1 h-4 w-4 cursor-pointer rounded border-gray-300 text-[#027da8] focus:ring-[#027da8]"
                />
                <label htmlFor="terms" className="cursor-pointer leading-snug text-xs sm:text-sm">
                  I agree to the{" "}
                  <button
                    type="button"
                    onClick={() => setShowTerms(true)}
                    className="text-[#027da8] font-medium hover:underline focus:outline-none"
                  >
                    Terms
                  </button>{" "}
                  and{" "}
                  <button
                    type="button"
                    onClick={() => setShowPrivacy(true)}
                    className="text-[#027da8] font-medium hover:underline focus:outline-none"
                  >
                    Privacy Policy
                  </button>
                </label>
              </div>

              {/* Action Buttons (When not showing OTP boxes) */}
              {!showOtpField && (
                <div className="flex flex-col gap-3 mt-4">
                  <button
                    type="button"
                    onClick={handleLogin}
                    disabled={loadingPass || !isTermsAccepted}
                    className={`w-full py-3 rounded-xl font-semibold transition-all ${
                      !isTermsAccepted
                        ? "bg-gray-400 cursor-not-allowed text-white"
                        : "bg-[#018EDE] hover:bg-[#018EDE]/90 text-white shadow-md shadow-[#018EDE]/20"
                    }`}
                  >
                    {loadingPass ? "Logging in..." : "Login with Password"}
                  </button>

                  <button
                    type="button"
                    onClick={sendOtp}
                    disabled={loadingOtp || !isTermsAccepted}
                    className={`w-full py-3 rounded-xl font-semibold transition-all ${
                      !isTermsAccepted
                        ? "bg-gray-400 cursor-not-allowed text-white"
                        : "bg-[#686a6d] hover:bg-[#686a6d]/90 text-white shadow-md shadow-gray-500/20"
                    }`}
                  >
                    {loadingOtp ? "Sending OTP..." : "Login with OTP"}
                  </button>
                </div>
              )}
            </form>
          </div>

          {/* Security Features Footnote */}
          <div className="mt-8 flex items-center justify-center space-x-6 text-xs text-slate-500">
            <div className="flex items-center space-x-1.5">
              <Shield className="w-4 h-4 text-[#027da8]" />
              <span>Secure Login</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <Lock className="w-4 h-4 text-[#027da8]" />
              <span>OTP Protected</span>
            </div>
          </div>
        </div>

        {/* Right Panel - Decorative Gradient with Floating Cards */}
        <div className="relative md:w-[50vw] bg-gradient-to-br from-[#d2709a] via-[#027da8] to-[#6b2945] overflow-hidden hidden md:flex items-center justify-center select-none">
          {/* Central Image */}
          <div className="relative z-20">
            <img
              src="/login.png"
              alt="Dashboard Preview"
              className="w-[42vw] max-w-[560px] mx-auto drop-shadow-2xl"
            />
          </div>

          {/* Floating Card 1: Fast Registration (Top-Left) */}
          <div className="absolute top-8 left-12 w-64 p-5 bg-white/20 backdrop-blur-lg border border-white/30 rounded-2xl shadow-2xl z-10 animate-float-1">
            <div className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3 bg-gradient-to-tr from-blue-400 to-purple-500 shadow-lg">
              <CheckCircle className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-base font-bold text-white mb-1 text-center">
              Fast Registration
            </h3>
            <p className="text-xs text-white/80 text-center mb-3">
              Set up your account securely in under 3 minutes
            </p>
            <div className="mx-auto w-fit px-3 py-0.5 bg-white/20 text-white text-xs font-semibold rounded-full backdrop-blur-sm">
              3 min
            </div>
          </div>

          {/* Floating Card 2: Trusted Platform (Top-Right) */}
          <div className="absolute top-16 right-16 w-64 p-5 bg-white/90 backdrop-blur-sm rounded-2xl shadow-2xl z-30 animate-float-2">
            <div className="text-center">
              <div className="flex items-center justify-center space-x-1.5 mb-2">
                <div className="w-7 h-7 bg-amber-100 rounded-full flex items-center justify-center">
                  <span className="text-amber-600 font-bold text-sm">★</span>
                </div>
                <div className="w-7 h-7 bg-amber-100 rounded-full flex items-center justify-center">
                  <span className="text-amber-600 font-bold text-sm">★</span>
                </div>
                <div className="w-7 h-7 bg-amber-100 rounded-full flex items-center justify-center">
                  <span className="text-amber-600 font-bold text-sm">★</span>
                </div>
              </div>
              <h3 className="font-bold text-gray-900 mb-0.5 text-base">
                Trusted Platform
              </h3>
              <p className="text-xs text-gray-600">
                Join 50,000+ satisfied users
              </p>
            </div>
          </div>

          {/* Floating Card 3: OTP Security (Bottom-Left) */}
          <div className="absolute bottom-12 left-16 w-64 p-5 bg-white/90 backdrop-blur-sm rounded-2xl shadow-2xl z-30 animate-float-3">
            <div className="flex items-start mb-2.5">
              <Key className="w-5 h-5 text-orange-500 mr-2.5 mt-0.5 shrink-0" />
              <div>
                <h3 className="font-bold text-gray-900 text-sm">
                  OTP Security
                </h3>
                <p className="text-xs text-gray-600">Secure OTP verification</p>
              </div>
            </div>
            <div className="space-y-1.5">
              <div className="h-2 bg-emerald-500 rounded-full w-full" />
              <div className="h-2 bg-[#027da8] rounded-full w-2/3" />
              <div className="h-2 bg-amber-500 rounded-full w-1/3" />
            </div>
          </div>

          {/* Floating Card 4: Bank-Level Security (Bottom-Right) */}
          <div className="absolute bottom-8 right-12 w-64 p-5 bg-white/20 backdrop-blur-lg border border-white/30 rounded-2xl shadow-2xl z-10 animate-float-4">
            <div className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-2.5 bg-gradient-to-tr from-green-400 to-emerald-500 shadow-lg">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-base font-bold text-white mb-1 text-center">
              Bank-Level Security
            </h3>
            <p className="text-xs text-white/80 text-center mb-3">
              Your data and transactions are protected with top-tier security standards
            </p>
            <div className="mx-auto w-fit px-3 py-0.5 bg-white/20 text-white text-xs font-semibold rounded-full backdrop-blur-sm">
              Secure
            </div>
          </div>
        </div>
      </div>

      {/* Floating YouTube Side Widget */}
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

      {/* Modals for Terms and Privacy Policy */}
      {showTerms && <TermsModal setShowTerms={setShowTerms} />}
      {showPrivacy && <PrivacyPolicyModal setShowPrivacy={setShowPrivacy} />}
    </>
  );
};

export default LoginPage;
