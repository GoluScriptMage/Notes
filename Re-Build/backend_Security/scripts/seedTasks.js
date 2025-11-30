import mongoose from "mongoose";
import Task from "../models/taskModel.js";
import dotenv from "dotenv";

dotenv.config();

const dummyTasks = [
  {
    title: "Complete React Query tutorial",
    description: "Learn about useQuery, useMutation, and optimistic updates",
    status: "in-progress",
    priority: "high",
    userId: "692c3f21fe343e623e0f0f93"
  },
  {
    title: "Build authentication system",
    description: "Implement Google OAuth with Passport.js and session management",
    status: "done",
    priority: "high",
    userId: "692c3f21fe343e623e0f0f93"
  },
  {
    title: "Buy groceries",
    description: "Milk, eggs, bread, and vegetables from the supermarket",
    status: "to-do",
    priority: "medium",
    userId: "692c3f21fe343e623e0f0f93"
  },
  {
    title: "Fix bug in task list",
    description: "Tasks not updating when status changes",
    status: "to-do",
    priority: "low",
    userId: "692c3f21fe343e623e0f0f93"
  },
  {
    title: "Deploy app to production",
    description: "Set up hosting on Vercel and configure environment variables",
    status: "to-do",
    priority: "high",
    userId: "692c3f21fe343e623e0f0f93"
  }
];

const seedTasks = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URL);
    console.log("Connected to MongoDB");

    await Task.deleteMany({}); // Clear existing tasks
    console.log("Cleared existing tasks");

    await Task.insertMany(dummyTasks);
    console.log("✅ 5 dummy tasks inserted successfully!");

    process.exit(0);
  } catch (error) {
    console.error("Error seeding tasks:", error);
    process.exit(1);
  }
};

seedTasks();
