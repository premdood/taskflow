import { FaTasks } from "react-icons/fa";
import { RxActivityLog } from "react-icons/rx";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router";
import { toast } from "sonner";
import { Loader, Tabs, Title } from "../components/Index.jsx";
import { TaskDetails, TaskTimeline } from "../components/task/Index.jsx";
import { useGetSingleTaskQuery } from "../redux/slices/api/taskAPISlice.js";
import { setSingleTaskView } from "../redux/slices/features/uiSlice.js";

const TABS = [
  { title: "Task Detail", icon: <FaTasks /> },
  { title: "Activities/Timeline", icon: <RxActivityLog /> },
];

function Task() {
  const { id: taskId } = useParams();
  const {
    data: tasksResponse,
    error,
    isLoading,
    isFetching,
  } = useGetSingleTaskQuery({ taskId });
  const task = tasksResponse?.data;

  const singleTaskView = useSelector((state) => state.ui.singleTaskView);
  const selectedIndex = singleTaskView === "detail" ? 0 : 1;
  const nextView = singleTaskView === "detail" ? "activities" : "detail";

  const dispatch = useDispatch();
  const changeView = () => dispatch(setSingleTaskView(nextView));

  if (error) {
    console.error(error);
    toast.error(error?.data?.message || error?.message || error?.status);
  }

  if (isLoading || isFetching) {
    return <Loader />;
  }

  const TAB_PANELS = [
    <TaskDetails task={task} />,
    <TaskTimeline taskId={task._id} activities={task?.activities} />,
  ];

  return (
    <div className="mb-4 flex w-full flex-col gap-3 overflow-y-hidden">
      <Title title={task?.title} />

      <Tabs
        tabs={TABS}
        tabPanels={TAB_PANELS}
        selectedIndex={selectedIndex}
        changeView={changeView}
      />
    </div>
  );
}

export default Task;
