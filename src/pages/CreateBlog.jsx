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
  });

  const [thumbnail, setThumbnail] = useState(null);
  const [thumbnailPreview, setThumbnailPreview] = useState(
    existingBlog ? storage.getFileView(Config.appwriteBucketId, existingBlog.thumbnail) : ""
  );
  const [loading, setLoading] = useState(false);

  // const categories = [
  //   "Development", "Web Development", "Mobile Apps", "AI & Machine Learning", "Cybersecurity",
  //   "DevOps & Cloud Computing", "Programming & Coding", "Entrepreneurship & Startups", "Investing & Stock Market",
  //   "Personal Finance & Budgeting", "Marketing & SEO", "E-commerce & Dropshipping", "Freelancing & Remote Work",
  //   "Health & Fitness", "Mental Wellness & Self-Care", "Travel & Adventure", "Food & Cooking", "Fashion & Beauty",
  //   "Home & Living", "Job Search & Career Growth", "Productivity & Time Management", "Study & Learning Hacks",
  //   "Leadership & Management", "Movies & TV Shows", "Music & Podcasts", "Gaming & Esports", "Books & Literature",
  //   "Pop Culture & Celebrities", "Space & Astronomy", "Environment & Sustainability", "Physics & Chemistry",
  //   "Biotechnology & Medicine", "Self-Improvement & Motivation", "Social Issues & Culture", "Psychology & Philosophy",
  //   "Inspirational Stories", "technology","books","art & design","self-improvement","health & wellness",
  //   "business", "movies","travel","writing","photography","Music", "Food", "Programming", "Design", "Other"
  // ];

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

 // Handle Category Selection
// const handleCategoryChange = (category) => {
//   setBlogs((prev) => {
//     if (prev.categories.includes(category)) {
//       // Remove category if already selected
//       return {
//         ...prev,
//         categories: prev.categories.filter((c) => c !== category),
//       };
//     } else if (prev.categories.length >= 5) {
//       // Show error if user selects more than 5 categories
//       toast.error("You can select up to 5 categories only!");
//       return prev;
//     }

//     // Add category if less than 5 are selected
//     return {
//       ...prev,
//       categories: [...prev.categories, category],
//     };
//   });
// };

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
          }
        );
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
            authorName: `${userProfile.firstName} ${userProfile.lastName}`,
            userId: userProfile.$id,
            authorImage: userProfile?.profileId,
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


          {/* Submit Button */}
          <button type="submit" className="w-full bg-indigo-600 text-white font-medium py-2 px-4 rounded-md hover:bg-indigo-700">
            {loading ? "Saving..." : existingBlog ? "Update Blog" : "Create Blog"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateBlog;
