import React from "react";
import { ArrowRight } from "lucide-react";

const blogPosts = [
  {
    title: "Mastering the Art of Writing",
    description: "Discover the secrets to compelling storytelling and engaging blog content.",
    image: "https://images.unsplash.com/photo-1740672547046-74d1c45cb30b?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHw4fHx8ZW58MHx8fHx8",
  },
  {
    title: "Exploring Minimalist Design",
    description: "A guide to creating clean, simple, and effective designs.",
    image: "https://images.unsplash.com/photo-1740103874714-d28ab0a9d4ac?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHwxMnx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    title: "The Power of Daily Journaling",
    description: "How keeping a journal can improve mindfulness and productivity.",
    image:"https://plus.unsplash.com/premium_photo-1740708549031-fd00d8821c5b?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHwyMXx8fGVufDB8fHx8fA%3D%3D",
  },
];

export default function FeaturedBlogs() {
  return (
    <div className="max-w-6xl mx-auto py-12 px-6">
      <h2 className="text-3xl font-bold text-center mb-8 text-gray-900">
        Featured Blog Posts
      </h2>
      <div className="grid md:grid-cols-3 gap-6">
        {blogPosts.map((post, index) => (
          <div key={index} className="bg-white shadow-lg rounded-lg overflow-hidden transition-transform transform hover:scale-105">
            <img src={post.image} alt={post.title} className="w-full h-48 object-cover" />
            <div className="p-4">
              <h3 className="text-xl font-semibold text-gray-900">{post.title}</h3>
              <p className="text-gray-600 mt-2 text-sm">{post.description}</p>
              <button className="mt-4 flex items-center text-gray-900 font-semibold hover:text-gray-600 transition-all">
                Read More
                <ArrowRight className="ml-2" size={18} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
