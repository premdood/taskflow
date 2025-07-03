import clsx from "clsx";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { getInitials } from "../../utils/user.js";

dayjs.extend(relativeTime);

function TableHeader() {
  return (
    <thead className="border-b border-gray-300">
      <tr className="text-left text-black">
        <th className="p-2">Full Name</th>
        <th className="py-2">Status</th>
        <th className="py-2">Created At</th>
      </tr>
    </thead>
  );
}

function TableRow({ user }) {
  return (
    <tr className="border-b border-gray-300 text-gray-600 hover:bg-gray-300/10">
      <td className="min-w-50 p-2">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--primary-color)] text-sm text-white">
            <span>{getInitials(user?.name)}</span>
          </div>

          <div>
            <p>{user?.name}</p>
            <span className="text-xs text-black">{user?.role}</span>
          </div>
        </div>
      </td>

      <td className="min-w-20 py-2">
        <p
          className={clsx(
            "w-fit rounded-full px-3 py-1 text-sm text-[var(--primary-color)]",
            user?.isActive
              ? "bg-[var(--light-primary-color)]"
              : "bg-yellow-100",
          )}
        >
          {user?.isActive ? "Active" : "Disabled"}
        </p>
      </td>

      <td className="min-w-25 p-2">
        <span className="text-sm">{dayjs(user?.createdAt).fromNow()}</span>
      </td>
    </tr>
  );
}

function UserTable({ users }) {
  return (
    <div className="h-fit w-full flex-1/3 overflow-x-auto rounded bg-white px-2 py-4 shadow-md md:px-6 xl:w-1/3">
      <table className="mb-5 w-full table-auto">
        <TableHeader />
        <tbody>
          {users.map((user) => (
            <TableRow key={user._id} user={user} />
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default UserTable;
