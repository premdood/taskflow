import { StatusCodes } from "http-status-codes";
import mongoose from "mongoose";
import CustomAPIError from "../errors/custom-error.js";
import Notification from "../models/Notification.js";
import Task from "../models/Task.js";
import User from "../models/User.js";
import { copyFiles, getFilesUrl, uploadFiles } from "../supabaseClient.js";
import { findMissingFields } from "../utils/index.js";

const createTask = async (req, res) => {
  const { userId } = req.user;
  const { title, date, priority, stage, team, description } = req.body;

  const requiredFields = { title, team };
  const missingFields = findMissingFields(requiredFields);

  if (missingFields.length > 0) {
    throw new CustomAPIError(
      StatusCodes.BAD_REQUEST,
      `Please provide ${missingFields.join(", ")}`
    );
  }

  const assets = req.files;
  const taskId = new mongoose.Types.ObjectId();

  // upload files to supabase
  const assetsUrl = await Promise.all(
    assets.map(async (asset) => {
      const path = `task-${taskId}/${Date.now()}-${asset.originalname}`;
      await uploadFiles(path, asset);
      return path;
    })
  );

  // create notification for users
  let text = "New task has been assigned to you ";
  if (team.length > 1) {
    text += `and ${team.length - 0} others`;
  }
  // prettier-ignore
  text += `. The task is a ${priority || "low"} priority, so check and act accordingly. The task date is ${new Date(date || "").toDateString()}. Thank you!`;

  // create activity for task
  const activity = {
    type: "assigned",
    title: "Task created",
    by: userId,
  };

  const task = await Task.create({
    _id: taskId,
    title,
    date,
    priority: priority || "low",
    stage: stage || "todo",
    team,
    assets: assetsUrl,
    description,
    activities: activity,
  });

  await Notification.create({
    title: text,
    team,
    task: task._id,
  });

  await User.updateMany({ _id: { $in: team } }, { $push: { tasks: task._id } });

  res
    .status(StatusCodes.CREATED)
    .json({ success: true, data: task, message: "Task created successfully" });
};

const getAllTask = async (req, res) => {
  const { userId, isAdmin } = req.user;
  const { stage, isTrashed, search } = req.query;

  const query = { isTrashed: false };
  stage && (query.stage = stage);
  isTrashed && (query.isTrashed = Boolean(isTrashed));
  !isAdmin && (query.team = { $all: userId });
  search && (query.title = { $regex: search, $options: "i" });

  const tasks = await Task.find(query)
    .populate("team", "name title role email")
    .sort({ _id: -1 });

  res.status(StatusCodes.OK).json({
    success: true,
    data: tasks,
    message: "Tasks Fetched successfully",
  });
};

const duplicateTask = async (req, res) => {
  const { userId } = req.user;
  const { id: taskId } = req.params;

  const task = await Task.findById(taskId);
  if (!task) {
    throw new CustomAPIError(StatusCodes.NOT_FOUND, "Task not found");
  }

  const newTaskId = new mongoose.Types.ObjectId();

  // create new asset url for duplicate task
  const newAssetsUrl = await Promise.all(
    task.assets?.map(async (asset) => {
      const oldFileName = asset.split("-").pop();
      const toPath = `task-${newTaskId}/${Date.now()}-${oldFileName}`;
      await copyFiles(asset, toPath);
      return toPath;
    })
  );

  // create notification for users
  let text = "New task has been assigned to you ";
  if (task.team.length > 1) {
    text += `and ${task.team.length - 0} others`;
  }
  // prettier-ignore
  text += `. The task is a ${task.priority} priority, so check and act accordingly. The task date is ${new Date().toDateString()}. Thank you!`;

  // create activity for task
  const activity = {
    type: "assigned",
    title: "Task created",
    by: userId,
  };

  const duplicateTask = await Task.create({
    _id: newTaskId,
    title: `Duplicate - ${task.title}`,
    priority: task.priority,
    stage: task.stage,
    team: task.team,
    assets: newAssetsUrl,
    subTasks: task?.subTasks,
    description: task?.description,
    activities: activity,
  });

  await Notification.create({
    title: text,
    team: duplicateTask.team,
    task: duplicateTask._id,
  });

  await User.updateMany(
    { _id: { $in: duplicateTask.team } },
    { $push: { tasks: duplicateTask._id } }
  );

  res.status(StatusCodes.CREATED).json({
    success: true,
    data: duplicateTask,
    message: "Task duplicated successfully",
  });
};

const getSingleTask = async (req, res) => {
  const { userId, isAdmin } = req.user;
  const { id: taskId } = req.params;

  const query = { _id: taskId };
  !isAdmin && (query.team = { $in: userId });

  const task = await Task.findOne(query)
    .populate("team", "name title role")
    .populate("activities.by", "name title role")
    .lean();

  if (!task) {
    throw new CustomAPIError(StatusCodes.NOT_FOUND, "Task not found");
  }

  if (task.assets.length > 0) {
    task.assets = await getFilesUrl(task.assets);
  }

  res.status(StatusCodes.OK).json({
    success: true,
    data: task,
    message: "Task fetched successfully",
  });
};

const createSubTask = async (req, res) => {
  const { id: taskId } = req.params;
  const { title, date, tag } = req.body;

  if (!title) {
    throw new CustomAPIError(
      StatusCodes.BAD_REQUEST,
      "Please provide sub-task title"
    );
  }

  const subTask = { tag, date, title };

  await Task.findByIdAndUpdate(taskId, {
    $push: { subTasks: subTask },
  });

  res
    .status(StatusCodes.CREATED)
    .json({ success: true, message: "Sub-task created successfully" });
};

const updateTask = async (req, res) => {
  const { id: taskId } = req.params;
  const { title, team, stage, priority, date, description } = req.body;
  const assets = req.files;

  const task = await Task.findById(taskId);
  if (!task) {
    throw new CustomAPIError(StatusCodes.NOT_FOUND, "Task not found");
  }

  const assetsUrl = await Promise.all(
    assets.map(async (asset) => {
      const path = `task-${taskId}/${Date.now()}-${asset.originalname}`;
      await uploadFiles(path, asset);
      return path;
    })
  );

  title && (task.title = title);
  team && (task.team = team);
  stage && (task.stage = stage);
  priority && (task.priority = priority);
  date && (task.date = date);
  assets && (task.assets = assetsUrl);
  description && (task.description = description);

  await task.save();

  res
    .status(StatusCodes.OK)
    .json({ success: true, message: "Task updated successfully" });
};

const toggleSubTaskCompletion = async (req, res) => {
  const { id: taskId, subTaskId } = req.params;

  const task = await Task.findOne(
    { _id: taskId, "subTasks._id": subTaskId },
    { "subTasks.$": 1 }
  );

  if (!task || !task.subTasks) {
    throw new CustomAPIError(StatusCodes.NOT_FOUND, "Sub-Task not found");
  }

  const prevValue = task.subTasks[0].isCompleted;
  await Task.findOneAndUpdate(
    { _id: taskId, "subTasks._id": subTaskId },
    { $set: { "subTasks.$.isCompleted": !prevValue } }
  );

  res.status(StatusCodes.OK).json({
    success: true,
    message: `Sub-Task marked as ${prevValue ? "not completed" : "completed"}`,
  });
};

const trashTask = async (req, res) => {
  const { id: taskId } = req.params;
  await Task.findByIdAndUpdate(taskId, { isTrashed: true });

  res
    .status(StatusCodes.OK)
    .json({ success: true, message: "Task trashed successfully" });
};

const deleteTrashedTask = async (req, res) => {
  const { id: taskId } = req.params;

  await Task.findByIdAndDelete(taskId);
  await User.updateMany(
    { tasks: { $all: taskId } },
    { $pull: { tasks: taskId } }
  );

  res
    .status(StatusCodes.OK)
    .json({ success: true, message: "Task deleted successfully" });
};

const deleteAllTrashedTask = async (_req, res) => {
  const trashedTaskIds = await Task.find({ isTrashed: true }).select("_id");
  await User.updateMany(
    { tasks: { $in: trashedTaskIds } },
    { $pull: { tasks: { $in: trashedTaskIds } } }
  );
  await Task.deleteMany({ isTrashed: true });

  res
    .status(StatusCodes.OK)
    .json({ success: true, message: "Deleted all tasks successfully" });
};

const restoreTrashedTask = async (req, res) => {
  const { id: taskId } = req.params;
  await Task.findByIdAndUpdate(taskId, { isTrashed: false });

  res
    .status(StatusCodes.OK)
    .json({ success: true, message: "Task restored successfully" });
};

const restoreAllTrashedTask = async (_req, res) => {
  await Task.updateMany({ isTrashed: true }, { $set: { isTrashed: false } });

  res
    .status(StatusCodes.OK)
    .json({ success: true, message: "Restored all task successfully" });
};

export {
  createSubTask,
  createTask,
  deleteAllTrashedTask,
  deleteTrashedTask,
  duplicateTask,
  getAllTask,
  getSingleTask,
  restoreAllTrashedTask,
  restoreTrashedTask,
  toggleSubTaskCompletion,
  trashTask,
  updateTask,
};
