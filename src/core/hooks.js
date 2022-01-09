import { onSnapshot } from 'firebase/firestore';
import { createHook } from 'poor-man-jsx';
import Core from '.';
import { isGuest } from '../utils/auth';
import { converter, getCollectionRef, getData } from '../utils/firestore';
import { PROJECT, TASK } from './actions';
import Project from './classes/Project';

export const useRoot = () => {
  const [data] = createHook({ projects: [] });
  let unsubscribe;

  if (isGuest()) {
    data.projects = Core.main.getProjectDetails();

    unsubscribe = Core.event.onSuccess(PROJECT.ALL, () => {
      data.projects = Core.main.getProjectDetails();
    });
  } else {
    const ref = getCollectionRef('Projects', converter(Project));

    unsubscribe = onSnapshot(ref, (snapshot) => {
      data.projects = snapshot.docs.map(getData);
    });
  }

  return [data, unsubscribe];
};

// we rely on changes to original references
// to be reflected here
export const useProject = (projectId) => {
  const projectRef = Core.main.getProject(projectId);
  const [project] = createHook({
    // Add other properties if needed
    name: projectRef.name,
    id: projectRef.id,
    lists: projectRef.lists.items,
    labels: projectRef.labels.items,
  });

  const unsubscribe = [
    Core.event.onSuccess(
      [
        ...PROJECT.LISTS.ALL,
        ...PROJECT.LABELS.ALL,
        ...TASK.ALL,
        ...TASK.LABELS.ALL,
        ...TASK.SUBTASKS.ALL,
      ],
      () => {
        project.lists = projectRef.lists.items;
        project.labels = projectRef.labels.items;
      }
    ),
    Core.event.onSuccess(PROJECT.UPDATE, () => {
      project.name = projectRef.name;
    }),
  ];

  const revoke = () => unsubscribe.forEach((cb) => cb());

  return [project, revoke];
};

// for both task and subtask
export const useTask = (projectId, listId, taskId, subtaskId = null) => {
  const get = subtaskId ? Core.main.getSubtask : Core.main.getTask;
  const taskRef = get(projectId, listId, taskId, subtaskId);
  const [task] = createHook(taskRef.data);

  const action = subtaskId ? TASK.SUBTASKS : TASK;

  const unsubscribe = [
    Core.event.onSuccess(action.UPDATE, (newData) => {
      Object.assign(task, newData.data);
    }),
    Core.event.onSuccess([...TASK.LABELS.ALL, ...PROJECT.LABELS.ALL], () => {
      task.labels = taskRef.data.labels;
    }),
  ];

  if (!subtaskId) {
    unsubscribe.push(
      Core.event.onSuccess(
        [...TASK.SUBTASKS.ALL, ...TASK.LABELS.ALL, ...PROJECT.LABELS.ALL],
        () => {
          task.subtasks = taskRef.subtasks.items;
        }
      )
    );
  }

  const revoke = () => unsubscribe.forEach((cb) => cb());

  return [task, revoke];
};
