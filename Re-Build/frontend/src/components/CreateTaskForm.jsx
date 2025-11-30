import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../utils/api";
import { useNavigate } from "react-router-dom";

function CreateTaskForm() {
  // task -> title, status, priority

  const navigate = useNavigate();
  
  // create queryClient
  const queryClient = useQueryClient();

  // create useMutation
  const createTask = useMutation({
    mutationFn: async (newTask) => {
      const response = await api.post("/api/tasks", newTask);
      return response.data.data; // sending back the data
    },
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries(["Tasks"]);
    },
    onError: (error) => {
      console.error("Error creating task: ", error);
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = e.target;
    createTask.mutate({
      title: formData.title.value,
      status: "to-do",
      priority: formData.priority.value,
    });
  };

  // create the form
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="mb-6">
          <h3 className="text-3xl font-bold text-gray-900">Create Task</h3>
          <p className="text-gray-600 mt-1">Add a new task to your list</p>
        </div>

        {/* Form Card */}
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-lg shadow-md p-6 space-y-5 border border-gray-200"
        >
          {/* Title Input */}
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
              Task Title
            </label>
            <input
              type="text"
              name="title"
              placeholder="Enter task title"
              required
              className="w-full px-4 py-2.5 border border-gray-300 rounded-md focus:border-gray-900 focus:ring-2 focus:ring-gray-200 outline-none transition"
            />
          </div>

          {/* Status Select */}
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
              Status
            </label>
            <select
              name="status"
              className="w-full px-4 py-2.5 border border-gray-300 rounded-md focus:border-gray-900 focus:ring-2 focus:ring-gray-200 outline-none transition bg-white"
            >
              <option value="to-do">To Do</option>
            </select>
          </div>

          {/* Priority Select */}
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
              Priority
            </label>
            <select
              name="priority"
              className="w-full px-4 py-2.5 border border-gray-300 rounded-md focus:border-gray-900 focus:ring-2 focus:ring-gray-200 outline-none transition bg-white"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={createTask.isPending}
            className="w-full bg-gray-900 text-white font-medium py-3 rounded-md hover:bg-gray-800 active:bg-gray-950 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {createTask.isPending ? "Creating..." : "Create Task"}
          </button>
          <button onClick={() => {navigate("/task")}}>
            See Tasks
          </button>

          {/* Success Message */}
          {createTask.isSuccess && (
            <div className="bg-green-50 border border-green-200 rounded-md p-3 text-sm text-green-800">
              ✓ Task created successfully
            </div>
          )}

          {/* Error Message */}
          {createTask.isError && (
            <div className="bg-red-50 border border-red-200 rounded-md p-3 text-sm text-red-800">
              ✗ Error: {createTask.error?.message}
            </div>
          )}
        </form>
      </div>
    </div>
  );
}

export default CreateTaskForm;
