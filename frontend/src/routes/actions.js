import { redirect } from "react-router-dom";
import {toast} from 'react-hot-toast';
import { generateErrorToast } from "../utils.jsx";
const createTask = async ({request, params}) => {
    const pid = params.pid;
    const formData = await request.formData();
    const title = formData.get("title");
    const description = formData.get("description");
    const finished = formData.get("finished");
    const res = await fetch(`/api/projects/${pid}/tasks/`, {
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
      const data = await res.json();
      generateErrorToast(data.errors);
      return;
    }
    return redirect("/dashboard");
}
const updateTask = async ({request, params}) => {
    const formData = await request.formData();
    const tid = params.tid;
    const pid = params.pid;
    const title = formData.get("title");
    const description = formData.get("description");
    const finished = formData.get("finished");
    const res = await fetch(`/api/projects/${pid}/tasks/${tid}/`, {
      credentials: "include",
      method: "PATCH",
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
      const data = await res.json();
      generateErrorToast(data.errors);
      return;
    }
    return redirect("/dashboard");
}

export {updateTask, createTask};