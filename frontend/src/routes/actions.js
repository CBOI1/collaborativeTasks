import { redirect } from "react-router-dom";
import {toast} from 'react-hot-toast';
import { generateErrorToast } from "../utils.jsx";

const taskFormDataToObj = (fd) => ({
      title: fd.get("title"),
      description: fd.get("description"),
      finished: fd.get("finished") ? true : false
  });

function createAction(method, createUrl, redirectUrl = () => undefined, makeBody = () => undefined) {
  return async ({request, params}) => {
    const formData = await request.formData();
    const res = await fetch(createUrl(params), {
      credentials: "include",
      method: method,
      headers: {
        "Content-Type" : "application/json"
      },
      body : JSON.stringify(makeBody(formData))
    })
    if (!res.ok) {
      const data = await res.json();
      generateErrorToast(data.errors);
      return;
    }
    const redirUrl = redirectUrl(params);
    if (redirUrl) {
      return redirect(redirectUrl(params));
    }
    
  }
}
const createTask = createAction(
  "POST", 
  params => `/api/projects/${params.pid}/tasks/`,
  params => `/dashboard/${params.pid}`,
  taskFormDataToObj
)

const updateTask = createAction(
  "PATCH",
  params => `/api/projects/${params.pid}/tasks/${params.tid}`,
  params => `/dashboard/${params.pid}`,
  taskFormDataToObj
);

const createProject = createAction(
  "POST",
  params => "/api/projects/",
  params => "/dashboard",
  fd => ({title : fd.get("title")})
)

const updateProject = createAction(
  "PATCH",
  params => `/api/projects/${params.pid}`,
  params => `dashboard/${params.pid}`,
  fd => ({title : fd.get("title")})
);

const deleteProject = createAction(
  "DELETE",
  params => `/api/projects/${params.pid}`
)

export {updateTask, createTask, createProject, updateProject, deleteProject};