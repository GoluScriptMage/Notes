import Task from "../models/taskModel.js";
import APIFeatures from "../utils/apiFeatures.js";

const catchAsyncErrors = (fn) => {
  return async (req, res) => {
    try {
      await fn(req, res);
    } catch (error) {
      console.error(error);
      res.status(500).json({
        success: false,
        message: 'Server Error',
        error: error.message
      })
    }
  };
};

// Create Task
export const createTask = catchAsyncErrors(async (req, res) => {
  // Get the data
  const { title, description, status, priority } = req.body;

  // Save the data to db
  const newTask = new Task({
    title,
    description,
    status,
    priority,
    userId: req.user._id,
  });

  await newTask.save();
  // return the message
  res.status(201).json({
    success: true,
    length: newTask.length,
    data: newTask,
  });
});

// Get All Task
export const getAllTasks = catchAsyncErrors(async (req, res) => {
  const pendingQuery = new APIFeatures(Task.find({
    userId: req.user._id,
  }), req.query)
    .filter()
    .sort()
    .fields()
    .pagination();

  const tasks = await pendingQuery.query.populate("userId", "name email");

  res.status(200).json({
    success: true,
    length: tasks.length,
    data: tasks,
  });
});

// Get Single Task
export const getTask = catchAsyncErrors(async (req, res) => {
  const { id } = req.params;
  const task = await Task.findById(id).populate("userId", "name email");

  res.status(200).json({
    success: true,
    length: task.length,
    data: task,
  });
});

// Update Task
export const updateTask = catchAsyncErrors(async (req, res) => {
  const { id } = req.params;
  const { title } = req.body;

  const updatedTask = await Task.findByIdAndUpdate(
    id,
    { userId: req.user._id, title },
    {
      new: true,
    }
  );

  res.status(200).json({
    success: true,
    length: updatedTask.length,
    data: updatedTask,
  });
});

// Delete Task
export const deleteTask = catchAsyncErrors(async (req, res) => {
  const { id } = req.params;
  await Task.findByIdAndDelete(id);

  res.status(200).json({
    success: true,
    message: "Task Deleted Successfully",
  });
});
