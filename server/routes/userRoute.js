import express from 'express';
import { createUser, deleteUser, getUsers, updateUser } from '../controllers/userControllers.js';
import { admin, protect } from '../middleware/authMiddleware.js';

const router = express.Router()

router.route("/").get(protect, admin, getUsers).post(protect, admin, createUser);
router.route("/:id").put(protect, updateUser).delete(protect, admin, deleteUser)


export default router;