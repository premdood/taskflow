import clsx from "clsx";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import {
  MdKeyboardArrowDown,
  MdKeyboardArrowUp,
  MdKeyboardDoubleArrowUp,
} from "react-icons/md";
import {
  PRIORITY_TEXT_COLORS,
  TASK_BG_COLORS,
  USER_BG_COLORS,
} from "../../utils/task.jsx";
import { UserCard } from "../user/Index.jsx";

dayjs.extend(relativeTime);

const Icons = {
  high: <MdKeyboardDoubleArrowUp />,
  medium: <MdKeyboardArrowUp />,
  low: <MdKeyboardArrowDown />,
};

function TableHeader({ isAdmin }) {
  return (
    <thead className="border-b border-gray-300">
      <tr className="text-left text-black">
        <th className="p-2">Task Title</th>
        <th className="py-2">Priority</th>
        {!isAdmin && <th className="py-2">Stage</th>}
        <th className="py-2">Team</th>
        <th className="hidden py-2 md:block">Created At</th>
      </tr>
    </thead>
  );
}

function TableRow({ task, isAdmin }) {
  return (
    <tr className="border-b border-gray-300 text-gray-600 hover:bg-gray-300/10">
      <td className="min-w-70 p-2">
        <div className="flex items-center gap-2">
          <div
            className={clsx("h-4 w-4 rounded-full", TASK_BG_COLORS[task.stage])}
          ></div>

          <div>
            <p className="text-base text-black">{task.title}</p>
          </div>
        </div>
      </td>

      <td className="min-w-25 py-2">
        <div className="flex items-center gap-1">
          <span
            className={clsx("text-lg", PRIORITY_TEXT_COLORS[task.priority])}
          >
            {Icons[task.priority]}
          </span>
          <span className="capitalize">{task.priority}</span>
        </div>
      </td>

      {!isAdmin && (
        <td className="min-w-25 py-2">
          <span className="capitalize">{task.stage}</span>
        </td>
      )}

      <td className="min-w-25 p-2">
        <div className="flex">
          {task.team.map((member, index) => (
            <div
              key={member._id}
              className={clsx(
                `-mr-1 flex h-7 w-7 items-center justify-center rounded-full text-sm text-white`,
                USER_BG_COLORS[index % USER_BG_COLORS.length],
              )}
            >
              <UserCard
                user={member}
                bg={USER_BG_COLORS[index % USER_BG_COLORS.length]}
              />
            </div>
          ))}
        </div>
      </td>

      <td className="hidden min-w-30 p-2 md:block">
        <span className="text-base text-gray-600">
          {dayjs(task.createdAt).fromNow()}
        </span>
      </td>
    </tr>
  );
}

function DashboardTaskTable({ tasks, isAdmin }) {
  return (
    <div className="w-full flex-2/3 overflow-x-auto rounded bg-white px-2 pt-4 pb-4 shadow-md md:px-4">
      <table className="mb-5 w-full table-auto">
        <TableHeader isAdmin={isAdmin} />
        <tbody>
          {tasks?.map((task, index) => (
            <TableRow key={index} isAdmin={isAdmin} task={task}></TableRow>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default DashboardTaskTable;
