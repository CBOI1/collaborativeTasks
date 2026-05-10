import { useRouteLoaderData } from "react-router-dom";
import { Link } from "react-router-dom";
function Dashboard() {
    const {tasks} = useRouteLoaderData("dashboard");
    const taskItems = tasks.map(t => <li key={t.id} className="bg-green-200 rounded-full p-1">
        <Link to={`/tasks/${t.id}/edit`}>{t.title}</Link>
    </li>)
    return <ul>{taskItems}</ul>
}

export default Dashboard;