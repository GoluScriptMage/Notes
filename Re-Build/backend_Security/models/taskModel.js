import mongoose from "mongoose";

const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    status: {
      type: String,
      enum: ["to-do", "in-progress", "done"],
      default: "to-do",
    },
    priority: {
      type: String,
      enum: ["low", "medium", "high"],
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now(),
    },
  },
  {
    timestamps: true,
  }
);

const Task = mongoose.models.Task || mongoose.model("Task", taskSchema);

export default Task;
