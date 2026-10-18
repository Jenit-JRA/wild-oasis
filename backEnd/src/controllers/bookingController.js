import mongoose from "mongoose";
import Cabin from "../models/cabinModel.js";
import User from "../models/userModel.js";
import Booking from "../models/bookingModel.js"


export const createBooking = async (req, res) => {
    console.log(req, ';look here')
    try {
        const { cabin, startDate, endDate, numGuests } = req.body;

        // 1. Validate required fields
        if (!cabin || !startDate || !endDate || numGuests == null) {
            return res.status(400).json({
                status: "Failed",
                message: "Cabin, start date, end date and guest count are required.",
            });
        }

        // 2. Validate cabin ID format
        if (!mongoose.Types.ObjectId.isValid(cabin)) {
            return res.status(400).json({
                status: "Failed",
                message: "Invalid cabin ID.",
            });
        }

        // 3. Find the cabin
        const cabinData = await Cabin.findById(cabin);

        if (!cabinData) {
            return res.status(404).json({
                status: "Failed",
                message: "Cabin not found.",
            });
        }

        // 4. Validate dates
        const checkIn = new Date(startDate);
        const checkOut = new Date(endDate);

        if (
            Number.isNaN(checkIn.getTime()) ||
            Number.isNaN(checkOut.getTime())
        ) {
            return res.status(400).json({
                status: "Failed",
                message: "Please provide valid check-in and check-out dates.",
            });
        }

        // Normalize to calendar dates to avoid time-of-day differences
        const start = Date.UTC(
            checkIn.getUTCFullYear(),
            checkIn.getUTCMonth(),
            checkIn.getUTCDate()
        );

        const end = Date.UTC(
            checkOut.getUTCFullYear(),
            checkOut.getUTCMonth(),
            checkOut.getUTCDate()
        );

        const today = new Date();
        const todayStart = Date.UTC(
            today.getUTCFullYear(),
            today.getUTCMonth(),
            today.getUTCDate()
        );

        if (start < todayStart) {
            return res.status(400).json({
                status: "Failed",
                message: "Check-in cannot be in the past.",
            });
        }

        if (end <= start) {
            return res.status(400).json({
                status: "Failed",
                message: "Check-out must be after check-in.",
            });
        }

        // 5. Validate guest count
        const guestCount = Number(numGuests);

        if (
            !Number.isInteger(guestCount) ||
            guestCount < 1
        ) {
            return res.status(400).json({
                status: "Failed",
                message: "Guest count must be a positive whole number.",
            });
        }

        if (guestCount > cabinData.maxCapacity) {
            return res.status(400).json({
                status: "Failed",
                message: `This cabin accommodates a maximum of ${cabinData.maxCapacity} guests.`,
            });
        }

        // 6. Calculate price on the backend
        const nights = (end - start) / (1000 * 60 * 60 * 24);
        const nightlyPrice = Number(cabinData.regularPrice);

        if (!Number.isFinite(nightlyPrice) || nightlyPrice < 0) {
            return res.status(500).json({
                status: "Failed",
                message: "Cabin pricing is not configured correctly.",
            });
        }

        const totalPrice = nights * nightlyPrice;

        // 7. Check overlapping bookings
        // A booking conflicts when existing check-in < new check-out
        // AND existing check-out > new check-in.
        const conflictingBooking = await Booking.findOne({
            cabin: cabinData._id,
            startDate: { $lt: checkOut },
            endDate: { $gt: checkIn },
            status: { $ne: "cancelled" },
        });

        if (conflictingBooking) {
            return res.status(409).json({
                status: "Failed",
                message: "This cabin is already booked for the selected dates.",
            });
        }

        // 8. Create booking using authenticated user ID
        const booking = await Booking.create({
            cabin: cabinData._id,
            user: req.user.id,
            name: req.user.id,
            startDate: checkIn,
            endDate: checkOut,
            noOfGuests: guestCount,
            totalPrice,
        });

        return res.status(201).json({
            status: "Success",
            message: "Booking created successfully.",
            data: { booking },
        });
    } catch (error) {
        console.error("Create booking error:", error);

        return res.status(500).json({
            status: "Failed",
            message: "Unable to create booking.",
        });
    }
};


export const getMyBookings = async (req, res) => {
    try {
        const bookings = await Booking.find({
            user: req.user._id,
        })
            .populate("cabin")
            .sort({ createdAt: -1 });

        return res.status(200).json({
            status: "Success",
            results: bookings.length,
            data: { bookings },
        });
    } catch (error) {
        console.error("Get my bookings error:", error);

        return res.status(500).json({
            status: "Failed",
            message: "Unable to retrieve your bookings.",
        });
    }
};

export const manageBooking = async (req, res) => {
    try {
        const bookingId = req.params.id
        const bookingToUpdate = await Booking.findById(bookingId)
        console.log(bookingToUpdate)
        console.log(req.user)
        if (!bookingToUpdate) {
            return res.status(404).json({
                status: "Failed",
                message: "The bookign does not exist"
            })

        }
        if (bookingToUpdate.status === "CANCELLED") {
            return res.status(400).json({
                status: "fail",
                message: "This booking is already cancelled",
            });
        }
        if (bookingToUpdate.name.toString() !== req.user.id) {
            return res.status(403).json({
                status: "fail",
                message: "You are not allowed to cancel this booking",
            });
        }
        bookingToUpdate.status = "CANCELLED"
        await bookingToUpdate.save();

        return res.status(200).json({
            status: "success",
            message: "Booking cancelled successfully",
            data: {
                bookingToUpdate
            }
        });


    }
    catch (e) {
        return res.status(500).json({
            message: e.message,
            status: 'Failed'
        })

    }
}


