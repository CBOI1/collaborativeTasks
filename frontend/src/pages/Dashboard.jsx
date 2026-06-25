import DashboardContent from "../components/DashboardContent";
import Sidebar from "../components/Sidebar";
import { useState, useEffect } from "react";
import { Outlet, useParams} from "react-router-dom";

function Dashboard() {
    const params = useParams();
    const [activePid, setActivePid] = useState(params.pid ?? null);
    
    return <div className="grow self-stretch flex">
        <Outlet context={[activePid, setActivePid]}></Outlet>
        <DashboardContent activePid={activePid}></DashboardContent>
    </div>
}

export default Dashboard;