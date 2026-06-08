import { NavLink, useRouteLoaderData} from "react-router-dom";
import { useState, useEffect, useRef} from "react";
import { FiMoreVertical, FiTrash2, FiEdit, FiXCircle } from "react-icons/fi";
import { VscAdd } from "react-icons/vsc"
import { useRevalidator, useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { _null } from "zod/v4/core";
import useDetectOutsideClick from "../hooks/useDetectOutsideClick";
import Modal from "./Modal";

function TaskMenuOptions({onOutsideClick, children}) {
    const menuRef = useRef(null);
    const {revalidate} = useRevalidator();
    useDetectOutsideClick(menuRef, onOutsideClick);
    return <ul ref={menuRef} className="bg-gray-300 text-black p-2 rounded-full absolute -right-30 -top-6 px-4">
        {children}
    </ul>
}

//grid grid-cols-3 grid-rows-3 
function TaskPreview({pid, task, setActiveTid, activeTid, setModalIsOpen}) {
    const navigate = useNavigate();
    const options = [
        {
            name: "Edit",
            icon: <FiEdit></FiEdit>,
            styling: "text-green-800",
            action: () => {
                navigate(`/projects/${pid}/tasks/${task.id}/update`);
            }
        },
        {
            name: "Delete",
            icon: <FiTrash2></FiTrash2>,
            styling: "text-red-400",
            action: () => {
                setModalIsOpen(true)
            }
        }
    ]
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
            {activeTid === task.id && <TaskMenuOptions
                onOutsideClick={() => setActiveTid(null)}
            >
                {options.map(option => {
                    return <li onClick={option.action} className={`flex cursor-pointer ${option.styling}`}>
                        <span className="grow">{option.name}</span>
                        {option.icon}
                    </li>
                })}
            </TaskMenuOptions>}
        </div>
    </li>
}

function TaskList({pid, tasks, activeTid, setActiveTid, setModalIsOpen}) {
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
                    setModalIsOpen={setModalIsOpen}
                    />
                )
            }
        </ul>
}

function DashboardContent() {
    const revalidator = useRevalidator();
    const {tasks, pid} = useRouteLoaderData('dashboard');
    const [activeTid, setActiveTid] = useState(null);
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const displayTasks = <div className="grow flex flex-col justify-center items-center">
        <TaskList 
            pid={pid}
            tasks={tasks} 
            activeTid={activeTid} 
            setActiveTid={setActiveTid}
            setModalIsOpen={setModalIsOpen}
        />
        <Modal 
            title={"Are you certain you want to delete this task?"}
            confirmText={"Delete"}
            onConfirm={async () => {
                //onConfirm is responsible for making sure isOpen becomes false
                await fetch(`/api/projects/${pid}/tasks/${activeTid}`, {
                credentials: "include",
                method: "DELETE"
            });
                setModalIsOpen(false)
                revalidator.revalidate();
            }}
            isOpen={modalIsOpen}
            onClose={() => setModalIsOpen(false)}
            id={'delete-modal'}
        ></Modal>
    </div>
    return tasks !== null ? displayTasks : <p>No active project is selected</p>
}

export default DashboardContent;