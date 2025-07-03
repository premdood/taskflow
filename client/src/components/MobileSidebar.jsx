import { Transition } from "@headlessui/react";
import { Sidebar } from "./Index.jsx";
import clsx from "clsx";
import { IoClose } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import { setIsSidebarOpen } from "../redux/slices/features/uiSlice.js";

function MobileSidebar() {
  const dispatch = useDispatch();
  const isSidebarOpen = useSelector((state) => state.ui.isSidebarOpen);
  const closeSideBar = () => dispatch(setIsSidebarOpen(false));

  return (
    <Transition
      show={isSidebarOpen}
      enter="transition ease-out duration-100"
      enterFrom="opacity-0 -translate-x-full"
      enterTo="opacity-100 translate-x-0"
      leave="transition ease-in duration-100"
      leaveFrom="opacity-100 translate-x-0"
      leaveTo="opacity-0 -translate-x-full"
    >
      <div
        onClick={closeSideBar}
        className={clsx(
          `h-full w-full transform bg-black/40 transition-all duration-100 md:hidden`,
          isSidebarOpen ? "translate-x-0" : "translate-x-full",
        )}
      >
        <div className="h-full w-3/4 max-w-70 bg-white">
          <div className="relative h-full w-full">
            <button
              onClick={closeSideBar}
              className="absolute top-5 right-5 flex cursor-pointer items-center justify-center"
            >
              <IoClose className="text-3xl" />
            </button>

            <div>
              <Sidebar />
            </div>
          </div>
        </div>
      </div>
    </Transition>
  );
}

export default MobileSidebar;
