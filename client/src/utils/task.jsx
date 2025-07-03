import dayjs from "dayjs";
import { Suspense } from "react";
import {
  MdKeyboardArrowDown,
  MdKeyboardArrowUp,
  MdKeyboardDoubleArrowUp,
} from "react-icons/md";
import { Loader } from "../components/Index";

const PRIORITY_BG_COLORS = {
  high: "bg-red-200",
  medium: "bg-yellow-200",
  low: "bg-blue-200",
};

const PRIORITY_ICONS = {
  high: <MdKeyboardDoubleArrowUp />,
  medium: <MdKeyboardArrowUp />,
  low: <MdKeyboardArrowDown />,
};

const PRIORITY_TEXT_COLORS = {
  high: "text-red-600",
  medium: "text-yellow-600",
  low: "text-blue-600",
};

const TASK_BG_COLORS = {
  todo: "bg-blue-600",
  "in-progress": "bg-yellow-600",
  completed: "bg-green-600",
};

const USER_BG_COLORS = [
  "bg-blue-600",
  "bg-yellow-600",
  "bg-red-600",
  "bg-green-600",
];

function dateFormatter(dateString) {
  const date = dayjs(dateString);
  if (isNaN(date)) {
    return "Invalid Date";
  }
  const formattedDate = date.format("YYYY-MM-DD");
  return formattedDate;
}

function formatDate(dateObj) {
  const date = dayjs(dateObj);
  const formattedDate = date.format("DD-MMM-YYYY");
  return formattedDate;
}

function getTaskStageFromUrl(pathname) {
  const taskStage = pathname.split("/").at(-1);
  const validStages = ["completed", "in-progress", "todo"];
  return validStages.includes(taskStage) ? taskStage : null;
}

// eslint-disable-next-line no-unused-vars
const withSuspense = (Component) => {
  return function SuspendedComponent(props) {
    return (
      <Suspense fallback={<Loader />}>
        <Component {...props} />
      </Suspense>
    );
  };
};

export {
  dateFormatter,
  formatDate,
  getTaskStageFromUrl,
  PRIORITY_BG_COLORS,
  PRIORITY_ICONS,
  PRIORITY_TEXT_COLORS,
  TASK_BG_COLORS,
  USER_BG_COLORS,
  withSuspense,
};
