
const fetchResource = (urlConstructor, resourceName) => {
   return async ({params, request}) => {
    const resultObj = {}
    const res = await fetch(urlConstructor(params, request), {credentials: "include"});
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
const fetchProjects = fetchResource((params) => `/api/projects`, 'projects');
const searchUsers = fetchResource((params, request) => {
  const url = new URL(request.url);
  return `/api/search?email=${url.searchParams.get('email')}`
}, 'users');

const fetchTasks = async ({params}) => {
 if (params.pid === undefined) {
   return {tasks : null};
 }
 const getTasks = fetchResource((params) => `/api/projects/${params.pid}/tasks`, 'tasks');
 const resultObj = await getTasks({params});
 return {pid : params.pid, ...resultObj};
}

export default { 
  loadUser, 
  fetchTask, 
  fetchTasks, 
  fetchProject, 
  fetchProjects, 
  searchUsers 
};