import { differenceInWeeks, isWithinInterval } from 'date-fns';
import Task from './classes/Task';
import Subtask from './classes/Subtask';
import TaskList from './classes/TaskList';
import IdList from './classes/IdList';
import Label from './classes/Label';
import Project from './classes/Project';
import { LocalStorage } from './storage';
import { LAST_OPENED_PAGE, LAST_UPDATE } from '../constants';
import defaultData from '../defaultData.json';
import { filterById } from '../utils/misc';
import { isDueThisWeek, parse } from '../utils/date';

export const loadDefaultData = () => {
  const data = [];

  defaultData.projects.forEach((p, i) => {
    const project = new Project({ name: p.name, position: i });

    const lists = p.lists.map((l) => {
      const list = new TaskList({ name: l.name, project: project.id });
      const tasks = l.items.map((task) => new Task(task));
      list.add(tasks);

      return list;
    });

    project.lists.add(lists);

    data.push(project);
  });

  return data;
};

const recoverDataFromLocal = () => {
  const data = [];
  const stored = LocalStorage.filter(
    (key) => ![LAST_UPDATE, LAST_OPENED_PAGE, 'theme'].includes(key)
  );
  const cache = Object.entries(stored).reduce((acc, [key, value]) => {
    const [projectId, type] = key.split('__');

    if (!acc[projectId]) {
      acc[projectId] = {};
    }

    acc[projectId][type] = value;

    return acc;
  }, {});

  // reinitialize data
  Object.values(cache)
    .sort((a, b) => a.metadata.position - b.metadata.position)
    .forEach((project) => {
      const projectLabels = project.labels.map((label) => new Label(label));

      const projectLists = project.lists.map((list) => {
        const tasks = list._items.map((task) => {
          let { labels, subtasks } = task;

          labels = filterById(
            projectLabels,
            labels._items.map((label) => label.id)
          );

          subtasks = subtasks._items.map((subtask) => {
            const subtaskLabels = filterById(
              projectLabels,
              subtask.labels._items.map((label) => label.id)
            );

            return new Subtask({ ...subtask, labels: subtaskLabels });
          });

          return new Task({ ...task, labels, subtasks });
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

  return data;
};

const storeDataToLocal = function (data) {
  // remove deleted projects
  LocalStorage.keys.forEach((key) => {
    const [projectId] = key.split('__');

    if (
      !data.has(projectId) &&
      ![LAST_UPDATE, LAST_OPENED_PAGE, 'theme'].includes(key)
    ) {
      LocalStorage.remove(key);
    }
  });

  // sync new and existing ones
  data.items.forEach((project, i) => {
    LocalStorage.set(`${project.id}__metadata`, {
      id: project.id,
      name: project.name,
      position: i,
    });
    LocalStorage.set(`${project.id}__labels`, project.labels.items);
    LocalStorage.set(`${project.id}__lists`, project.lists.items);
  });

  // store the date last synced
  return Date.now();
};

let Root = new IdList();

export const init = (data) => {
  Root = new IdList(data);
  LocalStorage.store(LAST_UPDATE, Root, storeDataToLocal);
};

export const getLocalData = () => {
  const recoveredData = recoverDataFromLocal();
  const data = recoveredData.length ? recoveredData : loadDefaultData();

  return data;
};

export const initLocal = () => init(getLocalData());

export const syncLocalStorage = () => LocalStorage.sync(LAST_UPDATE, Root);

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
  if (!name.trim()) throw new Error('Project must have a name');

  const project = new Project({ name });
  Root.add(project);

  return project;
};

export const updateProjectName = (projectId, name) => {
  if (!name.trim()) throw new Error('Project must have a name');

  const project = getProject(projectId);
  project.name = name;

  return project;
};

export const moveProject = (projectId, position) =>
  Root.move(projectId, position);

export const insertProject = (project, position) =>
  Root.insert(project, position);

export const deleteProject = (projectId) => Root.extract(projectId);

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

export const moveList = (projectId, listId, position) =>
  getProject(projectId).lists.move(listId, position);

export const insertList = (projectId, list, position) =>
  getProject(projectId).lists.insert(list, position);

export const deleteList = (projectId, listId) =>
  getProject(projectId).lists.extract(listId);

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

export const getTasksByInterval = (interval) =>
  getAllTasks().filter((task) =>
    isWithinInterval(parse(task.dueDate), interval)
  );

export const getTasksDueThisWeek = () =>
  getAllTasks().filter((task) => isDueThisWeek(parse(task.dueDate)));

// tasks are considered stale if there are no updates in 2 weeks
export const getStaleTasks = () =>
  getAllTasks().filter(
    (task) => differenceInWeeks(new Date(), task.lastUpdate) >= 2
  );

export const getTasks = (projectId, listId) => getList(projectId, listId).items;

export const getTask = (projectId, listId, taskId) =>
  getList(projectId, listId).get(taskId);

export const addTask = (projectId, listId, data) => {
  const project = getProject(projectId);
  const task = new Task(data);
  project.getList(listId).add(task);

  return task;
};

export const updateTask = (projectId, listId, taskId, data) => {
  const task = getTask(projectId, listId, taskId);
  // since only one prop can be updated at a time
  const [prop, value] = Object.entries(data).flat();

  if (prop === 'title' && !value) throw new Error('Task must have a title');

  task.update(prop, value);

  return task;
};

export const moveTask = (projectId, listId, taskId, position) =>
  getList(projectId, listId).move(taskId, position);

export const insertTask = (projectId, listId, task, position) => {
  getList(projectId, listId).insert(task, position);
  return task;
};

export const deleteTask = (projectId, listId, taskId) =>
  getList(projectId, listId).extract(taskId);

export const transferTaskToProject = (project, list, taskId, position) =>
  insertTask(
    project.to,
    list.to,
    deleteTask(project.from, list.from, taskId),
    position
  );

export const transferTaskToList = (projectId, list, taskId, position) =>
  insertTask(
    projectId,
    list.to,
    deleteTask(projectId, list.from, taskId),
    position
  );

export const convertTaskToSubtask = (projectId, list, task, position) => {
  const item = deleteTask(projectId, list.from, task.from);
  return insertSubtask(
    projectId,
    list.to,
    task.to,
    new Subtask(item.data),
    position
  );
};

// =====================================================================================
// Subtasks
// =====================================================================================

export const getSubtask = (projectId, listId, taskId, subtaskId) =>
  getTask(projectId, listId, taskId).getSubtask(subtaskId);

export const addSubtask = (projectId, listId, taskId, data) => {
  const task = getTask(projectId, listId, taskId);
  const subtask = new Subtask(data);
  task.addSubtask(subtask);

  return subtask;
};

export const insertSubtask = (projectId, listId, taskId, subtask, position) => {
  getTask(projectId, listId, taskId).insertSubtask(subtask, position);
  return subtask;
};

export const deleteSubtask = (projectId, listId, taskId, subtaskId) =>
  getTask(projectId, listId, taskId).extractSubtask(subtaskId);

export const updateSubtask = (projectId, listId, taskId, subtaskId, data) => {
  const subtask = getTask(projectId, listId, taskId).getSubtask(subtaskId);
  const [prop, value] = Object.entries(data).flat();

  if (prop === 'title' && !value) throw new Error('Subtask must have a title');

  subtask.update(prop, value);

  return subtask;
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
  const subtask = deleteSubtask(projectId, list.from, taskId, subtaskId);
  return insertTask(projectId, list.to, new Task(subtask.data), position);
};

export const transferSubtask = (projectId, list, task, subtaskId, position) => {
  const subtask = deleteSubtask(projectId, list.from, task.from, subtaskId);
  return insertSubtask(projectId, list.to, task.to, subtask, position);
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
  getTasksFromProject(projectId).forEach((task) => task.removeLabel(labelId));
  return getProject(projectId).labels.extract(labelId);
};

export const editLabel = (projectId, labelId, data) => {
  const { labels } = getProject(projectId);
  const label = labels.get(labelId);

  if (!data.name.trim()) {
    throw new Error('Label must have a name');
  }

  if (label) Object.assign(label, data);
  else throw new Error(`Label with the id ${labelId} does not exists`);

  return label;
};
