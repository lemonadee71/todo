import { getProjectsDetails } from '../modules/projects';

const ProjectOptions = (location = '') => {
  const projects = getProjectsDetails();

  return [
    {
      type: 'option',
      text: 'Uncategorized',
      attr: {
        value: 'uncategorized',
        disabled: 'true',
        selected: location === '' ? 'true' : '',
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
