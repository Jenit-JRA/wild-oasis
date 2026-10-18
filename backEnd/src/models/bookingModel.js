import mongoose from "mongoose"


const bookingSchema = new mongoose.Schema({
    name: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true,
    },
    cabin: {
        type: mongoose.Schema.ObjectId,
        ref: 'Cabin',
        required: true,
    },
    startDate: {
        type: Date,
        required: true,
    },
    endDate: {
        type: Date,
        required: true,
    },
    noOfGuests: {
        type: Number,
        required: true,
        min: 1
    },
    totalPrice: {
        type: Number,
        required: true,
        min: 0
    },
    status: {
        type: String,
        enum: ['CONFIRMED', 'CANCELLED'],
        default: 'CONFIRMED'
    }

},
    {
        timestamps: true
    })

const Booking = mongoose.model("Booking", bookingSchema)
export default Booking;