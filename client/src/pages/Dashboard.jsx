import clsx from "clsx";
import { FaNewspaper } from "react-icons/fa";
import { FaArrowsToDot } from "react-icons/fa6";
import { LuClipboardPen } from "react-icons/lu";
import { MdAdminPanelSettings } from "react-icons/md";
import { useSelector } from "react-redux";
import { toast } from "sonner";
import { Chart, Loader } from "../components/Index.jsx";
import { DashboardTaskTable } from "../components/task/Index.jsx";
import { DashboardUserTable } from "../components/user/Index.jsx";
import { useGetDashboardStatisticsQuery } from "../redux/slices/api/userAPISlice.js";

function Card({ bg, count, icon, label }) {
  return (
    <div className="flex h-27 w-full items-center justify-between rounded-md bg-white p-5 shadow-md">
      <div className="flex h-full flex-1 flex-col justify-between">
        <p className="text-base text-gray-600">{label}</p>
        <span className="text-2xl font-semibold">{count}</span>
      </div>

      <div
        className={clsx(
          "flex h-10 w-10 items-center justify-center rounded-full text-white",
          bg,
        )}
      >
        {icon}
      </div>
    </div>
  );
}

function Dashboard() {
  const { isAdmin } = useSelector((state) => state.auth.user);
  const { data, error, isLoading } = useGetDashboardStatisticsQuery();
  const result = data?.data;

  const tasksStageData = result?.tasksStageData;
  const graphData = result?.graphData;
  const newest10Tasks = result?.newest10Tasks;
  const users = result?.users;

  if (isLoading) {
    return <Loader />;
  }

  if (error) {
    console.error(error);
    toast.error(error?.data?.message || error?.message || error?.status);
  }

  const stats = [
    {
      _id: "1",
      bg: "bg-[#1d4ed8]",
      count: tasksStageData.total,
      icon: <FaNewspaper />,
      label: "TOTAL TASK",
    },
    {
      _id: "2",
      bg: "bg-[#0f766e]",
      count: tasksStageData.completed,
      icon: <MdAdminPanelSettings />,
      label: "COMPLETED TASK",
    },
    {
      _id: "3",
      bg: "bg-[#f59e0b]",
      count: tasksStageData["in-progress"],
      icon: <LuClipboardPen />,
      label: "TASK IN PROGRESS ",
    },
    {
      _id: "4",
      bg: "bg-[#be185d]",
      count: tasksStageData.todo,
      icon: <FaArrowsToDot />,
      label: "TODO",
    },
  ];

  return (
    <div className="h-full py-4">
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {stats?.map(({ _id, bg, count, icon, label }) => {
          return (
            <Card key={_id} bg={bg} count={count} icon={icon} label={label} />
          );
        })}
      </div>

      <div className="my-10 w-full rounded bg-white p-4 shadow-sm">
        <h4 className="mb-4 text-xl font-semibold text-gray-600">
          Chart by Priority
        </h4>

        <Chart data={graphData} />
      </div>

      <div className="flex w-full flex-col gap-4 pb-8 xl:flex-row 2xl:gap-10">
        {/* left */}
        <DashboardTaskTable tasks={newest10Tasks} isAdmin={isAdmin} />
        {/* right */}
        {isAdmin && <DashboardUserTable users={users} />}
      </div>
    </div>
  );
}

export default Dashboard;
