import clsx from "clsx";
import {
  MdDelete,
  MdKeyboardArrowDown,
  MdKeyboardArrowUp,
  MdKeyboardDoubleArrowUp,
  MdOutlineRestore,
} from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router";
import { toast } from "sonner";
import {
  Button,
  ConfirmationDialog,
  Loader,
  Title,
} from "../components/Index.jsx";
import {
  useDeleteAllTaskMutation,
  useDeleteSingleTaskMutation,
  useGetAllTaskQuery,
  useRestoreAllTAskMutation,
  useRestoreSingleTaskMutation,
} from "../redux/slices/api/taskAPISlice.js";
import {
  setConfirmationAction,
  setIsConfirmationDialogOpen,
  setSelectedTaskId,
} from "../redux/slices/features/uiSlice.js";
import { PRIORITY_TEXT_COLORS, TASK_BG_COLORS } from "../utils/task.jsx";

const Icons = {
  high: <MdKeyboardDoubleArrowUp />,
  medium: <MdKeyboardArrowUp />,
  low: <MdKeyboardArrowDown />,
};

function TableHeader() {
  return (
    <thead className="w-full border-b border-gray-300">
      <tr className="w-full text-left text-black">
        <th className="p-2">Task Title</th>
        <th className="py-2">Priority</th>
        <th className="py-2">Stage</th>
        <th className="line-clamp-1 py-2">Modified On</th>
      </tr>
    </thead>
  );
}

function TableRow({ task, dispatch }) {
  return (
    <tr className="border-b border-gray-200 text-gray-600 hover:bg-gray-300/10">
      <td className="min-w-70 p-2 text-nowrap">
        <div className="flex items-center gap-2">
          <div
            className={clsx(
              "h-4 w-4 rounded-full",
              TASK_BG_COLORS[task?.stage],
            )}
          ></div>
          <Link
            to={`/tasks/${task._id}`}
            className="line-clamp-2 w-full text-base text-black hover:underline"
          >
            {task?.title}
          </Link>
        </div>
      </td>

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

      <td className="min-w-25 py-2 capitalize md:text-start">{task?.stage}</td>

      <td className="min-w-35 py-2 text-sm">
        {new Date(task?.updatedAt).toDateString()}
      </td>

      <td className="flex justify-end gap-2 md:gap-4">
        <Button
          type="button"
          icon={<MdOutlineRestore className="text-xl text-gray-500" />}
          onClick={() => {
            dispatch(setSelectedTaskId(task._id));
            dispatch(setConfirmationAction("restore"));
            dispatch(setIsConfirmationDialogOpen(true));
          }}
        />

        <Button
          type="button"
          icon={<MdDelete className="text-xl text-red-600" />}
          onClick={() => {
            dispatch(setSelectedTaskId(task._id));
            dispatch(setConfirmationAction("delete"));
            dispatch(setIsConfirmationDialogOpen(true));
          }}
        />
      </td>
    </tr>
  );
}

function Trash() {
  const {
    searchText,
    selectedTaskId,
    confirmationAction,
    isConfirmationDialogOpen,
  } = useSelector((state) => state.ui);

  const dispatch = useDispatch();

  const { data, isLoading, error } = useGetAllTaskQuery({
    isTrashed: true,
    search: searchText,
  });
  const tasks = data?.data;
  const selectedTask = tasks?.find((task) => task._id === selectedTaskId);

  const [restoreSingleTask] = useRestoreSingleTaskMutation();
  const [deleteSingleTask] = useDeleteSingleTaskMutation();
  const [restoreAllTask] = useRestoreAllTAskMutation();
  const [deleteAllTask] = useDeleteAllTaskMutation();

  if (isLoading) {
    return <Loader />;
  }

  if (error) {
    console.error(error);
    toast.error(error?.data?.message || error?.message || error?.status);
  }

  const confirmationMap = {
    restore: {
      mutation: (taskId) => restoreSingleTask(taskId),
      message: `Are you sure you want to restore "${selectedTask?.title}" task`,
    },
    delete: {
      mutation: (taskId) => deleteSingleTask(taskId),
      message: `Are you sure you want to delete "${selectedTask?.title}" task`,
    },
    "restore all": {
      mutation: () => restoreAllTask(),
      message: `Are you sure you want to restore all tasks`,
    },
    "delete all": {
      mutation: () => deleteAllTask(),
      message: `Are you sure you want to delete all tasks`,
    },
  };

  const mutation = confirmationMap[confirmationAction]?.mutation;
  const confirmationMessage = confirmationMap[confirmationAction]?.message;

  const confirmationHandler = async () => {
    try {
      const result = await mutation({ taskId: selectedTaskId }).unwrap();
      result.success
        ? toast.success(result.message)
        : toast.error(result.message);
    } catch (err) {
      console.error(err);
      toast.error(err?.data?.message || err?.message || err?.status);
    }
  };

  return (
    <div className="mb-6 w-full px-0 md:px-1">
      <div className="mb-8 flex items-center justify-between">
        <Title title="Trashed Tasks" />

        <div className="flex min-w-32 flex-col items-center gap-0 min-[500px]:flex-row md:gap-4">
          <Button
            label="Restore All"
            icon={<MdOutlineRestore className="text-lg" />}
            className="flex items-center gap-1 rounded-md text-black md:text-base 2xl:py-2.5"
            onClick={() => {
              dispatch(setConfirmationAction("restore all"));
              dispatch(setIsConfirmationDialogOpen(true));
            }}
          />
          <Button
            label="Delete All"
            icon={<MdDelete className="text-lg" />}
            className="flex items-center gap-1 rounded-md text-red-600 md:text-base 2xl:py-2.5"
            onClick={() => {
              dispatch(setConfirmationAction("delete all"));
              dispatch(setIsConfirmationDialogOpen(true));
            }}
          />
        </div>
      </div>

      <div className="rounded bg-white px-2 py-4 shadow-md md:px-6">
        <div className="overflow-x-auto">
          <table className="mb-5 w-full">
            <TableHeader />
            <tbody>
              {tasks.length > 0 ? (
                tasks?.map((task) => (
                  <TableRow key={task._id} task={task} dispatch={dispatch} />
                ))
              ) : (
                <tr className="border-b border-gray-200 text-gray-600 hover:bg-gray-300/10">
                  <td colSpan="4" className="py-2 text-center">
                    {searchText !== ""
                      ? `No Task with name "${searchText}"`
                      : "No Task"}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <ConfirmationDialog
        option1="cancel"
        option2={confirmationAction}
        msg={confirmationMessage}
        onClick={confirmationHandler}
        isOpen={isConfirmationDialogOpen}
        setIsOpen={() => dispatch(setIsConfirmationDialogOpen(false))}
      />
    </div>
  );
}

export default Trash;
