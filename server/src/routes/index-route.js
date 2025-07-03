import express from "express";
import authMiddleware from "../middleware/auth-middleware.js";
import isAdminMiddleware from "../middleware/is-admin-middleware.js";
import adminRouter from "./admin-route.js";
import authRouter from "./auth-route.js";
import userRouter from "./user-route.js";

const router = express.Router();

router.use("/auth", authRouter);
router.use("/users", authMiddleware, userRouter);
router.use("/admin", authMiddleware, isAdminMiddleware, adminRouter);

export default router;
