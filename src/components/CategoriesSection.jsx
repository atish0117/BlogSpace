import React from "react";
import {Link } from "react-router-dom"
import { useNavigate } from "react-router-dom";
const categories = [
  { name: "Writing", slug:"writing", image: "https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=400&q=80" },
  { name: "Photography",slug:"photography", image: "https://images.unsplash.com/photo-1512790182412-b19e6d62bc39?w=400&q=80" },
  { name: "Technology",slug:"technology", image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=400&q=80" },
  { name: "Travel", slug:"travel", image: "https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0?w=400&q=80" },
  { name: "Music", slug:"music", image: "https://images.unsplash.com/photo-1511376777868-611b54f68947?w=400&q=80" },
  { name: "Books", slug:"books", image: "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400&q=80" },
  { name: "Movies", slug:"movies", image: "https://images.unsplash.com/photo-1598899134739-24c36a3535db?w=400&q=80" },
  { name: "Art & Design", slug:"art & design", image: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=400&q=80" },
  { name: "Self-Improvement", slug:"self-improvement", image: "https://images.unsplash.com/photo-1517048676732-d65bc937f952?w=400&q=80" },
  { name: "Health & Wellness", slug:"health & wellness", image: "https://images.unsplash.com/photo-1554284126-aa88f22d8b74?w=400&q=80" },
  { name: "Business", slug:"business", image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=400&q=80" },
  { name: "Food", slug:"food", image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&q=80" },
];

export default function CategoriesSection() {
  const navigate = useNavigate(); // React Router Hook

  // Function to navigate with category parameter
  const handleCategoryClick = (category) => {
    navigate(`/blog?category=${category.slug}`);
  };
  return (
    <div className="max-w-6xl mx-auto py-12 px-6 text-center ">
      <h2 className="text-3xl font-bold text-gray-900 mb-8">Explore Topics</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {categories.map((category, index) => (
          <div
            key={index}
            className="relative h-32 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-all cursor-pointer"
            style={{
              backgroundImage: `url(${category.image})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
            onClick={() => handleCategoryClick(category)}
          >
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <h3 className="text-white text-lg font-semibold">{category.name}</h3>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-8">
        <Link to={"/blog"} className="px-6 py-3 text-white bg-black rounded-lg hover:bg-gray-800 transition-all duration-300">
          View All Categories
        </Link>
      </div>
    </div>
  );
}
