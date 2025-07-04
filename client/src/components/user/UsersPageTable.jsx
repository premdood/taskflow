import clsx from "clsx";
import { useGetAllUsersQuery } from "../../redux/slices/api/userAPISlice.js";
import {
  setConfirmationAction,
  setIsAddUserOpen,
  setIsConfirmationDialogOpen,
  setSelectedUserId,
} from "../../redux/slices/features/uiSlice.js";
import { getInitials } from "../../utils/user.js";
import { Button, Loader } from "../ui/Index.jsx";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";

function TableHeader() {
  return (
    <thead className="border-b border-gray-300">
      <tr className="text-left text-black">
        <td className="p-2">Full Name</td>
        <td className="py-2">Title</td>
        <td className="py-2">Email</td>
        <td className="py-2">Role</td>
        <td className="py-2">Active</td>
      </tr>
    </thead>
  );
}

function TableRow({ user }) {
  const dispatch = useDispatch();

  const changeStatus = () => {
    const confirmationAction = user.isActive ? "deactivate" : "activate";
    dispatch(setSelectedUserId(user._id));
    dispatch(setConfirmationAction(confirmationAction));
    dispatch(setIsConfirmationDialogOpen(true));
  };

  const editUser = () => {
    dispatch(setSelectedUserId(user._id));
    dispatch(setIsAddUserOpen(true));
  };

  const deleteUser = () => {
    dispatch(setSelectedUserId(user._id));
    dispatch(setConfirmationAction("delete"));
    dispatch(setIsConfirmationDialogOpen(true));
  };

  return (
    <tr className="border-b border-gray-200 text-gray-600 hover:bg-gray-300/10">
      <td className="min-w-50 p-2">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--primary-color)] text-sm text-white">
            <span>{getInitials(user?.name)}</span>
          </div>

          <div>
            <p>{user?.name}</p>
          </div>
        </div>
      </td>

      <td className="min-w-35 py-2">{user?.title}</td>
      <td className="min-w-45 py-2">{user?.email || "user@example.com"}</td>
      <td className="min-w-25 py-2">{user?.role}</td>

      <td className="min-w-20 py-2">
        <button
          className={clsx(
            `w-fit cursor-pointer rounded-xl px-3 py-1 text-sm text-[var(--primary-color)]`,
            user?.isActive
              ? "bg-[var(--light-primary-color)]"
              : "bg-yellow-100",
          )}
          onClick={changeStatus}
        >
          {user?.isActive ? "Active" : "Inactive"}
        </button>
      </td>

      <td className="flex justify-end gap-2 py-2 md:gap-4">
        <Button
          label="Edit"
          type="button"
          onClick={editUser}
          className="text-sm text-[var(--primary-color)] sm:px-0 md:text-base"
        />

        <Button
          label="Delete"
          type="button"
          onClick={deleteUser}
          className="text-sm text-red-700 sm:px-0 md:text-base"
        />
      </td>
    </tr>
  );
}

function UsersPageTable() {
  const { searchText } = useSelector((state) => state.ui);
  const { data, isLoading, error } = useGetAllUsersQuery({
    search: searchText,
  });
  const users = data?.data;

  if (isLoading) {
    return <Loader />;
  }

  if (error) {
    console.error(error);
    toast.error(error?.data?.message || error?.message || error?.status);
  }

  return (
    <div className="rounded bg-white px-2 py-4 shadow-md md:px-4">
      <div className="overflow-x-auto">
        <table className="mb-5 w-full">
          <TableHeader />
          <tbody>
            {users?.length > 0 ? (
              users.map((user) => <TableRow key={user._id} user={user} />)
            ) : (
              <tr className="border-b border-gray-200 text-gray-600 hover:bg-gray-300/10">
                <td colSpan="5" className="py-2 text-center">
                  {searchText !== ""
                    ? `No member with name "${searchText}"`
                    : "No Member"}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default UsersPageTable;
