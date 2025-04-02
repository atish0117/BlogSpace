import React, { useState } from "react";

export default function Newsletter() {
  const [email, setEmail] = useState("");
  const [showPopup, setShowPopup] = useState(false);

  const handleSubscribe = () => {
    if (!email.trim()) {
      document.getElementById("emailInput").focus();
      return;
    }

    setShowPopup(true);
    setTimeout(() => {
      setShowPopup(false);
      setEmail(""); // Clear input after success
    }, 3000);
  };

  return (
    <div className="max-w-4xl mx-auto py-12 px-6 text-center bg-gray-100 rounded-lg shadow-md mb-10">
      <h2 className="text-3xl font-bold text-gray-900">Join Our Community</h2>
      <p className="text-gray-600 mt-2 text-sm">
        Subscribe to our newsletter and stay updated with the latest blog posts, insights, and exclusive content!
      </p>
      <div className="mt-6 flex justify-center">
        <input
          id="emailInput"
          type="email"
          placeholder="Enter your email"
          className="w-2/3 p-3 border border-gray-300 rounded-l-lg focus:outline-none"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <button
          className="bg-gray-900 text-white px-6 py-3 rounded-r-lg hover:bg-gray-700 transition-all"
          onClick={handleSubscribe}
        >
          Subscribe
        </button>
      </div>
      <p className="text-gray-500 text-xs mt-3">
        We respect your privacy. No spam, only valuable content.
      </p>

      {/* Full-Screen Popup */}
      {showPopup && (
        <div className="fixed inset-0 flex items-center justify-center backdrop-blur-md bg-black bg-opacity-30">
          <div className="bg-white p-6 rounded-lg shadow-lg text-center animate-fadeIn">
            <p className="text-lg font-semibold text-gray-900">
              🎉 Thank you for subscribing!
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
