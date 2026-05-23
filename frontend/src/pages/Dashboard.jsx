import { useRouteLoaderData } from "react-router-dom";
import { useState, useEffect, useRef} from "react";
import { FiMoreVertical, FiTrash2, FiEdit, FiXCircle } from "react-icons/fi";
import { useRevalidator } from "react-router-dom";
import { Link } from "react-router-dom";

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

function useDetectOutsideClick(ref, onOutsideClick) {
    useEffect(() => {
        function handler(e) {
            if (ref.current && !ref.current.contains(e.target)) {
                onOutsideClick()
            }
        }
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler)
    }, [ref, onOutsideClick]);
}

function Modal({title, confirmText, onConfirm, onClose, isOpen}) {
    const dialogRef = useRef(null);
    return <dialog ref={dialogRef} onClose={() => setOpen(false)}>
        <div>
            <h2>{title}</h2>
            <button onClick={onClose}>
                <FiXCircle></FiXCircle>
            </button>
        </div>
        <button onClick={onConfirm}>{confirmMsg}</button>
    </dialog>
}

function MenuOptions({tid, options, onOutsideClick}) {
    const menuRef = useRef(null);
    const {revalidate} = useRevalidator();
    useDetectOutsideClick(menuRef, onOutsideClick);

    return <ul ref={menuRef} className="bg-gray-300 text-black p-2 rounded-full absolute -right-30 -top-6 px-4">
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

function ActiveMenu({tid, setActiveTid}) {
    function handleOutsideTap() {
        setActiveTid(null);
    }
    return <MenuOptions tid={tid} options={options} onOutsideClick={handleOutsideTap}></MenuOptions>
}

//grid grid-cols-3 grid-rows-3 
function TaskPreview({task, setActiveTid, activeTid}) {
    return <li className="shrink-0 grid grid-cols-[1fr_max-content] grid-rows-[1fr_2fr] bg-gray-200 rounded-lg p-1">
        <p className="text-l font-bold line-clamp-1">{task.title}</p>
        <p className="row-start-2 col-start-1 line-clamp-2">{task.description}</p>
        <div className="relative row-span-full col-start-2 self-center justify-center">
            <FiMoreVertical onClick= { 
                () => {
                    setActiveTid(task.id);
                }} className="shrink-0">
            </FiMoreVertical>
            {activeTid === task.id && <ActiveMenu tid={task.id} setActiveTid={setActiveTid}></ActiveMenu>}
        </div>
    </li>
}

function Dashboard() {
    const {tasks} = useRouteLoaderData("dashboard");
    const [activeTid, setActiveTid] = useState(null);
    const [loading, setLoading] = useState(false);
    const dialogRef = useRef(null);
    const [dialogIsOpen, setDialogOpen] = useState(false);
    const taskItems = tasks.map(t => <TaskPreview task={t} key={t.id} setActiveTid={setActiveTid} activeTid={activeTid}></TaskPreview>)
    return <>
        <ul className="flex flex-col gap-2 self-stretch max-w-3/5 grow">
                {taskItems}
        </ul>
    </>
}

export default Dashboard;