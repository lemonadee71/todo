import { getDocs, query, setDoc, where } from 'firebase/firestore';
import {
  getCollection,
  getData,
  getDocument,
  getDocuments,
} from '../utils/firestore';
import Label from './classes/Label';
import Project from './classes/Project';
import Subtask from './classes/Subtask';
import Task from './classes/Task';
import TaskList from './classes/TaskList';
import { loadDefaultData } from './main';

export const fetchData = async (conditions = {}, converters = {}) => {
  const data = {};

  // refs
  const projectsRef = query(
    getCollection('Projects', converters.projects || Project.converter(data)),
    ...(conditions.projects || [])
  );
  const labelsRef = query(
    getCollection('Labels', converters.labels || Label.converter()),
    ...(conditions.labels || [])
  );
  const listsRef = query(
    getCollection('Lists', converters.lists || TaskList.converter(data)),
    ...(conditions.lists || [])
  );
  const tasksRef = query(
    getCollection('Tasks', converters.tasks || Task.converter(data)),
    ...(conditions.tasks || [])
  );
  const subtasksRef = query(
    getCollection('Subtasks', converters.subtasks || Subtask.converter(data)),
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

export const initFirestore = async () => {
  const defaultData = loadDefaultData();

  defaultData.forEach(async (project) => {
    await setDoc(
      getDocument('Projects', project.id, Project.converter()),
      project
    );

    project.labels.items.forEach(async (label) => {
      await setDoc(getDocument('Labels', label.id, Label.converter()), label);
    });

    project.lists.items.forEach(async (list) => {
      await setDoc(getDocument('Lists', list.id, TaskList.converter()), list);

      list.items.forEach(async (task) => {
        await setDoc(getDocument('Tasks', task.id, Task.converter()), task);

        task.data.subtasks.forEach(async (subtask) => {
          await setDoc(
            getDocument('Subtasks', subtask.id, Subtask.converter(), subtask)
          );
        });
      });
    });
  });
};
