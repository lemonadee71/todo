import { html } from 'poor-man-jsx';
import { PROJECT } from '../actions';
import { useUndo } from '../utils/undo';
import { DeleteIcon } from '../assets/icons';
import { PATHS } from '../constants';

const ProjectLink = (data, i) => {
  const deleteProject = useUndo({
    type: PROJECT,
    text: 'Project removed',
    payload: { id: data.id, project: data.id },
  });

  return html`
    <li
      ignore="style"
      class="group flex justify-between items-center"
      data-id="${data.id}"
      data-position="${i}"
    >
      <a
        is="navigo-link"
        class="no-underline hover:underline text-sm text-white truncate"
        href="/${PATHS.project.url.replace(':id', data.id)}"
      >
        {% ${data.name} %}
      </a>
      <button onClick=${deleteProject}>
        ${DeleteIcon(
          'invisible group-hover:visible stroke-red-500 hover:stroke-red-700',
          18
        )}
      </button>
    </li>
  `;
};

export default ProjectLink;
