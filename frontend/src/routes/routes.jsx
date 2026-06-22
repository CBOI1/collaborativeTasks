import { createBrowserRouter, Outlet } from "react-router-dom";
import Register from "../pages/Register";
import Login from "../pages/Login";
import Dashboard from "../pages/Dashboard"
import Project from "../pages/Project";
import { NewTask, ExistingTask } from "../pages/Task";
import loaders from "./loaders";
import actions from "./actions";
import { ProtectedRoute, UnauthRoute } from "../components/RouteGuards";
import RootLayout from "../Layouts/RootLayout";
import Sidebar from "../components/Sidebar";
import AddCollaborator from "../pages/AddCollaborator";

const router = createBrowserRouter([
  {
    path: "/",
    Component: RootLayout,
    loader: loaders.loadUser,
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
            action: actions.registerUser
          },
          {
            path: "login",
            Component: Login,
            action: actions.loginUser
          },
        ]
      },
      {
        Component: ProtectedRoute,
        children : [
          {
            path: 'dashboard/:pid?',
            loader: loaders.fetchTasks,
            id: "dashboard",
            Component: Dashboard,
            children: [
              {
                index: true,
                Component: Sidebar,
                loader: loaders.fetchProjects,
                id: 'projects'
              }
            ]
          },
          {
            path: "projects/new",
            Component: Project,
            action: actions.createProject
          },
          {
            path: 'projects/:pid/update',
            Component: Project,
            loader: loaders.fetchProject,
            action: actions.updateProject,
            id: "project-info"
          },
          {
            path: "projects/:pid/tasks/:tid/update",
            Component: ExistingTask,
            loader: loaders.fetchTask,
            id: "get-task",
            action: actions.updateTask
          },
          {
            path: "projects/:pid/tasks/new",
            Component: NewTask,
            action: actions.createTask
          },
          {
            path: "projects/:pid/delete",
            action: actions.deleteProject
          },
          {
            path: "projects/:pid/share",
            Component: AddCollaborator,
            action: actions.shareWithUser
          }, 
          {
            path: "/search",
            loader: loaders.searchUsers
          }
        ]
      }
    ]
  }
]);

export default router;

