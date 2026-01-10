import { useAuth } from "@clerk/clerk-react";
import { Navigate } from "react-router-dom";
import { LoadingAnimation } from "./LoadingAnimation";

const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const { isLoaded, isSignedIn } = useAuth();
  if (!isLoaded) return <LoadingAnimation size="lg" />;
  if (!isSignedIn) return <Navigate to="/" replace />;
  return children;
};

export default ProtectedRoute;
