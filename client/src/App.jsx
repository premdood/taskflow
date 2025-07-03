import { lazy } from "react";
import {
  createBrowserRouter,
  createRoutesFromElements,
  redirect,
  Route,
} from "react-router";
import { GlobalErrorBoundary } from "./components/Index.jsx";
import "./index.css";
import { withSuspense } from "./utils/task.jsx";

const ProtectedRoute = lazy(() => import("./pages/ProtectedRoute.jsx"));
const Dashboard = lazy(() => import("./pages/Dashboard.jsx"));
const Tasks = lazy(() => import("./pages/Tasks.jsx"));
const Task = lazy(() => import("./pages/Task.jsx"));
const Users = lazy(() => import("./pages/Users.jsx"));
const Trash = lazy(() => import("./pages/Trash.jsx"));
const Login = lazy(() => import("./pages/Login.jsx"));
const NotFound = lazy(() => import("./pages/NotFound.jsx"));

const SuspendedProtectedRoute = withSuspense(ProtectedRoute);
const SuspendedDashboard = withSuspense(Dashboard);
const SuspendedTasks = withSuspense(Tasks);
const SuspendedTask = withSuspense(Task);
const SuspendedUsers = withSuspense(Users);
const SuspendedTrash = withSuspense(Trash);
const SuspendedLogin = withSuspense(Login);
const SuspendedNotFound = withSuspense(NotFound);

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route
        path="/"
        element={<SuspendedProtectedRoute />}
        errorElement={<GlobalErrorBoundary />}
      >
        {/* index route */}
        <Route index loader={() => redirect("/dashboard")} />
        <Route
          path="dashboard"
          element={<SuspendedDashboard />}
          errorElement={<GlobalErrorBoundary />}
        />

        <Route path="tasks" errorElement={<GlobalErrorBoundary />}>
          <Route index element={<SuspendedTasks />} />
          <Route path="completed" element={<SuspendedTasks />} />
          <Route path="in-progress" element={<SuspendedTasks />} />
          <Route path="todo" element={<SuspendedTasks />} />
          <Route path=":id" element={<SuspendedTask />} />
        </Route>

        <Route
          path="team"
          element={<SuspendedUsers />}
          errorElement={<GlobalErrorBoundary />}
        />

        <Route
          path="trash"
          element={<SuspendedTrash />}
          errorElement={<GlobalErrorBoundary />}
        />
      </Route>

      <Route
        path="/login"
        element={<SuspendedLogin />}
        errorElement={<GlobalErrorBoundary />}
      />

      <Route
        path="*"
        element={<SuspendedNotFound />}
        errorElement={<GlobalErrorBoundary />}
      />
    </>,
  ),
);

export default router;
