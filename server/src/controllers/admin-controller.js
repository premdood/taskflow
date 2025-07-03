import { StatusCodes } from "http-status-codes";
import CustomAPIError from "../errors/custom-error.js";
import User from "../models/User.js";
import { findMissingFields } from "../utils/index.js";

const addUser = async (req, res) => {
  const { name, email, title, role } = req.body;
  const requiredFields = { name, email, title, role };
  const missingFields = findMissingFields(requiredFields);

  if (missingFields.length > 0) {
    throw new CustomAPIError(
      StatusCodes.BAD_REQUEST,
      `Please provide: ${missingFields.join(", ")}`
    );
  }

  const user = await User.create({
    name,
    email,
    title,
    role,
    password: email,
  });

  res.status(StatusCodes.CREATED).json({
    success: true,
    message: "User added successfully",
  });
};

const getTeamList = async (req, res) => {
  const { search, fields } = req.query;
  let query = { isAdmin: false };

  if (search) {
    query = {
      ...query,
      $or: [
        { name: { $regex: search, $options: "i" } },
        { title: { $regex: search, $options: "i" } },
        { role: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ],
    };
  }

  const fieldList =
    fields?.split(",").join(" ") || "name title role email isActive";
  query = User.find(query).select(fieldList);

  const teamList = await query;

  res.status(StatusCodes.OK).json({
    success: true,
    data: teamList,
    message: "Team fetched successfully",
  });
};

const changeUserStatus = async (req, res) => {
  const { id: userIdToUpdate } = req.params;

  const user = await User.findById(userIdToUpdate);
  if (!user) {
    throw new CustomAPIError(StatusCodes.NOT_FOUND, "User not found");
  }

  user.isActive = !user.isActive;
  await user.save();

  res.status(StatusCodes.OK).json({
    success: true,
    message: `User account has been ${
      user.isActive ? "activated" : "deactivated"
    } successfully`,
  });
};

const deleteUserProfile = async (req, res) => {
  const { id: userIdToDelete } = req.params;

  const user = await User.findById(userIdToDelete);
  if (!user) {
    throw new CustomAPIError(StatusCodes.NOT_FOUND, "User not found");
  }

  await User.findByIdAndDelete(userIdToDelete);
  res
    .status(StatusCodes.OK)
    .json({ success: true, message: "User deleted successfully" });
};

export { addUser, changeUserStatus, deleteUserProfile, getTeamList };
