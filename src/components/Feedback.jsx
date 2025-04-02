import React, { useState } from "react";

export default function Feedback() {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [showModal, setShowModal] = useState(false);

  const handleRating = (value) => {
    setRating(value);
  };

  const handleSubmit = () => {
    if (rating === 0) {
      alert("Please provide a rating before submitting.");
      return;
    }

    // TODO: Send feedback to the backend
    console.log({ rating, comment });

    setShowModal(true);
    // restart rating star
    setRating(0);
  };

  return (
    <div className="max-w-lg mx-auto p-6 bg-gray-100 rounded-lg shadow-md text-center mb-3">
      <h2 className="text-2xl font-bold text-gray-900">Feedback</h2>
      <p className="text-gray-600 text-sm">Rate your experience with our website</p>

      {/* Star Rating */}
      <div className="flex justify-center mt-4">
        {[1, 2, 3, 4, 5].map((star) => (
          <span
            key={star}
            className={`cursor-pointer text-3xl ${
              star <= rating ? "text-yellow-400" : "text-gray-400"
            }`}
            onClick={() => handleRating(star)}
          >
            ★
          </span>
        ))}
      </div>

      {/* Comment Box (Optional) */}
      <textarea
        className="w-full mt-4 p-2 border rounded-lg focus:outline-none"
        rows="3"
        placeholder="Write your feedback..."
        value={comment}
        onChange={(e) => setComment(e.target.value)}
      />

      {/* Submit Button */}
      <button
        className="mt-4 bg-gray-900 text-white px-6 py-2 rounded-lg hover:bg-gray-700 transition-all"
        onClick={handleSubmit}
      >
        Submit Feedback
      </button>

     {/* Modal Popup */}
{showModal && (
  <div className="fixed inset-0 flex items-center justify-center backdrop-blur-md">
    <div className="bg-white p-6 rounded-lg shadow-lg text-center animate-fadeIn">
      <h3 className="text-xl font-bold text-gray-900">Thank You! 🎉</h3>
      <p className="text-gray-600 mt-2">We appreciate your feedback.</p>

      <button
        className="mt-4 bg-gray-900 text-white px-6 py-2 rounded-lg hover:bg-gray-700 transition-all"
        onClick={() => setShowModal(false)}
      >
        Close
      </button>
    </div>
  </div>
)}

    </div>
  );
}
