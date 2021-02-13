import { uncategorizedTasks } from '../modules/projects';

const ProjectOptions = (projects, location = '') => {
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
              location === uncategorizedTasks.id || location === ''
                ? 'true'
                : '',
          },
        },
        ...projects.map((proj) => ({
          type: 'option',
          text: proj.name,
          attr: {
            value: proj.id,
            selected: location === proj.id ? 'true' : '',
          },
        })),
      ]
    : '';
};

export default ProjectOptions;
