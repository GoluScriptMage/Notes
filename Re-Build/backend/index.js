import express from "express";
import taskRoutes from "./routes/taskRoutes.js";
import userRoutes from "./routes/userRoutes.js";

const app = express();
app.use(express.json());

app.get("/", (req, res) => {
  res.send("API is running...");
});
app.use("/api", taskRoutes);
app.use("/api/user", userRoutes);
app.use("/api/products", productRoutes);

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
