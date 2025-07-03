import { StatusCodes } from "http-status-codes";
import { NODE_ENV } from "../config/config.js";
import CustomAPIError from "../errors/custom-error.js";

const errorHandlerMiddleware = (err, _req, res, _next) => {
  if (err instanceof CustomAPIError) {
    return res
      .status(err.statusCode)
      .json({ success: false, message: err.message });
  }

  const customError = new CustomAPIError(
    StatusCodes.INTERNAL_SERVER_ERROR,
    "Something went wrong. Please try again later"
  );

  if (err.name === "TokenExpiredError") {
    customError.statusCode = StatusCodes.UNAUTHORIZED;
    customError.message = "Token Expired. Login again";
  }

  if (err.name == "JsonWebTokenError") {
    customError.statusCode = StatusCodes.UNAUTHORIZED;
    customError.message = "Invalid token";
  }

  if (err.name === "CastError" && err.kind === "ObjectId") {
    customError.statusCode = StatusCodes.NOT_FOUND;
    customError.message = "Resource not found";
  }

  if (err?.cause?.code === 11000) {
    customError.statusCode = StatusCodes.BAD_REQUEST;
    customError.message = "User already exist with email";
  }

  res.status(customError.statusCode).json({
    success: false,
    message: customError.message,
    stack: NODE_ENV === "production" ? null : err.stack,
  });
};

export default errorHandlerMiddleware;
