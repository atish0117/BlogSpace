import { useState,useEffect } from 'react';
import { Link,useLocation } from 'react-router-dom';
import { Search } from 'lucide-react';
import SearchBar from '../components/SearchBar';
import BlogCard from '../components/BlogCard';
import { useAuth } from '../context/AuthContext';
export default function Blog() {
    const { allBlogs, fetchAllBlogs } = useAuth();
  
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const categoryFromURL = queryParams.get("category"); // Get category from URL

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(categoryFromURL ||'all');
  const categories = [
    "Development", "Web Development", "Mobile Apps", "AI & Machine Learning", "Cybersecurity",
    "DevOps & Cloud Computing", "Programming & Coding", "Entrepreneurship & Startups", "Investing & Stock Market",
    "Personal Finance & Budgeting", "Marketing & SEO", "E-commerce & Dropshipping", "Freelancing & Remote Work",
    "Health & Fitness", "Mental Wellness & Self-Care", "Travel & Adventure", "Food & Cooking", "Fashion & Beauty",
    "Home & Living", "Job Search & Career Growth", "Productivity & Time Management", "Study & Learning Hacks",
    "Leadership & Management", "Movies & TV Shows", "Music & Podcasts", "Gaming & Esports", "Books & Literature",
    "Pop Culture & Celebrities", "Space & Astronomy", "Environment & Sustainability", "Physics & Chemistry",
    "Biotechnology & Medicine", "Self-Improvement & Motivation", "Social Issues & Culture", "Psychology & Philosophy",
    "Inspirational Stories",  "technology","books","art & design","self-improvement","health & wellness",
    "business", "movies","travel","writing","photography","Music", "Food","Music", "Programming", "Design", "Other"
  ];

  // Update category when URL changes
  useEffect(() => {
    if (categoryFromURL) {
      setSelectedCategory(categoryFromURL);
    }
  }, [categoryFromURL]);

    // Filter blogs based on search term and selected category
    const filteredBlogs = allBlogs.filter((blog) => {
      const matchesSearch =
        blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        blog.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        blog.category.some((cat) =>
          cat.toLowerCase().includes(searchTerm.toLowerCase())
        );
  
      const matchesCategory =
        selectedCategory.toLowerCase() === "all" ||
        blog.category
          .map((cat) => cat.toLowerCase())
          .includes(selectedCategory.toLowerCase());
  
      return matchesSearch && matchesCategory;
    });

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Search and Filter Section */}
        {/* SearchBar Component */}
        <SearchBar
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          categories={["All", ...categories]} // Add "All" to the categories list
        />

        {/* Blog Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredBlogs.map((blog) => (
            <BlogCard key={blog.$id} blog={blog} />
          ))}
        </div>
      </div>
    </div>
  );
}