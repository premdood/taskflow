import { StatusCodes } from "http-status-codes";
import jwt from "jsonwebtoken";
import { JWT } from "../config/config.js";
import CustomAPIError from "../errors/custom-error.js";
import User from "../models/User.js";

const authMiddleware = async (req, _res, next) => {
  const token = req.cookies.token || req.headers.authorization?.split(" ")[1];

  if (token) {
    const { userId } = jwt.verify(token, JWT.SECRET);
    const { email, isAdmin } = await User.findById(userId).select(
      "email isAdmin"
    );

    req.user = { userId, email, isAdmin };
    return next();
  }

  throw new CustomAPIError(StatusCodes.UNAUTHORIZED, "Not Authorized");
};

export default authMiddleware;
