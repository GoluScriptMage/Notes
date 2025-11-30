import { useContext, createContext } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import api from "../utils/api";

// Create Auth Context
const AuthContext = createContext(null);

// Create Auth Context Provider
const AuthContextProvider = ({ children }) => {
  const queryClient = useQueryClient();
  // Fetch with useQuery and api
  const { data, isLoading, error } = useQuery({
    queryKey: ["AuthUser"],
    queryFn: async () => {
      const response = await api.get("/auth/status");
      return response.data;
    },
  });

  const logout = async () => {
    try {
      //send axios req to backend to logout
      await api.get("auth/logout");

      // then update auth-query
      queryClient.setQueryData(["AuthUser"], {
        isAuthenticated: false,
        user: null,
      });

      // invalidate the auth query after logout
      queryClient.invalidateQueries(["AuthUser"]);

      // redirect to login page
      window.location.href = "/login";
    } catch (err) {
      console.error("Logout failed", err);
    }
  };

  return (
    <AuthContext.Provider value={{ data, isLoading, error, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// create useAuth custom hook
const useAuth = () => {
  const context = useContext(AuthContext);

  // For error handling
  if (!context) {
    console.error("useAuth must be used within AuthProvider");
  }

  // Return context
  return context;
};

// eslint-disable-next-line react-refresh/only-export-components
export { AuthContextProvider, useAuth };
