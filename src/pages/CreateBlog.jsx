import React, { useState } from "react";
import SunEditor from "suneditor-react";
import "suneditor/dist/css/suneditor.min.css";
import { toast } from "react-hot-toast";
import { useNavigate, useLocation } from "react-router-dom";
import { databases, storage } from "../lib/appwrite";
import { Upload, Tag } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import Config from "../lib/Config";
import { ID } from "appwrite";
import CategorySelector from "../components/CategorySelector"

const CreateBlog = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { userProfile, fetchAllBlogs } = useAuth();

  // Check if editing an existing blog
  const existingBlog = location.state?.blog || null;

  const [blogs, setBlogs] = useState({
    title: existingBlog?.title || "",
    categories: existingBlog?.category || [],
    content: existingBlog?.description || "",
     status: existingBlog?.status || "Draft", // new
  });

  const [thumbnail, setThumbnail] = useState(null);
  const [thumbnailPreview, setThumbnailPreview] = useState(
    existingBlog ? storage.getFileView(Config.appwriteBucketId, existingBlog.thumbnail) : ""
  );
  const [loading, setLoading] = useState(false);

 

  // Handle Thumbnail Change
  const handleThumbnailChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setThumbnail(file);
      const reader = new FileReader();
      reader.onloadend = () => setThumbnailPreview(reader.result);
      reader.readAsDataURL(file);
    }
  };


  // Upload Image
  const uploadImage = async () => {
    if (!thumbnail) return existingBlog?.thumbnail || null;
    try {
      const uploadedFile = await storage.createFile(Config.appwriteBucketId, ID.unique(), thumbnail);
      return uploadedFile.$id;
    } catch (error) {
      toast.error("Image upload failed!");
      return null;
    }
  };
console.log("existingBlog.thumbnail",existingBlog?.thumbnail)
  // Handle Submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const imageId = await uploadImage();
      if (!imageId) return;

      if (existingBlog) {
        // Update Blog
        await databases.updateDocument(
          Config.appwriteDatabaseId,
          Config.appwriteCollectionIdBlogs,
          existingBlog.$id,
          {
            title: blogs.title,
            category: blogs.categories,
            description: blogs.content,
            thumbnail: imageId,
            status: blogs.status, // 👈 new
          }
        );
        toast.success(blogs.status === "draft" ? "Draft saved!" : "Blog updated & published!");
        toast.success("Blog updated successfully!");
      } else {
        // Create New Blog
        const newBlog = await databases.createDocument(
          Config.appwriteDatabaseId,
          Config.appwriteCollectionIdBlogs,
          ID.unique(),
          {
            title: blogs.title,
            category: blogs.categories,
            description: blogs.content,
            thumbnail: imageId,
            authorName: `${userProfile?.firstName || ""} ${userProfile?.lastName || ""}`,
            userId: userProfile.$id,
            authorImage: userProfile?.profileId,
             status: blogs.status, // 👈 new
          }
        );

        if (!newBlog) {
          toast.error("Failed to create blog.");
          return;
        }

        // Update User Profile
        await databases.updateDocument(
          Config.appwriteDatabaseId,
          Config.appwriteCollectionIdUsers,
          userProfile.$id,
          { blogsId: [...(userProfile.blogsId || []), newBlog.$id] }
        );
        toast.success(blogs.status === "draft" ? "Draft saved!" : "Blog published!");
        toast.success("Blog created successfully!");
      }

      fetchAllBlogs();
      navigate("/profile");
    } catch (error) {
      toast.error("Failed to process blog!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex justify-center items-center py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl w-full bg-white shadow-lg rounded-lg p-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          {existingBlog ? "Edit Blog" : "Create Blog"}
        </h2>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Thumbnail Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Blog Thumbnail</label>
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg">
              <div className="space-y-1 text-center">
                {thumbnailPreview ? (
                  <img src={thumbnailPreview} alt="Thumbnail preview" className="mx-auto h-48 w-full object-cover rounded-lg" />
                ) : (
                  <Upload className="mx-auto h-12 w-12 text-gray-400" />
                )}
                <div className="flex text-sm text-gray-600">
                  <label htmlFor="thumbnail" className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500">
                    <span>Upload a file</span>
                    <input id="thumbnail" name="thumbnail" type="file" accept="image/*" className="sr-only" onChange={handleThumbnailChange} />
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Blog Title</label>
            <input
              type="text"
              placeholder="Enter blog title"
              value={blogs.title}
              onChange={(e) => setBlogs({ ...blogs, title: e.target.value })}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
                
          {/* Categories */}
          <CategorySelector
        selectedCategories={blogs.categories}
        setSelectedCategories={(categories) => setBlogs({ ...blogs, categories })}
      />


          

          {/* Content Editor (SunEditor) */}
          <label className="block text-sm font-medium text-gray-700">Blog Content</label>
          <SunEditor
  setContents={blogs.content}
  onChange={(content) => setBlogs({ ...blogs, content })}
  setOptions={{
    height: "500px", // Increases editor height
    defaultStyle: "font-size: 18px; padding: 10px;", // Increases text size & padding
    buttonList: [
      ["undo", "redo"],
      ["bold", "italic", "underline", "strike"],
      ["fontSize", "formatBlock", "align", "list"],
      ["image", "link", "video", "table"],
      ["fullScreen", "preview"]
    ],
  }}
/>
        <div>
  <label className="block text-sm font-medium mb-1">Status</label>
  <select
    value={blogs.status}
    onChange={(e) => setBlogs({ ...blogs, status: e.target.value })}
    className={`mt-1 text-xl font-extrabold block w-1/5 px-3 py-2 border border-green-300 rounded-md shadow-sm
      ${blogs.status === "Published" ? "bg-green-100 text-green-700 ring-green-400 border-green-300 focus:ring-green-500 focus:border-green-500"
        :"bg-red-100 text-red-700 ring-red-400 border-red-300 focus:ring-red-500 focus:border-red-500"
      }`}
  >
    <option value="Published"   className="bg-green-100 font-extrabold text-green-700">Published</option>
    <option value="Draft" className="bg-red-100 font-bold text-red-700">Save as Draft</option>
  </select>
</div>

          {/* Submit Button */}
          <button type="submit" disabled={loading} className={`w-full text-white font-medium py-2 px-4 rounded-md
              ${loading 
              ? 'bg-gray-400 cursor-not-allowed' 
              :blogs.status === 'Published' 
              ?'bg-green-600 hover:bg-green-700'
              :'bg-red-600 hover:bg-red-700'
              }`}>
            {loading 
            ? "Saving..." : existingBlog 
                          ? `Update Blog & ${blogs.status}`
                          : `Create Blog & ${blogs.status}`}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateBlog;
