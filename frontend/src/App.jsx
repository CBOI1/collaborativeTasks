import {createBrowserRouter, RouterProvider, Link, Outlet, useLoaderData, redirect, useMatch } from "react-router-dom";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard"
import { useState, useEffect, use} from "react";
import { useAuthContext, } from "./AuthContext";
import AuthProvider from "./components/AuthProvider";


const loadUser = async () => {
  const res = await fetch('/api/me', { credentials: 'include'});
  if (!res.ok) {
    return {user: null};
  } 
  const data = await res.json();
  console.log("LOADER USER:", data.user);
  return {user: data.user};
}

const handleRoute = ({protectedRoute = false, noUser = false}) => {
  return async () => {
    console.log("Route handler protected: ", protectedRoute, " noUser: ", noUser);
    if (protectedRoute && noUser) {
      throw new Error("Invalid loader configuration");
    } 
    const {user} = await loadUser();
    if (protectedRoute && !user) {
      throw redirect('/login');
    } else if (noUser && user) {
      throw redirect('/dashboard')
    }
    return {user};
  }
}

const router = createBrowserRouter([
  {
    path: "/",
    Component: RootLayout,
    loader: loadUser,
    children : [
      {
        index: true,
        Component: Index
      },
      {
        path: "register",
        Component : Register,
        loader: handleRoute({noUser: true})
      },
      {
        path: "login",
        Component: Login,
        loader: handleRoute({noUser: true})
      },
      {
        path: "dashboard",
        Component: Dashboard,
        loader: handleRoute({protectedRoute : true})
      }
    ]
  }
]);

function LinkNav({to, title}) {
  return <Link to={to} className="bg-green-200 hover:bg-green-300 rounded-full px-4 py-2">{title}</Link>
}

function LogOut() {
  const {logout} = useAuthContext();
  return <button type="button" className="bg-green-200 hover:bg-green-300 rounded-full px-4 py-2" onClick={logout}>Logout</button>
}

function NavBar() {
  const {user} = useAuthContext();
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
  const { user : loadedUser} = useLoaderData();
  const  { setUser } = useAuthContext();

  useEffect(() => {
    console.log("ROOT → setting user:", loadedUser);
    setUser(loadedUser);
  }, [loadedUser]);

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
  return <AuthProvider>
    <RouterProvider router={router}></RouterProvider>
  </AuthProvider>
}

export default App;
