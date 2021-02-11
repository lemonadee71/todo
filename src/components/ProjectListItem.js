import Component from '../helpers/component';
import Icons from './Icons';

const ProjectListItem = (proj, { clickHandler, deleteHandler }) => {
  return {
    type: 'li',
    id: proj.id,
    listeners: {
      click: clickHandler,
    },
    children: [
      {
        type: 'span',
        text: proj.name,
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
  };
};

export default ProjectListItem;
