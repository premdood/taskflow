import { FaList } from "react-icons/fa";
import { IoMdAdd } from "react-icons/io";
import { MdGridView } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router";
import { toast } from "sonner";
import { Button, Loader, Tabs, Title } from "../components/Index.jsx";
import {
  BoardView,
  TableView,
  TasksPageDialogs,
} from "../components/task/Index.jsx";
import { useGetAllTaskQuery } from "../redux/slices/api/taskAPISlice.js";
import {
  setIsAddTaskOpen,
  setTasksView,
} from "../redux/slices/features/uiSlice.js";
import { getTaskStageFromUrl } from "../utils/task.jsx";

const TABS = [
  { title: "Board View", icon: <MdGridView /> },
  { title: "List View", icon: <FaList /> },
];

function Tasks() {
  const { tasksView, searchText } = useSelector((state) => state.ui);

  const {
    data: tasksResponse,
    error: tasksError,
    isLoading: tasksIsLoading,
    isFetching: tasksIsFetching,
  } = useGetAllTaskQuery({ search: searchText });

  const { user } = useSelector((state) => state.auth);
  const isAdmin = user?.isAdmin;

  const newView = tasksView === "board" ? "table" : "board";
  const selectedIndex = tasksView === "board" ? 0 : 1;

  const dispatch = useDispatch();
  const changeView = () => dispatch(setTasksView(newView));

  const location = useLocation();
  let stage = getTaskStageFromUrl(location.pathname);
  stage = stage?.charAt(0).toUpperCase() + stage?.slice(1);

  if (tasksIsLoading || tasksIsFetching) {
    return <Loader />;
  }

  if (tasksError) {
    console.error(tasksError);
    toast.error(
      tasksError?.data?.message || tasksError?.message || tasksError?.status,
    );
  }

  const TAB_PANELS = [
    <BoardView tasks={tasksResponse?.data} />,
    <TableView tasks={tasksResponse?.data} />,
  ];

  return (
    <div className="w-full">
      <div className="mb-4 flex items-center justify-between">
        <Title title={stage ? `${stage} Tasks` : "Tasks"} />

        {!stage && isAdmin && (
          <Button
            label="Create Task"
            icon={<IoMdAdd className="text-lg" />}
            onClick={() => dispatch(setIsAddTaskOpen(true))}
            className="flex cursor-pointer items-center gap-1 rounded-md bg-[var(--primary-color)] py-2 text-white hover:translate-[1px] 2xl:py-2.5"
          />
        )}
      </div>

      <Tabs
        tabs={TABS}
        tabPanels={TAB_PANELS}
        selectedIndex={selectedIndex}
        changeView={changeView}
      />

      {isAdmin && <TasksPageDialogs />}
    </div>
  );
}

export default Tasks;
