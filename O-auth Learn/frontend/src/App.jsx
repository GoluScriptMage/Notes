import "./App.css";
import Login from "./Login";
import { useState, useEffect } from "react";
import axios from "axios";
function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  axios.defaults.withCredentials = true;

  useEffect(() => {
    // Check Authentaction status aif user exists
    const checkAuthStatus = async () => {
      try {
        const { data } = await axios.get("http://localhost:3001/auth/status");
        console.log(`Auth status response:`, data);
        if (data.isAuthenticated) {
          setUser({
            name: data.name,
            email: data.email,
            image: data.image,
          });
          console.log(`User is authenticated: ${data.name}`);
        }
      } catch (error) {
        console.error("Error checking auth status", error);
      } finally {
        setLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  const logout = async () => {
    try {
      await axios.get("http://localhost:3001/auth/logout");
      setUser(null);

      console.log(`User logged out successfully`);
    } catch (error) {
      console.error("Error during logout", error);
    }
  };

  return (
    <div className="App">
      {loading && <p>Loading...</p>}
      {!user && <Login />}
      {user && (
        <div>
          <h2>Welcome, {user.name}!</h2>
          <img src={user.image} alt={user.name} />
        </div>
      )}
      {user && (
        <button onClick={logout}>Logout</button>
      )}
    </div>
  );
}

export default App;
