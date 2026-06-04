import DashboardContent from "../components/DashboardContent";
import Sidebar from "../components/Sidebar";
function Dashboard() {
    return <div className="grow self-stretch flex">
        <Sidebar></Sidebar>
        <DashboardContent></DashboardContent>
    </div>
}

export default Dashboard;