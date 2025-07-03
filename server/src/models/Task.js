import mongoose from "mongoose";

const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Please provide a name for the task"],
    },
    date: {
      type: Date,
      default: new Date(),
    },
    description: String,
    priority: {
      type: String,
      enum: {
        values: ["high", "medium", "low"],
        message: "enum validator failed for path `{PATH}` with value `{VALUE}`",
      },
      default: "low",
    },
    stage: {
      type: String,
      enum: {
        values: ["todo", "in-progress", "completed"],
        message: "enum validator failed for path `{PATH}` with value `{VALUE}`",
      },
      default: "todo",
    },
    activities: [
      {
        type: {
          type: String,
          enum: {
            values: [
              "assigned",
              "started",
              "in-progress",
              "bug",
              "completed",
              "commented",
            ],
            message:
              "enum validator failed for path `{PATH}` with value `{VALUE}`",
          },
        },
        title: {
          type: String,
          required: [true, "Please provide message in the activity"],
        },
        date: {
          type: Date,
          default: new Date(),
        },
        by: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
      },
    ],
    subTasks: [
      {
        title: {
          type: String,
          required: [true, "Please provide sub-task title"],
        },
        date: {
          type: Date,
          default: new Date(),
        },
        tag: String,
        isCompleted: {
          type: Boolean,
          default: false,
        },
      },
    ],
    assets: [String],
    team: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    isTrashed: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const Task = mongoose.model("Task", taskSchema);

export default Task;
