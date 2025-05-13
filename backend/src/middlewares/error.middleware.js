import { HTTP_ERROR } from "../constants/httpCode.js";

const errorMiddleware = (err, req, res, next) => {
    try {
        res.status(err.status || HTTP_ERROR.INTERNAL_SERVER_ERROR).json({
            message: err.message || 'Internal server error'
        })
    } catch (error) {
        next(error);
    }
}

export default errorMiddleware;