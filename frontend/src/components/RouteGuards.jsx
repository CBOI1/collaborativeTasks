import { Navigate, useRouteLoaderData, Outlet } from "react-router-dom";
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

export { ProtectedRoute, UnauthRoute };