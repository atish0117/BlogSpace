import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const imageCollection = [
  {
    src: "https://images.unsplash.com/photo-1520975916090-3105956dac38",
    className: "absolute w-40 h-40 sm:w-48 sm:h-48 md:w-64 md:h-64 rounded-2xl shadow-lg object-cover top-0 left-0 rotate-2",
  },
  {
    src: "https://images.unsplash.com/photo-1512058564366-18510be2db19",
    className: "absolute w-48 h-48 sm:w-56 sm:h-56 md:w-72 md:h-72 rounded-2xl shadow-lg object-cover top-0 right-0 -rotate-2",
  },
  {
    src: "https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0",
    className: "absolute w-40 h-40 sm:w-48 sm:h-48 md:w-64 md:h-64 rounded-2xl shadow-lg object-cover bottom-0 left-0 rotate-3",
  },
  {
    src: "https://images.unsplash.com/photo-1518770660439-4636190af475",
    className: "absolute w-48 h-48 sm:w-56 sm:h-56 md:w-72 md:h-72 rounded-2xl shadow-lg object-cover bottom-0 right-0 -rotate-3",
  },
];

export default function HeroSection() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="grid grid-cols-1 md:grid-cols-2 items-center gap-8 md:gap-12">
        {/* Left Section - Text Content */}
        <div className="relative text-center md:text-left px-4">
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 leading-tight">
            Feed Your Curiosity, Fuel Your Mind!
          </h1>
          <p className="mt-4 text-base sm:text-lg text-gray-600">
            "Explore insightful stories, fresh ideas, and endless inspiration—one read at a time."
          </p>
          <div className="mt-6 flex justify-center md:justify-start">
            <Link
              to="/blog"
              className="px-6 py-3 text-white flex items-center bg-black rounded-lg hover:bg-gray-800 transition-all duration-300 group"
            >
              Start Reading
              <span className="ml-2 transition-all duration-300 transform group-hover:translate-x-1">
                <ArrowRight size={18} />
              </span>
            </Link>
          </div>
        </div>

        {/* Right Section - Responsive Image Collection */}
        <div className="relative flex justify-center items-center h-72 sm:h-96 md:h-[500px] w-full">
          {imageCollection.map((image, index) => (
            <img
              key={index}
              src={image.src}
              alt={`Image ${index + 1}`}
              className={image.className}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
