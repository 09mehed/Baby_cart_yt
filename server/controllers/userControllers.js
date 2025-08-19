import asyncHandler from "express-async-handler";
import User from "../models/userModel.js";

const getUsers = asyncHandler(async (req, res) => {
    const users = await User.find({}).select("-password");
    res.json(users);
})

const createUser = asyncHandler(async (req, res) => {
    const { name, email, password, role, addresses } = req.body;
    const userExists = await User.findOne({ email });
    if (userExists) {
        res.status(400).json({message: "User already exists"})
    }
    const user = await User.create({
        name,
        email,
        password,
        role,
        addresses: addresses || [],
    });
    if (user) {
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            avatar: user.avatar,
            role: user.role,
            addresses: user.addresses
        })
    } else {
        res.status(400).json({message: "Invalid user data"});
    }
})

const deleteUser = asyncHandler(async(req, res) => {
    const user = await User.findById(req.params.id)
    if(user){
        // delete user cart
        // Delete user
        await user.deleteOne();
        res.json({ message: "user removed" })
    }else{
        res.status(404).json({message: "User not found"})
    }
})

export { getUsers, createUser, deleteUser }