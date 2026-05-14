import { useRouteLoaderData } from "react-router-dom";
import { useState, useEffect, createContext, useContext, useRef } from "react";
import { FiMoreVertical, FiTrash2, FiEdit } from "react-icons/fi";
import { useRevalidator } from "react-router-dom";
import { Link } from "react-router-dom";

const TaskContext = createContext(null);

const options = {
    "delete" : {
        name: "Delete",
        operation: async (tid) => {
            await fetch(`/api/tasks/${tid}/delete`, {
                credentials: "include",
                method: "DELETE"
            });
        },
    },
    "edit" : {
            name: "Edit",
    }
}

function Modal({title, body, action, dismiss}) {
    return <div>

    </div>

}

function MenuOptions({tid, options}) {
    const {revalidate} = useRevalidator();
    return <ul className="bg-gray-300 text-black p-2 rounded-full absolute -right-30 top-0 px-4">
        <li key={options.delete.name} className="text-red-400 flex justify-between gap-1 border-b-1 border-gray-500" onClick={async () => {
            await options.delete.operation(tid);
            revalidate();
        }}>
            {options.delete.name}
            <FiTrash2></FiTrash2>
        </li >
        <li >
            <Link to={`/tasks/${tid}/update`} className="text-blue-400 flex justify-between gap-1">
                {options.edit.name}
                <FiEdit></FiEdit>
            </Link>
        </li>
    </ul>
}

function ActiveMenu({tid}) {
    const {setActiveTid, activeMenuContainer, setActiveMenuContainer} = useContext(TaskContext)
    useEffect(() => {
        function handleTap(e) {
            if (activeMenuContainer && !activeMenuContainer.contains(e.target)) {
                setActiveTid(null);
                setActiveMenuContainer(null);
            }
        }
        document.addEventListener("mousedown", handleTap);
        return () => {
            document.removeEventListener("mousedown", handleTap);
        }
    }, [activeMenuContainer]);
    return <MenuOptions tid={tid} options={options}></MenuOptions>
}


function TaskPreview({task}) {
    const menuContainerRef = useRef(null);
    const {activeTid, setActiveTid, setActiveMenuContainer} = useContext(TaskContext)
    console.log("Task id ", task.id);
    console.log("Active tid", activeTid);
    return <li className="grid-cols-3 grid-rows-3 shrink-0">
        <span>{task.title}</span>
        <span>{task.description}</span>
        <div ref={menuContainerRef} className="relative">
            <FiMoreVertical onClick= { 
                () => {
                    setActiveTid(task.id);
                    setActiveMenuContainer(menuContainerRef.current);
                }}>
            </FiMoreVertical>
            {activeTid === task.id && <ActiveMenu tid={task.id}></ActiveMenu>}
        </div>
    </li>
}

function Dashboard() {
    const {tasks} = useRouteLoaderData("dashboard");
    const [activeTid, setActiveTid] = useState(null);
    const [activeMenuContainer, setActiveMenuContainer] = useState(null);
    const [loading, setLoading] = useState(false);
    const taskItems = tasks.map(t => <TaskPreview task={t} key={t.id}></TaskPreview>)
    return <ul className="flex flex-col gap-2">
        <TaskContext.Provider value={{
            activeTid,
            setActiveTid, 
            setActiveMenuContainer, 
            activeMenuContainer
        }}>
            {taskItems}
        </TaskContext.Provider>
    </ul>
}

export default Dashboard;