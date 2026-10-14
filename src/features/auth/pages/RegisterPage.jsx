import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { User, Phone, Mail, Lock, Eye, EyeOff, ShieldCheck, AlertCircle, CheckCircle2, Gift } from "lucide-react";
import { useAuth } from "../../../app/providers/AuthContext";
import { Button, Input, Card } from "../../../components/common";
import { getErrorMessage } from "../../../utils/apiError";

export const RegisterPage = () => {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [formData, setFormData] = useState({
    name: "",
    mobile: "",
    email: "",
    password: "",
    confirmPassword: "",
    referralCode: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isTermsAccepted, setIsTermsAccepted] = useState(true);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "mobile" ? value.replace(/\D/g, "") : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    // Form Validations
    if (!formData.name.trim()) {
      setErrorMessage("Please enter your full name.");
      return;
    }

    if (formData.mobile.trim().length !== 10 || !/^\d{10}$/.test(formData.mobile.trim())) {
      setErrorMessage("Please enter a valid 10-digit mobile number.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim() || !emailRegex.test(formData.email.trim())) {
      setErrorMessage("Please enter a valid email address.");
      return;
    }

    if (!formData.password || formData.password.length < 6) {
      setErrorMessage("Password must be at least 6 characters long.");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setErrorMessage("Passwords do not match. Please verify.");
      return;
    }

    if (!isTermsAccepted) {
      setErrorMessage("Please accept the Terms of Service & Privacy Policy to register.");
      return;
    }

    try {
      setIsSubmitting(true);
      const res = await register({
        name: formData.name.trim(),
        mobile: formData.mobile.trim(),
        email: formData.email.trim(),
        password: formData.password,
        referralCode: formData.referralCode.trim() || undefined,
      });

      setSuccessMessage(res.message || "Registration successful! Redirecting to sign in...");
      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } catch (err) {
      setErrorMessage(getErrorMessage(err, "Registration failed. Please check information."));
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
            Create an Account
          </h2>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Join SaveDost today to access seamless utility services
          </p>
        </div>

        {/* Register Card */}
        <Card className="mt-8 border-slate-200 dark:border-slate-800 shadow-xl" padding="lg">
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

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Full Name */}
            <div>
              <Input
                label="Full Name"
                id="register-name-input"
                name="name"
                type="text"
                placeholder="Enter your full name"
                value={formData.name}
                onChange={handleChange}
                leftIcon={<User className="w-4 h-4 text-slate-400" />}
                required
                autoComplete="name"
              />
            </div>

            {/* Mobile Number */}
            <div>
              <Input
                label="Mobile Number"
                id="register-mobile-input"
                name="mobile"
                type="tel"
                maxLength={10}
                placeholder="Enter 10-digit mobile number"
                value={formData.mobile}
                onChange={handleChange}
                leftIcon={<Phone className="w-4 h-4 text-slate-400" />}
                required
                autoComplete="tel"
              />
            </div>

            {/* Email Address */}
            <div>
              <Input
                label="Email Address"
                id="register-email-input"
                name="email"
                type="email"
                placeholder="name@example.com"
                value={formData.email}
                onChange={handleChange}
                leftIcon={<Mail className="w-4 h-4 text-slate-400" />}
                required
                autoComplete="email"
              />
            </div>

            {/* Password */}
            <div>
              <Input
                label="Password"
                id="register-password-input"
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="Minimum 6 characters"
                value={formData.password}
                onChange={handleChange}
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
                autoComplete="new-password"
              />
            </div>

            {/* Confirm Password */}
            <div>
              <Input
                label="Confirm Password"
                id="register-confirm-password-input"
                name="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Re-type your password"
                value={formData.confirmPassword}
                onChange={handleChange}
                leftIcon={<Lock className="w-4 h-4 text-slate-400" />}
                rightIcon={
                  <button
                    type="button"
                    aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="text-slate-400 hover:text-slate-600 focus:outline-none"
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                }
                required
                autoComplete="new-password"
              />
            </div>

            {/* Referral Code */}
            <div>
              <Input
                label="Referral Code (Optional)"
                id="register-referral-input"
                name="referralCode"
                type="text"
                placeholder="Optional referrer code"
                value={formData.referralCode}
                onChange={handleChange}
                leftIcon={<Gift className="w-4 h-4 text-slate-400" />}
              />
            </div>

            {/* Terms and Conditions */}
            <div className="flex items-center space-x-2 pt-1">
              <input
                id="register-terms-checkbox"
                type="checkbox"
                checked={isTermsAccepted}
                onChange={(e) => setIsTermsAccepted(e.target.checked)}
                className="w-4 h-4 text-brand-blue rounded border-slate-300 focus:ring-brand-blue/30"
              />
              <label htmlFor="register-terms-checkbox" className="text-xs text-slate-600 dark:text-slate-400">
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
                id="register-submit-button"
                type="submit"
                variant="primary"
                size="lg"
                fullWidth
                isLoading={isSubmitting}
                disabled={isSubmitting || !isTermsAccepted}
              >
                Create Account
              </Button>
            </div>
          </form>

          {/* Footer Navigation */}
          <div className="mt-6 pt-5 border-t border-slate-100 dark:border-slate-800 text-center text-xs text-slate-500 dark:text-slate-400">
            Already have an account?{" "}
            <Link
              to="/login"
              id="go-to-login-link"
              className="font-semibold text-brand-blue hover:text-brand-blue/80 transition-colors"
            >
              Sign In
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default RegisterPage;
