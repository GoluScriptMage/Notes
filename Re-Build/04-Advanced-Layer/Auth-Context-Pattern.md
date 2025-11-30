# 📘 Auth Context Pattern - Deep Dive

> **"The pattern that connects your OAuth backend to your React frontend seamlessly."**

---

## 🎯 What is the Auth Context Pattern?

The **Auth Context Pattern** is a way to:

- **Check authentication status** globally across your React app
- **Share user data** between all components
- **Handle auth state** without prop drilling
- **Integrate with React Query** for automatic caching and refetching

**Think of it as your app's "security guard" that knows who's logged in at all times.**

---

## 🔍 The Complete Flow

```
┌─────────────────────────────────────────────────────────────┐
│                    App Startup Flow                         │
└─────────────────────────────────────────────────────────────┘

1. App loads → AuthProvider mounts
2. AuthProvider calls useQuery(['authStatus'])
3. useQuery makes GET /auth/status request
4. Backend checks req.isAuthenticated()
5. Backend returns { isAuthenticated: true/false, user: {...} }
6. AuthProvider provides { user, isLoading } to entire app
7. Components use useAuth() to access auth state
```

---

## 🧠 The Pattern Implementation

### **Step 1: Create the Context**

**File: `src/context/AuthContext.jsx`**

```jsx
import { createContext, useContext } from "react";
import { useQuery } from "@tanstack/react-query";
import api from "../api/axios";

// 1. Create the context
const AuthContext = createContext();

// 2. Create the provider component
export const AuthProvider = ({ children }) => {
  // 3. Use React Query to fetch auth status
  const { data, isLoading, error } = useQuery({
    queryKey: ["authStatus"],
    queryFn: async () => {
      const { data } = await api.get("/auth/status");
      return data; // { isAuthenticated: boolean, user: User | null }
    },
    retry: false, // Don't retry if user is not logged in (401 is expected)
    staleTime: 1000 * 60 * 5, // Consider fresh for 5 minutes
  });

  // 4. Extract user from response
  const user = data?.isAuthenticated ? data.user : null;
  const isAuthenticated = !!user;

  // 5. Create context value
  const contextValue = {
    user,
    isAuthenticated,
    isLoading,
    error,
  };

  // 6. Provide context to children
  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};

// 7. Create hook for consuming context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};
```

### **Step 2: Wrap Your App**

**File: `src/main.jsx`**

```jsx
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "./context/AuthContext";
import App from "./App";

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")).render(
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      {" "}
      {/* Wrap entire app */}
      <App />
    </AuthProvider>
  </QueryClientProvider>
);
```

### **Step 3: Use in Components**

**File: `src/components/Dashboard.jsx`**

```jsx
import { useAuth } from "../context/AuthContext";
import { Navigate } from "react-router-dom";

function Dashboard() {
  const { user, isLoading, isAuthenticated } = useAuth();

  // Show loading while checking auth
  if (isLoading) {
    return <div className="loading">Checking authentication...</div>;
  }

  // Redirect if not logged in
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Show dashboard for authenticated users
  return (
    <div>
      <h1>Welcome, {user.name}!</h1>
      <img src={user.avatar} alt="Profile" />
      <p>Email: {user.email}</p>
    </div>
  );
}
```

---

## 🔗 How It Connects to Your OAuth Backend

### **Backend `/auth/status` Endpoint (What You Built):**

```javascript
// Your backend route
router.get("/status", (req, res) => {
  if (req.isAuthenticated()) {
    res.json({
      isAuthenticated: true,
      user: req.user,
    });
  } else {
    res.json({
      isAuthenticated: false,
      user: null,
    });
  }
});
```

### **Frontend React Query Call:**

```jsx
// AuthContext calls this automatically
const { data } = useQuery({
  queryKey: ["authStatus"],
  queryFn: () => api.get("/auth/status"), // Calls your backend
});

// data = { isAuthenticated: true, user: { name: "Golu", email: "..." } }
```

---

## 🎯 Advanced Features

### **1. Automatic Refetching**

```jsx
export const AuthProvider = ({ children }) => {
  const { data, isLoading, refetch } = useQuery({
    queryKey: ["authStatus"],
    queryFn: async () => {
      const { data } = await api.get("/auth/status");
      return data;
    },
    retry: false,
    refetchOnWindowFocus: true, // Recheck when user returns to tab
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  // Expose refetch for manual auth checks
  const contextValue = {
    user: data?.isAuthenticated ? data.user : null,
    isLoading,
    refetch, // Components can manually refresh auth
  };

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};
```

### **2. Logout Function Integration**

```jsx
export const AuthProvider = ({ children }) => {
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["authStatus"],
    queryFn: () => api.get("/auth/status"),
    retry: false,
  });

  // Logout function
  const logout = async () => {
    try {
      await api.get("/auth/logout"); // Call backend logout
      queryClient.setQueryData(["authStatus"], {
        isAuthenticated: false,
        user: null,
      });
      queryClient.invalidateQueries({ queryKey: ["authStatus"] });
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const contextValue = {
    user: data?.isAuthenticated ? data.user : null,
    isLoading,
    logout, // Components can call this
  };

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};
```

### **3. Protected Route Component**

```jsx
import { useAuth } from "../context/AuthContext";
import { Navigate, useLocation } from "react-router-dom";

function ProtectedRoute({ children }) {
  const { user, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    // Redirect to login but remember where they tried to go
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}

// Usage:
// <ProtectedRoute>
//   <Dashboard />
// </ProtectedRoute>
```

---

## 🔄 Complete Integration Example

### **App Component with Routing:**

```jsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import Login from "./components/Login";
import Dashboard from "./components/Dashboard";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <div className="app-loading">Loading...</div>;
  }

  return (
    <BrowserRouter>
      <div className="app">
        <nav>
          {user ? (
            <div>
              Welcome, {user.name}!
              <LogoutButton />
            </div>
          ) : (
            <LoginButton />
          )}
        </nav>

        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route path="/" element={user ? <Dashboard /> : <Login />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}
```

---

## 💡 Why This Pattern is Powerful

### **1. Single Source of Truth** ✅

- All auth state lives in one place
- No inconsistencies between components
- Easy to debug auth issues

### **2. Automatic Caching** ✅

- React Query caches the auth status
- No redundant API calls
- Fast component renders

### **3. Real-time Updates** ✅

- When user logs in/out, entire app updates
- Background refetching keeps auth fresh
- Handles expired sessions automatically

### **4. TypeScript Friendly** ✅

```tsx
interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);
```

---

## 🎯 Common Patterns

### **Conditional Rendering Based on Auth:**

```jsx
function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav>
      {user ? (
        <div>
          <span>Hello, {user.name}</span>
          <button onClick={logout}>Logout</button>
        </div>
      ) : (
        <a href="/auth/google">Login with Google</a>
      )}
    </nav>
  );
}
```

### **Role-based Access:**

```jsx
function AdminPanel() {
  const { user } = useAuth();

  if (user?.role !== "admin") {
    return <div>Access denied. Admin only.</div>;
  }

  return <div>Admin controls...</div>;
}
```

---

## 🚀 **This Pattern Powers Professional Apps**

**Companies like Netflix, Spotify, and GitHub use this exact pattern to:**

- Handle millions of user sessions
- Provide seamless auth experiences
- Integrate with complex backend systems
- Scale to global audiences

**You've just learned a PRODUCTION-LEVEL pattern!** 💪

**Back to:** [Tier 4 Guide](./Guide.md) | [Practice Questions](./Practice-Questions.md) | [Mission Checklist](./Mission-Checklist.md)
