import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import {
  useDuplicateTaskMutation,
  useGetAllTaskQuery,
  useTrashSingleTaskMutation,
} from "../../redux/slices/api/taskAPISlice.js";
import { useGetAllUsersQuery } from "../../redux/slices/api/userAPISlice.js";
import { AddSubTask, AddTask, ConfirmationDialog } from "../dialog/Index.jsx";
import {
  setIsAddSubTaskOpen,
  setIsAddTaskOpen,
  setIsConfirmationDialogOpen,
} from "../../redux/slices/features/uiSlice.js";

function TasksPageDialogs() {
  const {
    selectedTaskId,
    isAddTaskOpen,
    isAddSubTaskOpen,
    confirmationAction,
    isConfirmationDialogOpen,
  } = useSelector((state) => state.ui);

  const dispatch = useDispatch();

  const { data: tasksResponse } = useGetAllTaskQuery();
  const tasks = tasksResponse?.data;
  const selectedTask = tasks?.find((task) => task._id === selectedTaskId);

  const { data: usersResponse } = useGetAllUsersQuery({ fields: "name" });
  const users = usersResponse?.data;

  const [duplicateTask] = useDuplicateTaskMutation();
  const [trashSingleTask] = useTrashSingleTaskMutation();

  const confirmationMessage =
    confirmationAction === "duplicate"
      ? `Do you want to duplicate this task: ${selectedTask?.title}`
      : `Are you sure you want to delete this task: ${selectedTask?.title}`;

  const handleConfirmationAction = async () => {
    const mutation =
      confirmationAction === "duplicate" ? duplicateTask : trashSingleTask;
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

  // to prevent re-render
  const handleIsAddTaskOpen = (newState) => {
    dispatch(setIsAddTaskOpen(newState));
  };

  const handleIsAddSubTaskOpen = (newState) => {
    dispatch(setIsAddSubTaskOpen(newState));
  };

  const handleIsConfirmationDialogOpen = (newState) => {
    dispatch(setIsConfirmationDialogOpen(newState));
  };

  return (
    <>
      <AddTask
        isOpen={isAddTaskOpen}
        setIsOpen={handleIsAddTaskOpen}
        options={users}
        task={selectedTask}
      />

      <AddSubTask
        selectedTaskId={selectedTaskId}
        isOpen={isAddSubTaskOpen}
        setIsOpen={handleIsAddSubTaskOpen}
      />

      <ConfirmationDialog
        option1="cancel"
        option2={confirmationAction}
        msg={confirmationMessage}
        onClick={handleConfirmationAction}
        isOpen={isConfirmationDialogOpen}
        setIsOpen={handleIsConfirmationDialogOpen}
      />
    </>
  );
}

export default TasksPageDialogs;
