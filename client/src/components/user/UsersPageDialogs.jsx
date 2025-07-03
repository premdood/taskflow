import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import { useGetAllUsersQuery } from "../../redux/slices/api/userAPISlice.js";
import { AddUser } from "../dialog/Index.jsx";
import { ConfirmationDialog } from "../Index.jsx";
import {
  useChangeUserStatusMutation,
  useDeleteUserMutation,
} from "../../redux/slices/api/userAPISlice.js";
import {
  setIsAddUserOpen,
  setIsConfirmationDialogOpen,
} from "../../redux/slices/features/uiSlice.js";

function UsersPageDialogs() {
  const {
    isAddUserOpen,
    selectedUserId,
    confirmationAction,
    isConfirmationDialogOpen,
  } = useSelector((state) => state.ui);
  const dispatch = useDispatch();

  const { data } = useGetAllUsersQuery();
  const users = data?.data;
  const selectedUser = users?.find((user) => user._id === selectedUserId);

  const [deleteUser] = useDeleteUserMutation();
  const [changeUserStatus] = useChangeUserStatusMutation();

  const confirmationMessage = `Are you sure you want to ${confirmationAction} ${selectedUser?.name} account`;

  const confirmationHandler = async () => {
    const mutation =
      confirmationAction === "delete" ? deleteUser : changeUserStatus;
    try {
      const result = await mutation(selectedUserId).unwrap();

      result.success
        ? toast.success(result.message)
        : toast.error(result.message);
    } catch (err) {
      console.error(err);
      toast.error(err?.data?.message || err?.message || err?.status);
    }
  };

  return (
    <>
      <AddUser
        user={selectedUser}
        isOpen={isAddUserOpen}
        setIsOpen={() => dispatch(setIsAddUserOpen(false))}
      />

      <ConfirmationDialog
        option1="cancel"
        msg={confirmationMessage}
        option2={confirmationAction}
        isOpen={isConfirmationDialogOpen}
        onClick={confirmationHandler}
        setIsOpen={() => dispatch(setIsConfirmationDialogOpen(false))}
      />
    </>
  );
}

export default UsersPageDialogs;
