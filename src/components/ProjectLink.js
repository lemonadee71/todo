import { html } from 'poor-man-jsx';
import Core from '../core';
import { PROJECT } from '../core/actions';
import { useUndo } from '../utils/undo';

const ProjectLink = (data) => {
  const deleteProject = useUndo({
    element: `[data-id="${data.id}"]`,
    text: 'Project removed',
    callback: () =>
      Core.event.emit(PROJECT.REMOVE, {
        project: data.id,
      }),
  });

  return html`
    <li data-id="${data.id}">
      <a
        is="navigo-link"
        href="${`/app/${data.link}`}"
        title="Project | ${data.name}"
      >
        {% ${data.name} %}
      </a>
      <button
        ${{
          onClick: deleteProject,
        }}
      >
        Delete
      </button>
    </li>
  `;
};

export default ProjectLink;
