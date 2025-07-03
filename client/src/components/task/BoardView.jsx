import { useSelector } from "react-redux";
import { useLocation } from "react-router";
import { getTaskStageFromUrl } from "../../utils/task.jsx";
import { TaskCard } from "./Index.jsx";

function BoardView({ tasks }) {
  const location = useLocation();
  const stage = getTaskStageFromUrl(location.pathname);
  const { searchText } = useSelector((state) => state.ui);

  return (
    <div className="grid w-full gap-4 py-4 max-md:grid-cols-2 max-sm:grid-cols-1 min-[900px]:grid-cols-2 min-[2200px]:grid-cols-4 xl:grid-cols-3 2xl:gap-10">
      {tasks.length > 0 ? (
        tasks
          .filter((task) => !stage || task.stage === stage)
          .map((task) => <TaskCard key={task._id} task={task} />)
      ) : (
        <div className="col-span-full rounded bg-white p-4 text-center shadow-md">
          {searchText !== "" ? `No task with name "${searchText}"` : "No Task"}
        </div>
      )}
    </div>
  );
}

export default BoardView;
