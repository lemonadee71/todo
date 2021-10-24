import { html } from 'poor-man-jsx';
import Core from '../core';
import { PROJECT } from '../core/actions';
import { createUndoFn } from '../utils/undo';

const ProjectLink = (data) => {
  const deleteProject = createUndoFn(
    `#${data.id}`,
    () =>
      Core.event.emit(PROJECT.REMOVE, {
        project: data.id,
      }),
    'Project removed'
  );

  return html`
    <li id="${data.id}">
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
