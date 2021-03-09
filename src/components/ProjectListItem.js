import Component from '../helpers/component';
import Icons from './Icons';

const ProjectListItem = (proj, { deleteHandler }) => {
  return Component.html`
    <li id="${proj.id}">
      ${{
        type: 'span',
        text: proj.name,
      }}
      <span ${{ onClick: deleteHandler }}>${Icons('delete')}</span>
    </li>
  `;
};

export default ProjectListItem;
