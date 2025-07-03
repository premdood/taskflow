import { StatusCodes } from "http-status-codes";
import { JWT } from "../config/config.js";
import CustomAPIError from "../errors/custom-error.js";
import User from "../models/User.js";
import { findMissingFields } from "../utils/index.js";

const login = async (req, res) => {
  const { email, password } = req.body;
  const requiredFields = { email, password };
  const missingFields = findMissingFields(requiredFields);

  if (missingFields.length > 0) {
    throw new CustomAPIError(
      StatusCodes.BAD_REQUEST,
      `Please provide: ${missingFields.join(", ")}`
    );
  }

  let user = await User.findOne({ email }).select("+password -tasks");
  if (!user) {
    throw new CustomAPIError(StatusCodes.UNAUTHORIZED, "Invalid credentials");
  }

  if (!user.isActive) {
    throw new CustomAPIError(
      StatusCodes.UNAUTHORIZED,
      "User account has been deactivated, contact the administrator"
    );
  }

  const isPasswordCorrect = await user.comparePassword(password);
  if (!isPasswordCorrect) {
    throw new CustomAPIError(StatusCodes.UNAUTHORIZED, "Invalid credentials");
  }

  const token = user.createToken();
  user = user.toObject();
  delete user.password;

  res.cookie("token", token, {
    maxAge: JWT.LIFETIME * 1000, // convert to ms
    sameSite: "lax",
    httpOnly: true,
    secure: true,
  });

  res.status(StatusCodes.OK).json({
    success: true,
    data: { token, user },
    message: "Logged in successfully",
  });
};

const logout = async (_req, res) => {
  res.clearCookie("token");

  res
    .status(StatusCodes.OK)
    .json({ success: true, message: "Logged out successfully" });
};

export { login, logout };
