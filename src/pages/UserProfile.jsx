import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { Camera, Edit2, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import { databases, storage } from "../lib/appwrite";
import { ID } from "appwrite";
import Config from "../lib/Config";
import { toast } from "react-hot-toast";
import BlogCard from "../components/BlogCard";
export default function UserProfile() {
  const { userProfile, setUserProfile } = useAuth();
  console.log(userProfile, "userProfile in Profile page");
  const [isEditing, setIsEditing] = useState(false);
  const [userBlogs, setUserBlogs] = useState([]); //  store all user's blog inside this state
  const [coverImage, setCoverImage] = useState("");
  const [profileImage, setProfileImage] = useState("");

  // update user cover image
  const handleCoverImageChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      // Step 1: Convert image to preview (Optional)
      const reader = new FileReader();
      reader.onloadend = () => {
        setCoverImage(reader.result);
      };
      reader.readAsDataURL(file);

      // Step 2: Delete old cover image if it exists
      if (userProfile?.coverId) {
        try {
          await storage.deleteFile(
            Config.appwriteBucketId,
            userProfile.coverId
          );
          console.log("✅ Old cover image deleted successfully");
        } catch (error) {
          console.warn("⚠️ Error deleting old cover image:", error.message);
        }
      }

      // Step 3: Upload new cover image to Appwrite Storage
      const uploadedFile = await storage.createFile(
        Config.appwriteBucketId, // Bucket ID
        ID.unique(), // Unique File ID
        file
      );
      // 🔹 Update state with new profile data
      setUserProfile(updatedProfile);
      // Step 4: Store the uploaded cover image ID in the database
      await databases.updateDocument(
        Config.appwriteDatabaseId, // Database ID
        Config.appwriteCollectionIdUsers, // Users Collection ID
        userProfile.$id, // User ID
        { coverId: uploadedFile.$id } // Store only the image ID
      );

      toast.success("✅ Cover image updated successfully!");
    } catch (error) {
      console.error("❌ Error updating cover image:", error.message);
      toast.error("Failed to update cover image!");
    }
  };

  // Update user profile image
  const handleProfileImageChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      // Step 1: Convert image to preview (Optional)
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result);
      };
      reader.readAsDataURL(file);

      // Step 2: Delete old profile image if it exists
      if (userProfile?.profileId) {
        try {
          // const oldImageId = userProfile.profileId.split("/").pop(); // Extract file ID
          await storage.deleteFile(
            Config.appwriteBucketId,
            userProfile?.profileId
          );
          console.log("✅ Old profile image deleted successfully");
        } catch (error) {
          console.warn("⚠️ Error deleting old profile image:", error.message);
        }
      }

      // Step 3: Upload new image to Appwrite Storage
      const uploadedFile = await storage.createFile(
        Config.appwriteBucketId, // Bucket ID
        ID.unique(), // Unique File ID
        file
      );

      // Step 4: Store the uploaded image ID in the database (not preview URL)
      const updatedProfile = await databases.updateDocument(
        Config.appwriteDatabaseId, // Database ID
        Config.appwriteCollectionIdUsers, // Users Collection ID
        userProfile.$id, // User ID
        { profileId: uploadedFile.$id } // Store only the image ID
      );
      // 🔹 Update state with new profile data
      setUserProfile(updatedProfile);

      toast.success("✅ Profile image updated successfully!");
    } catch (error) {
      console.error("❌ Error updating profile image:", error.message);
      toast.error("Failed to update profile image!");
    }
  };

  const handleDeleteBlog = (blogId) => {
    console.log("Deleting blog:", blogId);
  };

  // fetch user"s all Blogs
  useEffect(() => {
    const fetchUserBlogs = async () => {
      if (!userProfile?.blogsId || userProfile.blogsId.length === 0) {
        console.log("No blogs found for this user.");
        return;
      }
      try {
        // Fetch all blogs using the stored blog IDs
        const blogPromises = userProfile.blogsId.map((blogId) =>
          databases.getDocument(
            Config.appwriteDatabaseId,
            Config.appwriteCollectionIdBlogs,
            blogId
          )
        );

        const blogs = await Promise.all(blogPromises);
        setUserBlogs(blogs);
      } catch (error) {
        console.error("Error fetching user blogs:", error);
      }
    };

    fetchUserBlogs();
  }, [userProfile]);
  console.log(userBlogs, "all user's blogs");

  return (
    <div className="min-h-screen bg-gray-50">
      {userProfile ? (
        <>
          {/* Cover Image */}
          <div className="relative h-64">
            <img
              src={
                coverImage ||
                (userProfile?.coverId
                  ? storage.getFilePreview(
                      Config.appwriteBucketId,
                      userProfile.coverId
                    )
                  : "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=2000") // Fallback cover image
              }
              alt="Cover"
              className="w-full h-full object-cover"
            />
            <label className="absolute bottom-4 right-4 bg-white p-2 rounded-full shadow-lg cursor-pointer hover:bg-gray-100">
              <Camera className="w-5 h-5 text-gray-600" />
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleCoverImageChange}
              />
            </label>
          </div>

          {/* Profile Section */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16">
            <div className="relative">
              <div className="relative z-10">
                <div className="bg-white p-6 rounded-lg shadow-lg">
                  <div className="sm:flex sm:items-center sm:justify-between">
                    <div className="sm:flex sm:space-x-5">
                      <div className="relative flex-shrink-0">
                        <img
                          className="mx-auto h-20 w-20 rounded-full object-cover"
                          src={
                            profileImage ||
                            (userProfile?.profileId
                              ? storage.getFilePreview(
                                  Config.appwriteBucketId,
                                  userProfile.profileId
                                )
                              : `https://api.dicebear.com/9.x/initials/svg?seed=${userProfile?.firstName} ${userProfile?.lastName}`) // Default image
                          }
                          alt={userProfile?.firstName || "User"}
                        />
                        <label className="absolute bottom-0 right-0 bg-white p-1 rounded-full shadow-lg cursor-pointer hover:bg-gray-100">
                          <Camera className="w-4 h-4 text-gray-600" />
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={handleProfileImageChange}
                          />
                        </label>
                      </div>
                      <div className="mt-4 text-center sm:mt-0 sm:pt-1 sm:text-left">
                        <p className="text-xl font-bold text-gray-900 sm:text-2xl">
                          {`${userProfile?.firstName || "User"} ${
                            userProfile?.lastName || "name"
                          }`}
                        </p>
                        <p className="text-sm font-medium text-gray-600">
                          {userProfile?.email}
                        </p>
                      </div>
                    </div>
                    <div className="mt-5 flex justify-center sm:mt-0">
                      <button
                        onClick={() => setIsEditing(true)}
                        className="flex items-center justify-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                      >
                        <Edit2 className="w-4 h-4 mr-2" />
                        Edit Profile
                      </button>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="mt-6 grid grid-cols-2 gap-5 sm:grid-cols-3">
                    {/* Total Posts */}
                    <div className="bg-gray-50 px-4 py-5 shadow-sm rounded-lg overflow-hidden sm:p-6">
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        Total Posts
                      </dt>
                      <dd className="mt-1 text-3xl font-semibold text-gray-900">
                        {userProfile?.blogsId?.length || 0}
                      </dd>
                    </div>

                    {/* Total Views */}
                    <div className="bg-gray-50 px-4 py-5 shadow-sm rounded-lg overflow-hidden sm:p-6">
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        Total Views
                      </dt>
                      <dd className="mt-1 text-3xl font-semibold text-gray-900">
                        {userBlogs?.length > 0
                          ? userBlogs.reduce(
                              (acc, blog) => acc + (blog.views || 0),
                              0
                            )
                          : 0}
                      </dd>
                    </div>

                    {/* Member Since */}
                    <div className="bg-gray-50 px-4 py-5 shadow-sm rounded-lg overflow-hidden sm:p-6">
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        Member Since
                      </dt>
                      <dd className="mt-1 text-3xl font-semibold text-gray-900">
                        {userProfile?.$createdAt
                          ? new Date(
                              userProfile.$createdAt
                            ).toLocaleDateString()
                          : "N/A"}
                      </dd>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* User's Blogs Section */}
            <div className="mt-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Your Blog Posts
              </h2>

              {userBlogs?.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {userBlogs.map((blog) => (
                  <BlogCard key={blog.$id} blog={blog} />
                ))}
              </div>
              ) : (
                <p className="text-gray-600 text-center ">
                  <span>No blogs found. Start writing your first blog!</span>
                  <div className="flex justify-center items-center ">
                    <div className="bg-white p-8 rounded-lg shadow-md">
                      <div className="text-center mb-4">
                        <h2 className="text-2xl font-bold text-gray-900">
                          No Blogs Found
                        </h2>
                        <p className="text-gray-600">
                          You don't have any blogs yet. Create one{" "}
                          <Link
                            to="/createblog"
                            className="text-blue-600 hover:text-blue-700"
                          >
                            Create Blog
                          </Link>
                        </p>
                      </div>
                    </div>
                  </div>
                </p>
              )}
            </div>
          </div>
        </>
      ) : (
        <div className="flex justify-center items-center h-screen">
          <div className="bg-white p-8 rounded-lg shadow-md text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Not Found Profile
            </h2>
            <p className="text-gray-600"></p>
          </div>
        </div>
      )}
    </div>
  );
}
