import { StatusCodes } from "http-status-codes";
import CustomAPIError from "../errors/custom-error.js";
import Notification from "../models/Notification.js";
import Task from "../models/Task.js";
import User from "../models/User.js";
import { findMissingFields } from "../utils/index.js";

const getNotificationList = async (req, res) => {
  const { userId } = req.user;

  const notificationList = await Notification.find({
    team: { $in: userId },
    isRead: { $nin: userId },
  })
    .populate("task", "title")
    .sort({ _id: -1 });

  res.status(StatusCodes.OK).json({
    success: true,
    data: notificationList,
    message: "Notifications fetched successfully",
  });
};

const markNotificationRead = async (req, res) => {
  const { userId } = req.user;
  const { readType, notificationId } = req.body;
  let message;

  if (readType === "all") {
    await Notification.updateMany(
      { team: { $in: userId }, isRead: { $nin: userId } },
      { $push: { isRead: userId } }
    );
    message = "Marked all notifications as read";
  } else {
    await Notification.updateOne(
      { _id: notificationId, isRead: { $nin: userId } },
      { $push: { isRead: userId } }
    );
    message = "Marked notification as read";
  }

  res.status(StatusCodes.OK).json({ success: true, message });
};

const updateProfile = async (req, res, next) => {
  const { userId } = req.user;
  const { userId: id } = req.body;

  if (id !== userId && !req.user.isAdmin) {
    throw new CustomAPIError(
      StatusCodes.FORBIDDEN,
      "Not authorized as admin. Try login as admin."
    );
  }

  const userIdToUpdate = req.user.isAdmin ? id : userId;

  const user = await User.findById(userIdToUpdate).select("-tasks");
  if (!user) {
    throw new CustomAPIError(StatusCodes.NOT_FOUND, "User not found");
  }

  user.name = req.body.name || user.name;
  user.email = req.body.email || user.email;
  user.title = req.body.title || user.title;
  user.role = req.body.role || user.role;

  await user.save();

  res.status(StatusCodes.OK).json({
    success: true,
    data: user,
    message: "Profile updated successfully",
  });
};

const changePassword = async (req, res) => {
  const { userId } = req.user;
  const { newPassword } = req.body;

  let user = await User.findById(userId).select("+password");

  if (await user.comparePassword(newPassword)) {
    throw new CustomAPIError(
      StatusCodes.BAD_REQUEST,
      "Previous password and new password can't be same"
    );
  }

  user.password = newPassword;
  user = await user.save();

  res
    .status(StatusCodes.OK)
    .json({ success: true, message: "Password updated successfully" });
};

const postActivity = async (req, res) => {
  const { userId } = req.user;
  const { id: taskId } = req.params;

  const { type, title, date } = req.body;
  const requiredFields = { type, title };
  const missingFields = findMissingFields(requiredFields);

  if (missingFields.length > 0) {
    throw new CustomAPIError(
      StatusCodes.BAD_REQUEST,
      `Please specify ${missingFields.join(", ")} of the activity`
    );
  }

  const activity = {
    type,
    title,
    date,
    by: userId,
  };

  await Task.findByIdAndUpdate(taskId, {
    $push: { activities: activity },
  });

  res.status(StatusCodes.CREATED).json({
    success: true,
    message: "Activity posted successfully",
  });
};

const getDashboardStatistics = async (req, res) => {
  const { userId, isAdmin } = req.user;

  const query = { isTrashed: false };
  !isAdmin && (query.team = { $all: userId });

  // fetch all tasks from the database
  const allTasks = await Task.find(query)
    .populate("team", "name title role email")
    .sort({ _id: -1 });

  // fetch users data
  const users = await User.find({ isActive: true, isAdmin: false })
    .select("name title role isActive createdAt")
    .limit(10)
    .sort({ _id: -1 });

  // get tasks stage data
  const stageArray = ["todo", "in-progress", "completed"];
  const tasksStageData = {};
  stageArray.forEach((stage) => {
    tasksStageData[stage] = allTasks.filter(
      (task) => task.stage === stage
    ).length;
  });

  // get graph data. Transformed it according to recharts library
  const prioritiesArray = ["low", "medium", "high"];
  const graphData = prioritiesArray.map((priority) => ({
    name: priority,
    total: allTasks.filter((task) => task.priority === priority).length,
  }));

  const newest10Tasks = allTasks.slice(0, 10);
  const totalTasks = allTasks.length;
  tasksStageData.total = totalTasks;

  const data = {
    totalTasks,
    tasksStageData,
    graphData,
    newest10Tasks,
    users: isAdmin ? users : [],
  };

  res.status(StatusCodes.OK).json({
    success: true,
    data,
    message: "Dashboard statistics fetched successfully",
  });
};

export {
  changePassword,
  getDashboardStatistics,
  getNotificationList,
  markNotificationRead,
  postActivity,
  updateProfile,
};
