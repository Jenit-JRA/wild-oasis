import jwt from "jsonwebtoken";

export const protect = async (req, res, next) => {
    try {
        const authedHeader = req?.headers?.authorization
        if (!authedHeader) {
            return res.status(401).json({
                status: "fail",
                message: "You are not logged in"
            });
        }
        const token = authedHeader.split(" ")[1]
        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        )
        req.user = decoded
        next()


    }
    catch (e) {
        return res.status(401).json({
            status: "fail",
            message: "Invalid or expired token"
        });

    }

}