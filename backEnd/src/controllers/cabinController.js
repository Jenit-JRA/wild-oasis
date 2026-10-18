import Cabin from "../models/cabinModel.js"
import cloudinary from "../config/cloudinary.js";
import { uploadToCloudinary } from "../config/cloudinary.js";


export const getAllCabins = async (req, res) => {
    try {
        const cabins = await Cabin.find()
        res.status(200).json({
            status: "success",
            data: cabins
        })
    }
    catch (e) {
        res.status(500).json({
            status: "error",
            message: e.message
        })

    }

}
export const createCabin = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                status: "fail",
                message: "Cabin image is required",
            });
        }

        const result = await uploadToCloudinary(req.file.buffer);

        const cabin = await Cabin.create({
            ...req.body,
            image: result.secure_url,
        });

        res.status(201).json({
            status: "success",
            data: cabin,
        });

    } catch (e) {
        res.status(500).json({
            status: "error",
            message: e.message
        })
    }
};
export const getCabin = async (req, res) => {
    try {


        const cabin = await Cabin.findById(req.params.id)
        res.status(200).json({
            status: "success",
            data: cabin
        })
    }
    catch (e) {
        res.status(500).json({
            status: "error",
            message: e.message
        })
    }


}
export const updateCabin = async (req, res) => {

    try {
        const updatedData = { ...req.body }
        if (req.file) {

            const result = await uploadToCloudinary(req.file.buffer);
            updatedData.image = result.secure_url

        }

        const cabin = await Cabin.findByIdAndUpdate(
            req.params.id,
            updatedData,
            {
                new: true,
                runValidators: true,
            }
        );

        res.status(200).json({
            status: "success",
            data: cabin,
        });
    } catch (e) {
        res.status(400).json({
            status: "fail",
            message: e.message,
        });
    }
};
export const deleteCabin = async (req, res) => {
    try {
        await Cabin.findByIdAndDelete(req.params.id)
        res.status(204).json({
            status: "success",
            message: "Deleted",
        });

    }
    catch (e) {
        res.status(500).json({
            status: "fail",
            message: e.message,
        });

    }
}
