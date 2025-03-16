import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { UserCircle2, PenSquare, LogOut } from 'lucide-react';
export default function Navbar() {
  const { userProfile,user, logout } = useAuth();

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
          <img src="1472935.png" alt="Logo" className="h-10 w-auto" />
            <Link to="/" className="text-xl font-bold text-gray-800">
              BlogSpace
            </Link>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <Link
                to="/"
                className="text-gray-900 hover:text-gray-500 px-3 py-2 rounded-md text-sm font-medium"
              >
                Home
              </Link>
              <Link
                to="/blog"
                className="text-gray-900 hover:text-gray-500 px-3 py-2 rounded-md text-sm font-medium"
              >
                Blog
              </Link>
              <Link
                to="/about"
                className="text-gray-900 hover:text-gray-500 px-3 py-2 rounded-md text-sm font-medium"
              >
                About
              </Link>
            </div>
          </div>

          <div className="flex items-center">
            {user ? (
              <div className="flex items-center space-x-4">
                <Link
                  to="/createblog"
                  className="flex items-center text-gray-900 hover:text-gray-500 px-3 py-2 rounded-md text-sm font-medium"
                >
                  <PenSquare className="w-5 h-5 mr-1" />
                  Create Blog
                </Link>
                <Link
                   to={userProfile?.role === 'admin' ? '/admindashboard' : '/profile'}
                  className="text-gray-900 hover:text-gray-500"
                >
                  <UserCircle2 className="w-6 h-6" />
                </Link>
                <button
                  onClick={() => logout()}
                  className="flex items-center text-gray-900 hover:text-gray-500 px-3 py-2 rounded-md text-sm font-medium"
                >
                  <LogOut className="w-5 h-5 mr-1" />
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  to="/login"
                  className="text-gray-900 hover:text-gray-500 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="bg-blue-600 text-white hover:bg-blue-700 px-4 py-2 rounded-md text-sm font-medium"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}