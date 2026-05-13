import { useRouteLoaderData } from "react-router-dom";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { FiMoreVertical } from "react-icons/fi";
import { useRevalidator } from "react-router-dom";

const options ={
    "delete" : {
        name: "Delete",
        operation: async (tid) => {
            await fetch(`/api/tasks/${tid}/delete`, {
                credentials: "include",
                method: "DELETE"
            });
        }
    }
}

function MenuOptions({tid, options}) {
    const {revalidate} = useRevalidator();
    return <ul className="bg-gray-300 text-black p-2 rounded-full absolute -right-20 top-0 px-4">
        <li key={options.delete.name} className="text-red-400" onClick={async () => {
            await options.delete.operation(tid);
            revalidate();
        }}>{options.delete.name}</li>
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
                <Link to={`/tasks/${t.id}/update`} className="truncate">{t.title}</Link>
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