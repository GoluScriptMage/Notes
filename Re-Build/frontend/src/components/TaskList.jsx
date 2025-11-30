import { useQuery } from "@tanstack/react-query";
import api from "../utils/api";
import { useNavigate } from "react-router-dom";

function TaskList() {

  const navigate = useNavigate();
  
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["Tasks"],
    queryFn: async () => {
      const res = await api.get("api/tasks");
      return res.data.data;
    },
  });

  console.log(`Data in TaskList: `, data);

  // Loading State
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-300 border-t-gray-900 mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading tasks...</p>
        </div>
      </div>
    );
  }

  // Error State
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <div className="bg-white rounded-lg shadow-md p-6 border border-red-200 max-w-md">
          <div className="text-center">
            <div className="text-red-500 text-4xl mb-3">⚠️</div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              Error Loading Tasks
            </h3>
            <p className="text-gray-600 mb-4">{error.message}</p>
            <button
              onClick={refetch}
              className="bg-gray-900 text-white px-6 py-2 rounded-md hover:bg-gray-800 transition"
            >
              Try Again
            </button>
            
          </div>
        </div>
      </div>
    );
  }

  // Priority badge colors
  const getPriorityColor = (priority) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800 border-red-200";
      case "medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "low":
        return "bg-green-100 text-green-800 border-green-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  // Status badge colors
  const getStatusColor = (status) => {
    switch (status) {
      case "done":
        return "bg-green-100 text-green-800 border-green-200";
      case "in-progress":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "to-do":
        return "bg-gray-100 text-gray-800 border-gray-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">My Tasks</h2>
            <p className="text-gray-600 mt-1">
              {data?.length || 0} tasks total
            </p>
          </div>
          <button
            onClick={refetch}
            className="bg-gray-900 text-white px-4 py-2 rounded-md hover:bg-gray-800 active:bg-gray-950 transition font-medium"
          >
            Refresh
          </button>
          <button
              onClick={() => { navigate("/dashboard")}}
              className="bg-gray-700 text-white px-6 py-2 rounded-md hover:bg-gray-800 transition"
            >
              Go to DashBoard
            </button>
        </div>

        {/* Tasks List */}
        {data && data.length > 0 ? (
          <div className="space-y-4">
            {data.map((task) => (
              <div
                key={task._id}
                className="bg-white rounded-lg shadow-md p-5 border border-gray-200 hover:shadow-lg transition"
              >
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {task.title}
                  </h3>
                  <div className="flex gap-2">
                    <span
                      className={`text-xs px-3 py-1 rounded-full border font-medium ${getPriorityColor(
                        task.priority
                      )}`}
                    >
                      {task.priority}
                    </span>
                    <span
                      className={`text-xs px-3 py-1 rounded-full border font-medium ${getStatusColor(
                        task.status
                      )}`}
                    >
                      {task.status}
                    </span>
                  </div>
                </div>

                {task.description && (
                  <p className="text-gray-600 text-sm mb-3">
                    {task.description}
                  </p>
                )}

                <div className="flex justify-between items-center text-xs text-gray-500 pt-3 border-t border-gray-100">
                  <span>
                    Created: {new Date(task.createdAt).toLocaleDateString()}
                  </span>
                  <div className="flex gap-2">
                    <button className="text-blue-600 hover:text-blue-700 font-medium">
                      Edit
                    </button>
                    <button className="text-red-600 hover:text-red-700 font-medium">
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md p-12 border border-gray-200 text-center">
            <div className="text-gray-400 text-5xl mb-4">📋</div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              No Tasks Yet
            </h3>
            <p className="text-gray-600">
              Create your first task to get started!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default TaskList;
