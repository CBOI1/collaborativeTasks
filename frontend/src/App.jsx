import {createBrowserRouter, RouterProvider, Link, Outlet, useLoaderData, redirect, useMatch, useRouteLoaderData, Navigate, useNavigate, useRevalidator} from "react-router-dom";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard"
import { useState, useEffect} from "react";



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
  const res = await fetch('/api/tasks', { credentials: "include"});
  if (!res.ok) {
    return {tasks: null};
  }
  const tasks = res.json();
  return {tasks};
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
