import express from "express";
import {
  addUser,
  changeUserStatus,
  deleteUserProfile,
  getTeamList,
} from "../controllers/admin-controller.js";
import {
  createSubTask,
  createTask,
  deleteAllTrashedTask,
  deleteTrashedTask,
  duplicateTask,
  restoreAllTrashedTask,
  restoreTrashedTask,
  trashTask,
  updateTask,
} from "../controllers/task-controller.js";
import multer from "multer";

const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({ storage });

router.route("/users").get(getTeamList).post(addUser);
router.route("/users/:id").delete(deleteUserProfile);
router.route("/users/:id/status").patch(changeUserStatus);

router.route("/tasks").post(upload.array("assets"), createTask);
router
  .route("/tasks/:id")
  .patch(upload.array("assets"), updateTask)
  .delete(trashTask);
router.route("/tasks/:id/duplicate").post(duplicateTask);
router.route("/tasks/:id/sub-tasks").post(createSubTask);

router
  .route("/trash")
  .patch(restoreAllTrashedTask)
  .delete(deleteAllTrashedTask);
router.route("/trash/:id").patch(restoreTrashedTask).delete(deleteTrashedTask);

export default router;
