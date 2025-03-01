import React from "react";

export default function Newsletter() {
  return (
    <div className="max-w-4xl mx-auto py-12 px-6 text-center bg-gray-100 rounded-lg shadow-md mb-10">
      <h2 className="text-3xl font-bold text-gray-900">Join Our Community</h2>
      <p className="text-gray-600 mt-2 text-sm">
        Subscribe to our newsletter and stay updated with the latest blog posts, insights, and exclusive content!
      </p>
      <div className="mt-6 flex justify-center">
        <input
          type="email"
          placeholder="Enter your email"
          className="w-2/3 p-3 border border-gray-300 rounded-l-lg focus:outline-none"
        />
        <button className="bg-gray-900 text-white px-6 py-3 rounded-r-lg hover:bg-gray-700 transition-all">
          Subscribe
        </button>
      </div>
      <p className="text-gray-500 text-xs mt-3">
        We respect your privacy. No spam, only valuable content.
      </p>
    </div>
  );
}
