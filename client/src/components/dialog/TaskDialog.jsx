import {
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
  Transition,
} from "@headlessui/react";
import { BsThreeDots } from "react-icons/bs";
import { HiDuplicate } from "react-icons/hi";
import { IoFolderOpen } from "react-icons/io5";
import { MdAdd, MdDelete, MdOutlineEdit } from "react-icons/md";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router";
import {
  setConfirmationAction,
  setIsAddSubTaskOpen,
  setIsAddTaskOpen,
  setIsConfirmationDialogOpen,
  setSelectedTaskId,
} from "../../redux/slices/features/uiSlice";

function TaskDialog({ taskId }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const dialogItems = [
    {
      label: <span>Open Task</span>,
      icon: <IoFolderOpen className="mr-2 h-5 w-5 text-gray-700" aria-hidden />,
      onClick: () => navigate(`/tasks/${taskId}`),
    },
    {
      label: <span>Edit</span>,
      icon: (
        <MdOutlineEdit className="mr-2 h-5 w-5 text-gray-700" aria-hidden />
      ),
      onClick: () => {
        dispatch(setSelectedTaskId(taskId));
        dispatch(setIsAddTaskOpen(true));
      },
    },
    {
      label: <span>Add Sub-Task</span>,
      icon: <MdAdd className="mr-2 h-5 w-5 text-gray-700" aria-hidden />,
      onClick: () => {
        dispatch(setSelectedTaskId(taskId));
        dispatch(setIsAddSubTaskOpen(true));
      },
    },
    {
      label: <span>Duplicate</span>,
      icon: <HiDuplicate className="mr-2 h-5 w-5 text-gray-700" aria-hidden />,
      onClick: () => {
        dispatch(setSelectedTaskId(taskId));
        dispatch(setConfirmationAction("duplicate"));
        dispatch(setIsConfirmationDialogOpen(true));
      },
    },
    {
      label: <span className="text-red-500">Delete</span>,
      icon: <MdDelete className="mr-2 h-5 w-5 text-red-400" aria-hidden />,
      onClick: () => {
        dispatch(setSelectedTaskId(taskId));
        dispatch(setConfirmationAction("delete"));
        dispatch(setIsConfirmationDialogOpen(true));
      },
    },
  ];

  return (
    <Menu as="div" className="relative inline-block text-left">
      <MenuButton className="inline-flex w-full cursor-pointer justify-center rounded-md py-2 pl-2 font-medium text-gray-600">
        <BsThreeDots />
      </MenuButton>

      <Transition
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <MenuItems className="foucs:outline-none absolute right-0 z-10 mt-2 w-50 origin-top-right divide-y divide-gray-100 rounded-lg bg-white shadow-lg ring-1 ring-black/5">
          <div className="space-x-2 p-1">
            {dialogItems.map((item, index) => (
              <MenuItem key={index}>
                <button
                  onClick={item.onClick}
                  className="flex w-full cursor-pointer items-center rounded-md p-2 text-sm data-focus:bg-gray-100"
                >
                  {item.icon}
                  {item.label}
                </button>
              </MenuItem>
            ))}
          </div>
        </MenuItems>
      </Transition>
    </Menu>
  );
}

export default TaskDialog;
