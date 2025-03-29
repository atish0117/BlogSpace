import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import BlogCard from "../components/BlogCard";
import { useAuth } from "../context/AuthContext";

export default function Blog() {
  const { allBlogs } = useAuth();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const categoryFromURL = queryParams.get("category");

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(categoryFromURL || "All");

  const categories = [
    "Development", "Web Development", "Mobile Apps", "AI & Machine Learning", "Cybersecurity",
    "DevOps & Cloud Computing", "Programming & Coding", "Entrepreneurship & Startups", "Investing & Stock Market",
    "Personal Finance & Budgeting", "Marketing & SEO", "E-commerce & Dropshipping", "Freelancing & Remote Work",
    "Health & Fitness", "Mental Wellness & Self-Care", "Travel & Adventure", "Food & Cooking", "Fashion & Beauty",
    "Home & Living", "Job Search & Career Growth", "Productivity & Time Management", "Study & Learning Hacks",
    "Leadership & Management", "Movies & TV Shows", "Music & Podcasts", "Gaming & Esports", "Books & Literature",
    "Pop Culture & Celebrities", "Space & Astronomy", "Environment & Sustainability", "Physics & Chemistry",
    "Biotechnology & Medicine", "Self-Improvement & Motivation", "Social Issues & Culture", "Psychology & Philosophy",
    "Inspirational Stories", "Technology", "Books", "Art & Design", "Self-Improvement", "Health & Wellness",
    "Business", "Movies", "Travel", "Writing", "Photography", "Music", "Food", "Programming", "Design", "Other"
  ];

  useEffect(() => {
    if (categoryFromURL) {
      setSelectedCategory(categoryFromURL);
    }
  }, [categoryFromURL]);

  const filteredBlogs = allBlogs.filter((blog) => {
    const matchesSearch =
      blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      blog.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      blog.category.some((cat) => cat.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesCategory =
      selectedCategory.toLowerCase() === "all" ||
      blog.category.map((cat) => cat.toLowerCase()).includes(selectedCategory.toLowerCase());

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 md:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Search & Filter Section */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8">
          
          {/* Search Input */}
          <div className="relative w-full md:w-2/5">
            <input
              type="text"
              placeholder="Search blogs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm"
            />
          </div>

          {/* Category Filter Dropdown (Scrollable for many categories) */}
          <div className="relative w-full md:w-1/4">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm"
            >
              <option value="All">All Categories</option>
              {categories.map((category) => (
                <option key={category} value={category} className="text-sm">
                  {category}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Blog Grid */}
        {filteredBlogs.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
            {filteredBlogs.map((blog) => (
              <BlogCard key={blog.$id} blog={blog} />
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500 text-lg">No blogs found!</p>
        )}
      </div>
    </div>
  );
}
