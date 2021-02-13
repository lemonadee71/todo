import Component from '../helpers/component';
import Icons from './Icons';

const ProjectListItem = (proj, { clickHandler, deleteHandler }) => {
  return Component.parseString`
    <li id="${proj.id}" ${{ onClick: clickHandler }}>
      ${{
        type: 'span',
        text: proj.name,
      }}
      <span ${{ onClick: deleteHandler }}>${Icons('delete')}</span>
    </li>
  `;
};

export default ProjectListItem;
