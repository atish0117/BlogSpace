import { createContext, useContext, useEffect, useState } from 'react';
import { account, databases,storage } from '../lib/appwrite';
import { Query, ID } from 'appwrite';
import Config from '../lib/Config';
import {toast} from 'react-hot-toast';
const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [userProfile, setUserProfile] = useState(null);
  const [blogs, setBlogs] = useState([]);
  const [allBlogs, setAllBlogs] = useState([]);
  const [allUsers, setAllUsers] = useState([]); // Store all users
  const [publishedBlog, setPublishedBlog] = useState([]); // Store all published blogs
  
  useEffect(() => {
    checkUser();
    fetchAllUsers();
    fetchAllBlogs();
    fetchPublishedBlogs();
  }, []);

  // Fetch the logged-in user profile and their blogs
  useEffect(() => {
    const fetchUserData = async () => {
      const storedEmail = localStorage.getItem('BlogToken');
      if (!storedEmail) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        const userResponse = await databases.listDocuments(
          Config.appwriteDatabaseId,
          Config.appwriteCollectionIdUsers,
          [Query.equal('email', storedEmail)]
        );

        if (userResponse.documents.length > 0) {
          const user = userResponse.documents[0];
          setUserProfile(user);

          const blogResponse = await databases.listDocuments(
            Config.appwriteDatabaseId,
            Config.appwriteCollectionIdBlogs,
            [Query.equal('userId', user.$id)]
          );

          setBlogs(blogResponse.documents);
        setIsLoading(false); // Stop loader after slight delay
        }
      } catch (error) {
        console.error('Error fetching user data:', error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, []);

  //  Fetch all blogs from the database
  const fetchAllBlogs = async () => {
    try {
      setIsLoading(true); 
      const response = await databases.listDocuments(
        Config.appwriteDatabaseId,
        Config.appwriteCollectionIdBlogs
      );
        setAllBlogs(response.documents);
        setIsLoading(false); // Stop loader after slight delay
    } catch (error) {
      console.error('Error fetching all blogs:', error.message);
      setIsLoading(false); 
    }
  };
        // fetch only Published blog
  const fetchPublishedBlogs = async () => {
  try {
    setIsLoading(true);
    const response = await databases.listDocuments(
      Config.appwriteDatabaseId,
      Config.appwriteCollectionIdBlogs,
      [
        Query.equal("status", "Published")  // 👈 only published
      ]
    );
    setPublishedBlog(response.documents);
    setIsLoading(false);
  } catch (error) {
    console.error("Error fetching published blogs:", error.message);
    setIsLoading(false);
  }
};



  //  Fetch all users from the database
  const fetchAllUsers = async () => {
    try {
      const response = await databases.listDocuments(
        Config.appwriteDatabaseId,
        Config.appwriteCollectionIdUsers
      );
      setAllUsers(response.documents);
    } catch (error) {
      console.error('Error fetching all users:', error.message);
    }
  };

      // Edit User Details
const editUser = async (userId, updatedData) => {
  try {
    const response = await databases.updateDocument(
      Config.appwriteDatabaseId,
      Config.appwriteCollectionIdUsers,
      userId,
      updatedData
    );

    // Update the user list state with the edited user
    setAllUsers((prevUsers) =>
      prevUsers.map((user) => (user.$id === userId ? response : user))
    );

    toast.success("User details updated successfully!");
  } catch (error) {
    console.error("Error updating user:", error.message);
    toast.error("Failed to update user!");
  }
};

  //  Delete a user from the database
  const deleteUser = async (userId) => {
    try {
      await databases.deleteDocument(
        Config.appwriteDatabaseId,
        Config.appwriteCollectionIdUsers,
        userId
      );

      // Remove user from state
      setAllUsers((prevUsers) => prevUsers.filter((user) => user.$id !== userId));

      console.log(`User ${userId} deleted successfully.`);
    } catch (error) {
      console.error('Error deleting user:', error.message);
    }
  };


  const deleteBlog = async (blogId, userId, blogThumbnailId) => {
    const isConfirmed = window.confirm("Are you sure you want to delete this blog?");
    if (!isConfirmed) return;
  
    try {
      // Step 1: Fetch user data
      const userResponse = await databases.getDocument(
        Config.appwriteDatabaseId,
        Config.appwriteCollectionIdUsers,
        userId
      );
  
      if (!userResponse) {
        console.error("User not found!");
        return;
      }
  
      // Step 2: Remove blogId from user's blogsId array
      const updatedBlogs = userResponse.blogsId?.filter((id) => id !== blogId);
  
      await databases.updateDocument(
        Config.appwriteDatabaseId,
        Config.appwriteCollectionIdUsers,
        userId,
        { blogsId: updatedBlogs }
      );
      console.log(`Removed blog ${blogId} from user ${userId}`);
  
      // Step 3: Remove blogId from all users who liked or saved it
      const allUsers = await databases.listDocuments(
        Config.appwriteDatabaseId,
        Config.appwriteCollectionIdUsers
      );
  
      const updateUserPromises = allUsers.documents.map(async (user) => {
        const hasLiked = user.likedBlogs?.includes(blogId);
        const hasSaved = user.savedBlogs?.includes(blogId);
  
        if (hasLiked || hasSaved) {
          const updatedLikedBlogs = user.likedBlogs?.filter((id) => id !== blogId);
          const updatedSavedBlogs = user.savedBlogs?.filter((id) => id !== blogId);
  
          await databases.updateDocument(
            Config.appwriteDatabaseId,
            Config.appwriteCollectionIdUsers,
            user.$id,
            { likedBlogs: updatedLikedBlogs, savedBlogs: updatedSavedBlogs }
          );
  
          console.log(`Removed blog ${blogId} from user ${user.$id}'s liked & saved blogs`);
        }
      });
  
      await Promise.all(updateUserPromises);
  
      // Step 4: Delete the blog thumbnail (if exists)
      if (blogThumbnailId) {
        try {
          await storage.deleteFile(Config.appwriteBucketId, blogThumbnailId);
          console.log(`Deleted blog thumbnail: ${blogThumbnailId}`);
        } catch (error) {
          console.warn("Error deleting thumbnail, maybe it doesn't exist:", error.message);
        }
      }
  
      // Step 5: Delete the blog document
      await databases.deleteDocument(
        Config.appwriteDatabaseId,
        Config.appwriteCollectionIdBlogs,
        blogId
      );
      console.log(`Blog ${blogId} deleted successfully.`);
  
      // Step 6: Remove the deleted blog from UI state
      setAllBlogs((prevBlogs) => prevBlogs.filter((blog) => blog.$id !== blogId));
  
      toast.success("Blog deleted successfully!");
    } catch (error) {
      console.error("Error deleting blog:", error.message);
      toast.error("Failed to delete blog.");
    }
  };
  
  //  save and unsave blog

  const saveBlog = async (blogId) => {
    if (!userProfile) return;
  
    try {
      const updatedSavedBlogs = [...(userProfile.savedBlogs || []), blogId];
  
      await databases.updateDocument(
        Config.appwriteDatabaseId,
        Config.appwriteCollectionIdUsers,
        userProfile.$id,
        { savedBlogs: updatedSavedBlogs }
      );
  
      setUserProfile((prev) => ({ ...prev, savedBlogs: updatedSavedBlogs }));
  
      console.log(`Blog ${blogId} saved successfully.`);
    } catch (error) {
      console.error(" Error saving blog:", error.message);
    }
  };
  
  const unsaveBlog = async (blogId) => {
    if (!userProfile) return;
  
    try {
      const updatedSavedBlogs = userProfile.savedBlogs.filter((id) => id !== blogId);
  
      await databases.updateDocument(
        Config.appwriteDatabaseId,
        Config.appwriteCollectionIdUsers,
        userProfile.$id,
        { savedBlogs: updatedSavedBlogs }
      );
  
      setUserProfile((prev) => ({ ...prev, savedBlogs: updatedSavedBlogs }));
  
      console.log(`Blog ${blogId} unsaved successfully.`);
    } catch (error) {
      console.error("Error unsaving blog:", error.message);
    }
  };
  

  //  Like/Unlike a blog
  const toggleLike = async (blogId) => {
    try {
      if (!userProfile) {
        toast.error("You must be logged in to like a blog!");
        return;
      }
  
      const isLiked = userProfile?.likedBlogs?.includes(blogId);
  
      // Optimistic UI update for instant feedback
      setUserProfile((prev) => ({
        ...prev,
        likedBlogs: isLiked
          ? prev.likedBlogs.filter((id) => id !== blogId) // Remove like
          : [...(prev.likedBlogs || []), blogId], // Add like
      }));
  
      // **Step 1: Update user's likedBlogs field**
      const updatedUserLikes = isLiked
        ? userProfile.likedBlogs.filter((id) => id !== blogId)
        : [...(userProfile.likedBlogs || []), blogId];
  
      await databases.updateDocument(
        Config.appwriteDatabaseId,
        Config.appwriteCollectionIdUsers,
        userProfile.$id,
        { likedBlogs: updatedUserLikes }
      );
  
      // **Step 2: Fetch the latest blog data**
      const blogResponse = await databases.getDocument(
        Config.appwriteDatabaseId,
        Config.appwriteCollectionIdBlogs,
        blogId
      );
  
      const updatedLikes = isLiked
        ? blogResponse.likes.filter((id) => id !== userProfile.$id)
        : [...(blogResponse.likes || []), userProfile.$id];
  
      // **Step 3: Update likes in the blog document**
      await databases.updateDocument(
        Config.appwriteDatabaseId,
        Config.appwriteCollectionIdBlogs,
        blogId,
        { likes: updatedLikes }
      );
  
      toast.success(isLiked ? "Unliked the blog!" : "Liked the blog!");
    } catch (error) {
      console.error("Error toggling like:", error.message);
      toast.error("Failed to update like.");
    }
  };
  


  //  Check if user is logged in
 async function checkUser() {
  try {
    const currentUser = await account.get();
    setUser(currentUser);
  } catch (error) {
    // Only log this if you want, or just ignore 401
    if (error.code !== 401) {
      console.error("Error checking user:", error.message);
    }
    setUser(null); // ensure app doesn't crash
  } finally {
    setIsLoading(false); // stop loading state
  }
}


  //  User login
  async function login(email, password) {
    try {
      const session = await account.createEmailPasswordSession(email, password);
      localStorage.setItem('BlogToken', email);

      if (session) {
        await checkUser();

        const userResponse = await databases.listDocuments(
          Config.appwriteDatabaseId,
          Config.appwriteCollectionIdUsers,
          [Query.equal('email', email)]
        );

        if (userResponse.documents.length > 0) {
          const user = userResponse.documents[0];
          setUserProfile(user);
          return user;
        }
      }
    } catch (error) {
      console.error('Login error:', error.message);
      throw error;
    }
  }

  // User signup
  async function signup(email, password, name) {
    try {
      await account.create(ID.unique(), email, password, name);
      await login(email, password);
    } catch (error) {
      console.error('Signup error:', error.message);
    }
  }

  // User logout
  async function logout() {
    try {
      await account.deleteSession('current');
      localStorage.removeItem('BlogToken');
      setUser(null);
      setUserProfile(null);
    } catch (error) {
      console.error('Logout error:', error.message);
    }
  }
  return (
    <AuthContext.Provider
      value={{
        userProfile,
        setUserProfile,
        saveBlog, 
        unsaveBlog,
        toggleLike, // like and unlike
        blogs,
        allBlogs,
        allUsers,
        user,
        isLoading,
        login,
        signup,
        logout,
        fetchAllBlogs,
        fetchAllUsers,
        editUser,
        deleteUser,
        deleteBlog,
        publishedBlog, // published blog 
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
