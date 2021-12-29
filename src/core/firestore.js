import { getDocs, query, where } from 'firebase/firestore';
import { getCollection, getData, getDocuments } from '../utils/firestore';
import Label from './classes/Label';
import Project from './classes/Project';
import Subtask from './classes/Subtask';
import Task from './classes/Task';
import TaskList from './classes/TaskList';

export const fetchData = async (conditions) => {
  const data = {};

  // refs
  const projectsRef = query(
    getCollection('Projects', Project.converter(data)),
    ...(conditions.projects || [])
  );
  const labelsRef = query(
    getCollection('Labels', Label.converter()),
    ...(conditions.labels || [])
  );
  const listsRef = query(
    getCollection('Lists', TaskList.converter(data)),
    ...(conditions.lists || [])
  );
  const tasksRef = query(
    getCollection('Tasks', Task.converter(data)),
    ...(conditions.tasks || [])
  );
  const subtasksRef = query(
    getCollection('Subtasks', Subtask.converter(data)),
    ...(conditions.subtasks || [])
  );

  // do an initial fetch to build the data
  const result = await Promise.all([
    getDocs(labelsRef),
    getDocs(subtasksRef),
    getDocs(tasksRef),
    getDocs(listsRef),
  ]);

  data.labels = result[0].docs?.map(getData);
  data.subtasks = result[1].docs?.map(getData);
  data.tasks = result[2].docs?.map(getData);
  data.lists = result[3].docs?.map(getData);

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
