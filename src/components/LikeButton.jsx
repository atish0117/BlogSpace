import { useState, useEffect } from "react";
import { Heart } from "lucide-react";
import { useAuth } from "../context/AuthContext";

const LikeButton = ({ blog }) => {
  const { userProfile, toggleLike } = useAuth();
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(blog.likes?.length || 0);

  // Set initial like state based on user's liked blogs
  useEffect(() => {
    if (userProfile?.likedBlogs?.includes(blog.$id)) {
      setIsLiked(true);
    } else {
      setIsLiked(false);
    }
  }, [userProfile?.likedBlogs, blog.$id]);

  const handleLikeClick = (e) => {
    e.stopPropagation();
    
    const newLikeState = !isLiked;
    setIsLiked(newLikeState);
    setLikeCount((prev) => (newLikeState ? prev + 1 : prev - 1));

    toggleLike(blog.$id);
  };

  return (
    <button
      onClick={handleLikeClick}
      className={`flex items-center gap-1 text-lg font-medium transition-all ${
        isLiked ? "text-red-600" : "text-gray-500 hover:text-red-600"
      }`}
    >
      {isLiked ? "❤️" : <Heart className="w-6 h-6" />} {/* Show filled heart on like */}
      <span>{likeCount}</span>
    </button>
  );
};

export default LikeButton;
