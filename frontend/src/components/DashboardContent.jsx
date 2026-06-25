import { NavLink, useRouteLoaderData} from "react-router-dom";
import { useState, useEffect, useRef} from "react";
import { FiMoreVertical, FiTrash2, FiEdit, FiXCircle } from "react-icons/fi";
import { VscAdd } from "react-icons/vsc"
import { useRevalidator, useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { _null } from "zod/v4/core";
import useDetectOutsideClick from "../hooks/useDetectOutsideClick.jsx";
import Modal from "./Modal";
import MenuOptions from "./MenuOptions.jsx";
import Role from "../constants.js";
import styles from "./style.module.css"

//grid grid-cols-3 grid-rows-3 
function TaskPreview({pid, role, task, setActiveTid, activeTid, setModalIsOpen}) {
    const navigate = useNavigate();
    const options = [
        {
            name: "Edit",
            icon: <FiEdit></FiEdit>,
            styling: "text-green-800",
            action: () => {
                navigate(`/projects/${pid}/tasks/${task.id}/update`);
            },
            canPerform: () => {
                return role == Role.member || role === Role.owner ? "" : styles.disable
            }
        },
        {
            name: "Delete",
            icon: <FiTrash2></FiTrash2>,
            styling: "text-red-400",
            action: () => {
                setModalIsOpen(true);
            },
            canPerform: () => {
                return role === Role.owner ? "" : styles.disable
            }
        }
    ]
    const taskItemStyling = "shrink-0  bg-gray-200 rounded-lg p-1 grid grid-cols-[1fr_max-content] grid-rows-[1fr_2fr]"
    return <li className={taskItemStyling}>
        <p className="text-l font-bold line-clamp-1">{task.title}</p>
        <p className="row-start-2 col-start-1 line-clamp-2">{task.description}</p>
        <div className="relative row-span-full col-start-2 self-center justify-center">
            <FiMoreVertical onClick={ 
                (e) => {
                    setActiveTid(task.id);
                    //stop bubbling to prevent click from immediately clearing active task
                    //clearing triggers on mousedown which occurs before click event
                    e.stopPropagation();
                }} className="shrink-0">
            </FiMoreVertical>
            {activeTid === task.id && <MenuOptions
                onOutsideClick={() => setActiveTid(null)}
                className={"bg-gray-300 text-black p-2 rounded-full absolute -right-30 -top-6 px-4"}
            >
                {options.map(option => {
                    return <li 
                    key={option.name}
                    onClick={option.action} 
                    className={`flex cursor-pointer ${option.styling} ${option.canPerform()} `}
                    >
                        <span className="grow">{option.name}</span>
                        {option.icon}
                    </li>
                })}
            </MenuOptions>}
        </div>
    </li>
}

function TaskList({pid, role, tasks, activeTid, setActiveTid, setModalIsOpen}) {
    const createTaskItemStyling = "shrink-0 self-stretch flex bg-gray-200 rounded-lg p-1 space-between"
    return <ul className="flex flex-col gap-2 min-w-1/2 grow">
            <li className={createTaskItemStyling}>
                <NavLink to={`/projects/${pid}/tasks/new`} className={"grow"}>Create Task</NavLink>
                <VscAdd className="row-span-full col-start-2 self-center"></VscAdd>
            </li>
            {
                tasks.map(t => <TaskPreview 
                    pid={pid}
                    role={role}
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
//need to add mechanism to be able to read role of user viewing task list
function DashboardContent({activePid}) {
    const revalidator = useRevalidator();
    const {tasks, role} = useRouteLoaderData('dashboard');
    const [activeTid, setActiveTid] = useState(null);
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const displayTasks = <div className="grow flex flex-col justify-center items-center">
        <TaskList 
            pid={activePid}
            role={role}
            tasks={tasks ?? []} 
            activeTid={activeTid} 
            setActiveTid={setActiveTid}
            setModalIsOpen={setModalIsOpen}
        />
        <Modal 
            title={"Are you certain you want to delete this task?"}
            confirmText={"Delete"}
            onConfirm={async () => {
                //onConfirm is responsible for making sure isOpen becomes false
                await fetch(`/api/projects/${activePid}/tasks/${activeTid}`, {
                credentials: "include",
                method: "delete"
            });
                setModalIsOpen(false)
                revalidator.revalidate();
            }}
            isOpen={modalIsOpen}
            onClose={() => setModalIsOpen(false)}
            id={'delete-modal'}
        ></Modal>
    </div>
    return tasks !== null ? displayTasks : <p>No available tasks</p>;
}

export default DashboardContent;