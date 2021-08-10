import { getProjectsDetails } from '../modules/projects';

const ProjectOptions = (location = '') => {
  const projects = getProjectsDetails();
  const defaultIds = ['all', 'today', 'week', 'upcoming', 'list-uncategorized'];
  const isDefault = (id) => defaultIds.includes(id);

  return [
    {
      type: 'option',
      text: 'Uncategorized',
      attr: {
        value: 'uncategorized',
        disabled: 'true',
        selected: isDefault(location) ? 'true' : '',
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
