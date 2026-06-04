import { useEffect, useState } from "react";
import { Form } from "react-router-dom";
import { useRouteLoaderData } from "react-router-dom";
import { maxLength } from "zod";
import { Toaster } from 'react-hot-toast';
import { styles } from "./style.module.css"
function Task({isNew}) {
    const [descCharCount, updateDescCharCount] = useState(0);
    const [titleCharCount, updateTitleCharCount] = useState(0);
    const DESC_CHAR_LIMIT = 500;
    const TITLE_CHAR_LIMIT = 100;
    const task = isNew ? {} : useRouteLoaderData("get-task").task;

    useEffect(() => {
        if (!isNew) {
            updateDescCharCount(task.description.length);
            updateTitleCharCount(task.title.length);
        }
    }, [isNew]);
    
    return <div className="grow flex flex-col justify-center items-center p-4">
        <Toaster></Toaster>
        <Form method="POST" className="grow flex flex-col justify-center min-w-1/2 gap-4">
            <div className={styles.inputContainerStyle}>
                <label htmlFor="title">Title:</label>
                <input type="text" id="title" defaultValue={task.title} name="title" className={styles.inputStyle} onChange={(e) => updateTitleCharCount(e.currentTarget.value.length)} maxLength={`${TITLE_CHAR_LIMIT}`}/>
                <span>{`characters ${titleCharCount}/${TITLE_CHAR_LIMIT}`}</span>
            </div>
            <div className={styles.inputContainerStyle + " grow-2 max-h-1/2"}>
                <label htmlFor="description">Description</label>
                <textarea name="description" id="description" defaultValue={task.description} className={styles.inputStyle + " resize-none grow"} maxLength={`${DESC_CHAR_LIMIT}`} onChange={(e) => updateDescCharCount(e.currentTarget.value.length)}></textarea>
                <span>{`characters ${descCharCount}/${DESC_CHAR_LIMIT}`}</span>
            </div>
            <div>
                <label htmlFor="finished">Finished:</label>
                <input type="checkbox" name="finished" id="finished" defaultChecked={task.finished}/>
            </div>
            <button type="submit">{isNew ? "Create" : "Update"}</button>
        </Form>
    </div>
}

export function ExistingTask() {
    return <Task isNew={false}></Task>
}
export function NewTask() {
    return <Task isNew={true}></Task>
}