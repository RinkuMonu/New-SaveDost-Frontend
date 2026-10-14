import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Phone, Lock, KeyRound, Eye, EyeOff, ShieldCheck, AlertCircle, CheckCircle2 } from "lucide-react";
import { useAuth } from "../../../app/providers/AuthContext";
import authService from "../services/authService";
import { Button, Input, Card } from "../../../components/common";
import { getRoleDashboardPath } from "../../../utils/constants";
import { getErrorMessage } from "../../../utils/apiError";

export const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isAuthenticated, role } = useAuth();

  // If already authenticated, redirect to role dashboard
  useEffect(() => {
    if (isAuthenticated && role) {
      const from = location.state?.from?.pathname || getRoleDashboardPath(role);
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, role, navigate, location]);

  // Form State
  const [loginMode, setLoginMode] = useState("password"); // "password" | "otp"
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isTermsAccepted, setIsTermsAccepted] = useState(true);

  // OTP flow state
  const [otpSent, setOtpSent] = useState(false);
  const [sendingOtp, setSendingOtp] = useState(false);
  const [otpTimer, setOtpTimer] = useState(0);

  // Status and feedback
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // Countdown timer for OTP resend
  useEffect(() => {
    let interval = null;
    if (otpTimer > 0) {
      interval = setInterval(() => {
        setOtpTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [otpTimer]);

  // Handle Send OTP
  const handleSendOtp = async () => {
    setErrorMessage("");
    setSuccessMessage("");

    if (!mobile || mobile.trim().length !== 10 || !/^\d{10}$/.test(mobile.trim())) {
      setErrorMessage("Please enter a valid 10-digit mobile number before requesting an OTP.");
      return;
    }

    try {
      setSendingOtp(true);
      const res = await authService.sendOtp(mobile.trim());
      setOtpSent(true);
      setOtpTimer(60);
      setSuccessMessage(res.message || "OTP sent successfully to your mobile number.");
    } catch (err) {
      setErrorMessage(getErrorMessage(err, "Failed to send OTP. Please verify mobile number."));
    } finally {
      setSendingOtp(false);
    }
  };

  // Safe non-blocking telemetry collection
  const getCoordinatesSafely = async () => {
    if (typeof window === "undefined" || !navigator?.geolocation) return { lat: null, long: null };
    return new Promise((resolve) => {
      // Timeout after 2.5 seconds so login is never blocked
      const timer = setTimeout(() => resolve({ lat: null, long: null }), 2500);
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          clearTimeout(timer);
          resolve({
            lat: pos.coords.latitude ? String(pos.coords.latitude) : null,
            long: pos.coords.longitude ? String(pos.coords.longitude) : null,
          });
        },
        () => {
          clearTimeout(timer);
          resolve({ lat: null, long: null });
        },
        { timeout: 2500 }
      );
    });
  };

  // Form Submit Handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    const cleanedMobile = mobile.trim();
    if (!cleanedMobile || cleanedMobile.length !== 10 || !/^\d{10}$/.test(cleanedMobile)) {
      setErrorMessage("Please enter a valid 10-digit mobile number.");
      return;
    }

    if (!isTermsAccepted) {
      setErrorMessage("Please accept the Terms of Service & Privacy Policy to continue.");
      return;
    }

    if (loginMode === "password") {
      if (!password) {
        setErrorMessage("Please enter your account password.");
        return;
      }
    } else {
      if (!otp || otp.trim().length < 4) {
        setErrorMessage("Please enter the OTP sent to your registered mobile number.");
        return;
      }
    }

    try {
      setIsSubmitting(true);
      const coords = await getCoordinatesSafely();

      const credentials = {
        mobile: cleanedMobile,
        lat: coords.lat,
        long: coords.long,
      };

      if (loginMode === "password") {
        credentials.password = password;
      } else {
        credentials.otp = otp.trim();
      }

      const result = await login(credentials);

      // Redirect to target or role-based dashboard
      const targetDashboard =
        location.state?.from?.pathname || getRoleDashboardPath(result.role);
      navigate(targetDashboard, { replace: true });
    } catch (err) {
      setErrorMessage(getErrorMessage(err, "Login failed. Please check credentials."));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        {/* Brand Header */}
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-brand-blue text-white shadow-lg shadow-brand-blue/30 mb-3">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            SaveDost
          </h2>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Sign in to access your secure portal
          </p>
        </div>

        {/* Login Card */}
        <Card className="mt-8 border-slate-200 dark:border-slate-800 shadow-xl" padding="lg">
          {/* Mode Switcher Tabs */}
          <div className="grid grid-cols-2 gap-1 p-1 mb-6 bg-slate-100 dark:bg-slate-800 rounded-xl">
            <button
              type="button"
              id="password-login-tab"
              onClick={() => {
                setLoginMode("password");
                setErrorMessage("");
                setSuccessMessage("");
              }}
              className={`py-2 text-xs font-semibold rounded-lg transition-all ${
                loginMode === "password"
                  ? "bg-white dark:bg-slate-700 text-brand-blue shadow-sm font-bold"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900"
              }`}
            >
              Password Login
            </button>
            <button
              type="button"
              id="otp-login-tab"
              onClick={() => {
                setLoginMode("otp");
                setErrorMessage("");
                setSuccessMessage("");
              }}
              className={`py-2 text-xs font-semibold rounded-lg transition-all ${
                loginMode === "otp"
                  ? "bg-white dark:bg-slate-700 text-brand-blue shadow-sm font-bold"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900"
              }`}
            >
              OTP Login
            </button>
          </div>

          {/* Feedback Messages */}
          {errorMessage && (
            <div className="mb-4 p-3 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/50 rounded-xl flex items-start space-x-2 text-red-700 dark:text-red-300 text-xs">
              <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          {successMessage && (
            <div className="mb-4 p-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/50 rounded-xl flex items-start space-x-2 text-emerald-700 dark:text-emerald-300 text-xs">
              <CheckCircle2 className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <span>{successMessage}</span>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Mobile Number Field */}
            <div>
              <Input
                label="Mobile Number"
                id="login-mobile-input"
                name="mobile"
                type="tel"
                maxLength={10}
                placeholder="Enter 10-digit mobile number"
                value={mobile}
                onChange={(e) => setMobile(e.target.value.replace(/\D/g, ""))}
                leftIcon={<Phone className="w-4 h-4 text-slate-400" />}
                required
                autoComplete="tel"
              />
            </div>

            {/* Password Login Mode */}
            {loginMode === "password" ? (
              <div>
                <Input
                  label="Password"
                  id="login-password-input"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your account password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  leftIcon={<Lock className="w-4 h-4 text-slate-400" />}
                  rightIcon={
                    <button
                      type="button"
                      aria-label={showPassword ? "Hide password" : "Show password"}
                      onClick={() => setShowPassword(!showPassword)}
                      className="text-slate-400 hover:text-slate-600 focus:outline-none"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  }
                  required
                  autoComplete="current-password"
                />
              </div>
            ) : (
              /* OTP Login Mode */
              <div className="space-y-3">
                <div className="flex items-end space-x-2">
                  <div className="flex-1">
                    <Input
                      label="6-Digit OTP"
                      id="login-otp-input"
                      name="otp"
                      type="text"
                      maxLength={6}
                      placeholder="Enter received OTP"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                      leftIcon={<KeyRound className="w-4 h-4 text-slate-400" />}
                      autoComplete="one-time-code"
                      disabled={!otpSent}
                    />
                  </div>
                  <Button
                    type="button"
                    variant={otpSent ? "secondary" : "primary"}
                    size="md"
                    onClick={handleSendOtp}
                    isLoading={sendingOtp}
                    disabled={sendingOtp || otpTimer > 0 || mobile.length !== 10}
                    className="mb-[2px] whitespace-nowrap"
                  >
                    {otpTimer > 0
                      ? `Resend (${otpTimer}s)`
                      : otpSent
                      ? "Resend OTP"
                      : "Send OTP"}
                  </Button>
                </div>
                {!otpSent && (
                  <p className="text-xs text-slate-500">
                    Click <strong>Send OTP</strong> to receive a code on your registered mobile.
                  </p>
                )}
              </div>
            )}

            {/* Terms and Conditions Checkbox */}
            <div className="flex items-center space-x-2 pt-1">
              <input
                id="login-terms-checkbox"
                type="checkbox"
                checked={isTermsAccepted}
                onChange={(e) => setIsTermsAccepted(e.target.checked)}
                className="w-4 h-4 text-brand-blue rounded border-slate-300 focus:ring-brand-blue/30"
              />
              <label htmlFor="login-terms-checkbox" className="text-xs text-slate-600 dark:text-slate-400">
                I agree to the{" "}
                <span className="text-brand-blue font-medium hover:underline cursor-pointer">
                  Terms of Service
                </span>{" "}
                and{" "}
                <span className="text-brand-blue font-medium hover:underline cursor-pointer">
                  Privacy Policy
                </span>
              </label>
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <Button
                id="login-submit-button"
                type="submit"
                variant="primary"
                size="lg"
                fullWidth
                isLoading={isSubmitting}
                disabled={isSubmitting || !isTermsAccepted}
              >
                {loginMode === "password" ? "Sign In with Password" : "Sign In with OTP"}
              </Button>
            </div>
          </form>

          {/* Footer Navigation */}
          <div className="mt-6 pt-5 border-t border-slate-100 dark:border-slate-800 text-center text-xs text-slate-500 dark:text-slate-400">
            Don't have an account?{" "}
            <Link
              to="/register"
              id="go-to-register-link"
              className="font-semibold text-brand-blue hover:text-brand-blue/80 transition-colors"
            >
              Create Account
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default LoginPage;
