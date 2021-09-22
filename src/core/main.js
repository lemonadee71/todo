import List from './classes/List';
import Task from './classes/Task';
import Label from './classes/Label';
import Project from './classes/Project';
import Storage from './storage';
// import { isDueToday, isDueThisWeek, isUpcoming, parse } from '../utils/date';
// import { defaultProjects } from './defaults';

const NAME = 'root';
const DEFAULT = {
  id: 'default',
  name: 'default',
};

const recoverData = function () {
  const data = [];
  const cache = {};

  // recover and sort all data from localStorage
  for (let i = 0; i < this.length; i++) {
    const key = this.key(i);

    if (key.startsWith(`${NAME}__`)) {
      const [_, projectID, type] = key.split('__'); // eslint-disable-line no-unused-vars
      const item = Storage.getItem(key);

      if (!cache[projectID]) {
        cache[projectID] = { lists: [] };
      }

      if (type === 'lists') {
        cache[projectID].lists.push(item);
      } else {
        cache[projectID][type] = item;
      }
    }
  }

  // reinitialize data
  Object.values(cache).forEach((project) => {
    const projectLabels = project.labels.map((label) => {
      const { name, color, id } = label;
      return new Label(name, color, id);
    });

    const projectLists = project.lists.map((list) => {
      const tasks = list.items.map((task) => {
        let { labels, subtasks } = task;

        labels = labels.items.map((taskLabel) =>
          projectLabels.find((label) => label.id === taskLabel.id)
        );
        subtasks = subtasks.items.map((subtask) => new Task(subtask));

        return new Task({
          ...task,
          labels,
          subtasks,
        });
      });

      return new List({ ...list, defaultItems: tasks });
    });

    data.push(
      new Project({
        ...project.metadata,
        labels: projectLabels,
        lists: projectLists,
      })
    );
  });

  return data;
};

const storeData = function (root) {
  // remove deleted projects
  for (let i = 0; i < this.length; i++) {
    const key = this.key(i);
    const [_, projectID, type, listID] = key.split('__'); // eslint-disable-line no-unused-vars

    if (key.startsWith(`${NAME}__`)) {
      const project = root.get(projectID);
      // delete from localStorage if project is deleted
      // or list is deleted
      if (!root.has(projectID) || (type === 'lists' && !project.has(listID))) {
        Storage.deleteItem(key);
      }
    }
  }

  // sync new and existing ones
  root.items.forEach((project) => {
    Storage.setItem(`${NAME}__${project.id}__metadata`, {
      id: project.id,
      name: project.name,
      totalTasks: project.totalTasks,
    });
    Storage.setItem(`${NAME}__${project.id}__labels`, project.labels.items);

    project.lists.items.map((list) =>
      Storage.setItem(`${NAME}__${project.id}__lists__${list.id}`, list)
    );
  });
};

const recoveredData = Storage.recover(NAME, recoverData);
const initData = recoveredData.length ? recoveredData : new List(DEFAULT);

const Root = new List({ name: NAME, id: NAME, defaultItems: initData });
Storage.store(NAME, Root, storeData);

export const syncLocalStorage = () => Storage.sync(NAME, Root);

// const getDueThisWeek = () =>
//   getAllTasks().filter((task) => isDueThisWeek(parse(task.dueDate)));

// const getUpcoming = () =>
//   getAllTasks().filter((task) => isUpcoming(parse(task.dueDate)));

// const getDueToday = () =>
//   getAllTasks().filter((task) => isDueToday(parse(task.dueDate)));

// =====================================================================================
// Projects
// =====================================================================================
export const getAllProjects = () => [...Root.items];

export const getProjectDetails = () => {
  const projects = Root.filter((project) => project.id !== 'uncategorized');

  return projects.map((project) => ({
    id: project.id,
    name: project.name,
  }));
};

export const getProject = (projectFilter) => {
  const project = Root.get(projectFilter);

  if (!project) throw new Error('No project that matches the condition.');

  return project;
};

export const addProject = (name) => {
  if (Root.has((project) => project.name === name)) {
    throw new Error('Project with the same name already exists');
  }

  const newProject = new Project({ name });
  Root.add(newProject);

  return newProject;
};

export const deleteProject = (id) => Root.delete(id);

// =====================================================================================
// Lists
// =====================================================================================
export const getLists = (projectFilter) => [
  ...Root.get(projectFilter).lists.items,
];

export const getListDetails = (projectFilter) =>
  getLists(projectFilter).map((list) => ({ name: list.name, id: list.id }));

export const getList = (projectFilter, listFilter) =>
  Root.get(projectFilter).lists.get(listFilter);

export const addList = (projectFilter, name) => {
  const { lists } = getProject(projectFilter);

  if (lists.has((list) => list.name === name)) {
    throw new Error('List with the same name already exists');
  }

  const list = new List({ name });
  lists.add(list);

  return list;
};

export const deleteList = (projectFilter, listFilter) =>
  getProject(projectFilter).lists.delete(listFilter);

// =====================================================================================
// Tasks
// =====================================================================================
export const getAllTasks = () =>
  Root.items
    .flatMap((project) => project.lists.items)
    .flatMap((list) => list.items);

export const getTaskFromRoot = (taskID) =>
  getAllTasks().filter((task) => task.id === taskID);

export const getTasksFromProject = (projectFilter) =>
  getProject(projectFilter).lists.items.flatMap((list) => list.items);

export const getTasksFromList = (projectFilter, listFilter) => [
  ...getList(projectFilter, listFilter).items,
];

export const getTask = (projectID, listID, taskID) =>
  getList(projectID, listID).get(taskID);

export const addTask = (data) => {
  const project = getProject(data.project);
  const task = new Task({ ...data, numId: ++project.totalTasks });
  project.lists.get(data.list).add(task);

  return task;
};

export const deleteTask = (task) =>
  getList(task.project, task.list).delete(task.id);

export const transferTaskToProject = (
  taskID,
  listID,
  prevProject,
  newProject
) => {
  const task = getList(prevProject, listID).extract(taskID);
  getList(newProject, 'default').add(task);
};

export const transferTaskToList = (taskID, projectID, prevList, newList) => {
  const task = getList(projectID, prevList).extract(taskID);
  getList(projectID, newList).add(task);
};

// =====================================================================================
// Labels
// =====================================================================================
export const getLabels = (projectFilter) => [
  ...getProject(projectFilter).labels.items,
];

export const getLabel = (projectFilter, labelFilter) =>
  getProject(projectFilter).labels.get(labelFilter);

export const addLabel = (projectFilter, name, color) => {
  const { labels } = getProject(projectFilter);

  if (labels.has((label) => label.name === name)) {
    throw new Error('Label already exists');
  }

  const label = new Label(name, color);
  labels.add(label);

  return label;
};

export const deleteLabel = (projectFilter, labelID) => {
  getProject(projectFilter).labels.delete(labelID);
  getTasksFromProject(projectFilter).forEach((task) =>
    task.removeLabel(labelID)
  );
};

export const editLabel = (projectFilter, labelID, prop, value) => {
  const { labels } = getProject(projectFilter);
  const label = labels.get(labelID);
  const labelAlreadyExists = labels.has((item) => item.name === value);

  if (prop === 'name' && labelAlreadyExists) {
    throw new Error('Label already exists');
  }

  if (label) label[prop] = value;

  // may not be necessary
  // getTasksFromProject(projectFilter).forEach((task) => {
  //   const taskLabel = task.labels.get(labelID);

  //   if (taskLabel) taskLabel[prop] = value;
  // });
  return label;
};
