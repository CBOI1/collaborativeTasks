import { Form } from "react-router-dom";
import { useRouteLoaderData } from "react-router-dom";

function Task() {
    const { task } = useRouteLoaderData("get-task");
    return <Form method="POST">
        <div>
            <label htmlFor="title">Title:</label>
            <input type="text" id="title" defaultValue={task.title} name="title"/>
        </div>
        <div>
            <label htmlFor="description">Description</label>
            <textarea name="description" id="description" defaultValue={task.description}></textarea>
        </div>
        <div>
            <label htmlFor="finished">Finished:</label>
            <input type="checkbox" name="finished" id="finished" defaultChecked={task.finished}/>
        </div>
        <button type="submit">Update</button>
    </Form>
}

export default Task;