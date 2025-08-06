const mongoose = require('mongoose')
const bcrypt = require ('bcryptjs')

const userSchema = mongoose.Schema({
    name:{
        type: String,
        required: true, 
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password:{
        type: String,
        required: true, 
    },
    avatar: {
        type: String,
        default: "https://unsplash.com/s/photos/man",
    },
    role: {
        type: String,
        enum: ["admin", "user", "deliveryman"],
        default: "user",
    },
    address: [{
        street:{
            type: String,
            required: true
        },
        city: {
            type: String,
            required: true,
        },
        country: {
            type: String,
            required: true,
        },
        postalCode: {
            type: String,
            required: true,
        },
        isDefault: {
            type: Boolean,
            required: false,
        },
    }],
    wishlist: [],
    cart: [],
}, {
    Timestamps: true,
});

userSchema.methods.matchPassword = async function (enteredPassword){
    return await bcrypt.compare(enteredPassword, this.password);
}

userSchema.pre("save", async function (next) {
    if(!this.isModified("password")){
        next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
})

const User = mongoose.model("User", userSchema);
module.exports = User;