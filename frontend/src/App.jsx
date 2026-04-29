
import {createBrowserRouter, RouterProvider, Link, Outlet } from "react-router-dom";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard"
import { useState, useEffect, useContext } from "react";
import { AuthContext } from "./AuthContext";
import AuthProvider from "./components/AuthProvider";

const router = createBrowserRouter([
  {
    path: "/",
    Component: IndexLayout,
    children : [
      {
        index: true,
        Component: Index
      },
      {
        path: "register",
        Component : Register,
      },
      {
        path: "login",
        Component: Login,
      },
      {
        path: "dashboard",
        Component: Dashboard
      }
    ]
  }
]);

function LinkNav({to, title}) {
  return <Link to={to} className="bg-green-200 hover:bg-green-300 rounded-full px-4 py-2">{title}</Link>
}

function NavBar() {
  const {user} = useContext(AuthContext);
  return <nav className="flex justify-around p-2">
    {!user && <LinkNav to="register" title="Register"/>}
    {!user && <LinkNav to="login" title="Login" /> }
  </nav>
}

function IndexLayout() {
  return <div className="flex flex-col grow gap-1 w-full">
    <NavBar />
    <div className="flex justify-center items-center grow self-stretch">
      <Outlet />
    </div>
  </div>
  
  
}2

function Index() {
  return <p className="grow">Hello world!</p>
}

function App() {
  return <RouterProvider router={router}></RouterProvider>
}

export default App;
