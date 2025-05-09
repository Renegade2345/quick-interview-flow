
import AdminPanel from "@/components/AdminPanel";
import { useAuth } from "@/contexts/AuthContext";
import { Navigate } from "react-router-dom";

const AdminPage = () => {
  const { user } = useAuth();
  
  // Redirect if not admin
  if (user && user.role !== "admin") {
    return <Navigate to="/" />;
  }
  
  if (!user) {
    return <Navigate to="/login" />;
  }

  return (
    <div className="container py-8">
      <AdminPanel />
    </div>
  );
};

export default AdminPage;
