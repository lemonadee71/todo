import { uncategorizedTasks } from '../modules/projects';

const ProjectOptions = (projects, task = '') => {
  return projects.length
    ? [
        // Use an imported uncategorizedTasks for now
        {
          type: 'option',
          text: 'Uncategorized',
          attr: {
            value: uncategorizedTasks.id,
            disabled: 'true',
            selected:
              task && task.location === uncategorizedTasks.id ? 'true' : '',
          },
        },
        ...projects.map((proj) => ({
          type: 'option',
          text: proj.name,
          attr: {
            value: proj.id,
            selected: task.location === proj.id ? 'true' : '',
          },
        })),
      ]
    : '';
};

export default ProjectOptions;
