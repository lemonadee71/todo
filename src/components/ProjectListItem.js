import Icons from './Icons';

const ProjectListItem = (proj, { clickHandler, deleteHandler }) => {
  return {
    type: 'li',
    id: proj.id,
    listeners: {
      click: clickHandler,
    },
    children: [
      `<span>${proj.name}</span>`,
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
