import express from "express";
import * as notificationController from "../controllers/notification.controller.js";
import authenticate from "../middleware/authenticate.js";

const router = express.Router();

router.use(authenticate); // All notification routes require authentication

router.get("/", notificationController.getNotifications);
router.patch("/read-all", notificationController.markAllRead);
router.patch("/:id/read", notificationController.markRead);
router.patch("/:id/unread", notificationController.markUnread);
router.delete("/:id", notificationController.deleteNotification);

export default router;
