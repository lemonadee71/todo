import { createHook } from 'poor-man-jsx';
import Core from '../core';
import { PROJECT, TASK } from '../core/actions';
import { memoize } from './memo';

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
