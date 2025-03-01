import { Mail, Github, Linkedin } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">BlogSpace</h3>
            <p className="text-gray-400">
              Share your thoughts and ideas with the world through our modern
              blogging platform.
            </p>
          </div>
          <div>
            <h3 className="text-xl font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/about"
                  className="text-gray-400 hover:text-white transition"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  to="/blog"
                  className="text-gray-400 hover:text-white transition"
                >
                  Blog
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  className="text-gray-400 hover:text-white transition"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-xl font-bold mb-4">Contact Us</h3>
            <div className="space-y-4">
              <div className="flex items-center">
                <Mail className="w-5 h-5 mr-2" />
                <a
                  href="blogspace@gmail.com"
                  className="text-gray-400 hover:text-white transition"
                >
                  blogspace@gmail.com
                </a>
              </div>
              <div className="flex space-x-4">
                <a
                  href="https://github.com/atish0117"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white transition"
                >
                  <Github className="w-6 h-6" />
                </a>
                <a
                  href="www.linkedin.com/in/atish-kumar-6856a42ba"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white transition"
                >
                  <Linkedin className="w-6 h-6" />
                </a>
              </div>
            </div>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-8 pt-8 text-center">
          <p className="text-gray-400">
            © {new Date().getFullYear()} BlogSpace. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}