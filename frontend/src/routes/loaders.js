import { redirect } from "react-router-dom";

const loadUser = async () => {
  const res = await fetch('/api/me', { credentials: 'include'});
  if (!res.ok) {
    return {user: null};
  } 
  const data = await res.json();
  return {user: data.user};
}

const fetchTasks = async () => {
  const res = await fetch('/api/tasks', { credentials: "include"});
  if (!res.ok) {
    return {tasks: null};
  }
  const tasks = await res.json();
  return {tasks};
}

const fetchTask = async ({params}) => {
  const res = await fetch(`/api/tasks/${params.tid}`, {credentials: "include"});
  if (!res.ok) {
    return {task: null};
  }
  const task = await res.json();
  return {task};
}

export {loadUser, fetchTask, fetchTasks};