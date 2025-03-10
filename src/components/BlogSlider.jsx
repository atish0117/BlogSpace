import { useRef, useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import BlogCard from "./BlogCard";

const BlogSlider = () => {
    const { allBlogs, fetchAllBlogs } = useAuth();
    const latestBlogs = [...allBlogs].reverse().slice(0, 6); // Reverse & take latest 6

  
  const scrollRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const totalSlides = latestBlogs.length;

  useEffect(() => {
    const interval = setInterval(() => {
      scroll("right");
    }, 3000); // Auto-scroll every 3 seconds

    return () => clearInterval(interval);
  }, [currentIndex]);

  const scroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = 350; // Adjust as needed
      if (direction === "left") {
        setCurrentIndex((prev) => (prev > 0 ? prev - 1 : totalSlides - 1));
      } else {
        setCurrentIndex((prev) => (prev < totalSlides - 1 ? prev + 1 : 0));
      }
      scrollRef.current.scrollTo({
        left: currentIndex * scrollAmount,
        behavior: "smooth",
      });
    }
  };

  useEffect(() => {
    fetchAllBlogs(); // Fetch all blogs when this component loads
  }, []);

  return (
    <section className="py-10 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Latest Blogs</h2>

        {/* Left Scroll Button */}
        <button
          onClick={() => scroll("left")}
          className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-white p-3 rounded-full shadow-md hover:bg-gray-200 transition"
        >
          <ChevronLeft className="w-6 h-6 text-gray-700" />
        </button>

        {/* Blog Cards Row */}
        <div
          ref={scrollRef}
          className="flex gap-6 overflow-hidden pb-4 scroll-smooth"
        >
          {latestBlogs.map((blog, index) => (
            <div key={index} className="flex-shrink-0 w-[350px]">
              <BlogCard blog={blog} />
            </div>
          ))}
        </div>

        {/* Right Scroll Button */}
        <button
          onClick={() => scroll("right")}
          className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-white p-3 rounded-full shadow-md hover:bg-gray-200 transition"
        >
          <ChevronRight className="w-6 h-6 text-gray-700" />
        </button>

        {/* Indicator Dots */}
        <div className="flex justify-center mt-4">
          {latestBlogs.map((_, index) => (
            <span
              key={index}
              className={`h-3 w-3 mx-1 rounded-full transition-all duration-300 ${
                currentIndex === index ? "bg-gray-900 w-5" : "bg-gray-400"
              }`}
            ></span>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BlogSlider;
