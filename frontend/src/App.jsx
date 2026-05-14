import { RouterProvider, Link, Outlet, useMatch, useRouteLoaderData } from "react-router-dom";
import router from "./routes/routes";

function App() {
  return <RouterProvider router={router}></RouterProvider>
}

export default App;
