import { NavLink, useRouteLoaderData} from "react-router-dom";
import { useState, useEffect, useRef} from "react";
import { FiMoreVertical, FiTrash2, FiEdit, FiXCircle } from "react-icons/fi";
import { VscAdd } from "react-icons/vsc"
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

function Modal({title, confirmText, onConfirm, onClose, isOpen, id}) {
    const dialogRef = useRef(null);
    useEffect(() => {
        if (isOpen) {
            dialogRef.current.showModal()
        }
        if (!isOpen) {
            dialogRef.current.close();
        }
    }, [isOpen]);
    return <dialog id={id} ref={dialogRef} className="fixed top-1/2 right-auto bottom-auto left-1/2 -translate-1/2 p-5 open:flex flex-col gap-2">
        <div className="p-2 text-rose-500 shrink-0 flex flex-row justify-end"><FiXCircle onClick={onClose}></FiXCircle></div>
        <h2>{title}</h2>
        <button onClick={async () => {
            await onConfirm();
        }}>
          {confirmText}  
        </button>
    </dialog>
}

function MenuOptions({pid, tid, options, onOutsideClick, setTidToDelete}) {
    const menuRef = useRef(null);
    const {revalidate} = useRevalidator();
    useDetectOutsideClick(menuRef, onOutsideClick);
    return <ul ref={menuRef} className="bg-gray-300 text-black p-2 rounded-full absolute -right-30 -top-6 px-4">
        <li key={options.delete.name} className="text-red-400 flex justify-between gap-1 border-b-1 border-gray-500" onClick={() => {
            setTidToDelete(tid);
        }}>
            {options.delete.name}
            <FiTrash2></FiTrash2>
        </li >
        <li >
            <Link to={`/projects/${pid}/tasks/${tid}/update`} className="text-blue-400 flex justify-between gap-1">
                {options.edit.name}
                <FiEdit></FiEdit>
            </Link>
        </li>
    </ul>
}

function ActiveMenu({pid, tid, setActiveTid, setTidToDelete}) {
    function handleOutsideTap() {
        setActiveTid(null);
    }
    return <MenuOptions pid={pid} tid={tid} options={options} onOutsideClick={handleOutsideTap} setTidToDelete={setTidToDelete}></MenuOptions>
}


//grid grid-cols-3 grid-rows-3 
function TaskPreview({pid, task, setActiveTid, activeTid, setTidToDelete}) {
    const taskItemStyling = "shrink-0  bg-gray-200 rounded-lg p-1 grid grid-cols-[1fr_max-content] grid-rows-[1fr_2fr]"
    return <li className={taskItemStyling}>
        <p className="text-l font-bold line-clamp-1">{task.title}</p>
        <p className="row-start-2 col-start-1 line-clamp-2">{task.description}</p>
        <div className="relative row-span-full col-start-2 self-center justify-center">
            <FiMoreVertical onClick={ 
                () => {
                    setActiveTid(task.id);
                }} className="shrink-0">
            </FiMoreVertical>
            {activeTid === task.id && <ActiveMenu pid={pid} tid={task.id} setActiveTid={setActiveTid} setTidToDelete={setTidToDelete}></ActiveMenu>}
        </div>
    </li>
}

function TaskList({pid, tasks, activeTid, setActiveTid, setTidToDelete}) {
    const createTaskItemStyling = "shrink-0 self-stretch flex bg-gray-200 rounded-lg p-1 space-between"
    return <ul className="flex flex-col gap-2 min-w-1/2 grow">
            <li className={createTaskItemStyling}>
                <NavLink to={`/projects/${pid}/tasks/new`} className={"grow"}>Create Task</NavLink>
                <VscAdd className="row-span-full col-start-2 self-center"></VscAdd>
            </li>
            {
                tasks.map(t => <TaskPreview 
                    pid={pid}
                    task={t} 
                    key={t.id} 
                    setActiveTid={setActiveTid} 
                    activeTid={activeTid}
                    setTidToDelete={setTidToDelete}
                    />
                )
            }
        </ul>
}

function DashboardContent() {
    const revalidator = useRevalidator();
    const {tasks, pid} = useRouteLoaderData('dashboard');
    const [activeTid, setActiveTid] = useState(null);
    const [tidToDelete, setTidToDelete] = useState(null);
    const displayTasks = <div className="grow flex flex-col justify-center items-center">
        <TaskList 
            pid={pid}
            tasks={tasks} 
            activeTid={activeTid} 
            setActiveTid={setActiveTid}
            setTidToDelete={setTidToDelete}
        />
        <Modal 
            title={"Are you certain you want to delete this task?"}
            confirmText={"Delete"}
            onConfirm={async () => {
                //onConfirm is responsible for making sure isOpen becomes false
                await options.delete.operation(tidToDelete);
                setTidToDelete(null);
                revalidator.revalidate();
            }}
            isOpen={tidToDelete !== null}
            onClose={() => setTidToDelete(null)}
            id={'delete-modal'}
        ></Modal>
    </div>
    return tasks !== null ? displayTasks : <p>No active project is selected</p>
}

export default DashboardContent;