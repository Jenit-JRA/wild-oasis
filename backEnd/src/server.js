import "dotenv/config";
import express from "express";
import mongoose from "mongoose"
import cabinRouter from "./routes/cabinRoutes.js"
import authRouter from "./routes/authRoutes.js"
import bookingRouter from "./routes/bookingRoutes.js"
import cors from "cors"




const app = express();
app.use(express.json())
app.use(cors())

app.use("/api/v1/cabins", cabinRouter)
app.use("/api/v1/auth", authRouter)
app.use("/api/v1/bookings", bookingRouter);

const DB = process.env.DATABASE_URL

async function startServer() {
    try {
        await mongoose.connect(DB)
        console.log("MongoDB connected")
        app.listen(process.env.PORT, () => {
            console.log("connection is successfull")
        })
    }
    catch (e) {
        console.log(e)

    }
}

startServer();