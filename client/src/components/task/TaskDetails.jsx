import clsx from "clsx";
import { MdTaskAlt } from "react-icons/md";
import { toast } from "sonner";
import { useToggleSubTaskCompletionMutation } from "../../redux/slices/api/taskAPISlice.js";
import {
  PRIORITY_BG_COLORS,
  PRIORITY_ICONS,
  PRIORITY_TEXT_COLORS,
  TASK_BG_COLORS,
  USER_BG_COLORS,
} from "../../utils/task.jsx";
import { getInitials } from "../../utils/user.js";

function TaskDetails({ task }) {
  const [toggleSubTaskCompletion] = useToggleSubTaskCompletionMutation();

  const handleSubTaskCompletion = async (subTaskId) => {
    try {
      const result = await toggleSubTaskCompletion({
        taskId: task._id,
        subTaskId,
      }).unwrap();

      result.success
        ? toast.success(result.message)
        : toast.error(result.message);
    } catch (err) {
      console.error(err);
      toast.error(err?.data?.message || err?.message || err?.status);
    }
  };

  return (
    <div className="flex w-full flex-col gap-5 overflow-y-auto rounded-md bg-white p-8 shadow-md lg:flex-row 2xl:gap-8">
      {/* left */}
      <div className="w-full space-y-8 lg:w-1/2">
        <div className="flex items-center gap-5">
          <div
            className={clsx(
              `flex items-center gap-1 rounded-md px-3 py-1 text-base font-semibold`,
              PRIORITY_TEXT_COLORS[task?.priority],
              PRIORITY_BG_COLORS[task?.priority],
            )}
          >
            <span className="text-lg">{PRIORITY_ICONS[task?.priority]}</span>
            <span className="uppercase">{task.priority} Priority</span>
          </div>

          <div className="flex items-center gap-2">
            <div
              className={clsx(
                "h-4 w-4 rounded-full",
                TASK_BG_COLORS[task?.stage],
              )}
            ></div>
            <span className="text-black uppercase">{task?.stage}</span>
          </div>
        </div>

        <p className="text-gray-600">
          Created At: {new Date(task?.createdAt).toDateString()}
        </p>

        <div className="flex items-center gap-8 border-y border-gray-200 p-4">
          <div className="flex space-x-1 md:space-x-2">
            <span className="font-semibold">Assets: </span>
            <span>{task?.assets?.length}</span>
          </div>

          <span className="text-gray-400">|</span>

          <div className="flex space-x-1 md:space-x-2">
            <span className="font-semibold">Sub-Task: </span>
            <span>{task?.subTasks?.length}</span>
          </div>
        </div>

        <div className="space-y-2 py-4">
          <h3 className="text-sm font-semibold uppercase">Task Team</h3>

          <div className="space-y-3">
            {task?.team?.map((member, index) => (
              <div
                key={member._id}
                className="flex items-center gap-4 border-t border-gray-200 py-2"
              >
                <div
                  className={clsx(
                    `-mr-1 flex h-10 w-10 items-center justify-center rounded-full text-sm text-white`,
                    USER_BG_COLORS[index % USER_BG_COLORS.length],
                  )}
                >
                  {getInitials(member?.name)}
                </div>

                <div className="">
                  <p className="text-lg font-semibold">{member?.name}</p>
                  <span className="text-gray-500">{member?.title}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-2 py-4">
          <h3 className="text-sm font-semibold uppercase">Sub-Tasks</h3>

          <div className="space-y-4">
            {task?.subTasks.length === 0 ? (
              <p className="text-gray-600">No sub-task added till now</p>
            ) : (
              task?.subTasks.map((subTask) => (
                <div key={subTask._id} className="flex gap-3">
                  <div
                    onClick={() => handleSubTaskCompletion(subTask._id)}
                    title={
                      subTask.isCompleted
                        ? "Mark as not completed"
                        : "Mark as completed"
                    }
                    className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--light-primary-color)] hover:cursor-pointer"
                  >
                    {subTask.isCompleted && (
                      <MdTaskAlt
                        className="text-[var(--primary-color)]"
                        size="26"
                      />
                    )}
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-500">
                        {new Date(subTask?.date).toDateString()}
                      </span>

                      <span className="rounded-md bg-[var(--light-primary-color)] px-2 py-0.5 text-center text-sm font-semibold text-[var(--primary-color)]">
                        {subTask?.tag}
                      </span>
                    </div>

                    <p className="text-gray-700">{subTask?.title}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* right */}
      <div className="overflow-hide w-full space-y-8 lg:w-1/2">
        <h2 className="text-lg font-semibold uppercase">Assets</h2>

        {task.assets.length === 0 ? (
          <p className="text-gray-600">No Assets uploaded till now</p>
        ) : (
          <div className="grid w-full items-center justify-center gap-4 lg:grid-cols-2">
            {task?.assets?.map((asset, index) => (
              <img
                key={index}
                src={asset}
                className="w-full cursor-pointer rounded-md"
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default TaskDetails;
