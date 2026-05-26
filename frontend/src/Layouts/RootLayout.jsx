import { Link, Outlet, useRevalidator, useMatch, useNavigate, useRouteLoaderData } from "react-router-dom";

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


function NavBar() {
  const {user} = useRouteLoaderData("root");
  const isDashboardRoute = useMatch('/dashboard');
  return <nav className="flex justify-around p-2">
    {!user && <LinkNav to="register" title="Register"/>}
    {!user && <LinkNav to="login" title="Login" /> }
    {user && !isDashboardRoute && <LinkNav to='dashboard' title='Dashboard'/>}
    {user && isDashboardRoute && <LinkNav to='/tasks/new' title="Create Task"/>}
    {user && <LogOut/>}
  </nav>
}

export default function RootLayout() {
  return <div className="grow self-stretch flex flex-col gap-1">
    <NavBar />
    <Outlet />
  </div>
}