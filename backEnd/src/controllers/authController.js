import User from "../models/userModel.js"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken";

export const register = async (req, res) => {
    try {
        const hashedPass = await bcrypt.hash(req.body.password, 12)
        const user = await User.create({
            name: req.body.name,
            email: req.body.email,
            password: hashedPass
        })
        res.status(201).json({
            status: "Success",
            data: {
                id: user._id,
                name: user.name,
                email: user.email
            }
        })
    }
    catch (e) {
        res.status(500).json({
            status: 'error',
            message: e.message
        })

    }

}

export const login = async (req, res) => {
    try {
        const email = req.body.email
        const password = req.body.password
        const authedUser = await User.findOne({ email })
        if (!authedUser) {
            return res.status(401).json({
                status: "fail",
                message: "Invalid email or password"
            });
        }
        const isPasswordSame = await bcrypt.compare(password, authedUser?.password)
        if (!isPasswordSame) {
            return res.status(401).json({
                status: "fail",
                message: "Invalid email or password"
            });
        }
        const token = jwt.sign(
            {
                id: authedUser._id,
                role: authedUser.role,
                name: authedUser.name
            },
            process.env.JWT_SECRET,
            {
                expiresIn: process.env.JWT_EXPIRES_IN
            }

        );
        return res.status(200).json({
            status: "success",
            data: ({
                id: authedUser?._id,
                token,
                name: authedUser.name,
                email: authedUser.email,
                role: authedUser.role

            })
        })

    }
    catch (e) {
        return res.status(500).json({
            status: "error",
            message: e.message
        });

    }
}