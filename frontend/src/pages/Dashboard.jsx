import { useRouteLoaderData } from "react-router-dom";
import { useState, useEffect } from "react";
import { FiMoreVertical, FiTrash2, FiEdit } from "react-icons/fi";
import { useRevalidator, useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

const options ={
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

function ExpandableMenu({anchor, setActiveTid, tid}) {
    useEffect(() => {
        function handleTap(e) {
            if (anchor && !anchor.contains(e.target)) {
                setActiveTid(null);
            }
        }
        document.addEventListener("mousedown", handleTap);
        return () => {
            document.removeEventListener("mousedown", handleTap);
        }
    }, [anchor]);
    return <MenuOptions tid={tid} options={options}></MenuOptions>
}

function Dashboard() {
    const {tasks} = useRouteLoaderData("dashboard");
    const [activeTid, setActiveTid] = useState(null);
    const [activeMenuBtn, setActiveMenuBtn] = useState(null);
    const [loading, setLoading] = useState(false);
    
    const menu = <ExpandableMenu currentTarget={activeMenuBtn}></ExpandableMenu>;
    const taskItems = tasks.map(t => 
            <li key={t.id} className="bg-green-200 rounded-full px-2 py-4 relative flex justify-between max-w-48">
                <span className="truncate">{t.title}</span>
                <div onClick={ (e) => {
                    setActiveTid(t.id);
                    setActiveMenuBtn(e.currentTarget)
                }} className="shrink-0">
                    <FiMoreVertical data-tid={t.id}></FiMoreVertical>
                    {t.id === activeTid && <ExpandableMenu anchor={activeMenuBtn} setActiveTid={setActiveTid} tid={t.id}></ExpandableMenu>}
                </div>
            </li>
    )
    return <ul className="flex flex-col gap-2">{taskItems}</ul>
}

export default Dashboard;