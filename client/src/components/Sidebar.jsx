import clsx from "clsx";
import { AiFillHome } from "react-icons/ai";
import { FaTasks, FaTrashAlt } from "react-icons/fa";
import { FaUsers } from "react-icons/fa6";
import { MdOutlinePendingActions, MdTaskAlt } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { NavLink } from "react-router";
import { Logo } from "../components/Index.jsx";
import { setIsSidebarOpen } from "../redux/slices/features/uiSlice.js";

const linkData = [
  {
    label: "Dashboard",
    link: "/dashboard",
    icon: <AiFillHome className="self-start text-xl" />,
  },
  {
    label: "Tasks",
    link: "/tasks",
    icon: <FaTasks className="text-lg" />,
  },
  {
    label: "Completed",
    link: "/tasks/completed",
    icon: <MdTaskAlt className="text-xl" />,
  },
  {
    label: "In Progress",
    link: "/tasks/in-progress",
    icon: <MdOutlinePendingActions className="text-xl" />,
  },
  {
    label: "To Do",
    link: "/tasks/todo",
    icon: <MdOutlinePendingActions className="text-xl" />,
  },
  {
    label: "Team",
    link: "/team",
    icon: <FaUsers className="text-xl" />,
  },
  {
    label: "Trash",
    link: "/trash",
    icon: <FaTrashAlt className="text-md" />,
  },
];

function Sidebar() {
  const { user } = useSelector((state) => state.auth);
  const { isAdmin } = user;
  const sidebarLinks = isAdmin ? linkData : linkData.slice(0, 5);

  const dispatch = useDispatch();
  const closeSideBar = () => dispatch(setIsSidebarOpen(false));

  return (
    <div className="flex h-full w-full flex-col px-4 py-3">
      <Logo className="p-2 text-2xl" />

      <nav className="flex flex-1 flex-col gap-y-4 py-8 text-gray-800">
        {sidebarLinks.map((link) => {
          return (
            <NavLink
              end
              key={link.label}
              to={link.link}
              onClick={() => closeSideBar()}
              className={({ isActive }) =>
                clsx(
                  isActive &&
                    `bg-[var(--light-primary-color)] text-[var(--primary-color)]`,
                  `flex w-full items-center gap-3 rounded-lg px-4 py-2 text-base hover:bg-[var(--light-primary-color)] hover:text-[var(--primary-color)]`,
                )
              }
            >
              {link.icon}
              <span>{link.label}</span>
            </NavLink>
          );
        })}
      </nav>
    </div>
  );
}

export default Sidebar;
