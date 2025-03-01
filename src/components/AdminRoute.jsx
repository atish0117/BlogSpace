import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function AdminRoute() {
  const { userProfile } = useAuth(); // Get user data from context

  if (!userProfile || userProfile.role !== "admin") {
    return <Navigate to="/" replace />; // Redirect non-admin users
  }

  return <Outlet />; // Render the admin page
}
