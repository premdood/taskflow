import CustomAPIError from "../errors/custom-error.js";
import { StatusCodes } from "http-status-codes";

const isAdminMiddleware = (req, _res, next) => {
  if (req.user.isAdmin) {
    return next();
  }

  throw new CustomAPIError(
    StatusCodes.FORBIDDEN,
    "Not authorized as admin. Try login as admin."
  );
};

export default isAdminMiddleware;
