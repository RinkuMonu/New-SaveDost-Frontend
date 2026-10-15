import React from "react";
import Swal from "sweetalert2";
import apiClient from "../../../services/apiClient";

export const OtpVerification = ({
  otp,
  setOtp,
  shake,
  loading,
  setLoading,
  setRegistrationStep,
  setIsOtpVerified,
  setShake,
  watch,
  handleApiError,
  setUserId,
}) => {
  const verifyOtp = async (e) => {
    e.preventDefault();
    if (!otp || !/^\d{4,8}$/.test(otp)) {
      Swal.fire({
        icon: "info",
        title: "Oops...",
        text: "Please enter a valid OTP",
      });
      setShake(true);
      setTimeout(() => setShake(false), 500);
      return;
    }

    setLoading(true);
    try {
      const response = await apiClient.post("/auth/verify-otp", {
        mobileNumber: watch("mobileNumber"),
        otp,
        outerRegister: true,
      });

      if (response.status === 200 || response.status === 201) {
        if (response?.data?.isExistingUser) {
          await Swal.fire({
            title: "👋 Welcome Back!",
            text: "We found your existing record. Resuming registration.",
            icon: "info",
            confirmButtonText: "Continue",
            confirmButtonColor: "#027DA7",
          });
          setRegistrationStep(response?.data?.nextStep || 3);
          setIsOtpVerified(true);
          setUserId(response?.data?.userId);
        } else {
          Swal.fire({
            title: "OTP Verified Successfully!",
            icon: "success",
          });
          setIsOtpVerified(true);
          setRegistrationStep(3);
        }
      }
    } catch (error) {
      if (handleApiError) {
        handleApiError(error);
      } else {
        Swal.fire({
          icon: "error",
          title: "Verification Failed",
          text: error.response?.data?.message || "Invalid OTP code entered.",
        });
      }
      setShake(true);
      setTimeout(() => setShake(false), 500);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 pt-2">
      <div className="space-y-2">
        <label htmlFor="otp" className="text-slate-700 font-semibold text-sm sm:text-base">
          Enter 6-Digit OTP *
        </label>
        <div className="flex justify-center sm:justify-start gap-2 pt-1">
          {Array.from({ length: 6 }).map((_, index) => (
            <input
              key={index}
              type="text"
              inputMode="numeric"
              maxLength={1}
              className="w-11 h-11 sm:w-12 sm:h-12 text-center border-2 border-gray-300 rounded-xl focus:border-[#027da8] focus:ring-1 focus:ring-[#027da8] text-lg font-bold text-gray-800 bg-white"
              value={otp[index] || ""}
              onChange={(e) => {
                const val = e.target.value.replace(/\D/g, "");
                if (!val) return;

                const newOtp = otp.split("");
                newOtp[index] = val;
                setOtp(newOtp.join(""));

                // Auto-focus next
                if (e.target.nextSibling) {
                  e.target.nextSibling.focus();
                }
              }}
              onKeyDown={(e) => {
                if (e.key === "Backspace") {
                  e.preventDefault();
                  const newOtp = otp.split("");

                  if (otp[index]) {
                    newOtp[index] = "";
                    setOtp(newOtp.join(""));
                  } else if (index > 0) {
                    newOtp[index - 1] = "";
                    setOtp(newOtp.join(""));
                    if (e.target.previousSibling) {
                      e.target.previousSibling.focus();
                    }
                  }
                }
              }}
              onPaste={(e) => {
                e.preventDefault();
                const pasted = e.clipboardData.getData("text").replace(/\D/g, "");
                if (pasted.length === 6) {
                  setOtp(pasted);
                }
              }}
            />
          ))}
        </div>
      </div>

      <button
        type="button"
        onClick={verifyOtp}
        disabled={loading || otp.length < 6}
        className={`w-full bg-[#018EDE] hover:bg-[#018EDE]/90 text-white py-3 rounded-xl font-semibold transition-colors shadow-sm ${
          shake ? "shake" : ""
        }`}
      >
        {loading ? "Verifying..." : "Verify OTP"}
      </button>
    </div>
  );
};

export default OtpVerification;
