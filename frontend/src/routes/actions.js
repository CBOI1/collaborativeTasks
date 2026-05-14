import { redirect } from "react-router-dom";

const createTask = async ({request}) => {
    const formData = await request.formData();
    const title = formData.get("title");
    const description = formData.get("description");
    const finished = formData.get("finished");
    const res = await fetch('/api/tasks/create', {
      credentials: "include",
      method: "POST",
      headers: {
        "Content-Type" : "application/json"
      },
      body : JSON.stringify({
        title,
        description,
        finished: (finished ? true : false)
      })
    });
    if (!res.ok) {
      throw Error("Creation failed");
    }
    return redirect("/dashboard");
}
const updateTask = async ({request, params}) => {
    const formData = await request.formData();
    const tid = params.tid;
    const title = formData.get("title");
    const description = formData.get("description");
    const finished = formData.get("finished");
    const res = await fetch(`/api/tasks/${tid}/update`, {
      credentials: "include",
      method: "POST",
      headers: {
        "Content-Type" : "application/json"
      },
      body : JSON.stringify({
        title,
        description,
        finished: (finished ? true : false)
      })
    });
    if (!res.ok) {
      throw Error("Update failed");
    }
    return redirect("/dashboard");
}

export {updateTask, createTask};