import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Please provide the notification title"],
    },
    team: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    task: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Task",
    },
    notificationType: {
      type: String,
      enum: {
        values: ["alert", "message"],
        message: "enum validator failed for path `{PATH}` with value `{VALUE}`",
      },
      default: "alert",
    },
    isRead: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  { timestamps: true }
);

const Notification = mongoose.model("Notification", notificationSchema);

export default Notification;
