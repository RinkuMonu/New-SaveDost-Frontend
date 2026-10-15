import React from "react";
import { X } from "lucide-react";

export const PrivacyPolicyModal = ({ setShowPrivacy }) => {
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full p-6 relative shadow-2xl">
        <button
          type="button"
          onClick={() => setShowPrivacy(false)}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 p-1"
        >
          <X className="w-5 h-5" />
        </button>

        <h2 className="text-xl font-bold mb-3 text-brand-navy">
          Privacy Policy – Finunique Small Private Limited
        </h2>

        <div className="max-h-[60vh] overflow-y-auto text-sm text-gray-600 space-y-3 pr-2">
          <p>
            Effective Date: 28-09-2025. Company: Finunique Small Private Limited. Registered Office: Plot No 97, Dakshinpuri - I, Shrikishan, Sanganer, Jagatpura, Jaipur, Rajasthan, India - 302017.
          </p>

          <h3 className="font-semibold text-base text-gray-800">1. Introduction</h3>
          <p>
            Finunique Small Private Limited (“Company”, “we”, “our”, or “us”) values the privacy of its users and is fully committed to safeguarding personal data. This Privacy Policy outlines how we collect, use, store, and protect your information when you access or use our services.
          </p>
          <p>
            Our goal is to ensure that your personal and financial information is handled responsibly, securely, and in compliance with applicable laws and regulatory guidelines, including those prescribed by the Reserve Bank of India (RBI), NPCI, and UIDAI.
          </p>

          <h3 className="font-semibold text-base text-gray-800">2. Information Collection and Security</h3>
          <p>
            We collect information provided directly by you during registration, including your mobile number, email, and identity verification credentials strictly for compliance and service enablement.
          </p>
        </div>

        <div className="mt-5 pt-3 border-t flex justify-end">
          <button
            type="button"
            onClick={() => setShowPrivacy(false)}
            className="px-5 py-2 bg-[#027da8] text-white rounded-xl text-sm font-semibold hover:bg-[#027da8]/90"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicyModal;
