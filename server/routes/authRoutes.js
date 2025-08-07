import express from 'express';
import authController from '../controllers/authControllers.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/login', authController.loginUser);
router.post('/register', authController.registerUser);
router.get("/profile/:id", protect, authController.getUserProfile);
router.post("/logout", protect, authController.logoutUser);

export default router;