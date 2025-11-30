import Task from "../models/taksModel.js";

export const tasks = [
  { id: 1, title: "Task One", completed: false },
  { id: 2, title: "Task Two", completed: true },
];

export const getTasks = (req, res) => {
  res.status(200).json({
    success: true,
    data: tasks,
  });
};

export const createTasks = async (req, res) => {

    // Comemnting these bcz the db is not connected yet 
//   const { id, title, completed } = req.body;
//   const newTask = await Task.create({
//     id,
//     title,
//     completed,
//   });

  res.status(201).json({
    success: true,
    message: "Tasks created successfully",
    data: tasks
  });
};
