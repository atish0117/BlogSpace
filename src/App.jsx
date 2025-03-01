import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Blog from './pages/Blog';
import About from './pages/About';
import CreateBlog from './pages/CreateBlog';
import UserProfile from './pages/UserProfile';
import SingleBlog from './pages/SingleBlog';
import Contact from './pages/Contact';
import AdminPanel from './pages/AdminPanel';
import ErrorPage from './pages/ErrorPage';
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';
function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen flex flex-col">
          <Navbar />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/blog" element={<Blog />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/blog/:id" element={<SingleBlog />} />
              <Route element={<ProtectedRoute />}>
                <Route path="/createblog" element={<CreateBlog />} />
                <Route path="/profile" element={<UserProfile />} />
                <Route element={<AdminRoute />}>
          <Route path="admindashboard" element={<AdminPanel />} />
        </Route>
              </Route>
              <Route path="*" element={<ErrorPage />} />
            </Routes>
          </main>
          <Footer />
        </div>
        <Toaster position="top-center" />
      </Router>
   </AuthProvider>
  );
}

export default App;