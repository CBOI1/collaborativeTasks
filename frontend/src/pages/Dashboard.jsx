import { useRouteLoaderData } from "react-router-dom";
function Dashboard() {
    const {tasks} = useRouteLoaderData("dashboard");
    tasks.map(t => <li key={t.id}>
        <h2>{t.title}</h2>
    </li>)
}

export default Dashboard;