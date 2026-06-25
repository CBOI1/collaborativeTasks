import styles from "./style.module.css"
import { Form, useRouteLoaderData} from "react-router-dom";
import { useState } from "react"; 
const TITLE_CHAR_LIMIT = 40;
function Project() {
    const project = useRouteLoaderData("project-info");
    const [charCount, setCharCount] = useState(project ? project.title.length : 0);
    return <div className="grow flex flex-col items-center">
        <Form method="post" className="grow flex flex-col justify-center min-w-1/2 gap-4">
            <div className={styles.inputContainer}>
                <label htmlFor="title">Title:</label>
                <input 
                    type="text" 
                    id="title"  
                    name="title" 
                    className={styles.inputStyle} 
                    defaultValue={project ? project.title : ""} 
                    onChange={e => setCharCount(e.currentTarget.value.length)}
                />
                { <span>{`characters ${charCount}/${TITLE_CHAR_LIMIT}`}</span> }
            </div>
            <button type="submit">{"Create"}</button>
        </Form>
    </div>
}

export default Project;