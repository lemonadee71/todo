import Component from '../helpers/component';
import Icons from './Icons';

const ProjectListItem = ({ proj, deleteHandler }) => {
  return Component.html`
    <li id="${proj.id}">
      ${{
        type: 'a',
        text: proj.name,
        attr: {
          href: `#/${proj.id.replace('-', '/')}`,
        },
      }}
      <span ${{ onClick: deleteHandler }}>${Icons('delete')}</span>
    </li>
  `;
};

export default ProjectListItem;
