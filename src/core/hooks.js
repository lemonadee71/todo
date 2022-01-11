import { doc, getFirestore, onSnapshot } from 'firebase/firestore';
import { createHook } from 'poor-man-jsx';
import Core from '.';
import { isGuest } from '../utils/auth';
import { getCollectionRef, getDocuments } from '../utils/firestore';
import { orderByIds } from '../utils/misc';
import { PROJECT, TASK } from './actions';
import Project from './classes/Project';

export const useRoot = () => {
  let unsubscribe;

  if (isGuest()) {
    Core.data.projects = Core.main.getProjectDetails();

    unsubscribe = Core.event.onSuccess(PROJECT.ALL, () => {
      Core.data.projects = Core.main.getProjectDetails();
    });
  } else {
    const projectsRef = getCollectionRef('Projects', Project.converter());
    const orderRef = doc(getFirestore(), `${Core.state.currentUser}/Projects`);

    // only add, delete, and move will be captured here
    // since change in "name" will not change "order"
    unsubscribe = onSnapshot(orderRef, async (snapshot) => {
      const projects = await getDocuments(projectsRef);
      Core.data.projects = orderByIds(snapshot.data().order, projects);
    });
  }

  return [Core.data, unsubscribe];
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
