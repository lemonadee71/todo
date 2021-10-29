import { createHook } from 'poor-man-jsx';
import Core from '../core';
import { PROJECT, TASK } from '../core/actions';

// we rely on changes to original references
// to be reflected here
export const useProject = (projectId) => {
  const projectRef = Core.main.getProject(projectId);
  const [project] = createHook({
    // Add other properties if needed
    name: projectRef.name,
    id: projectRef.id,
    lists: projectRef.lists.items,
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
      },
      { order: 'last' }
    ),
    Core.event.on(PROJECT.UPDATE, () => {
      project.name = projectRef.name;
    }),
  ];

  const revoke = () => unsubscribe.forEach((cb) => cb());

  return [project, revoke];
};
