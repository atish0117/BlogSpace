import HeroSection from '../components/HeroSection';
import FeaturedBlogPosts from '../components/FeaturedBlogPosts';
import CategoriesSection from '../components/CategoriesSection';
import Testimonials from '../components/Testimonials';
import Newsletter from '../components/Newsletter';
import BlogSlider from '../components/BlogSlider';
export default function Home() {
  return (
    <div className="min-h-screen bg-">
      <HeroSection/>
      <BlogSlider/>
      <FeaturedBlogPosts/>
      <CategoriesSection/>
      <Testimonials/>
      <Newsletter/>

      {/* Featured Blogs Section */}
      
    </div>
  );
}