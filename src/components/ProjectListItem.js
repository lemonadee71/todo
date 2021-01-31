import Component from '../helpers/component';

const ProjectListItem = (proj, clickHandler) => {
  return Component.createElementFromObject({
    type: `li`,
    id: proj.id,
    text: proj.name,
    listeners: {
      click: () => clickHandler(proj.id),
    },
  });
};

export default ProjectListItem;
