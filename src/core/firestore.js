import { deleteDoc, getDocs, query, setDoc, where } from 'firebase/firestore';
import {
  getCollectionRef,
  getData,
  getDocumentRef,
  getDocuments,
} from '../utils/firestore';
import Label from './classes/Label';
import Project from './classes/Project';
import Subtask from './classes/Subtask';
import Task from './classes/Task';
import TaskList from './classes/TaskList';
import { loadDefaultData } from './main';
import Core from '.';
import { PROJECT, TASK } from './actions';

export const fetchData = async (conditions = {}, converters = {}) => {
  const data = {};

  // refs
  const projectsRef = query(
    getCollectionRef(
      'Projects',
      converters.projects || Project.converter(data)
    ),
    ...(conditions.projects || [])
  );
  const labelsRef = query(
    getCollectionRef('Labels', converters.labels || Label.converter()),
    ...(conditions.labels || [])
  );
  const listsRef = query(
    getCollectionRef('Lists', converters.lists || TaskList.converter(data)),
    ...(conditions.lists || [])
  );
  const tasksRef = query(
    getCollectionRef('Tasks', converters.tasks || Task.converter(data)),
    ...(conditions.tasks || [])
  );
  const subtasksRef = query(
    getCollectionRef(
      'Subtasks',
      converters.subtasks || Subtask.converter(data)
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
      getDocumentRef('Projects', project.id, Project.converter()),
      project
    );

    project.labels.items.forEach(async (label) => {
      await setDoc(
        getDocumentRef('Labels', label.id, Label.converter()),
        label
      );
    });

    project.lists.items.forEach(async (list) => {
      await setDoc(
        getDocumentRef('Lists', list.id, TaskList.converter()),
        list
      );

      list.items.forEach(async (task) => {
        await setDoc(getDocumentRef('Tasks', task.id, Task.converter()), task);

        task.data.subtasks.forEach(async (subtask) => {
          await setDoc(
            getDocumentRef('Subtasks', subtask.id, Subtask.converter(), subtask)
          );
        });
      });
    });
  });
};

export const setupListeners = () => {
  // Projects
  Core.event.onSuccess(PROJECT.ADD, async (data) => {
    await setDoc(
      getDocumentRef('Projects', data.id, Project.converter()),
      data
    );

    data.labels.items.forEach(async (label) => {
      await setDoc(
        getDocumentRef('Labels', label.id, Label.converter()),
        label
      );
    });

    data.lists.items.forEach(async (list) => {
      await setDoc(
        getDocumentRef('Lists', list.id, TaskList.converter()),
        list
      );
    });
  });
  Core.event.onSuccess([PROJECT.MOVE, PROJECT.UPDATE], async (data) =>
    setDoc(getDocumentRef('Projects', data.id, Project.converter()), data)
  );
  Core.event.on(`${PROJECT.REMOVE}:timeout`, async (data) =>
    deleteDoc(getDocumentRef('Projects', data.id))
  );

  // Lists
  Core.event.onSuccess(
    [PROJECT.LISTS.ADD, PROJECT.LISTS.MOVE, PROJECT.LISTS.UPDATE],
    async (data) =>
      setDoc(getDocumentRef('Lists', data.id, TaskList.converter()), data)
  );
  Core.event.on(`${PROJECT.LISTS.REMOVE}:timeout`, async (data) =>
    deleteDoc(getDocumentRef('Lists', data.id))
  );

  // Labels
  Core.event.onSuccess(
    [PROJECT.LABELS.ADD, PROJECT.LABELS.UPDATE],
    async (data) =>
      setDoc(getDocumentRef('Labels', data.id, Label.converter()), data)
  );
  Core.event.onSuccess(PROJECT.LABELS.REMOVE, async (data) =>
    deleteDoc(getDocumentRef('Labels', data.id))
  );

  // Tasks
  Core.event.onSuccess(
    [TASK.ADD, TASK.MOVE, TASK.UPDATE, TASK.LABELS.ADD, TASK.LABELS.REMOVE],
    // use to toFirestore instead of converter since task and subtask share TASK.LABELS.*
    async (data) => setDoc(getDocumentRef('Tasks', data.id), data.toFirestore())
  );
  // transfer has a different return value for TASK
  Core.event.onSuccess(TASK.TRANSFER, async (data) => {
    if (data.type === 'task') {
      // delete original document
      await deleteDoc(
        getDocumentRef('Tasks', data.result.id, Task.converter())
      );
      // create new one in a different collection
      await setDoc(
        getDocumentRef('Subtasks', data.result.id, Subtask.converter()),
        data.result
      );
    } else {
      await setDoc(
        getDocumentRef('Tasks', data.result.id, Task.converter()),
        data.result
      );
    }
  });
  Core.event.on(`${TASK.REMOVE}:timeout`, async (data) =>
    deleteDoc(getDocumentRef('Tasks', data.id))
  );

  // Subtasks
  Core.event.onSuccess(
    [TASK.SUBTASKS.ADD, TASK.SUBTASKS.MOVE, TASK.SUBTASKS.UPDATE],
    async (data) =>
      setDoc(getDocumentRef('Subtasks', data.id, Subtask.converter()), data)
  );
  Core.event.onSuccess(TASK.SUBTASKS.TRANSFER, async (data) => {
    if (data.type === 'list') {
      // delete original document
      await deleteDoc(
        getDocumentRef('Subtasks', data.result.id, Task.converter())
      );
      // create new one in a different collection
      await setDoc(
        getDocumentRef('Tasks', data.result.id, Subtask.converter()),
        data.result
      );
    } else {
      await setDoc(
        getDocumentRef('Subtasks', data.result.id, Subtask.converter()),
        data.result
      );
    }
  });
  Core.event.on(`${TASK.SUBTASKS.REMOVE}:timeout`, async (data) =>
    deleteDoc(getDocumentRef('Subtasks', data.id))
  );
};
