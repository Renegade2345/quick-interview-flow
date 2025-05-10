
import { useAuth } from "@/contexts/AuthContext";
import { Navigate } from "react-router-dom";
import SLAAnalytics from "@/components/SLAAnalytics";

const Analytics = () => {
  const { user, loading } = useAuth();
  
  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo"></div>
      </div>
    );
  }
  
  // Redirect to login if not authenticated
  if (!user) {
    return <Navigate to="/login" />;
  }

  return (
    <div className="container py-8">
      <SLAAnalytics />
    </div>
  );
};

export default Analytics;
