import Component from '../helpers/component';
import Icons from './Icons';

const ProjectListItem = (proj, { clickHandler, deleteHandler }) => {
  return Component.createElementFromObject({
    type: 'li',
    id: proj.id,
    listeners: {
      click: clickHandler,
    },
    children: [
      {
        span: proj.name,
      },
      {
        type: 'span',
        prop: {
          innerHTML: Icons('delete'),
        },
        listeners: {
          click: deleteHandler,
        },
      },
    ],
  });
};

export default ProjectListItem;
