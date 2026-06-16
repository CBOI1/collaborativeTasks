import DashboardContent from "../components/DashboardContent";
import Sidebar from "../components/Sidebar";
import { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";

function Dashboard() {
    return <div className="grow self-stretch flex">
        <Outlet></Outlet>
        <DashboardContent></DashboardContent>
    </div>
}

export default Dashboard;