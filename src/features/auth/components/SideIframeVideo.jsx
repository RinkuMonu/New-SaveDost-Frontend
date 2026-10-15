import React, { useState } from "react";

/**
 * Side floating YouTube video widget and modal.
 * Matches exact reference from Sevenunique Utility AdminPanel.
 */
export const SideIframeVideo = ({
  src = "https://www.youtube.com/embed/LsLV1Emkb-Q?si=EepaHlUk19iWeB4B&autoplay=1&controls=0&loop=1&mute=1",
  heading = "रजिस्ट्रेशन का आसान तरीका — वीडियो में देखें",
  youtube = false,
  youtube2 = false,
}) => {
  const [open, setOpen] = useState(true);

  if (!open) return null;

  return (
    <div
      className={`fixed md:bottom-6 bottom-4 right-2 md:right-8 z-50 bg-white rounded-xl p-2 shadow-2xl border border-gray-100 ${
        youtube || youtube2 ? "hidden" : "block"
      }`}
    >
      <button
        type="button"
        onClick={() => setOpen(false)}
        className="absolute -top-2.5 -right-2.5 bg-[#027DA7] hover:bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold shadow-md transition-colors"
        title="Close Video"
      >
        ×
      </button>

      <p className="text-center text-black text-[11px] font-bold mb-1.5 px-1">
        {heading}
      </p>

      <iframe
        className="w-36 h-24 lg:w-56 lg:h-32 rounded-xl shadow-md mx-auto"
        src={src}
        title="YouTube video"
        allow="autoplay; encrypted-media"
        allowFullScreen
      />
    </div>
  );
};

export default SideIframeVideo;
