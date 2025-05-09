
import LoginForm from "@/components/LoginForm";

const Login = () => {
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
