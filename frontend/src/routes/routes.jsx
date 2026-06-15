import { createBrowserRouter, Outlet } from "react-router-dom";
import Register from "../pages/Register";
import Login from "../pages/Login";
import Dashboard from "../pages/Dashboard"
import Project from "../pages/Project";
import { NewTask, ExistingTask } from "../pages/Task";
import { loadUser, fetchTask, fetchTasks, fetchProject} from "./loaders";
import { createTask, updateTask, createProject, updateProject } from "./actions";
import { ProtectedRoute, UnauthRoute } from "../components/RouteGuards";
import RootLayout from "../Layouts/RootLayout";

const router = createBrowserRouter([
  {
    path: "/",
    Component: RootLayout,
    loader: loadUser,
    id: "root",
    children : [
      {
        index: true,
        element: <p className="grow"></p>
      },
      {
        Component: UnauthRoute,
        children : [
          {
            path: "register",
            Component : Register,
          },
          {
            path: "login",
            Component: Login,
          },
        ]
      },
      {
        Component: ProtectedRoute,
        children : [
          {
            path: "dashboard/:pid?",
            Component: Dashboard,
            loader: fetchTasks,
            id: "dashboard"
          },
          {
            path: "projects/new",
            Component: Project,
            action: createProject
          },
          {
            path: 'projects/:pid/update',
            Component: Project,
            loader: fetchProject,
            action: updateProject,
            id: "project-info"
          },
          {
            path: "projects/:pid/tasks/:tid/update",
            Component: ExistingTask,
            loader: fetchTask,
            id: "get-task",
            action: updateTask
          },
          {
            path: "projects/:pid/tasks/new",
            Component: NewTask,
            action: createTask
          }
        ]
      }
    ]
  }
]);

export default router;

