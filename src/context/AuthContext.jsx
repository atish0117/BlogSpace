import { createContext, useContext, useEffect, useState } from 'react';
import { account, databases } from '../lib/appwrite';
import { Query, ID } from 'appwrite';
import Config from '../lib/Config';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userProfile, setUserProfile] = useState(null);
  const [blogs, setBlogs] = useState([]);
  const [allBlogs, setAllBlogs] = useState([]);
  const [allUsers, setAllUsers] = useState([]); // Store all users

  useEffect(() => {
    checkUser();
    fetchAllUsers();
    fetchAllBlogs();
  }, []);

  // ✅ Fetch the logged-in user profile and their blogs
  useEffect(() => {
    const fetchUserData = async () => {
      const storedEmail = localStorage.getItem('BlogToken');
      if (!storedEmail) {
        setLoading(false);
        return;
      }

      try {
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
        }
      } catch (error) {
        console.error('Error fetching user data:', error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  //  Fetch all blogs from the database
  const fetchAllBlogs = async () => {
    try {
      const response = await databases.listDocuments(
        Config.appwriteDatabaseId,
        Config.appwriteCollectionIdBlogs
      );
      setAllBlogs(response.documents);
    } catch (error) {
      console.error('Error fetching all blogs:', error.message);
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

  // Delete a blog from the database
  const deleteBlog = async (blogId) => {
    try {
      await databases.deleteDocument(
        Config.appwriteDatabaseId,
        Config.appwriteCollectionIdBlogs,
        blogId
      );

      // Remove blog from state
      setAllBlogs((prevBlogs) => prevBlogs.filter((blog) => blog.$id !== blogId));

      console.log(`Blog ${blogId} deleted successfully.`);
    } catch (error) {
      console.error('Error deleting blog:', error.message);
    }
  };



  // ✅ Check if user is logged in
  async function checkUser() {
    try {
      const currentUser = await account.get();
      setUser(currentUser);
    } catch (error) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }

  // ✅ User login
  async function login(email, password) {
    try {
      const session = await account.createEmailSession(email, password);
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

  // ✅ User signup
  async function signup(email, password, name) {
    try {
      await account.create(ID.unique(), email, password, name);
      await login(email, password);
    } catch (error) {
      console.error('Signup error:', error.message);
    }
  }

  // ✅ User logout
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
        blogs,
        allBlogs,
        allUsers,
        user,
        loading,
        login,
        signup,
        logout,
        fetchAllBlogs,
        fetchAllUsers,
        editUser,
        deleteUser,
        deleteBlog,
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
