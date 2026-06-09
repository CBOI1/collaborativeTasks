
const fetchResource = (urlConstructor, resourceName) => {
   return async ({params}) => {
    const resultObj = {}
    const res = await fetch(urlConstructor(params), {credentials: "include"});
    if (!res.ok) {
      resultObj[resourceName] = null;
    } else {
      resultObj[resourceName] = await res.json();
    }
    return resultObj;
 }
}


const loadUser = fetchResource((params) => '/api/me', 'user');
const fetchTask = fetchResource((params) => `/api/projects/${params.pid}/tasks/${params.tid}`, 'task');
const fetchProject = fetchResource((params) => `/api/projects/${params.pid}`, 'project');


const fetchTasks = async ({params}) => {
 if (params.pid === undefined) {
   return {tasks : null};
 }
 const getTasks = fetchResource((params) => `/api/projects/${params.pid}/tasks`, 'tasks');
 const resultObj = await getTasks({params});
 return {pid : params.pid, ...resultObj};
}






export {
 loadUser,
 fetchTask,
 fetchProject,
 fetchTasks
};



/*
const loadUser = async () => {
  const res = await fetch('/api/me', { credentials: 'include'});
  if (!res.ok) {
    return {user: null};
  } 
  const data = await res.json();
  return {user: data.user};
}

const fetchTasks = async ({params}) => {
  if (params.pid === undefined) {
    return {pid: undefined, tasks : null};
  }
  const res = await fetch(`/api/projects/${params.pid}/tasks`, { credentials: "include"});
  if (!res.ok) {
    return {tasks: null};
  }
  const tasks = await res.json();
  return {pid : params.pid, tasks};
}

const fetchTask = async ({params}) => {
  const res = await fetch(`/api/projects/${params.pid}/tasks/${params.tid}`, {credentials: "include"});
  if (!res.ok) {
    return {task: null};
  }
  const task = await res.json();
  return {task};
}

const fetchProject = async({params}) => {
  console.log("hello");
}

export {loadUser, fetchTask, fetchTasks, fetchProject};
*/