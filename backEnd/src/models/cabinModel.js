import mongoose from "mongoose";

const cabinSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    maxCapacity: {
        type: Number,
        required: true,
    },
    regularPrice: {
        type: Number,
        required: true,
    },
    discount: {
        type: Number,
        default: 0,
    },
    image: String,
    description: String,
});
const Cabin = mongoose.model("Cabin", cabinSchema)

export default Cabin;