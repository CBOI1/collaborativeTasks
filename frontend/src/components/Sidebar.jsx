import styles from "./Sidebar.module.css";
import { FiChevronLeft, FiChevronRight, FiMoreVertical, FiEdit, FiTrash2} from "react-icons/fi";
import { useEffect, useState } from "react";
import { NavLink, useNavigate, useRevalidator } from "react-router-dom";
import Modal from "./Modal";
import useDetectOutsideClick from "../hooks/useDetectOutsideClick.jsx";
import MenuOptions from "./MenuOptions.jsx";
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

function Sidebar() {
    const [activePid, setActivePid] = useState(null);
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const projects = useProjects();
    const navigate = useNavigate();
    const options = [
        {
            name: "edit",
            icon: <FiEdit/>,
            styling: "ml-6 text-green-800",
            action: () => {
                navigate(`/projects/${activePid}/update`);
            }
        },
        {
            name: "delete",
            icon: <FiTrash2/>,
            styling: "ml-6 text-red-600",
            action: () => {
                setModalIsOpen(true);
            }
        }
    ]
    return <div className="bg-blue-200">
        <button className={`flex ${styles.cleanButton} ${styles.buttonStyle}`}
        onClick={() => {setIsCollapsed(!isCollapsed)}}>
            Projects {isCollapsed ? <FiChevronRight/> : <FiChevronLeft/>}
        </button>
        <ul style={{
            display: isCollapsed ? "none" : "block",
        }}>
            {
                projects?.map(p => {
                    return <li>
                        <NavLink
                            onClick={() => setActivePid(p.id)} 
                            to={`/dashboard/${p.id}`}
                            className={({ isActive }) => {
                                return isActive ? 'text-blue-700 font-extrabold' : 'bg-transparent';
                            }}
                            end
                        >{p.title}</NavLink>
                        {p.id === activePid && 
                            <MenuOptions
                                className={`flex flex-col bg-blue-100`}
                            >
                                {options.map((option, index, arr) => {
                                    return <span className={`flex cursor-pointer ${option.styling}`} onClick={option.action}>
                                            {option.name} {option.icon}
                                    </span>
                                })}
                            </MenuOptions>}
                    </li>
                })
            }
       
        </ul>
        <Modal
            title={"Do you want to delete this project"}
            confirmText={"Confirm"}
            onConfirm={() => {
                console.log("Hello from delete modal");
                setModalIsOpen(false);
            }}
            onClose={() => setModalIsOpen(false)}
            isOpen={modalIsOpen}
            id={"project-delete-modal"}
        />
    </div>
}

export default Sidebar;