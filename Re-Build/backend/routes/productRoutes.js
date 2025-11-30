
import express from "express";
import {
  getAllProducts,
  getProduct,
  createProduct,
} from "../controllers/productController.js";

const router = express.Router();

router.get("/products", getAllProducts);
router.get("/products/:id", getProduct);
router.post("/products", createProduct);

export default router;
