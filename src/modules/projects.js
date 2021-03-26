import List from '../classes/List';
import Task from '../classes/Task';
import { isDueToday, isDueThisWeek, isUpcoming, parse } from '../helpers/date';
import { defaultProjects } from './defaults';
import Storage from './storage';

const Root = new List({ name: 'root', id: 'root' });

/*
 *  Initialize
 */
const storedData = Storage.recover('data');

if (storedData) {
  Root.add(
    storedData._items.map(
      (list) =>
        new List({
          id: list.id,
          name: list.name,
          defaultItems: list._items.map(
            (task) =>
              new Task({
                id: task.id,
                title: task.title,
                notes: task.notes,
                dueDate: task.dueDate,
                location: task.location,
                completed: task.completed,
                labels: task.labels._items,
              })
          ),
        })
    )
  );
} else {
  Root.add(new List({ name: 'Uncategorized', id: 'uncategorized' }));
  Root.add(defaultProjects);
}

Storage.store('data', Root);

const getProject = (condition) => {
  const project = Root.get(condition);

  if (!project) throw new Error('No project that matches the condition.');

  return project;
};

const getAllProjects = () => Root.items;

const getProjectsDetails = () => {
  const projects = Root.filter((proj) => proj.id !== 'uncategorized');

  return projects.length
    ? projects.map((proj) => ({
        id: proj.id,
        name: proj.name,
      }))
    : [];
};

const getAllTasks = () => Root.items.map((proj) => proj.items).flat();

const getProjectTasks = (id) => getProject((proj) => proj.id === id).items;

const getDueToday = () =>
  getAllTasks().filter((task) => isDueToday(parse(task.dueDate)));

const getDueThisWeek = () =>
  getAllTasks().filter((task) => isDueThisWeek(parse(task.dueDate)));

const getUpcoming = () =>
  getAllTasks().filter((task) => isUpcoming(parse(task.dueDate)));

const addProject = (name) => {
  if (Root.has((proj) => proj.name === name)) {
    throw new Error('Project with the same name already exists');
  }

  const newProject = new List({ name });
  Root.add(newProject);

  return newProject;
};

const deleteProject = (id) => {
  Root.delete((proj) => proj.id === id);
};

const getTask = (location, id) =>
  getProject((proj) => proj.id === location).get((item) => item.id === id);

const addTask = (task) => {
  getProject((proj) => proj.id === task.location).add(task);
};

const deleteTask = (task) => {
  getProject((proj) => proj.id === task.location).delete(
    (item) => item.id === task.id
  );
};

const transferTask = (id, prevList, newList) => {
  const task = getProject((proj) => proj.id === prevList).extract(
    (item) => item.id === id
  );

  getProject((proj) => proj.id === newList).add(task);
};

export {
  addProject,
  deleteProject,
  getProject,
  getAllTasks,
  getProjectTasks,
  getProjectsDetails,
  getAllProjects,
  getDueToday,
  getDueThisWeek,
  getUpcoming,
  getTask,
  addTask,
  transferTask,
  deleteTask,
};
