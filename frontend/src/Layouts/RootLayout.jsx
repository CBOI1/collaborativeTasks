import { useState } from "react";
import { Link, Outlet, useRevalidator, useMatch, useNavigate, useRouteLoaderData, useParams } from "react-router-dom";

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
  const user = useRouteLoaderData("root");
  //if user is not null return a log out button
  return <button type="button" className="bg-green-200 hover:bg-green-300 rounded-full px-4 py-2" onClick={logout}>Logout</button>;
}

function NavBar() {
  const {pid} = useParams();
  const user = useRouteLoaderData("root");
  const isDashboardRoute = useMatch('/dashboard/:pid?');
  return <nav className="flex justify-around p-2">
    {!user && <LinkNav to="register" title="Register"/>}
    {!user && <LinkNav to="login" title="Login" /> }
    {user && !isDashboardRoute && <LinkNav to={pid !== undefined ? `dashboard/${pid}` : '/dashboard'} title='Dashboard'/>}
    {user && isDashboardRoute && <LinkNav to='/projects/new' title="Create Project"/>}
    {user && <LogOut/>}
  </nav>
}

export default function RootLayout() {
  return <div className="grow self-stretch flex flex-col gap-1">
    <NavBar/>
    <Outlet/>
  </div>
}