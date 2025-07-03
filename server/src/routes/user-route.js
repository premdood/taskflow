import express from "express";
import {
  getAllTask,
  getSingleTask,
  toggleSubTaskCompletion,
} from "../controllers/task-controller.js";
import {
  changePassword,
  getDashboardStatistics,
  getNotificationList,
  markNotificationRead,
  postActivity,
  updateProfile,
} from "../controllers/user-controller.js";

const router = express.Router();

router.route("/dashboard").get(getDashboardStatistics);

router
  .route("/notifications")
  .get(getNotificationList)
  .patch(markNotificationRead);

router.route("/profile").patch(updateProfile);
router.route("/password").patch(changePassword);

router.route("/tasks").get(getAllTask);
router.route("/tasks/:id").get(getSingleTask);

router.route("/tasks/:id/sub-task/:subTaskId").patch(toggleSubTaskCompletion);
router.route("/tasks/:id/activities").post(postActivity);

export default router;
