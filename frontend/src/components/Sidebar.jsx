import styles from "./Sidebar.module.css";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { useEffect, useState } from "react";

function useProjects() {
    const [projects, updateProjects] = useState([]);
    useEffect(async () => {
        const projectData = await fetch('/api/projects', {credentials: "include"});
        console.log(projectData);
        updateProjects(projects);
    }, [])
    return projects;
}
function Sidebar({children}) {
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
        </ul>
    </div>
}

export default Sidebar;