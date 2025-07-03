import express from "express";
import { login, logout } from "../controllers/auth-controller.js";
import authMiddelware from "../middleware/auth-middleware.js";

const router = express.Router();

router.route("/login").post(login);
router.route("/logout").post(logout);

export default router;
