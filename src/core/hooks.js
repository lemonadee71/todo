import { createHook } from 'poor-man-jsx';
import Core from '.';
import { PROJECT, TASK } from './actions';
import { memoize } from '../utils/memo';

// we rely on changes to original references
// to be reflected here
export const useProject = memoize((projectId) => {
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
      },
      { order: 'last' }
    ),
    Core.event.on(PROJECT.UPDATE, () => {
      project.name = projectRef.name;
    }),
  ];

  const revoke = () => {
    unsubscribe.forEach((cb) => cb());
    useProject.__cache__.delete(JSON.stringify([projectId]));
  };

  return [project, revoke];
});

export const useTask = (projectId, listId, taskId) => {
  const taskRef = Core.main.getTask(projectId, listId, taskId);
  const [task] = createHook(taskRef.data);

  const unsubscribe = [
    Core.event.on(TASK.UPDATE + '.success', (newData) => {
      Object.assign(task, newData);
    }),
    Core.event.on(
      [...TASK.LABELS.ALL, ...PROJECT.LABELS.ALL],
      () => {
        task.labels = taskRef.data.labels;
      },
      { order: 'last' }
    ),
    Core.event.on(
      TASK.SUBTASKS.ALL,
      () => {
        task.subtasks = taskRef.subtasks.items;
      },
      { order: 'last' }
    ),
  ];

  const revoke = () => unsubscribe.forEach((cb) => cb());

  return [task, revoke];
};
