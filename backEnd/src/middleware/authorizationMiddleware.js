export const restrictTo = (...roles) => {
    return (req, res, next) => {
        const authed = roles.includes(req.user.role)
        if (!authed) {
            return res.status(403).json({
                status: "failed",
                message: "You are not allowed to perform this action"
            })
        }
        next()

    }

}