import express from 'express';
import authController from '../controllers/authControllers.js';

const router = express.Router();

router.post('/login', authController.loginUser);
router.post('/register', authController.registerUser);
router.get("/profile/:id", authController.getUserProfile);

export default router;