import {
  doc,
  getDoc,
  getDocs,
  getFirestore,
  query,
  where,
} from 'firebase/firestore';
import { converter, getCollection, getData, path } from '../utils/firestore';
import { fetchFromIds } from '../utils/misc';
import Label from './classes/Label';
import Project from './classes/Project';
import Subtask from './classes/Subtask';
import Task from './classes/Task';
import TaskList from './classes/TaskList';

export const fetchProject = async (projectId) => {
  const temp = {};

  // refs
  const projectRef = doc(
    getFirestore(),
    path('Projects'),
    projectId
  ).withConverter(
    converter(Project, (data) => ({
      ...data,
      labels: temp.labels?.filter((label) => label.project === data.id),
      lists: temp.lists?.filter((list) => list.project === data.id),
    }))
  );
  const labelsRef = query(
    getCollection('Labels', converter(Label)),
    where('project', '==', projectId)
  );
  const listsRef = query(
    getCollection(
      'Lists',
      converter(TaskList, (data) => ({
        ...data,
        defaultItems: temp.tasks?.filter((task) => task.list === data.id),
      }))
    ),
    where('project', '==', projectId)
  );
  const tasksRef = query(
    getCollection(
      'Tasks',
      converter(Task, (data) => ({
        ...data,
        labels: fetchFromIds(data.labels || [], temp.labels || []),
        subtasks: temp.subtasks?.filter(
          (subtask) => subtask.parent === data.id
        ),
      }))
    ),
    where('project', '==', projectId)
  );
  const subtasksRef = query(
    getCollection(
      'Subtasks',
      converter(Subtask, (data) => ({
        ...data,
        labels: fetchFromIds(data.labels || [], temp.labels || []),
      }))
    ),
    where('project', '==', projectId)
  );

  (async () => {
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
  })();

  return (await getDoc(projectRef)).data();
};
