
import { useAuth } from "@/contexts/AuthContext";
import { Navigate } from "react-router-dom";
import SLAAnalytics from "@/components/SLAAnalytics";

const Analytics = () => {
  const { user, loading } = useAuth();
  
  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-ios-blue"></div>
      </div>
    );
  }
  
  // Redirect to login if not authenticated
  if (!user) {
    return <Navigate to="/login" />;
  }

  return (
    <div className="container py-8 space-y-8">
      <div className="ios-card p-6 animate-slide-in">
        <h1 className="text-2xl font-bold mb-6 text-ios-blue">Analytics Dashboard</h1>
        <SLAAnalytics />
      </div>
    </div>
  );
};

export default Analytics;
