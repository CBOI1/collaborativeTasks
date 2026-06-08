import styles from "./Sidebar.module.css";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";

function useProjects() {
    const [projects, updateProjects] = useState([]);
    useEffect(() => {
        let ignoreData = false;
        const fetchProjectData = async () => {
            const res = await fetch('/api/projects', {credentials: "include"});
            if (!ignoreData && !res.ok) {
                updateProjects(null);
            }
            const data = await res.json();
            if (!ignoreData) {
                updateProjects(data.projects)
            }
        }
        fetchProjectData();
        return () => {
            ignoreData = true;
        }
    }, []);
    return projects;
}

function Sidebar({activePid, setActivePid}) {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const projects = useProjects();
    return <div className="bg-blue-200">
        <button className={`flex ${styles.cleanButton} ${styles.buttonStyle}`}
        onClick={() => {setIsCollapsed(!isCollapsed)}}>
            Projects {isCollapsed ? <FiChevronRight/> : <FiChevronLeft/>}
        </button>
        <ul style={{
            display: isCollapsed ? "none" : "block",
        }}>
            {
                projects?.map(p => <li><NavLink to={`/dashboard/${p.id}`}>{p.title}</NavLink></li>)
            }
       
        </ul>
    </div>
}

export default Sidebar;