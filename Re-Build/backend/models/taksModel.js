import mongoose from "mongoose";

const taskSchema = new mongoose.Schema({
  id: {
    type: Number,
    required: true,
    unique: true,
  },
  title: {
    type: String,
    required: true,
  },
  completed: {
    type: Boolean,
    required: true,
  },
});

const Task = mongoose.models.Task || mongoose.model("Task", taskSchema);

export default Task;
