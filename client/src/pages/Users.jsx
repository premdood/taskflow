import { IoMdAdd } from "react-icons/io";
import { useDispatch } from "react-redux";
import { Title } from "../components/Index.jsx";
import { Button } from "../components/ui/Index.jsx";
import { UsersPageDialogs, UsersPageTable } from "../components/user/Index.jsx";
import { setIsAddUserOpen } from "../redux/slices/features/uiSlice.js";

function Users() {
  const dispatch = useDispatch();

  return (
    <div className="mb-6 w-full px-0 md:px-1">
      <div className="mb-8 flex items-center justify-between">
        <Title title="Team Members" />
        <Button
          label="Add New User"
          icon={<IoMdAdd className="text-lg" />}
          onClick={() => {
            dispatch(setIsAddUserOpen(true));
          }}
          className="flex items-center gap-1 rounded-md bg-[var(--primary-color)] px-2 text-white hover:translate-[1px] md:px-4 2xl:py-2.5"
        />
      </div>

      <UsersPageTable />

      <UsersPageDialogs />
    </div>
  );
}

export default Users;
