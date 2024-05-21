export const asyncHandler = (fn) => async (req, res, next) => {
    try {
        await fn(req, res, next); //runing asyncHanler function part not fn()
    } catch (error) {
        res.status(500)
        .json({
            success: false,
            message: error.message,
        });
    }
};
