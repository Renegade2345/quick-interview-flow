
import React, { createContext, useState, useContext, useEffect } from "react";
import { AuthState, User } from "@/types";
import { useToast } from "@/components/ui/use-toast";

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const initialState: AuthState = {
  user: null,
  loading: true,
  error: null,
};

// Mock users for demo purposes
const MOCK_USERS: User[] = [
  {
    id: "admin-1",
    name: "Admin User",
    email: "admin@example.com",
    role: "admin",
  },
  {
    id: "intern-1",
    name: "Ram",
    email: "ram@example.com",
    role: "intern",
  },
  {
    id: "intern-2",
    name: "Shyam",
    email: "shyam@example.com",
    role: "intern",
  },
];

// Create context
export const AuthContext = createContext<AuthContextType>({
  ...initialState,
  login: async () => {},
  logout: () => {},
});

// Auth provider component
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AuthState>(initialState);
  const { toast } = useToast();
  
  // Check if user is already logged in
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const savedUser = localStorage.getItem("user");
        if (savedUser) {
          const user = JSON.parse(savedUser) as User;
          setState({ user, loading: false, error: null });
        } else {
          setState({ user: null, loading: false, error: null });
        }
      } catch (error) {
        setState({ user: null, loading: false, error: "Authentication failed" });
      }
    };
    
    checkAuth();
  }, []);
  
  const login = async (email: string, password: string) => {
    setState({ ...state, loading: true });
    try {
      // In a real app, you would make an API call here
      // For this MVP, we'll use mock authentication
      const user = MOCK_USERS.find(u => u.email === email);
      
      // Simple "authentication" for demo
      if (user && password === "password") {
        localStorage.setItem("user", JSON.stringify(user));
        setState({ user, loading: false, error: null });
        toast({
          title: "Logged in successfully",
          description: `Welcome back, ${user.name}!`,
        });
      } else {
        setState({ user: null, loading: false, error: "Invalid credentials" });
        toast({
          title: "Login failed",
          description: "Invalid email or password",
          variant: "destructive",
        });
      }
    } catch (error) {
      setState({ user: null, loading: false, error: "Authentication failed" });
      toast({
        title: "Login failed",
        description: "An error occurred during login",
        variant: "destructive",
      });
    }
  };
  
  const logout = () => {
    localStorage.removeItem("user");
    setState({ user: null, loading: false, error: null });
    toast({
      title: "Logged out",
      description: "You have been logged out successfully",
    });
  };
  
  return (
    <AuthContext.Provider value={{ ...state, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use auth context
export const useAuth = () => useContext(AuthContext);
