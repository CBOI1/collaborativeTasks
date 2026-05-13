import {createBrowserRouter, RouterProvider, Link, Outlet, useLoaderData, redirect, useMatch, useRouteLoaderData, Navigate, useNavigate, useRevalidator} from "react-router-dom";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard"
import { useState, useEffect} from "react";
import {ExistingTask, NewTask} from "./pages/Task";


const loadUser = async () => {
  const res = await fetch('/api/me', { credentials: 'include'});
  if (!res.ok) {
    return {user: null};
  } 
  const data = await res.json();
  console.log("LOADER USER:", data.user);
  return {user: data.user};
}

const fetchTasks = async () => {
  console.log("DASHBOARD LOADER RUNNING..");
  const res = await fetch('/api/tasks', { credentials: "include"});
  if (!res.ok) {
    return {tasks: null};
  }
  const tasks = await res.json();
  return {tasks};
}

const fetchTask = async ({params}) => {
  console.log("TASK LOADER RUNNING...");
  const res = await fetch(`/api/tasks/${params.tid}`, {credentials: "include"});
  if (!res.ok) {
    return {task: null};
  }
  const task = await res.json();
  return {task};
}

const createTask = async ({request}) => {
    const formData = await request.formData();
    const title = formData.get("title");
    const description = formData.get("description");
    const finished = formData.get("finished");
    const res = await fetch('/api/tasks/create', {
      credentials: "include",
      method: "POST",
      headers: {
        "Content-Type" : "application/json"
      },
      body : JSON.stringify({
        title,
        description,
        finished: (finished ? true : false)
      })
    });
    if (!res.ok) {
      throw Error("Creation failed");
    }
    return redirect("/dashboard");
}
const updateTask = async ({request, params}) => {
    const formData = await request.formData();
    const tid = params.tid;
    const title = formData.get("title");
    const description = formData.get("description");
    const finished = formData.get("finished");
    const res = await fetch(`/api/tasks/${tid}/update`, {
      credentials: "include",
      method: "POST",
      headers: {
        "Content-Type" : "application/json"
      },
      body : JSON.stringify({
        title,
        description,
        finished: (finished ? true : false)
      })
    });
    if (!res.ok) {
      throw Error("Update failed");
    }
    return redirect("/dashboard");
}

const router = createBrowserRouter([
  {
    path: "/",
    Component: RootLayout,
    loader: loadUser,
    id: "root",
    children : [
      {
        index: true,
        Component: Index
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

function LinkNav({to, title}) {
  return <Link to={to} className="bg-green-200 hover:bg-green-300 rounded-full px-4 py-2">{title}</Link>
}

function LogOut() {
  const navigate = useNavigate();
  const {revalidate} = useRevalidator();
  const logout = async() => {
    await fetch('/api/logout', {credentials : 'include', method: 'POST'});
    revalidate();
    navigate("/");
  }
  const { user } = useRouteLoaderData("root");
  return user ? <button type="button" className="bg-green-200 hover:bg-green-300 rounded-full px-4 py-2" onClick={logout}>Logout</button> : <></>
}

function ProtectedRoute() {
  const {user} = useRouteLoaderData("root");
  if (!user) {
    return <Navigate to="/login" replace="true"></Navigate>
  }
  return <Outlet></Outlet>
}
function UnauthRoute() {
  const {user} = useRouteLoaderData("root");
  if (user) {
    return <Navigate to="/dashboard" replace="true"></Navigate>
  }
  return <Outlet></Outlet>
}

function NavBar() {
  const {user} = useRouteLoaderData("root");
  console.log("NAVBAR sees user:", user);
  const isDashboardRoute = useMatch('/dashboard');
  return <nav className="flex justify-around p-2">
    {!user && <LinkNav to="register" title="Register"/>}
    {!user && <LinkNav to="login" title="Login" /> }
    {user && !isDashboardRoute && <LinkNav to='dashboard' title='Dashboard'/>}
    {user && isDashboardRoute && <LinkNav to='/tasks/new' title="Create Task"/>}
    {user && <LogOut/>}
  </nav>
}

function RootLayout() {
  return <div className="flex flex-col grow gap-1 w-full">
    <NavBar />
    <div className="flex justify-center items-center grow self-stretch">
      <Outlet />
    </div>
  </div>
}

function Index() {
  return <p className="grow">Hello world!</p>
}

function App() {
  return <RouterProvider router={router}></RouterProvider>
}

export default App;
