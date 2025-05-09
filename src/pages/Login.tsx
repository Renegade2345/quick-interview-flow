
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import LoginForm from "@/components/LoginForm";
import { useAuth } from "@/contexts/AuthContext";

const Login = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  // If user is already logged in, redirect to home
  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-50 p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-indigo">Interview Scheduler</h1>
          <p className="text-gray-600 mt-2">Login to manage interview scheduling</p>
        </div>
        <LoginForm />
      </div>
    </div>
  );
};

export default Login;
