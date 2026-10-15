import React from "react";
import { X } from "lucide-react";

export const TermsModal = ({ setShowTerms }) => {
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full p-6 relative shadow-2xl">
        <button
          type="button"
          onClick={() => setShowTerms(false)}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 p-1"
        >
          <X className="w-5 h-5" />
        </button>

        <h2 className="text-xl font-bold mb-3 text-brand-navy">
          Terms and Conditions – Finunique Small Private Limited
        </h2>

        <div className="max-h-[60vh] overflow-y-auto text-sm text-gray-600 space-y-3 pr-2">
          <p>
            By accessing this webpage or application, you agree to be bound by these Terms and Conditions (“Terms”) in a legally binding agreement between you (“User” or “you”) and Finunique Small Private Limited (“Company” or “we” or “us” or “our”). Please read these Terms carefully before using or accessing the Website/App. If you do not agree to these Terms, you may not use or access the Platform.
          </p>

          <h3 className="font-semibold text-base text-gray-800">
            Appointment as Retailer / Partner / Distributor / API Partner
          </h3>
          <p>
            These Terms and Conditions govern the commercial arrangement between Finunique Small Private Limited and the appointed Retailer, Partner, Distributor, or API Partner (hereinafter collectively referred to as “Partner”). This agreement, along with any attachments, represents the entire understanding between Finunique Small Private Limited and the Partner. Any amendments or changes to this agreement shall be valid only if made in writing and authorized by an official representative of Finunique Small Private Limited.
          </p>
          <p>
            Finunique Small Private Limited is a digital financial facilitation service provider, incorporated under the Companies Act, 2013, with its registered office at Plot No. 97, Dakshinpuri-I, Shrikishanpura, Sanganer, Jagatpura, Jaipur – 302017, Rajasthan.
          </p>

          <h3 className="font-semibold text-base text-gray-800">
            OPERATION OF OUTLET AND RENDERING OF SERVICES
          </h3>
          <p>
            During the term of this agreement, the Partner shall render the services (“Services”) of Finunique Small Private Limited, including but not limited to BBPS, DMT, and AEPS, through its authorized personnel, agents, or representatives.
          </p>
          <p>
            All Services must be rendered strictly through Finunique Small Private Limited’s portal/software. Offline transactions, fake receipts, or fraudulent activity are strictly prohibited.
          </p>
        </div>

        <div className="mt-5 pt-3 border-t flex justify-end">
          <button
            type="button"
            onClick={() => setShowTerms(false)}
            className="px-5 py-2 bg-[#027da8] text-white rounded-xl text-sm font-semibold hover:bg-[#027da8]/90"
          >
            I Understand
          </button>
        </div>
      </div>
    </div>
  );
};

export default TermsModal;
