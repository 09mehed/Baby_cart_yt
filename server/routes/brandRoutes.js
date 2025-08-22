import express from 'express'
import { admin, protect } from '../middleware/authMiddleware.js';
import { createBrand, deleteBrand, getBrandById, getBrands, updateBrand } from '../controllers/brandControllers.js';

const router = express.Router();

// home route
router.route("/").get(getBrands).post(protect, admin, createBrand);

// :id
router.route("/:id").get(getBrandById).put(protect, admin, updateBrand).delete(protect, admin, deleteBrand)

export default router