import express from "express";
import {
  getAllTasks,
  getTask,
  createTask,
  deleteTask,
  updateTask,
} from "../controller/taskController.js";

const router = express.Router();

// Routes for Crud Operatons+-
router.route("/tasks").get(getAllTasks).post(createTask);
router.route("/tasks/:id").get(getTask).delete(deleteTask).put(updateTask);

export default router;