import { useState, useRef, useEffect } from "react";
import { FaFacebook, FaXTwitter, FaLinkedin, FaWhatsapp, FaCopy } from "react-icons/fa6";
import { Share } from "lucide-react";

const ShareButton = () => {
  const [showOptions, setShowOptions] = useState(false);
  const dropdownRef = useRef(null);

  const blogUrl = encodeURIComponent(window.location.href);
  const blogTitle = encodeURIComponent("Check out this amazing blog!");

  const socialMediaLinks = {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${blogUrl}`,
    twitter: `https://twitter.com/intent/tweet?text=${blogTitle}&url=${blogUrl}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${blogUrl}`,
    whatsapp: `https://api.whatsapp.com/send?text=${blogTitle} - ${blogUrl}`,
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(window.location.href)
      .then(() => alert("Blog link copied to clipboard!"))
      .catch(err => console.error("Failed to copy:", err));
  };

  // Handle click outside the dropdown to close it
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowOptions(false);
      }
    };

    if (showOptions) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showOptions]);

  return (
    <div className="relative mt-6 inline-block" ref={dropdownRef}>
      {/* Share Button */}
      <button
        onClick={() => setShowOptions(!showOptions)}
        className=" text-gray-700 px-4 py-2  rounded flex items-center gap-2"
      >
        <Share /> Share
      </button>

      {/* Share Options (Dropdown) */}
      {showOptions && (
        <div className="absolute -top-56 -right-4 mt-2 bg-gray-500 text-white shadow-lg rounded-lg p-3 space-y-2 w-34 border z-10">
          {/* Downward Arrow */}
          <div className="absolute -bottom-5 left-1/2 transform -translate-x-1/2">
            <svg width="50" height="25" viewBox="0 0 50 25">
              <polygon points="0,0 50,0 25,25" fill="rgb(107, 114, 128)" />
            </svg>
          </div>

          {/* Social Media Links */}
          <a href={socialMediaLinks.whatsapp} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 p-1 hover:bg-gray-700 rounded">
            <FaWhatsapp className="text-green-500" /> WhatsApp
          </a>
          <a href={socialMediaLinks.facebook} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 p-1 hover:bg-gray-700 rounded">
            <FaFacebook className="text-blue-600" /> Facebook
          </a>
          <a href={socialMediaLinks.twitter} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 p-1 hover:bg-gray-700 rounded">
            <FaXTwitter className="text-black" /> X (Twitter)
          </a>
          <a href={socialMediaLinks.linkedin} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 p-1 hover:bg-gray-700 rounded">
            <FaLinkedin className="text-blue-500" /> LinkedIn
          </a>
          <button onClick={copyToClipboard} className="flex items-center gap-2 p-2 hover:bg-gray-700 rounded w-full text-left">
            <FaCopy className="text-gray-300" /> Copy Link
          </button>
        </div>
      )}
    </div>
  );
};

export default ShareButton;
