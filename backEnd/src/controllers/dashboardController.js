import Booking from "../models/bookingModel.js";
import Cabin from "../models/cabinModel.js";

export const getDashboardData = async (req, res) => {
    try {

        const [totalBookings, totalCabins, confirmedBookings] = await Promise.all([
            Booking.countDocuments(),
            Cabin.countDocuments(),
            Booking.countDocuments({
                status: 'CONFIRMED'
            })

        ])
        const revenueResult = await Booking.aggregate([
            {
                $match: {
                    status: 'CONFIRMED'
                }
            },
            {
                $group: {
                    _id: null,
                    totalRevenue: {
                        $sum: "$totalPrice"
                    }

                }
            }
        ])
        const startDate = new Date(
            new Date().getFullYear(),
            new Date().getMonth() - 5,
            1
        )
        const bookingPerMonth = await Booking.aggregate([
            {
                $match: {
                    createdAt: {
                        $gte: startDate

                    }
                }
            },
            {
                $group: {
                    _id: {
                        year: { $year: "$createdAt" },
                        month: { $month: "$createdAt" }

                    },
                    bookings: {
                        $sum: 1
                    }

                }
            },

            {
                $sort: {
                    "_id.year": 1,
                    "_id.month": 1
                }
            }
        ])

        const recentBookings = await Booking.find()
            .populate("user", "name email")
            .populate("cabin", "name regularPrice")
            .sort({ createdAt: -1 })
            .limit(5)




        const totalRevenue = revenueResult[0]?.totalRevenue ?? 0;
        return res.status(200).json({
            status: 'Success',
            data: {
                stats: {
                    totalBookings,
                    totalCabins,
                    confirmedBookings,
                    totalRevenue
                },
                bookingOverview: bookingPerMonth,
                recentBookings

            }

        })
    }
    catch (error) {
        console.error("Dashboard API error:", error);

        return res.status(500).json({
            status: "error",
            message: "Unable to retrieve dashboard data."
        });
    }
}