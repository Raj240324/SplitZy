import { useAuth } from "@clerk/clerk-react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const { isLoaded, isSignedIn } = useAuth();
  if (!isLoaded) return <div className="flex items-center justify-center h-screen">Loading...</div>;
  if (!isSignedIn) return <Navigate to="/" replace />;
  return children;
};

export default ProtectedRoute;
