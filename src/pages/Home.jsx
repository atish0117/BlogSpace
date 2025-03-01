import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useAuth } from "../context/AuthContext";
import { useEffect } from 'react';
import { storage } from '../lib/appwrite';
import Config from '../lib/Config';
import BlogCard from "../components/BlogCard";
import HeroSection from '../components/HeroSection';
import FeaturedBlogPosts from '../components/FeaturedBlogPosts';
import CategoriesSection from '../components/CategoriesSection';
import Testimonials from '../components/Testimonials';
import Newsletter from '../components/Newsletter';
export default function Home() {
  const { allBlogs, fetchAllBlogs } = useAuth();

  useEffect(() => {
    fetchAllBlogs(); // Fetch all blogs when this component loads
  }, []);

  return (
    <div className="min-h-screen bg-">
      {/* Hero Section */}
      {/* <section className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Share Your Story with the World
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-100">
              Create, share, and discover amazing blog posts from writers around the globe
            </p>
            <Link
              to="/signup"
              className="inline-flex items-center bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition"
            >
              Get Started
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </div>
      </section> */}
      <HeroSection/>

      <FeaturedBlogPosts/>
      <CategoriesSection/>
      <Testimonials/>
      <Newsletter/>

      {/* Featured Blogs Section */}
       <section className="py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-8">All Blogs</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {allBlogs.map((blog) => (
            <BlogCard key={blog.$id} blog={blog} />
          ))}
        </div>
      </div>
    </section>
    </div>
  );
}