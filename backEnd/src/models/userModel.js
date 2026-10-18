import mongoose from "mongoose";

const userModel = new mongoose.Schema({

    name: {
        type: String,
        required: [true, "Name is required"],
        trim: true

    },
    email: {
        type: String,
        required: [true, "Email is required"],
        trim: true,
        unique: true,
        lowercase: true
    },
    password: {
        type: String,
        required: [true, "Password is required"],
        minlength: 8,
    },
    role: {
        type: String,
        enum: ["user", "admin"],
        default: "user"
    },
},
    {
        timeStamps: true
    })
const User = mongoose.model("User", userModel)
export default User;