import { StatusCodes } from "http-status-codes";

const notFoundMiddleware = (req, res) => {
  return res
    .status(StatusCodes.NOT_FOUND)
    .json({ success: false, message: `${req.path} doesn't exist` });
};

export default notFoundMiddleware;
