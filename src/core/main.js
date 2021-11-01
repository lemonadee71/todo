import Task from './classes/Task';
import TaskList from './classes/TaskList';
import OrderedIdList from './classes/OrderedIdList';
import Label from './classes/Label';
import Project from './classes/Project';
import { LocalStorage } from './storage';
import { LAST_UPDATE } from './constants';
import defaultData from '../defaultData.json';
// import { isDueToday, isDueThisWeek, isUpcoming, parse } from '../utils/date';
// import { defaultProjects } from './defaults';

const loadDefaultData = () => {
  const data = [];

  defaultData.projects.forEach((p, i) => {
    const project = new Project({ name: p.name, position: i });

    const lists = p.lists.map((l) => {
      const list = new TaskList({ name: l.name, project: project.id });
      const tasks = l.items.map(
        (task) =>
          new Task({
            ...task,
            project: project.id,
            list: list.id,
            numId: ++project.totalTasks,
          })
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
  const stored = LocalStorage.filter((key) => key !== LAST_UPDATE);
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
    const projectLabels = project.labels.map((label) => new Label(label));

    const projectLists = project.lists.map((list) => {
      const tasks = list._items.map((task) => {
        let { labels, subtasks } = task;

        labels = labels._items.map((taskLabel) =>
          projectLabels.find((label) => label.id === taskLabel.id)
        );
        subtasks = subtasks._items.map((subtask) => {
          const subtaskLabels = subtask.labels._items.map((subtaskLabel) =>
            projectLabels.find((label) => label.id === subtaskLabel.id)
          );

          return new Task({ ...subtask, labels: subtaskLabels, subtasks: [] });
        });

        return new Task({
          ...task,
          labels,
          subtasks,
        });
      });

      return new TaskList({ ...list, defaultItems: tasks });
    });

    data.push(
      new Project({
        ...project.metadata,
        labels: projectLabels,
        lists: projectLists,
      })
    );
  });

  data.sort((a, b) => a.position - b.position);

  return data;
};

const storeData = function (data) {
  // remove deleted projects
  LocalStorage.keys.forEach((key) => {
    const [projectId] = key.split('__');

    if (!data.has(projectId)) {
      LocalStorage.remove(key);
    }
  });

  // sync new and existing ones
  data.items.forEach((project) => {
    LocalStorage.set(`${project.id}__metadata`, {
      id: project.id,
      name: project.name,
      totalTasks: project.totalTasks,
      position: project.position,
    });
    LocalStorage.set(`${project.id}__labels`, project.labels.items);
    LocalStorage.set(`${project.id}__lists`, project.lists.items);
  });

  // store the date last synced
  return Date.now();
};

let Root;

export const init = () => {
  const recoveredData = recoverData();
  const initData = recoveredData.length ? recoveredData : loadDefaultData();

  Root = new OrderedIdList(initData);
  LocalStorage.store(LAST_UPDATE, Root, storeData);
};

export const syncLocalStorage = () => LocalStorage.sync(LAST_UPDATE, Root);

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

  if (!name.trim()) throw new Error('Project must have a name');

  const project = new Project({ name });
  Root.add(project);

  return project;
};

export const updateProjectName = (projectId, name) => {
  if (Root.has((proj) => proj.name === name && proj.id !== projectId)) {
    throw new Error(`Project with the name "${name}" already exists`);
  }

  if (!name.trim()) throw new Error('Project must have a name');

  const project = getProject(projectId);
  project.name = name;

  return project;
};

export const moveProject = (projectId, pos) => Root.move(projectId, pos);

export const deleteProject = (projectId) => Root.delete(projectId);

// =====================================================================================
// Lists
// =====================================================================================
export const getLists = (projectId) => getProject(projectId).lists.items;

export const getListDetails = (projectId) =>
  getLists(projectId).map((list) => ({ name: list.name, id: list.id }));

export const getList = (projectId, listId) =>
  Root.get(projectId).getList(listId);

export const addList = (projectId, name) => {
  const project = getProject(projectId);

  if (project.lists.has((list) => list.name === name)) {
    throw new Error(
      `List with the name "${name}" already exists in this project`
    );
  }

  if (!name.trim()) throw new Error('List must have a name');

  const list = new TaskList({ name });
  project.addList(list);

  return list;
};

export const updateListName = (projectId, listId, name) => {
  const { lists } = getProject(projectId);

  if (lists.has((list) => list.name === name)) {
    throw new Error(
      `List with the name "${name}" already exists in this project`
    );
  }

  const list = lists.get(listId);
  list.name = name;

  return list;
};

export const moveList = (projectId, listId, pos) =>
  getProject(projectId).lists.move(listId, pos);

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
  getAllTasks().find((task) => task.id === taskId);

export const getTasksFromProject = (projectId) =>
  getLists(projectId).flatMap((list) => list.items);

export const getTasks = (projectId, listId) => getList(projectId, listId).items;

export const getTask = (projectId, listId, taskId) =>
  getList(projectId, listId).get(taskId);

export const addTask = (projectId, listId, data) => {
  const project = getProject(projectId);
  const task = new Task({
    ...data,
    numId: ++project.totalTasks,
  });
  project.getList(listId).add(task);

  return task;
};

export const updateTask = (projectId, listId, taskId, data) => {
  const task = getTask(projectId, listId, taskId);

  Object.entries(data).forEach(([prop, value]) => {
    if (prop === 'title' && !value) throw new Error('Task must have a title');

    task[prop] = value;
  });

  return task.data;
};

export const moveTask = (projectId, listId, taskId, pos) =>
  getList(projectId, listId).move(taskId, pos);

export const deleteTask = (projectId, listId, taskId) =>
  getList(projectId, listId).delete(taskId);

export const transferTaskToProject = (project, listId, taskId, position) => {
  const task = getList(project.from, listId).extract(taskId);
  getList(project.to, 'default').insert(task, position);
};

export const transferTaskToList = (projectId, list, taskId, position) => {
  const task = getList(projectId, list.from).extract(taskId);
  getList(projectId, list.to).insert(task, position);
};

export const convertTaskToSubtask = (projectId, list, task, position) => {
  const item = getList(projectId, list.from).extract(task.from);
  getTask(projectId, list.to, task.to).insertSubtask(item, position);

  return item;
};

// =====================================================================================
// Subtasks
// =====================================================================================

export const getSubtask = (projectId, listId, taskId, subtaskId) =>
  getTask(projectId, listId, taskId).getSubtask(subtaskId);

export const addSubtask = (projectId, listId, taskId, data) => {
  const project = getProject(projectId);
  const task = getTask(projectId, listId, taskId);
  const subtask = new Task({
    ...data,
    numId: ++project.totalTasks,
  });
  task.addSubtask(subtask);

  return subtask;
};

export const deleteSubtask = (projectId, listId, taskId, subtaskId) =>
  getTask(projectId, listId, taskId).deleteSubtask(subtaskId);

export const updateSubtask = (projectId, listId, taskId, subtaskId, data) => {
  const subtask = getTask(projectId, listId, taskId).getSubtask(subtaskId);

  Object.entries(data).forEach(([prop, value]) => {
    if (prop === 'title' && !value) throw new Error('Task must have a title');

    subtask[prop] = value;
  });

  return subtask.data;
};

export const moveSubtask = (projectId, listId, taskId, subtaskId, position) =>
  getTask(projectId, listId, taskId).moveSubtask(subtaskId, position);

export const convertSubtaskToTask = (
  projectId,
  list,
  taskId,
  subtaskId,
  position
) => {
  const subtask = getTask(projectId, list.from, taskId).extractSubtask(
    subtaskId
  );
  getList(projectId, list.to).insert(subtask, position);

  return subtask;
};

export const transferSubtask = (projectId, list, task, subtaskId, position) => {
  const subtask = getTask(projectId, list.from, task.from).extractSubtask(
    subtaskId
  );
  getTask(projectId, list.to, task.to).insertSubtask(subtask, position);

  return subtask;
};

// =====================================================================================
// Labels
// =====================================================================================
export const getLabels = (projectId) => getProject(projectId).labels.items;

export const getLabel = (projectId, labelId) =>
  getProject(projectId).getLabel(labelId);

export const addLabel = (projectId, name, color) => {
  const project = getProject(projectId);

  if (!name.trim()) {
    throw new Error('Label must have a name');
  }

  if (project.labels.has((label) => label.name === name)) {
    throw new Error('Label already exists');
  }

  const label = new Label({ name, color });
  project.addLabel(label);

  return label;
};

export const deleteLabel = (projectId, labelId) => {
  getProject(projectId).labels.delete(labelId);
  getTasksFromProject(projectId).forEach((task) => task.removeLabel(labelId));
};

export const editLabel = (projectId, labelId, prop, value) => {
  const { labels } = getProject(projectId);
  const label = labels.get(labelId);
  const labelAlreadyExists = labels.has(
    (item) => item.name === value && item.id !== labelId
  );

  if (prop === 'name' && !value.trim()) {
    throw new Error('Label must have a name');
  }

  if (prop === 'name' && labelAlreadyExists) {
    throw new Error(
      `Label with the name "${value}" already exists in this project`
    );
  }

  if (label) label[prop] = value;
  else throw new Error(`Label with the id ${labelId} does not exists`);

  return label;
};
