import List from './classes/List';
import Task from './classes/Task';
import Label from './classes/Label';
import Project from './classes/Project';
import Storage from './storage';
import { LAST_UPDATE, ROOT_NAME } from './constants';
import defaultData from '../defaultData.json';
// import { isDueToday, isDueThisWeek, isUpcoming, parse } from '../utils/date';
// import { defaultProjects } from './defaults';

const loadDefaultData = () => {
  const data = [];

  defaultData.projects.forEach((p) => {
    const project = new Project({ name: p.name });

    const lists = p.lists.map((l) => {
      const list = new List({ name: l.name });
      const tasks = l.items.map(
        (task) => new Task({ ...task, project: project.id, list: list.id })
      );
      list.add(tasks);

      return list;
    });

    project.lists.add(lists);

    data.push(project);
  });

  return data;
};

const recoverData = () => {
  const data = [];
  const stored = Storage.filter((key) => key !== LAST_UPDATE);
  const cache = Object.entries(stored).reduce((acc, [key, value]) => {
    const [projectId, type] = key.split('__');

    if (!acc[projectId]) {
      acc[projectId] = {};
    }

    acc[projectId][type] = value;

    return acc;
  }, {});

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

const storeData = function (data) {
  // remove deleted projects
  Storage.keys().forEach((key) => {
    const [projectId] = key.split('__');

    if (!data.has(projectId)) {
      Storage.remove(key);
    }
  });

  // sync new and existing ones
  data.items.forEach((project) => {
    Storage.set(`${project.id}__metadata`, {
      id: project.id,
      name: project.name,
      totalTasks: project.totalTasks,
    });
    Storage.set(`${project.id}__labels`, project.labels.items);
    Storage.set(`${project.id}__lists`, project.lists.items);
  });

  // store the date last synced
  return Date.now();
};

let Root;

export const init = () => {
  const recoveredData = recoverData();
  const initData = recoveredData.length ? recoveredData : loadDefaultData();

  Root = new List({
    name: ROOT_NAME,
    id: ROOT_NAME,
    defaultItems: initData,
  });
  Storage.store(LAST_UPDATE, Root, storeData);
};

export const syncLocalStorage = () => Storage.sync(LAST_UPDATE, Root);

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

export const getProjectDetails = () =>
  Root.items.map((project) => ({
    id: project.id,
    name: project.name,
    link: project.link,
  }));

export const getProject = (projectId) => {
  const project = Root.get(projectId);

  if (!project) throw new Error(`There's no project with the id: ${projectId}`);

  return project;
};

export const addProject = (name) => {
  if (Root.has((project) => project.name === name)) {
    throw new Error(`Project with the name "${name}" already exists`);
  }

  const project = new Project({ name });
  Root.add(project);

  return project;
};

export const deleteProject = (projectId) => Root.delete(projectId);

// =====================================================================================
// Lists
// =====================================================================================
export const getLists = (projectId) => [...getProject(projectId).lists.items];

export const getListDetails = (projectId) =>
  getLists(projectId).map((list) => ({ name: list.name, id: list.id }));

export const getList = (projectId, listId) =>
  Root.get(projectId).getList(listId);

export const addList = (projectId, name) => {
  const { lists } = getProject(projectId);

  if (lists.has((list) => list.name === name)) {
    throw new Error(
      `List with the name "${name}" already exists in this project`
    );
  }

  const list = new List({ name });
  lists.add(list);

  return list;
};

export const deleteList = (projectId, listId) =>
  getProject(projectId).lists.delete(listId);

// =====================================================================================
// Tasks
// =====================================================================================
export const getAllTasks = () =>
  Root.items
    .flatMap((project) => project.lists.items)
    .flatMap((list) => list.items);

export const getTaskFromRoot = (taskId) =>
  getAllTasks().filter((task) => task.id === taskId);

export const getTasksFromProject = (projectId) =>
  getProject(projectId).lists.items.flatMap((list) => list.items);

export const getTasksFromList = (projectId, listId) => [
  ...getList(projectId, listId).items,
];

export const getTask = (projectId, listId, taskId) =>
  getList(projectId, listId).get(taskId);

export const addTask = (projectId, listId, data) => {
  const project = getProject(projectId);
  const task = new Task({
    ...data,
    project: projectId,
    list: listId,
    numId: ++project.totalTasks,
  });
  project.getList(listId).add(task);

  return task;
};

export const deleteTask = (task) =>
  getList(task.project, task.list).delete(task.id);

export const transferTaskToProject = (taskId, listId, from, to) => {
  const task = getList(from, listId).extract(taskId);
  getList(to, 'default').add(task);
};

export const transferTaskToList = (taskId, projectId, from, to) => {
  const task = getList(projectId, from).extract(taskId);
  getList(projectId, to).add(task);
};

// =====================================================================================
// Labels
// =====================================================================================
export const getLabels = (projectId) => [...getProject(projectId).labels.items];

export const getLabel = (projectId, labelId) =>
  getProject(projectId).getLabel(labelId);

export const addLabel = (projectId, name, color) => {
  const { labels } = getProject(projectId);

  if (labels.has((label) => label.name === name)) {
    throw new Error('Label already exists');
  }

  const label = new Label(name, color);
  labels.add(label);

  return label;
};

export const deleteLabel = (projectId, labelId) => {
  getProject(projectId).labels.delete(labelId);
  getTasksFromProject(projectId).forEach((task) => task.removeLabel(labelId));
};

export const editLabel = (projectId, labelId, prop, value) => {
  const { labels } = getProject(projectId);
  const label = labels.get(labelId);
  const labelAlreadyExists = labels.has((item) => item.name === value);

  if (prop === 'name' && labelAlreadyExists) {
    throw new Error(
      `Label with the name "${value}" already exists in this project`
    );
  }

  if (label) label[prop] = value;
  else throw new Error(`Label with the id ${labelId} does not exists`);

  return label;
};