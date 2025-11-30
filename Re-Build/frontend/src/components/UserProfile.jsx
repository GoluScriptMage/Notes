import { useAuth } from "../context/AuthContextProvider";
import { useNavigate } from "react-router-dom";

function UserProfile() {
  const { data, isLoading, error, logout } = useAuth();
  const navigate = useNavigate();

  console.log(`User Data:`, data);

  if (isLoading) {
    return <div>Loading...</div>;
  }
  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-8">
        {/* Profile Card */}
        <div className="text-center space-y-6">
          {/* Name Field */}
          <div>
            <label className="block text-sm font-medium text-gray-500 mb-2">
              Name
            </label>
            <p className="text-2xl font-bold text-gray-900">{data.user.name}</p>
          </div>2

          {/* Email Field */}
          <div>
            <label className="block text-sm font-medium text-gray-500 mb-2">
              Email
            </label>
            <p className="text-lg text-gray-700">{data.user.email}</p>
          </div>

          {/* User ID Field - FOR DEBUGGING */}
          {/* <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <label className="block text-sm font-medium text-yellow-800 mb-2">
              🔍 Your User ID (for debugging)
            </label>
            <p className="text-sm font-mono text-yellow-900 break-all">
              {data.user._id}
            </p>
            <p className="text-xs text-yellow-700 mt-2">
              ↑ Copy this ID and use it in seedTasks.js
            </p>
          </div> */}

          <button
            onClick={logout}
            className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-500 transition duration-200"
          >
            Logout
          </button>
          <button onClick={() => navigate("/task")}>Go to DashBoard</button>
        </div>
      </div>
    </div>
  );
}

export default UserProfile;
