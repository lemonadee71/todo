import { getDocs, query, where } from 'firebase/firestore';
import { formatToDateTime } from '../utils/date';
import {
  converter,
  getCollection,
  getData,
  getDocuments,
} from '../utils/firestore';
import { fetchFromIds } from '../utils/misc';
import Label from './classes/Label';
import Project from './classes/Project';
import Subtask from './classes/Subtask';
import Task from './classes/Task';
import TaskList from './classes/TaskList';

export const fetchData = async (conditions) => {
  const temp = {};

  // refs
  const projectsRef = query(
    getCollection(
      'Projects',
      converter(Project, (data) => ({
        ...data,
        labels: temp.labels?.filter((label) => label.project === data.id),
        lists: temp.lists?.filter((list) => list.project === data.id),
      }))
    ),
    ...(conditions.projects || [])
  );
  const labelsRef = query(
    getCollection('Labels', converter(Label)),
    ...(conditions.labels || [])
  );
  const listsRef = query(
    getCollection(
      'Lists',
      converter(TaskList, (data) => ({
        ...data,
        defaultItems: temp.tasks?.filter((task) => task.list === data.id),
      }))
    ),
    ...(conditions.lists || [])
  );
  const tasksRef = query(
    getCollection(
      'Tasks',
      converter(Task, (data) => ({
        ...data,
        dueDate: formatToDateTime(new Date(data.dueDate)),
        labels: fetchFromIds(data.labels || [], temp.labels || []),
        subtasks: temp.subtasks?.filter(
          (subtask) => subtask.parent === data.id
        ),
      }))
    ),
    ...(conditions.tasks || [])
  );
  const subtasksRef = query(
    getCollection(
      'Subtasks',
      converter(Subtask, (data) => ({
        ...data,
        dueDate: formatToDateTime(new Date(data.dueDate)),
        labels: fetchFromIds(data.labels || [], temp.labels || []),
      }))
    ),
    ...(conditions.subtasks || [])
  );

  // do an initial fetch to build the data
  const result = await Promise.all([
    getDocs(labelsRef),
    getDocs(subtasksRef),
    getDocs(tasksRef),
    getDocs(listsRef),
  ]);

  temp.labels = result[0].docs?.map(getData);
  temp.subtasks = result[1].docs?.map(getData);
  temp.tasks = result[2].docs?.map(getData);
  temp.lists = result[3].docs?.map(getData);

  return getDocuments(projectsRef);
};

export const fetchProject = async (projectId) => {
  const condition = [where('project', '==', projectId)];
  const data = await fetchData({
    projects: [where('id', '==', projectId)],
    labels: condition,
    lists: condition,
    tasks: condition,
    subtasks: condition,
  });

  return data[0];
};
