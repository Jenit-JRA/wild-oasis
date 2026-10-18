import { Router } from "express";
import { createBooking, getMyBookings, manageBooking } from "../controllers/bookingController.js";
import { protect } from "../middleware/authMiddleware.js";


const router = Router()
router.post("/", protect, createBooking);
router.get("/my-bookings", protect, getMyBookings);
router.patch("/:id", protect, manageBooking)

export default router