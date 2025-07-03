import clsx from "clsx";
import { BiMessageAltDetail } from "react-icons/bi";
import { FaList } from "react-icons/fa";
import { HiArrowsPointingOut } from "react-icons/hi2";
import { IoMdAdd } from "react-icons/io";
import {
  MdAttachFile,
  MdKeyboardArrowDown,
  MdKeyboardArrowUp,
  MdKeyboardDoubleArrowUp,
} from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router";
import {
  setIsAddSubTaskOpen,
  setSelectedTaskId,
} from "../../redux/slices/features/uiSlice.js";
import {
  formatDate,
  PRIORITY_TEXT_COLORS,
  TASK_BG_COLORS,
  USER_BG_COLORS,
} from "../../utils/task.jsx";
import TaskDialog from "../dialog/TaskDialog.jsx";
import { UserCard } from "../user/Index.jsx";

const Icons = {
  high: <MdKeyboardDoubleArrowUp />,
  medium: <MdKeyboardArrowUp />,
  low: <MdKeyboardArrowDown />,
};

function TaskCard({ task }) {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const isAdmin = user?.isAdmin;

  return (
    <div
      to={`/tasks/${task._id}`}
      className="flex h-full w-full cursor-auto flex-col rounded bg-white p-4 shadow-md"
    >
      {/* first layer */}
      <div className="flex w-full justify-between">
        <div
          className={clsx(
            "flex flex-1 items-center gap-1 text-sm font-medium",
            PRIORITY_TEXT_COLORS[task?.priority],
          )}
        >
          <span className="text-lg">{Icons[task?.priority]}</span>
          <span className="uppercase">{task?.priority} Priority</span>
        </div>

        {isAdmin ? (
          <TaskDialog taskId={task._id} />
        ) : (
          <Link to={`${task._id}`}>
            <HiArrowsPointingOut
              title="Open Task"
              className="mr-2 h-5 w-5 text-gray-700"
              aria-hidden
            />
          </Link>
        )}
      </div>

      <div className="flex items-center gap-2">
        <div
          className={clsx("h-4 w-4 rounded-full", TASK_BG_COLORS[task.stage])}
        ></div>
        <h4 className="line-clamp-1 text-black hover:underline">
          <Link to={`${task._id}`}>{task?.title}</Link>
        </h4>
      </div>

      <span className="text-sm text-gray-600">
        {formatDate(new Date(task?.date))}
      </span>

      <div className="my-2 w-full border-t border-gray-200"></div>

      {/* second layer */}
      <div className="mb-2 flex items-center justify-between">
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

        <div className="flex flex-row-reverse items-center">
          {task?.team.map((member, index) => (
            <div
              key={member._id}
              className={clsx(
                `-mr-1 flex h-7 w-7 cursor-pointer items-center justify-center rounded-full text-sm text-white`,
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
      </div>

      <div className="my-2 w-full border-t border-gray-200"></div>

      {/* third layer */}
      <div className="mt-4 text-black">
        {task?.subTasks?.length > 0 ? (
          <>
            <h5 className="line-clamp-1 text-base">
              {task?.subTasks?.[0]?.title}
            </h5>

            <div className="space-x-8 p-4">
              <span className="text-sm text-gray-600">
                {formatDate(new Date(task?.subTasks?.[0]?.date))}
              </span>
              <span className="rounded-full bg-[var(--light-primary-color)] px-3 py-1 text-base font-medium text-[var(--primary-color)] lowercase">
                {task?.subTasks?.[0]?.tag}
              </span>
            </div>
          </>
        ) : (
          <span>No Sub Task</span>
        )}
      </div>

      {isAdmin && (
        <div className="mt-auto w-fit pb-2">
          <button
            onClick={() => {
              dispatch(setSelectedTaskId(task._id));
              dispatch(setIsAddSubTaskOpen(true));
            }}
            disabled={isAdmin ? false : true}
            className="flex w-full cursor-pointer items-center gap-1 p-2 text-sm font-semibold text-gray-500 disabled:cursor-not-allowed disabled:text-gray-300"
          >
            <IoMdAdd className="text-lg" />
            <span className="uppercase">Add Subtask</span>
          </button>
        </div>
      )}
    </div>
  );
}

export default TaskCard;
