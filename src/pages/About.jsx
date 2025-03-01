import { useState } from "react";
import { Send } from "lucide-react";

export default function About() {
  const [email, setEmail] = useState("");
  const [feedback, setFeedback] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setEmail("");
    setFeedback("");
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          {/* Left side - About Information */}
          <div>
            <img
              src="https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&q=80&w=800"
              alt="Blog writing"
              className="rounded-lg shadow-lg mb-8"
            />
            <h1 className="text-3xl font-bold text-gray-900 mb-6">
              About BlogSpace
            </h1>
            <p className="text-gray-600 mb-4">
              Welcome to BlogSpace, where ideas come to life. Our platform is designed
              to empower writers, thinkers, and creators to share their stories with
              the world.
            </p>
            <p className="text-gray-600 mb-4">
              Whether you're a seasoned writer or just starting your journey, BlogSpace
              provides the tools and community you need to succeed. Join thousands of
              writers who have already made BlogSpace their home.
            </p>
            <div className="bg-blue-50 p-6 rounded-lg">
              <h2 className="text-xl font-semibold text-blue-900 mb-4">
                Why Choose BlogSpace?
              </h2>
              <ul className="space-y-3 text-blue-800">
                <li>✓ User-friendly writing experience</li>
                <li>✓ Engaged community of readers and writers</li>
                <li>✓ Powerful customization options</li>
                <li>✓ Built-in SEO optimization</li>
                <li>✓ Responsive design for all devices</li>
              </ul>
            </div>
          </div>

          {/* Right side - Feedback Form */}
          <div className="bg-white p-8 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Share Your Feedback
            </h2>
            {submitted ? (
              <div className="bg-green-50 text-green-700 p-4 rounded-md mb-6">
                Thank you for your feedback! We appreciate your input.
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Email address
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label
                    htmlFor="feedback"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Your feedback
                  </label>
                  <textarea
                    id="feedback"
                    rows="4"
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                    required
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full flex justify-center items-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <Send className="w-4 h-4 mr-2" />
                  Submit Feedback
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
