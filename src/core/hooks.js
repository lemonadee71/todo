import { createHook } from 'poor-man-jsx';
import Core from '.';
import { FIREBASE, PROJECT, TASK } from '../actions';

export const useRoot = () => {
  const [state] = createHook({ projects: Core.main.getAllProjects() });

  const unsubscribe = Core.event.onSuccess(PROJECT.ALL, () => {
    state.projects = Core.main.getAllProjects();
  });

  return [state, unsubscribe];
};

// we rely on changes to original references
// to be reflected here
export const useProject = (projectId) => {
  const projectRef = Core.main.getProject(projectId);
  const [project] = createHook({
    // Add other properties if needed
    id: projectRef.id,
    name: projectRef.name,
    color: projectRef.color,
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
        FIREBASE.TASK.FETCH_COMPLETED,
      ],
      () => {
        project.lists = projectRef.lists.items;
        project.labels = projectRef.labels.items;
      }
    ),
    Core.event.onSuccess(PROJECT.UPDATE, () => {
      project.name = projectRef.name;
      project.color = projectRef.color;
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
