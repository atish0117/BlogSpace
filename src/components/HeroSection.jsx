import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
const imageCollection = [
  {
    src: "https://images.unsplash.com/photo-1520975916090-3105956dac38",
    className: "absolute w-64 h-64 rounded-2xl shadow-lg object-cover top-0 left-0 transform rotate-2",
  },
  {
    src: "https://images.unsplash.com/photo-1512058564366-18510be2db19",
    className: "absolute w-72 h-72 rounded-2xl shadow-lg object-cover top-0 right-0 transform -rotate-2",
  },
  {
    src: "https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0",
    className: "absolute w-64 h-64 rounded-2xl shadow-lg object-cover bottom-0 left-0 transform rotate-3",
  },
  {
    src: "https://images.unsplash.com/photo-1518770660439-4636190af475",
    className: "absolute w-72 h-72 rounded-2xl shadow-lg object-cover bottom-0 right-0 transform -rotate-3",
  },
];

export default function HeroSection() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8  ">
      <div className="grid grid-cols-1 md:grid-cols-2 items-center gap-12 py-2">
        {/* Left Section - Improved Design */}
        <div className="relative p-8  rounded-2xl py-50">
          {/* Decorative Icons */}
          <div className="absolute inset-0 flex items-center justify-center opacity-20 py-10">
            <svg
              className="w-64 h-64 text-purple-300"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
              ></path>
            </svg>
          </div>

          {/* Text Content */}
          <div className="relative z-10 ">
            <h1 className="text-5xl font-bold text-gray-900">
              Feed Your Curiosity, Fuel Your Mind!
            </h1>
            <p className="mt-4 text-lg text-gray-600">
              "Explore insightful stories, fresh ideas, and endless inspiration—one read at a time."
            </p>
            <div className="mt-6 flex space-x-4">
              <Link to="/blog" className="px-6 py-3 text-white flex items-center bg-black rounded-lg hover:bg-gray-800 transition-all duration-300 group">
                Start Reading
                <span className="ml-2 transition-all duration-300 transform group-hover:translate-x-1">
                  <ArrowRight size={18} />
                </span>
              </Link>
            </div>
          </div>
        </div>

        {/* Right Section - Static Image Collection */}
        <div className="relative flex justify-center items-center h-[500px]">
          {imageCollection.map((image, index) => (
            <img
              key={index}
              src={image.src}
              alt={`Image ${index + 1}`}
              className="absolute opacity-100"
              {...image}
            />
          ))}
        </div>
      </div>
    </div>
  );
}