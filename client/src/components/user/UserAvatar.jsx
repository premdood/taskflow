import {
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
  Transition,
} from "@headlessui/react";
import { FaUser, FaUserLock } from "react-icons/fa";
import { IoLogOutOutline } from "react-icons/io5";
import { useSelector } from "react-redux";
import { toast } from "sonner";
import { useLogoutMutation } from "../../redux/slices/api/authAPISlice.js";
import { getInitials } from "../../utils/user.js";

function UserAvatar({ setIsAddUserOpen, setIsUpdatePasswordOpen }) {
  const [logout] = useLogoutMutation();
  const { user } = useSelector((state) => state.auth);

  const handleLogout = async () => {
    try {
      const result = await logout().unwrap();

      result.success
        ? toast.success(result.message)
        : toast.error(result.message);
    } catch (err) {
      toast.error(err?.data?.message || err?.message || err?.status);
    }
  };

  return (
    <Menu as="div" className="relative inline-block text-left">
      {({ isOpen }) => (
        <>
          <MenuButton
            className={`flex h-10 w-10 cursor-pointer items-center justify-center rounded-full ${
              isOpen
                ? "bg-[var(--dark-primary-color)]"
                : `bg-[var(--primary-color)] hover:bg-[var(--dark-primary-color)]`
            } 2xl:h-12 2xl:w-12`}
          >
            <span className="font-semibold text-white">
              {getInitials(user?.name)}
            </span>
          </MenuButton>

          <Transition
            show={isOpen}
            enter="transition ease-out duration-100"
            enterFrom="transform opacity-0 scale-95"
            enterTo="transform opacity-100 scale-100"
            leave="transition ease-in duration-75"
            leaveFrom="transform opacity-100 scale-100"
            leaveTo="transform opacity-0 scale-95"
          >
            <MenuItems className="absolute right-0 mt-2 w-50 origin-top-right divide-y divide-gray-100 rounded-xl bg-white shadow-2xl focus:outline-none">
              <div className="p-1">
                <MenuItem>
                  <button
                    onClick={setIsAddUserOpen}
                    className="group flex w-full cursor-pointer items-center gap-2 rounded-md px-4 py-2 text-base data-[active]:bg-gray-100"
                  >
                    <FaUser aria-hidden />
                    Profile
                  </button>
                </MenuItem>

                <MenuItem>
                  <button
                    onClick={() => setIsUpdatePasswordOpen(true)}
                    className="group flex w-full cursor-pointer items-center gap-2 rounded-md px-4 py-2 text-base data-[active]:bg-gray-100"
                  >
                    <FaUserLock aria-hidden />
                    Change Password
                  </button>
                </MenuItem>

                <MenuItem>
                  <button
                    onClick={handleLogout}
                    className="group flex w-full cursor-pointer items-center gap-2 rounded-md px-4 py-2 text-base text-red-600 data-[active]:bg-gray-100"
                  >
                    <IoLogOutOutline aria-hidden className="text-xl" />
                    Logout
                  </button>
                </MenuItem>
              </div>
            </MenuItems>
          </Transition>
        </>
      )}
    </Menu>
  );
}

export default UserAvatar;
