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
    <div className="relative inline-block" ref={dropdownRef}>
      {/* Share Button */}
      <button
        onClick={() => setShowOptions(!showOptions)}
        className=" text-gray-700  rounded flex items-center gap-2"
      >
        <Share /> Share
      </button>

      {/* Share Options (Dropdown) */}
      {showOptions && (
 <div
 className={`absolute -top-62 -right-4 mt-2 w-36 p-3 border border-white/20 
   bg-white/10 backdrop-blur-lg text-white shadow-xl rounded-lg 
   transition-all duration-300 ease-in-out origin-top 
   ${showOptions ? "opacity-100 scale-95" : "opacity-0 scale-80"}`}
>          {/* Downward Arrow */}
          <div className="absolute -bottom-5 left-1/2 transform -translate-x-1/2">
            <svg width="50" height="25" viewBox="0 0 50 25">
              <polygon points="0,0 50,0 25,25" fill="rgba(255, 255, 255, 0.2)" />
            </svg>
          </div>

          {/* Social Media Links */}
          <a href={socialMediaLinks.whatsapp} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 p-2 hover:bg-white/20 rounded">
            <FaWhatsapp className="text-green-500" /> WhatsApp
          </a>
          <a href={socialMediaLinks.facebook} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 p-2 hover:bg-white/20 rounded">
            <FaFacebook className="text-blue-600" /> Facebook
          </a>
          <a href={socialMediaLinks.twitter} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 p-2 hover:bg-white/20 rounded">
            <FaXTwitter className="text-black" /> X (Twitter)
          </a>
          <a href={socialMediaLinks.linkedin} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 p-2 hover:bg-white/20 rounded">
            <FaLinkedin className="text-blue-500" /> LinkedIn
          </a>
          <button onClick={copyToClipboard} className="flex items-center gap-2 p-2 hover:bg-white/20 rounded w-full text-left">
            <FaCopy className="text-gray-300" /> Copy Link
          </button>
        </div>
      )}
    </div>
  );
};

export default ShareButton;
