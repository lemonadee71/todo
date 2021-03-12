import List from '../classes/List';
import Task from '../classes/Task';
import { isDueToday, isDueThisWeek, isUpcoming, parse } from '../helpers/date';
import { defaultProjects } from './defaults';
import { getLabel } from './labels';
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
                completed: task.completed,
                location: task.location,
                labels: task.labels._items.filter((label) =>
                  getLabel(label.id)
                ),
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

/*
 * Functions
 */

const syncData = () => Storage.sync('data');

const getProject = (condition) => {
  const project = Root.get(condition);

  if (!project) throw new Error('No matches');

  return project;
};

const getAllProjects = () => Root.items;

const getProjectsDetails = () => {
  const projects = Root.filter((proj) => proj.id !== 'uncategorized');

  return projects.length
    ? projects.map((proj) => {
        return {
          id: proj.id,
          name: proj.name,
        };
      })
    : [];
};

const getAllTasks = () => {
  return Root.items.map((proj) => proj.items).flat();
};

const getProjectTasks = (id) => {
  return getProject((proj) => proj.id === id).items;
};

const getDueToday = () => {
  return getAllTasks().filter((task) => isDueToday(parse(task.dueDate)));
};

const getDueThisWeek = () => {
  return getAllTasks().filter((task) => isDueThisWeek(parse(task.dueDate)));
};

const getUpcoming = () => {
  return getAllTasks().filter((task) => isUpcoming(parse(task.dueDate)));
};

const addProject = (name) => {
  if (Root.has((proj) => proj.name === name)) {
    throw new Error('Project with the same name already exists');
  }

  const newProject = new List({ name });
  Root.add(newProject);

  syncData();
  return newProject;
};

const deleteProject = (id) => {
  Root.delete((proj) => proj.id === id);
  syncData();
};

const addTask = (task) => {
  getProject((proj) => proj.id === task.location).add(task);
  syncData();
};

const deleteTask = (task) => {
  getProject((proj) => proj.id === task.location).delete(
    (item) => item.id === task.id
  );
  syncData();
};

const transferTask = (id, prevList, newList) => {
  const task = getProject((proj) => proj.id === prevList).extract(
    (task) => task.id === id
  );

  getProject((proj) => proj.id === newList).add(task);
  syncData();
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
  addTask,
  transferTask,
  deleteTask,
};
