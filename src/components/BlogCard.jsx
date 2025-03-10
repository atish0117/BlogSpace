import React, { useState } from "react";
import { Link } from "react-router-dom";
import { storage } from "../lib/appwrite"; // Adjust import path
import Config from "../lib/Config"; // Adjust import path
import { Heart, Bookmark, BookmarkCheck, UserCircle, Share } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-hot-toast"; // Import toast notification

const BlogCard = ({ blog }) => {
  const { userProfile, saveBlog, unsaveBlog } = useAuth();
  const [isLiked, setIsLiked] = useState(false);
  const isSaved = userProfile?.savedBlogs?.includes(blog.$id);

  // Handle Like
  const handleLike = () => {
    setIsLiked(!isLiked);
    // Logic to update like count in the backend (optional)
  };

  // Handle Save/Unsave with Toast Notification
  const handleSave = async (e) => {
    e.stopPropagation(); // Prevents unintended navigation
    if (isSaved) {
      await unsaveBlog(blog.$id);
      toast.success("Blog removed from saved!"); // Toast for Unsave
    } else {
      await saveBlog(blog.$id);
      toast.success("Blog saved successfully!"); // Toast for Save
    }
  };

  return (
    <div className="w-[350px] h-[500px] flex flex-col bg-white rounded-xl shadow-lg overflow-hidden transition-transform hover:scale-[1.02] hover:shadow-xl border border-gray-100 group">
      {/* Blog Thumbnail */}
      <Link to={`/blog/${blog.$id}`} className="relative h-48 overflow-hidden block">
        <img
          src={blog.thumbnail ? storage.getFilePreview(Config.appwriteBucketId, blog.thumbnail) : "/default-thumbnail.jpg"}
          alt={blog.title}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
      </Link>

      {/* Blog Content */}
      <div className="p-5 flex flex-col flex-grow">
        {/* Blog Categories */}
        <div className="flex flex-wrap gap-2 mb-3">
          {blog.category?.length > 0 ? (
            blog.category.slice(0, 2).map((cat, index) => (
              <span key={index} className="px-3 py-1 bg-blue-50 text-blue-800 text-xs font-medium rounded-full">
                {cat}
              </span>
            ))
          ) : (
            <span className="px-3 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded-full">Uncategorized</span>
          )}
        </div>

        {/* Blog Title */}
        <Link to={`/blog/${blog.$id}`} className="block">
          <h3 className="text-lg font-bold text-gray-900 mb-2 hover:text-blue-600 transition-colors line-clamp-2">
            {blog.title}
          </h3>
        </Link>

        {/* Blog Description */}
        <p className="text-gray-600 text-sm line-clamp-3 flex-grow">
          {blog.description ? (
            <span dangerouslySetInnerHTML={{ __html: blog.description.slice(0, 100) + "..." }} />
          ) : (
            <b>No description available.</b>
          )}
        </p>

        {/* Blog Metadata (Author, Date, Views) */}
        <div className="mt-auto">
          <div className="flex items-center gap-2 text-sm text-gray-700 mb-2">
            <UserCircle className="w-5 h-5 text-gray-500" />
            <span>{blog.authorName || "Unknown Author"}</span>
          </div>

          <div className="flex justify-between text-xs text-gray-500">
            <span>{new Date(blog.$createdAt).toLocaleDateString()}</span>
            <span>{blog.views || 0} views</span>
          </div>
        </div>
      </div>

      {/* Interactive Buttons (OUTSIDE THE LINK) */}
      <div className="flex justify-between items-center px-5 py-3 border-t bg-gray-50">
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
          className={`p-2 rounded-full transition-all ${
            isSaved ? "text-blue-600" : "text-gray-600 hover:text-blue-600"
          }`}
        >
          {isSaved ? <BookmarkCheck size={20} /> : <Bookmark size={20} />}
        </button>

        <button
          onClick={(e) => e.stopPropagation()} // Prevents unintended navigation
          className="flex items-center gap-1 text-sm font-medium text-gray-500 hover:text-blue-600 transition-colors"
        >
          <Share className="w-5 h-5" />
          <span>Share</span>
        </button>
      </div>
    </div>
  );
};

export default BlogCard;
