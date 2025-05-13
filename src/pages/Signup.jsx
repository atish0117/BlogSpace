import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { UserPlus } from "lucide-react";
import { account, databases,  } from "../lib/appwrite"; // Import Appwrite modules
import { ID } from "appwrite";

export default function Signup() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  async function handleSubmit(e) {
    e.preventDefault();
    if (password !== confirmPassword) {
      return setError("Passwords do not match");
    }

    try {
      setError("");
      setLoading(true);

      // Create user in Appwrite Auth
      const newUser = await account.create(ID.unique(), email, password, `${firstName} ${lastName}`);
      console.log("User created:", newUser);
      localStorage.setItem("BlogToken", email);

      // Use default profile image (if not uploading a file)
      const profileId = `https://api.dicebear.com/9.x/initials/svg?seed=${firstName} ${lastName}`;

      // Store user data in Appwrite Database
      await databases.createDocument(
        "67af5e8e000a6d18b2c5", // Database ID
        "67af5eab002c0c19bf53", // Collection ID
        ID.unique(),
        {
          email,
          firstName,
          lastName,
          profileId: "", // Store default profile image URL
          blogsId: null,
          coverId: "",
          role: "user", // Automatically assign "user" role
        }
      );

      await login(email, password);
      console.log("User data stored successfully!");
      navigate("/profile");
    } catch (err) {
      setError("Failed to create an account: " + err.message);
      console.error("Error creating account:", err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      className="min-h-screen flex flex-col justify-center items-center"
      style={{
        backgroundImage: `url('https://ideogram.ai/assets/image/lossless/response/4u1cr96ARTqUyGFuLdstVg')`, // Background image
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Gradient Overlay */}
      <div
        className="absolute "
        style={{ zIndex: 0 }}
      ></div>

      {/* Form Container */}
      <div
        className="bg-white/20 backdrop-blur-lg border border-white/20 py-8 px-4 shadow-2xl rounded-lg sm:px-10 w-full max-w-md mx-4"
        style={{
          boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
          zIndex: 1,
        }}
      >
        <div className="flex justify-center">
          <UserPlus className="w-12 h-12 text-black" />
        </div>
        <h2 className="mt-2 text-center text-3xl font-extrabold text-gray-900">
          Create your account
        </h2>
       

        {error && <div className="bg-red-50 text-red-700 p-3 rounded-md mt-4">{error}</div>}

        <form className="mt-6 space-y-6" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
                First name
              </label>
              <div className="mt-1">
                <input
                  id="firstName"
                  name="firstName"
                  type="text"
                  required
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-balck focus:border-gray-800 transition duration-300"
                />
              </div>
            </div>

            <div>
              <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
                Last name
              </label>
              <div className="mt-1">
                <input
                  id="lastName"
                  name="lastName"
                  type="text"
                  required
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2  focus:ring-balck focus:border-gray-800 transition duration-300"
                />
              </div>
            </div>
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email address
            </label>
            <div className="mt-1">
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-balck focus:border-gray-700 transition duration-300"
              />
            </div>
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <div className="mt-1">
              <input
                id="password"
                name="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2  focus:outline-none focus:ring-balck focus:border-gray-700 transition duration-300"
              />
            </div>
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
              Confirm password
            </label>
            <div className="mt-1">
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-balck focus:border-gray-700 transition duration-300"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2 px-4 bg-gray-900 text-white font-semibold rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 transition duration-300 disabled:opacity-50"
            >
              {loading ? "Creating account..." : "Create account"}
            </button>
          </div>
        </form>
        <p className="mt-2 text-center text-sm text-gray-600">
          Already have an account?{" "}
          <Link to="/login" className="font-medium text-black hover:text-gray-800 transition duration-300">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}