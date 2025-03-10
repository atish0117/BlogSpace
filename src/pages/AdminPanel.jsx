import { useEffect, useState } from "react";
import { Trash2, Edit2, XCircle,Eye  } from "lucide-react";
import { toast } from "react-hot-toast";
import { useAuth } from "../context/AuthContext";
import { storage } from "../lib/appwrite";
import Config from "../lib/Config";
import { useNavigate ,Link} from "react-router-dom";

export default function AdminPanel() {
  const { userProfile, allUsers, allBlogs, fetchAllUsers, fetchAllBlogs, deleteUser, deleteBlog, editBlog, editUser } = useAuth();
  const navigate = useNavigate();
  const [selectedItem, setSelectedItem] = useState(null);
  const [editType, setEditType] = useState(""); // "blog" or "user"
  // const [editData, setEditData] = useState({});

  const [selectedUser, setSelectedUser] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editData, setEditData] = useState({ firstName: "", lastName: "", email: "", role: "" });

  // Fetch users & blogs on component mount
  useEffect(() => {
    fetchAllUsers();
    fetchAllBlogs();
  }, []);

// Open user Edit Modal
const openEditModal = (user) => {
  setSelectedUser(user);
  setEditData({
    firstName: user.firstName || "",
    lastName: user.lastName || "",
    email: user.email || "",
    role: user.role || "User",
  });
  setIsEditModalOpen(true);
};

// Handle Edit Input Change
const handleEditChange = (e) => {
  const { name, value } = e.target;
  setEditData((prev) => ({ ...prev, [name]: value }));
};

// Save Edited User
const handleSaveEdit = async () => {
  if (!selectedUser) return;
  await editUser(selectedUser.$id, editData);
  setIsEditModalOpen(false);
};


 // Edit Blog function
  const handleEditBlog= async(blog)=>{
      navigate("/createblog", {state:{blog}});
  }




  return (
    <div className="min-h-screen bg-gray-50 py-12 px-6">
      {/* Admin Card */}
      <div className="max-w-5xl mx-auto bg-white shadow-2xl rounded-2xl overflow-hidden transform transition-all duration-300 hover:shadow-3xl hover:-translate-y-2 relative">
      <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-blue-600 opacity-10"></div>
        <div className="relative z-10 p-8 flex items-center">
          {/* Profile Image */}
          <div className="relative flex items-center">
            <div className="relative group">
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-500 to-blue-600 p-1 animate-spin-slow"></div>
              <img
                src={userProfile?.profileId ? storage.getFilePreview(Config.appwriteBucketId, userProfile.profileId) 
                  : `https://api.dicebear.com/9.x/initials/svg?seed=${userProfile?.firstName}+${userProfile?.lastName}`}
                alt="Admin"
                className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-lg relative z-10 transform transition-all duration-300 group-hover:scale-110 group-hover:rotate-6"
              />
              <div className="absolute inset-0 rounded-full bg-purple-500 opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
            </div>

            {/* Admin Details */}
            <div className="ml-6 flex-1">
              <h2 className="text-3xl font-bold text-gray-800  bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                {userProfile?.firstName} {userProfile?.lastName}
              </h2>
              <p className="text-gray-600 text-sm mt-1 flex items-center">
              <svg className="w-4 h-4 mr-2 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
      </svg>
                {userProfile?.email}</p>
            </div>
          </div>

          {/* Stats Section */}
          <div className="ml-auto text-right space-y-3">
          <div className="flex items-center justify-end">
        <svg className="w-6 h-6 text-purple-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path>
        </svg> 
            <p className="text-gray-700 font-semibold text-lg">
              Total Users: <span className="text-purple-600">{allUsers?.length}</span>
            </p>
            </div>
            <div className="flex items-center justify-end">
        <svg className="w-6 h-6 text-blue-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"></path>
        </svg>
            <p className="text-gray-700 font-semibold text-lg">
              Total Blogs: <span className="text-blue-600">{allBlogs?.length}</span>
            </p>
            </div>
          </div>
        </div>
      <div className="absolute top-0 right-0 w-24 h-24 bg-purple-500 opacity-20 rounded-bl-2xl transform rotate-45 translate-x-12 -translate-y-12"></div>
      </div>

      

      {/* Users Table */}
      <div className="bg-white shadow-md rounded-lg p-6 mt-6">
        <h2 className="text-xl font-semibold mb-4">Users</h2>
        <table className="w-full border">
          <thead>
            <tr className="border-b bg-gray-100">
              <th className="py-2 px-4">Image</th>
              <th className="py-2 px-4">Name</th>
              <th className="py-2 px-4">Email</th>
              <th className="py-2 px-4">Role</th>
              <th className="py-2 px-4">Total Blogs</th>
              <th className="py-2 px-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {allUsers?.map((user) => (
              <tr key={user.$id} className="border-b text-center">
                <td className="py-2 px-4">
                  <img
                    src={user.profileId ? storage.getFilePreview(Config.appwriteBucketId, user.profileId) : "/default-avatar.png"}
                    alt={user.firstName}
                    className="w-12 h-12 rounded-full"
                  />
                </td>
                <td className="py-2 px-4">{user.firstName} {user.lastName}</td>
                <td className="py-2 px-4">{user.email}</td>
                <td className="py-2 px-4">{user.role || "User"}</td>
                <td className="py-2 px-4">{user.blogsId ? user.blogsId.length : 0}</td>
                <td className="py-2 px-4 flex justify-center space-x-6">
                  <button onClick={() => openEditModal(user, "user")} className="text-blue-600 hover:text-blue-800">
                    <Edit2 className="w-5 h-5" />
                  </button>
                  <button onClick={() => deleteUser(user.$id)} className="text-red-600 hover:text-red-800">
                    <Trash2 className="w-5 h-5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Blogs Table */}
      <div className="bg-white shadow-md rounded-lg p-6 mt-6">
        <h2 className="text-xl font-semibold mb-4">Blogs</h2>
        <table className="w-full border">
          <thead>
            <tr className="border-b bg-gray-100">
              <th className="py-2 px-4">Thumbnail</th>
              <th className="py-2 px-4">Title</th>
              <th className="py-2 px-4">Author</th>
              <th className="py-2 px-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {allBlogs?.map((blog) => (
              <tr key={blog.$id} className="border-b text-center">
                <td className="py-2 px-4">
                  <img
                    src={blog.thumbnail ? storage.getFilePreview(Config.appwriteBucketId, blog.thumbnail) : "/default-thumbnail.jpg"}
                    alt="Blog"
                    className="w-12 h-12 rounded-md"
                  />
                </td>
                <td className="py-2 px-4">{blog.title}</td>
                <td className="py-2 px-4">{blog.authorName}</td>
                <td className="py-2 px-4 flex justify-center space-x-10">
                <Link to={`/blog/${blog.$id}`} className="text-green-600 hover:text-green-800">
                    <Eye className="w-5 h-5" />
                  </Link>
                <button
                    onClick={() => handleEditBlog(blog)}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    <Edit2 className="w-5 h-5" />
                  </button>
                  <button onClick={() => deleteBlog(blog.$id , blog.userId)} className="text-red-600 hover:text-red-800">
                    <Trash2 className="w-5 h-5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

         {/* Edit User Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-xl font-bold mb-4">Edit User</h2>
            <label className="block mb-2">
              First Name
              <input
                type="text"
                name="firstName"
                value={editData.firstName}
                onChange={handleEditChange}
                className="w-full px-3 py-2 border rounded-md"
              />
            </label>
            <label className="block mb-2">
              Last Name
              <input
                type="text"
                name="lastName"
                value={editData.lastName}
                onChange={handleEditChange}
                className="w-full px-3 py-2 border rounded-md"
              />
            </label>
            <label className="block mb-2">
              Email
              <input
                type="email"
                name="email"
                value={editData.email}
                disabled
                className="w-full px-3 py-2 border rounded-md bg-gray-100"
              />
            </label>
            <label className="block mb-4">
              Role
              <select
                name="role"
                value={editData.role}
                onChange={handleEditChange}
                className="w-full px-3 py-2 border rounded-md"
              >
                <option value="User">User</option>
                <option value="Admin">Admin</option>
              </select>
            </label>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="px-4 py-2 bg-gray-500 text-white rounded-md"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveEdit}
                className="px-4 py-2 bg-blue-600 text-white rounded-md"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
