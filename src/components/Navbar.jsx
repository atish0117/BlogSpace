import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { UserCircle2, PenSquare, LogOut, Menu, X } from "lucide-react";

export default function Navbar() {
  const { userProfile, user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="bg-white shadow-md fixed w-full z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <img src="1472935.png" alt="Logo" className="h-10 w-auto" />
            <Link to="/" className="text-xl font-bold text-gray-800 ml-2">
              BlogSpace
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex space-x-6">
            <Link to="/" className="nav-link">Home</Link>
            <Link to="/blog" className="nav-link">Blog</Link>
            <Link to="/about" className="nav-link">About</Link>
          </div>

          {/* User Actions */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <>
                <Link to="/createblog" className="nav-link flex items-center">
                  <PenSquare className="w-5 h-5 mr-1" /> Create
                </Link>
                <Link to={userProfile?.role === "admin" ? "/admindashboard" : "/profile"}>
                  <UserCircle2 className="w-6 h-6 text-gray-800 hover:text-gray-500" />
                </Link>
                <button onClick={logout} className="nav-link flex items-center">
                  <LogOut className="w-5 h-5 mr-1" /> Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="nav-link">Login</Link>
                <Link to="/signup" className="btn-primary">Sign Up</Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 rounded focus:outline-none"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden absolute w-full bg-white shadow-lg flex flex-col items-center py-4 space-y-3">
          <Link to="/" className="nav-link" onClick={() => setMenuOpen(false)}>Home</Link>
          <Link to="/blog" className="nav-link" onClick={() => setMenuOpen(false)}>Blog</Link>
          <Link to="/about" className="nav-link" onClick={() => setMenuOpen(false)}>About</Link>
          {user ? (
            <>
              <Link to="/createblog" className="nav-link" onClick={() => setMenuOpen(false)}>Create Blog</Link>
              <Link to={userProfile?.role === "admin" ? "/admindashboard" : "/profile"} onClick={() => setMenuOpen(false)}>
                Profile
              </Link>
              <button onClick={logout} className="nav-link">Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className="nav-link" onClick={() => setMenuOpen(false)}>Login</Link>
              <Link to="/signup" className="btn-primary" onClick={() => setMenuOpen(false)}>Sign Up</Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
}
