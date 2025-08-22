import asyncHandler from "express-async-handler";
import User from "../models/userModel.js";
import cloudinary from "../config/cloudinary.js";

const getUsers = asyncHandler(async (req, res) => {
    const users = await User.find({}).select("-password");
    res.json(users);
})

const createUser = asyncHandler(async (req, res) => {
    const { name, email, password, role, addresses, avatar } = req.body;
    const userExists = await User.findOne({ email });
    if (userExists) {
        res.status(400).json({message: "User already exists"})
    }

    let avatarUrl = "";
    if (avatar) {
        const result = await cloudinary.uploader.upload(avatar, {
            folder: "Baby-mart/avatars",
        });
        avatarUrl = result.secure_url;
    }

    const user = await User.create({
        name,
        email,
        password,
        role,
        addresses: addresses || [],
        avatar: avatarUrl || "",
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
        await user.deleteOne();
        res.json({ message: "user removed" })
    }else{
        res.status(404).json({message: "User not found"})
    }
})

const updateUser = asyncHandler(async(req, res) => {
    const user = await User.findById(req.params.id);
    if(!user){
        res.status(404).json({message: "user not found"})
    }
    if(user._id.toString() !== req.user._id.toString() && req.user.role !== "admin"){
        res.status(403).json({message: "Not authorized to update this user"})
    }
    user.name = req.body.name || user.name;
    if(req.body.role){
        user.role = req.body.role
    }
    user.addresses = req.body.addresses || user.addresses;

    if(req.body.avatar && req.body.avatar !== user.avatar){
        const result = await cloudinary.uploader.upload(req.body.avatar, {
            folder: "Baby-mart/avatars"
        })
        user.avatar = result.secure_url;
    }

    const updatedUser = await user.save();

    res.json({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        avatar: updatedUser.avatar,
        role: updatedUser.role,
        addresses: updatedUser.addresses,
    });
})

export { getUsers, createUser, deleteUser, updateUser }