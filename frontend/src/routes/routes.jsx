import { createBrowserRouter, Outlet } from "react-router-dom";
import Register from "../pages/Register";
import Login from "../pages/Login";
import Dashboard from "../pages/Dashboard"
import { NewTask, ExistingTask } from "../pages/Task";
import { loadUser, fetchTask, fetchTasks } from "./loaders";
import { createTask, updateTask } from "./actions";
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
        element: <p className="grow">Hello world!</p>
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
            path: "dashboard",
            Component: Dashboard,
            loader: fetchTasks,
            id: "dashboard"
          },
          {
            path: "tasks/:tid/update",
            Component: ExistingTask,
            loader: fetchTask,
            id: "get-task",
            action: updateTask
          },
          {
            path: "tasks/new",
            Component: NewTask,
            action: createTask
          }
        ]
      }
      
    ]
  }
]);

export default router;

