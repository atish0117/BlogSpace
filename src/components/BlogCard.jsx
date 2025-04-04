import React from "react";
import { Link,useNavigate } from "react-router-dom";
import { storage } from "../lib/appwrite"; // Adjust import path
import Config from "../lib/Config"; // Adjust import path
import { Bookmark, BookmarkCheck, UserCircle, Share, Trash2, Edit2, } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-hot-toast"; // Import toast notification
import LikeButton from "./LikeButton";
import ShareButton from "./ShareButton";

const BlogCard = ({ blog, showActions = false }) => {  // Accept showActions prop form UserProfile component
  const { userProfile, saveBlog, unsaveBlog, deleteBlog } = useAuth();
  const isSaved = userProfile?.savedBlogs?.includes(blog.$id);
  const navigate = useNavigate();
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

 // Edit Blog function
 const handleEditBlog= async(blog)=>{
  // e.stopPropagation(); 
  navigate("/createblog", {state:{blog}});
}
  return (
    <div className="w-[350px] h-[500px] flex flex-col bg-white rounded-xl shadow-lg overflow-hidden transition-transform hover:scale-[1.02] hover:shadow-xl border border-gray-100 group">
      {/* Blog Thumbnail */}
      <Link to={`/blog/${blog.$id}`} className="relative h-48 overflow-hidden block">
        <img
          src={blog.thumbnail ? storage.getFileView(Config.appwriteBucketId, blog.thumbnail) : "/default-thumbnail.jpg"}
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
        <div className="mt-auto relative">
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
      <div className="flex items-center justify-between px-5 py-3 border-t bg-gray-50">
  {/* Like Button */}
  <LikeButton blog={blog} />

  {/* Save Button */}
  <button
    onClick={handleSave}
    className={`p-2 rounded-full transition-all ${
      isSaved ? "text-blue-600" : "text-gray-600 hover:text-blue-600"
    }`}
  >
    {isSaved ? <BookmarkCheck size={20} /> : <Bookmark size={20} />}
  </button>

  {/* Share Button */}
  <div className="flex items-center">
    <ShareButton />
  </div>
</div>

      {showActions && (
        <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <button
            onClick={() => handleEditBlog(blog)}
            className="p-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            <Edit2 className="w-4 h-4" />
          </button>
          <button
            onClick={() => deleteBlog(blog.$id , blog.userId, blog.thumbnail)}
            className="p-2 bg-red-500 text-white rounded-md hover:bg-red-600"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};

export default BlogCard;
