import React, { useState, useEffect } from "react";
import { Editor } from "@tinymce/tinymce-react";
// import { Editor } from "react-tinymce";
import { toast } from "react-hot-toast";
import { useNavigate, useLocation } from "react-router-dom";
import { databases, storage } from "../lib/appwrite";
import { Upload, Tag, Save } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import Config from "../lib/Config";
import { ID } from "appwrite";

const CreateBlog = () => {
  const navigate = useNavigate();
  const location = useLocation(); // Get blog data if editing
  const { userProfile, fetchAllBlogs } = useAuth();

  // Check if editing an existing blog
  const existingBlog = location.state?.blog || null;
  
  const [blogs, setBlogs] = useState({
    title: existingBlog?.title || "",
    categories: existingBlog?.category || [],
    content: existingBlog?.description || "hello",
  });
  
  const [thumbnail, setThumbnail] = useState(null);
  const [thumbnailPreview, setThumbnailPreview] = useState(existingBlog ? storage.getFilePreview(Config.appwriteBucketId, existingBlog.thumbnail) : "");
  const [loading, setLoading] = useState(false);
  const [text, setText] = useState("");
  const categories = [
    "Development", "Web Development", "Mobile Apps", "AI & Machine Learning", "Cybersecurity",
    "DevOps & Cloud Computing", "Programming & Coding", "Entrepreneurship & Startups", "Investing & Stock Market",
    "Personal Finance & Budgeting", "Marketing & SEO", "E-commerce & Dropshipping", "Freelancing & Remote Work",
    "Health & Fitness", "Mental Wellness & Self-Care", "Travel & Adventure", "Food & Cooking", "Fashion & Beauty",
    "Home & Living", "Job Search & Career Growth", "Productivity & Time Management", "Study & Learning Hacks",
    "Leadership & Management", "Movies & TV Shows", "Music & Podcasts", "Gaming & Esports", "Books & Literature",
    "Pop Culture & Celebrities", "Space & Astronomy", "Environment & Sustainability", "Physics & Chemistry",
    "Biotechnology & Medicine", "Self-Improvement & Motivation", "Social Issues & Culture", "Psychology & Philosophy",
    "Inspirational Stories", "technology","books","art & design","self-improvement","health & wellness",
    "business", "movies","travel","writing","photography","Music", "Food", "Programming", "Design", "Other"
  ];

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

  // Handle Category Selection (Max 5)
  const handleCategoryChange = (category) => {
    setBlogs((prev) => {
      if (prev.categories.includes(category)) {
        return { ...prev, categories: prev.categories.filter((c) => c !== category) };
      } else if (prev.categories.length >= 5) {
        toast.error("You can select up to 5 categories only!");
        return prev;
      }
      return { ...prev, categories: [...prev.categories, category] };
    });
  };

  // Upload Image to Appwrite
  const uploadImage = async () => {
    if (!thumbnail) return existingBlog?.thumbnail || null; // Keep existing image if no new one is selected

    try {
      const uploadedFile = await storage.createFile(Config.appwriteBucketId, ID.unique(), thumbnail);
      return uploadedFile.$id;
    } catch (error) {
      console.error("Error uploading image:", error.message);
      toast.error("Image upload failed!");
      return null;
    }
  };

  // Handle Blog Submit (Create or Update)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const imageId = await uploadImage();
      if (!imageId) return;

      if (existingBlog) {
        // Update Existing Blog
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
            authorImage:userProfile?.profileId
                }
        );

        if (!newBlog) {
          toast.error("Failed to create blog post.");
          return;
        }
        const blogId = newBlog.$id;

        // **Update User Profile's Blogs ID Immediately**
        const updatedBlogsId = [...(userProfile.blogsId || []), blogId];
    
        await databases.updateDocument(
          Config.appwriteDatabaseId,
          Config.appwriteCollectionIdUsers,
          userProfile.$id,
          { blogsId: updatedBlogsId }
        );
        toast.success("Blog created successfully!");
      }

      fetchAllBlogs();
      navigate("/profile");

    } catch (error) {
      console.error("Error creating/updating blog:", error.message);
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
          <div>
            <label className="block text-sm font-medium text-gray-700">Select Categories (Max-5)</label>
            <div className="mt-2 flex flex-wrap gap-2">
              {categories.map((category) => (
                <button key={category} type="button" onClick={() => handleCategoryChange(category)}
                  className={`px-3 py-1.5 rounded-full flex text-sm font-medium ${blogs.categories.includes(category) ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-800 hover:bg-gray-300"}`}>
                  <Tag className="w-4 h-4 mr-1" />
                  {category}
                </button>
              ))}
            </div>
          </div>

          {/* Content Editor */}
          <Editor
              apiKey='ygmdwso517ny0ivhbysns5hpejzy18c1pcb0vrr7wh9tqhdi'
              onEditorChange={(newValue, editor) => {
                setBlogs({ ...blogs, content: newValue });
                setText(editor.getContent({ format: "text" }));
              }}
            
              initialValue={blogs?.content && typeof blogs.content === "string" ? blogs.content.trim() : "Write your blog here..."}
              init={{
                height: 300,
                plugins: [
                  // Core editing features
                  'anchor', 'autolink', 'charmap', 'codesample', 'emoticons', 'image', 'link', 'lists', 'media', 'searchreplace', 'table', 'visualblocks', 'wordcount',
                  // Your account includes a free trial of TinyMCE premium features
                  // Try the most popular premium features until Nov 27, 2024:
                  'checklist', 'mediaembed', 'casechange', 'export', 'formatpainter', 'pageembed', 'a11ychecker', 'tinymcespellchecker', 'permanentpen', 'powerpaste', 'advtable', 'advcode', 'editimage', 'advtemplate', 'ai', 'mentions', 'tinycomments', 'tableofcontents', 'footnotes', 'mergetags', 'autocorrect', 'typography', 'inlinecss', 'markdown',
                  // Early access to document converters
                  'importword', 'exportword', 'exportpdf'
                ],
                toolbar: 'undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | alignleft aligncenter alignright alignjustify | link image media table mergetags | addcomment showcomments | spellcheckdialog a11ycheck typography | align lineheight | checklist numlist bullist indent outdent | emoticons charmap | removeformat',
                tinycomments_mode: 'embedded',
                tinycomments_author: 'Author name',
                mergetags_list: [
                  { value: 'First.Name', title: 'First Name' },
                  { value: 'Email', title: 'Email' },
                ],

                ai_request: (request, respondWith) => respondWith.string(() => Promise.reject('See docs to implement AI Assistant')),
                exportpdf_converter_options: { 'format': 'Letter', 'margin_top': '1in', 'margin_right': '1in', 'margin_bottom': '1in', 'margin_left': '1in' },
                exportword_converter_options: { 'document': { 'size': 'Letter' } },
                importword_converter_options: { 'formatting': { 'styles': 'inline', 'resets': 'inline', 'defaults': 'inline', } },
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
