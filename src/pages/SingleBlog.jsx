import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Heart, MessageCircle, Share2, Bookmark } from "lucide-react";
import { databases, storage } from "../lib/appwrite";
import Config from "../lib/Config";
import { toast } from "react-hot-toast";
import { Query } from "appwrite";

export default function SingleBlog() {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);
  const [isLiked, setIsLiked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState([]);
  const [relatedPosts, setRelatedPosts] = useState([]);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const blogData = await databases.getDocument(
          Config.appwriteDatabaseId,
          Config.appwriteCollectionIdBlogs,
          id
        );
        setBlog(blogData);
        setComments(blogData.comments || []);

        // Fetch Related Blogs
        if (blogData.category.length > 0) {
          const relatedData = await databases.listDocuments(
            Config.appwriteDatabaseId,
            Config.appwriteCollectionIdBlogs,
            [Query.equal("category", blogData.category[0]), Query.limit(3)]
          );
          setRelatedPosts(relatedData.documents);
        }
      } catch (error) {
        console.error("Error fetching blog:", error.message);
        toast.error("Failed to load blog.");
      }
    };

    fetchBlog();
  }, [id]);

  // Handle Like Button
  const handleLike = () => {
    setIsLiked(!isLiked);
    toast.success(isLiked ? "Like removed" : "Liked!");
  };

  // Handle Save Button
  const handleSave = () => {
    setIsSaved(!isSaved);
    toast.success(isSaved ? "Removed from saved" : "Saved!");
  };

  // Handle Comment Submission
  const handleComment = (e) => {
    e.preventDefault();
    if (comment.trim() === "") return;

    const newComment = {
      id: comments.length + 1,
      author: "Anonymous",
      image: "/default-user.png",
      content: comment,
      date: "Just now",
    };

    setComments([...comments, newComment]);
    setComment("");
    toast.success("Comment added!");
  };

  if (!blog) {
    return <p className="text-center text-gray-500">Loading blog...</p>;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <header className="mb-8">
          <div className="flex items-center space-x-4 mb-4">
            <img
              src={blog.authorImage ||  `https://api.dicebear.com/9.x/initials/svg?seed=${blog.authorName}`}
              alt={blog.authorName}
              className="h-12 w-12 rounded-full"
            />
            <div>
              <h3 className="text-lg font-semibold text-gray-900">{blog.authorName}</h3>
              <div className="flex items-center space-x-2 text-sm text-gray-500">
                <span>{new Date(blog.$createdAt).toLocaleDateString()}</span>
                <span>•</span>
                <span>{blog.readTime || "5 min read"}</span>
              </div>
            </div>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">{blog.title}</h1>
          
          {/* Category Tags (Max 2 Categories) */}
          <div className="flex flex-wrap gap-2 mb-4">
  {blog.category?.length > 0 ? (
    blog.category.map((cat, index) => (
      <span
      key={index}
      className="px-3 py-1.5 bg-blue-100 text-blue-800 text-xs font-semibold rounded-full hover:bg-blue-200 transition-colors"
    >
      {cat}
    </span>
    ))
  ) : (
    <span className="px-3 py-1.5 bg-gray-200 text-gray-800 text-xs font-semibold rounded-full">
      Uncategorized
    </span>
  )}
</div>
        </header>

        <div className="mb-8">
          <img
            src={storage.getFilePreview(Config.appwriteBucketId, blog.thumbnail) || "/default-thumbnail.jpg"}
            alt={blog.title}
            className="w-full h-96 object-cover rounded-lg"
          />
        </div>

        <div className="prose prose-lg max-w-none mb-12">
          <div dangerouslySetInnerHTML={{ __html: blog.description }} />
        </div>

        {/* Like, Comment, Share, Save Section */}
        <div className="flex items-center justify-between py-4 border-t border-b border-gray-200 mb-8">
          <div className="flex items-center space-x-4">
            <button onClick={handleLike} className={`flex items-center space-x-1 ${isLiked ? "text-red-600" : "text-gray-600"}`}>
              <Heart className={`w-5 h-5 ${isLiked ? "fill-current" : ""}`} />
              <span>{blog.likes + (isLiked ? 1 : 0)}</span>
            </button>
            <button className="flex items-center space-x-1 text-gray-600">
              <MessageCircle className="w-5 h-5" />
              <span>{comments.length}</span>
            </button>
            <button className="flex items-center space-x-1 text-gray-600">
              <Share2 className="w-5 h-5" />
            </button>
          </div>
          <button onClick={handleSave} className={`flex items-center space-x-1 ${isSaved ? "text-blue-600" : "text-gray-600"}`}>
            <Bookmark className={`w-5 h-5 ${isSaved ? "fill-current" : ""}`} />
            <span>{isSaved ? "Saved" : "Save"}</span>
          </button>
        </div>

        {/* Comment Section */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Comments</h2>
          <form onSubmit={handleComment} className="mb-8">
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Add a comment..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              rows="3"
            />
            <button type="submit" className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
              Post Comment
            </button>
          </form>

          <div className="space-y-6">
            {comments.map((comment, index) => (
              <div key={index} className="flex space-x-4">
                <img src={comment.image} alt={comment.author} className="h-10 w-10 rounded-full" />
                <div>
                  <h4 className="font-semibold text-gray-900">{comment.author}</h4>
                  <p className="text-gray-700">{comment.content}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </article>
    </div>
  );
}
