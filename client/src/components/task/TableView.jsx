import clsx from "clsx";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { BiMessageAltDetail } from "react-icons/bi";
import { FaList } from "react-icons/fa";
import {
  MdAttachFile,
  MdKeyboardArrowDown,
  MdKeyboardArrowUp,
  MdKeyboardDoubleArrowUp,
} from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation } from "react-router";
import {
  setConfirmationAction,
  setIsAddTaskOpen,
  setIsConfirmationDialogOpen,
  setSelectedTaskId,
} from "../../redux/slices/features/uiSlice.js";
import {
  getTaskStageFromUrl,
  PRIORITY_TEXT_COLORS,
  TASK_BG_COLORS,
  USER_BG_COLORS,
} from "../../utils/task.jsx";
import { Button } from "../Index.jsx";
import { UserCard } from "../user/Index.jsx";

dayjs.extend(relativeTime);

const Icons = {
  high: <MdKeyboardDoubleArrowUp />,
  medium: <MdKeyboardArrowUp />,
  low: <MdKeyboardArrowDown />,
};

function TableHeader({ isAdmin }) {
  return (
    <thead className="w-full border-b border-gray-300">
      <tr className="w-full text-left text-black">
        <th className="p-2">Task Title</th>
        {!isAdmin && <th className="py-2">Stage</th>}
        <th className="py-2">Priority</th>
        <th className="py-2">Created At</th>
        <th className="hidden py-2 md:block">Assets</th>
        <th className="py-2">Team</th>
      </tr>
    </thead>
  );
}

function TableRow({ dispatch, isAdmin, task }) {
  return (
    <tr className="border-b border-gray-200 text-gray-600 hover:bg-gray-300/10">
      <td className="min-w-70 p-2">
        <div className="flex items-center gap-2">
          <div
            className={clsx(
              "h-4 w-4 rounded-full",
              TASK_BG_COLORS[task?.stage],
            )}
          ></div>
          <Link
            to={`${task._id}`}
            className="line-clamp-2 w-full text-base text-black hover:underline"
          >
            {task?.title}
          </Link>
        </div>
      </td>

      {!isAdmin && (
        <td className="min-w-25 py-2">
          <span className="capitalize">{task.stage}</span>
        </td>
      )}

      <td className="min-w-25 py-2">
        <div className="flex items-center gap-1">
          <span
            className={clsx("text-lg", PRIORITY_TEXT_COLORS[task?.priority])}
          >
            {Icons[task?.priority]}
          </span>
          <span className="capitalize">{task?.priority}</span>
        </div>
      </td>

      <td className="min-w-30 py-2">
        <span className="text-base text-gray-600">
          {dayjs(task.createdAt).fromNow()}
        </span>
      </td>

      <td className="hidden min-w-30 py-2 md:block">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 text-sm text-gray-600">
            <BiMessageAltDetail />
            <span>{task?.activities?.length}</span>
          </div>

          <div className="flex items-center gap-1 text-sm text-gray-600">
            <MdAttachFile />
            <span>{task?.assets?.length ?? 0}</span>
          </div>

          <div className="flex items-center gap-1 text-sm text-gray-600">
            <FaList />
            <span>{task?.subTasks?.length}</span>
          </div>
        </div>
      </td>

      <td className="min-w-30 p-2">
        <div className="flex">
          {task.team.map((member, index) => (
            <div
              key={index}
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

      {isAdmin && (
        <td className="py2 flex justify-end gap-2 md:gap-4">
          <Button
            label="Edit"
            type="button"
            onClick={() => {
              dispatch(setSelectedTaskId(task._id));
              dispatch(setIsAddTaskOpen(true));
            }}
            className="text-sm text-[var(--primary-color)] sm:px-0 md:text-base"
          />

          <Button
            label="Delete"
            type="button"
            onClick={() => {
              dispatch(setSelectedTaskId(task._id));
              dispatch(setConfirmationAction("delete"));
              dispatch(setIsConfirmationDialogOpen(true));
            }}
            className="text-sm text-red-700 sm:px-0 md:text-base"
          />
        </td>
      )}
    </tr>
  );
}

function TableView({ tasks }) {
  const { isAdmin } = useSelector((state) => state.auth.user);
  const { searchText } = useSelector((state) => state.ui);
  const dispatch = useDispatch();

  const location = useLocation();
  const stage = getTaskStageFromUrl(location.pathname);

  const tableRows = tasks
    .filter((task) => !stage || task.stage === stage)
    .map((task) => (
      <TableRow
        key={task._id}
        dispatch={dispatch}
        isAdmin={isAdmin}
        task={task}
      />
    ));

  return (
    <div className="w-full rounded bg-white px-2 pt-4 pb-4 shadow-md md:px-4">
      <div className="overflow-x-auto">
        <table className="mb-5 w-full table-auto">
          <TableHeader isAdmin={isAdmin} />
          <tbody>
            {tasks.length > 0 ? (
              tableRows
            ) : (
              <tr className="border-b border-gray-200 text-gray-600 hover:bg-gray-300/10">
                <td colSpan="6" className="py-2 text-center">
                  {searchText !== ""
                    ? `No task with name "${searchText}"`
                    : "No Task"}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default TableView;
