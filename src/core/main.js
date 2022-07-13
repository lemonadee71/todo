import { differenceInWeeks, isThisWeek, isWithinInterval } from 'date-fns';
import { LocalStorage } from './storage';
import IdList from './classes/IdList';
import Label from './classes/Label';
import Project from './classes/Project';
import Subtask from './classes/Subtask';
import Task from './classes/Task';
import TaskList from './classes/TaskList';
import defaultData from '../defaultData.json';
import { parseDate } from '../utils/date';
import { intersectAndSortById } from '../utils/misc';
import { LAST_UPDATE } from '../constants';

const Root = new IdList();

const recoverDataFromLocal = () => {
  if (!LocalStorage.get(LAST_UPDATE)) return null;

  const labels = Object.values(LocalStorage.get('labels')).map(
    (data) => new Label(data)
  );
  const projects = Object.values(LocalStorage.get('projects'));
  const lists = Object.values(LocalStorage.get('lists'));
  const tasks = Object.values(LocalStorage.get('tasks'));
  const subtasks = Object.values(LocalStorage.get('subtasks'));

  return projects
    .sort((a, b) => a.position - b.position)
    .map((project) => ({
      ...project,
      labels: intersectAndSortById(labels, project.labels),
      lists: intersectAndSortById(lists, project.lists)
        .map((list) => ({
          ...list,
          tasks: intersectAndSortById(tasks, list.tasks)
            .map((task) => ({
              ...task,
              labels: intersectAndSortById(labels, task.labels),
              subtasks: intersectAndSortById(subtasks, task.subtasks)
                .map((subtask) => ({
                  ...subtask,
                  labels: intersectAndSortById(labels, subtask.labels),
                }))
                .map((data) => new Subtask(data)),
            }))
            .map((data) => new Task(data)),
        }))
        .map((data) => new TaskList(data)),
    }))
    .map((data) => new Project(data));
};

export const syncLocalStorage = () => {
  // create similar structure to firestore
  const data = Root.items.reduce(
    (acc, curr, i) => {
      const toStore = curr.toJSON();

      acc.projects[toStore.data.id] = { ...toStore.data, position: i };
      toStore.labels.forEach((label) => {
        acc.labels[label.id] = label;
      });
      toStore.lists.forEach((list) => {
        acc.lists[list.id] = list;
      });
      toStore.tasks.forEach((task) => {
        acc.tasks[task.id] = task;
      });
      toStore.subtasks.forEach((subtask) => {
        acc.subtasks[subtask.id] = subtask;
      });

      return acc;
    },
    { projects: {}, lists: {}, tasks: {}, subtasks: {}, labels: {} }
  );

  // rewrite each folder every sync
  Object.entries(data).forEach(([key, value]) => {
    LocalStorage.sync(key, value);
  });

  LocalStorage.sync(LAST_UPDATE, Date.now());
};

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

export const getLocalData = () => recoverDataFromLocal() ?? loadDefaultData();

export const init = (data) => {
  Root.clear().add(data);
  syncLocalStorage();
};

export const initLocal = () => init(getLocalData());

// =====================================================================================
// Projects
// =====================================================================================
export const getAllProjects = () => [...Root.items];

export const getProject = (projectId) => {
  const project = Root.get(projectId);

  if (!project) throw new Error(`There's no project with the id: ${projectId}`);

  return project;
};

export const addProject = (name) => {
  const project = new Project({ name: name || 'Unnamed project' });
  Root.add(project);

  return project;
};

export const updateProject = (projectId, data) => {
  const [prop, value] = Object.entries(data).flat();

  const project = getProject(projectId);
  project[prop] = value;

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

  const list = new TaskList({ name: name || 'Unnamed list' });
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
    isWithinInterval(parseDate(task.dueDate), interval)
  );

export const getTasksDueThisWeek = () =>
  getAllTasks()
    .filter((task) => !task.completed)
    .filter((task) => isThisWeek(parseDate(task.dueDate)));

// tasks are considered stale if there are no updates in 2 weeks
export const getStaleTasks = () =>
  getAllTasks()
    .filter((task) => !task.completed)
    .filter((task) => differenceInWeeks(new Date(), task.lastUpdate) >= 2);

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

  if (label) Object.assign(label, data);
  else throw new Error(`Label with the id ${labelId} does not exists`);

  return label;
};
