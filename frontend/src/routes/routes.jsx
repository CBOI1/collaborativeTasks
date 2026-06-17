import { createBrowserRouter, Outlet } from "react-router-dom";
import Register from "../pages/Register";
import Login from "../pages/Login";
import Dashboard from "../pages/Dashboard"
import Project from "../pages/Project";
import { NewTask, ExistingTask } from "../pages/Task";
import { loadUser, fetchTask, fetchTasks, fetchProject, fetchProjects} from "./loaders";
import { createTask, updateTask, createProject, updateProject, deleteProject, registerUser, inviteUser } from "./actions";
import { ProtectedRoute, UnauthRoute } from "../components/RouteGuards";
import RootLayout from "../Layouts/RootLayout";
import Sidebar from "../components/Sidebar";
import Invite from "../pages/Invite";

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
            action: registerUser
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
            path: 'dashboard/:pid?',
            loader: fetchTasks,
            id: "dashboard",
            Component: Dashboard,
            children: [
              {
                index: true,
                Component: Sidebar,
                loader: fetchProjects,
                id: 'projects'
              }
            ]
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
          },
          {
            path: "projects/:pid/delete",
            action: deleteProject
          },
          {
            path: "projects/:pid/invite",
            Component: "Invite",
            action: inviteUser
          }
        ]
      }
    ]
  }
]);

export default router;

