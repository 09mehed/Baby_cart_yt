const asyncHandler = require('express-async-handler');
const User = require('../models/userModel');

const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body
    const user = await User.findOne({ email });
    if(user && user.matchPassword(password)){
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            avatar: user.avatar,
            role: user.role,
            address: user.address || [],
            // Token
            
        })
    }else{
        res.send(401);
        throw new Error("Invalid email or password")
    }
});

const registerUser = asyncHandler(async (req, res) => {
    const { name, email, password, role } = req.body;

    const user = await User.create({
        name,
        email,
        password,
        role,
        address: [],
    });

    if (user) {
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            avatar: user.avatar,
            role: user.role,
            address: user.address,
        });
    } else {
        res.status(400);
        throw new Error("Invalid user data");
    }
});

module.exports = { loginUser, registerUser };