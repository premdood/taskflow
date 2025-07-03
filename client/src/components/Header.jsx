import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router";
import { setIsSidebarOpen } from "../redux/slices/features/uiSlice.js";
import { AddUser, PasswordChangeDialog } from "./dialog/Index.jsx";
import { NotificationPanel } from "./Index.jsx";
import { SearchBox } from "./ui/Index.jsx";
import { UserAvatar } from "./user/Index.jsx";

function Header() {
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);
  const [isUpdatePasswordOpen, setIsUpdatePasswordOpen] = useState(false);

  const location = useLocation();
  const user = useSelector((state) => state.auth.user);

  const dispatch = useDispatch();
  const openSidebar = () => dispatch(setIsSidebarOpen(true));

  const regEx = /^\/tasks|team|trash$\/?/;
  const showSearchIcon = regEx.test(location.pathname);

  return (
    <div className="sticky top-0 z-10 flex items-center justify-between bg-white px-4 py-3 2xl:py-4">
      <div className="flex gap-4">
        <button
          onClick={openSidebar}
          className="block cursor-pointer text-2xl text-gray-500 md:hidden"
        >
          ☰
        </button>

        {showSearchIcon && <SearchBox />}
      </div>

      <div className="flex items-center gap-2">
        <NotificationPanel />
        <UserAvatar
          setIsAddUserOpen={setIsAddUserOpen}
          setIsUpdatePasswordOpen={setIsUpdatePasswordOpen}
        />
      </div>

      <AddUser
        user={user}
        isOpen={isAddUserOpen}
        setIsOpen={() => setIsAddUserOpen(false)}
      />

      <PasswordChangeDialog
        isOpen={isUpdatePasswordOpen}
        setIsOpen={setIsUpdatePasswordOpen}
      />
    </div>
  );
}

export default Header;
