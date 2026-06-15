import styles from "./style.module.css"
import { Form } from "react-router-dom";
import { useRouteLoaderData } from "react-router-dom";
function Project() {
    const data = useRouteLoaderData("project-info");
    return <div className="grow flex flex-col">
        <Form method="POST" className="grow flex flex-col justify-center min-w-1/2 gap-4">
            <div className={styles.inputContainer}>
                <label htmlFor="title">Title:</label>
                <input type="text" id="title"  name="title" className={styles.inputStyle} defaultValue={data ? data.project.title : ""}/>
                { /*<span>{`characters ${titleCharCount}/${TITLE_CHAR_LIMIT}`}</span> */ }
            </div>
            <button type="submit">{"Create"}</button>
        </Form>
    </div>
}

export default Project;