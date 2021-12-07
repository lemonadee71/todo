import { html } from 'poor-man-jsx';
import { PROJECT } from '../core/actions';
import { useUndo } from '../utils/undo';

const ProjectLink = (data) => {
  const deleteProject = useUndo({
    type: PROJECT,
    text: 'Project removed',
    payload: { project: data.id },
  });

  return html`
    <li ignore="style" data-id="${data.id}">
      <a is="navigo-link" href="${`/app/${data.link}`}">{% ${data.name} %}</a>
      <button ${{ onClick: deleteProject }}>Delete</button>
    </li>
  `;
};

export default ProjectLink;
