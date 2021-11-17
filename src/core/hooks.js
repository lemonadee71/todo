import { createHook } from 'poor-man-jsx';
import Core from '.';
import { PROJECT, TASK } from './actions';
import { appendSuccess as success } from '../utils/misc';

export const useRoot = () => {
  const [data] = createHook({ projects: Core.main.getProjectDetails() });

  const unsubscribe = Core.event.on(success(PROJECT.ALL), () => {
    data.projects = Core.main.getProjectDetails();
  });

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
    Core.event.on(
      success([
        ...PROJECT.LISTS.ALL,
        ...PROJECT.LABELS.ALL,
        ...TASK.ALL,
        ...TASK.LABELS.ALL,
        ...TASK.SUBTASKS.ALL,
      ]),
      () => {
        project.lists = projectRef.lists.items;
        project.labels = projectRef.labels.items;
      }
    ),
    Core.event.on(PROJECT.UPDATE, () => {
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
    Core.event.on(action.UPDATE + '.success', (newData) => {
      Object.assign(task, newData);
    }),
    Core.event.on(success([...TASK.LABELS.ALL, ...PROJECT.LABELS.ALL]), () => {
      task.labels = taskRef.data.labels;
    }),
  ];

  if (!subtaskId) {
    unsubscribe.push(
      Core.event.on(
        success([
          ...TASK.SUBTASKS.ALL,
          ...TASK.LABELS.ALL,
          ...PROJECT.LABELS.ALL,
        ]),
        () => {
          task.subtasks = taskRef.subtasks.items;
        }
      )
    );
  }

  const revoke = () => unsubscribe.forEach((cb) => cb());

  return [task, revoke];
};
