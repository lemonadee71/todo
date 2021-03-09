import { getUncategorizedProj } from '../modules/projects';

const ProjectOptions = (projects, location = '') => {
  return [
    // Use an imported uncategorizedTasks for now
    {
      type: 'option',
      text: 'Uncategorized',
      attr: {
        value: getUncategorizedProj().id,
        disabled: 'true',
        selected:
          location === getUncategorizedProj().id || location === ''
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
  ];
};

export default ProjectOptions;
