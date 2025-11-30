import express from 'express';
import { getTasks, createTasks } from '../controller/taskController.js';

const router = express.Router();

router.get('/tasks', getTasks);
router.post('/tasks', createTasks);

export default router;