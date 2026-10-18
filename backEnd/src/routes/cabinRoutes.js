import { Router } from "express"
import { createCabin, deleteCabin, getAllCabins, getCabin, updateCabin } from "../controllers/cabinController.js"
import multer from "multer"
import { protect } from "../middleware/authMiddleware.js";
import { restrictTo } from "../middleware/authorizationMiddleware.js";



const router = Router()
const upload = multer({
    storage: multer.memoryStorage()
})

router.route("/")
    .get(protect,
        restrictTo("admin", "user"),
        getAllCabins)
    .post(upload.single("image"), createCabin)

router.route("/:id")
    .get(getCabin)
    .patch(upload.single("image"), updateCabin)
    .delete(deleteCabin)

export default router