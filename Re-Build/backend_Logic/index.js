import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import cors from 'cors';
import taskRoutes from './routes/taskRoutes.js'

dotenv.config();

// Connecting to MONGODB
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URL);
        console.log("MONGODB connected successfully")
    } catch(error) {
        console.error("MONGODB connection failed", error);
    }
}

connectDB();


const app = express();

// middleware
app.use(express.json());
app.use(cors());

// routes
app.get('/', (req, res) => {
    res.send("API is working");
})
app.use('/api', taskRoutes);

// server
const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
    console.log(`Server is running on Port ${PORT}`);
})