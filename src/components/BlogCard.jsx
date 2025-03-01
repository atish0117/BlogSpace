import React, { useState } from "react";
import { Link } from "react-router-dom";
import { storage } from "../lib/appwrite"; // Adjust the import based on your file structure
import Config from "../lib/Config"; // Adjust the import based on your file structure
import { Heart, Bookmark, UserCircle, Share } from "lucide-react"; // Icons for interactivity

const BlogCard = ({ blog }) => {
  const [isLiked, setIsLiked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  const handleLike = () => {
    setIsLiked(!isLiked);
    // Add logic to update like count in the backend
  };

  const handleSave = () => {
    setIsSaved(!isSaved);
    // Add logic to save the blog for the user
  };

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden transition-transform hover:scale-[1.02] hover:shadow-xl border border-gray-100 group">
      {/* Blog Thumbnail */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={
            blog.thumbnail
              ? storage.getFilePreview(Config.appwriteBucketId, blog.thumbnail)
              : "/default-thumbnail.jpg"
          }
          alt={blog.title}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
        />
        {/* Overlay for Thumbnail */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
      </div>

      <div className="p-5">
        {/* Blog Categories */}
        <div className="flex flex-wrap gap-2 mb-3">
          {blog.category?.length > 0 ? (
            blog.category.slice(0, 2).map((cat, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-blue-50 text-blue-800 text-xs font-medium rounded-full"
              >
                {cat}
              </span>
            ))
          ) : (
            <span className="px-3 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded-full">
              Uncategorized
            </span>
          )}
        </div>

        {/* Blog Title */}
        <h3 className="text-xl font-bold text-gray-900 mb-2 hover:text-blue-600 transition-colors line-clamp-2">
          {blog.title}
        </h3>

        {/* Blog Description */}
        <p className="text-gray-600 text-sm mb-4 line-clamp-3">
        {blog.description ? (
            <div
              dangerouslySetInnerHTML={{
                __html: blog.description.slice(0, 100) + "...",
              }}
            />
          ) : (
            <b>No description available.</b>
          )}
        </p>

        {/* Author Information */}
        <div className="flex items-center gap-2 mb-4">
          <UserCircle className="w-5 h-5 text-gray-500" />
          <span className="text-sm text-gray-700">{blog.authorName || "Unknown Author"}</span>
        </div>

        {/* Blog Metadata (Date and Views) */}
        <div className="flex justify-between items-center text-sm text-gray-500 mb-4">
          <span>{new Date(blog.$createdAt).toLocaleDateString()}</span>
          <span>{blog.views || 0} views</span>
        </div>

        {/* Interactive Buttons */}
        <div className="flex justify-between items-center">
          <button
            onClick={handleLike}
            className={`flex items-center gap-1 text-sm font-medium ${
              isLiked ? "text-red-600" : "text-gray-500"
            } hover:text-red-600 transition-colors`}
          >
            <Heart className="w-5 h-5" />
            <span>{isLiked ? "Liked" : "Like"}</span>
          </button>

          <button
            onClick={handleSave}
            className={`flex items-center gap-1 text-sm font-medium ${
              isSaved ? "text-blue-600" : "text-gray-500"
            } hover:text-blue-600 transition-colors`}
          >
            <Bookmark className="w-5 h-5" />
            <span>{isSaved ? "Saved" : "Save"}</span>
          </button>

          <button
            className="flex items-center gap-1 text-sm font-medium text-gray-500 hover:text-blue-600 transition-colors"
          >
            <Share className="w-5 h-5" />
            <span>Share</span>
          </button>
        </div>

        {/* Read More Link */}
        <div className="mt-4">
          <Link
            to={`/blog/${blog.$id}`}
            className="text-blue-600 hover:text-blue-700 font-medium transition-colors"
          >
            Read More →
          </Link>
        </div>
      </div>
    </div>
  );
};

export default BlogCard;