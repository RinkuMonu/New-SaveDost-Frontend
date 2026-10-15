import React from "react";
import { Phone } from "lucide-react";
import Swal from "sweetalert2";
import apiClient from "../../../services/apiClient";

export const MobileVerification = ({
  register,
  errors,
  shake,
  loading,
  setLoading,
  setRegistrationStep,
  setShake,
  trigger,
  watch,
  handleApiError,
}) => {
  const sendOtp = async () => {
    const isValid = await trigger("mobileNumber");
    if (!isValid) {
      setShake(true);
      setTimeout(() => setShake(false), 500);
      return;
    }

    setLoading(true);
    try {
      const response = await apiClient.post("/auth/send-otp", {
        mobileNumber: watch("mobileNumber"),
        type: "register",
      });

      if (response.status === 200 || response.status === 201) {
        Swal.fire({
          title: "OTP Sent Successfully!",
          text: response.data?.message || "Please check your mobile for the verification code.",
          icon: "success",
        });
        setRegistrationStep(2);
      }
    } catch (error) {
      if (handleApiError) {
        handleApiError(error);
      } else {
        Swal.fire({
          icon: "error",
          title: "OTP Failed",
          text: error.response?.data?.message || "Failed to send verification OTP.",
        });
      }
      setShake(true);
      setTimeout(() => setShake(false), 500);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4 pt-2">
      <div className="space-y-2">
        <label htmlFor="mobileNumber" className="text-[#0C3D4C] text-sm sm:text-base font-semibold">
          Mobile Number *
        </label>
        <div
          className={`flex flex-col sm:flex-row sm:items-center justify-between border bg-white rounded-xl px-3.5 py-2.5 focus-within:border-[#027da8] gap-2 ${
            errors?.mobileNumber ? "border-red-500" : "border-gray-200"
          } ${shake ? "shake" : ""}`}
        >
          <div className="flex items-center flex-1">
            <Phone className="w-5 h-5 text-gray-400 mr-3 shrink-0" />
            <input
              type="text"
              id="mobileNumber"
              placeholder="Enter 10-digit mobile number"
              className="w-full border-0 p-0 focus:outline-none bg-white text-sm sm:text-base text-gray-800"
              maxLength={10}
              {...register("mobileNumber", {
                required: "Mobile number is required",
                pattern: {
                  value: /^[6-9][0-9]{9}$/,
                  message: "Please enter a valid 10-digit mobile number starting with 6-9",
                },
              })}
              onInput={(e) => {
                let value = e.target.value.replace(/\D/g, "");
                if (value.length === 1 && !/[6-9]/.test(value)) {
                  value = "";
                }
                if (value.length > 10) {
                  value = value.slice(0, 10);
                }
                e.target.value = value;
              }}
            />
          </div>
          <button
            type="button"
            onClick={sendOtp}
            disabled={loading}
            className={`bg-[#018EDE] hover:bg-[#018EDE]/90 text-white px-5 py-2 rounded-lg text-sm font-semibold transition-colors shrink-0 shadow-sm ${
              shake ? "shake" : ""
            }`}
          >
            {loading ? "Sending..." : "Send OTP"}
          </button>
        </div>
        {errors?.mobileNumber && (
          <p className="text-red-500 text-xs sm:text-sm mt-1">
            {errors.mobileNumber.message}
          </p>
        )}
      </div>
    </div>
  );
};

export default MobileVerification;
