import { html } from 'poor-man-jsx';
import { PROJECT } from '../actions';
import { useUndo } from '../utils/undo';

const ProjectLink = (data, i) => {
  const deleteProject = useUndo({
    type: PROJECT,
    message: 'Project removed',
    data: { id: data.id, project: data.id },
  });

  return html`
    <li
      :skip="style"
      :key=${data.id}
      class="group flex justify-between items-center"
      data-id="${data.id}"
      data-position="${i}"
    >
      <a
        is="navigo-link"
        class="no-underline hover:underline text-sm text-white truncate"
        href="${data.link}"
        text="${data.name}"
      >
      </a>
      <button
        class="w-0 opacity-0 group-hover:w-fit group-hover:opacity-100 focus:w-fit focus:opacity-100"
        onClick=${deleteProject}
      >
        <my-icon
          name="delete"
          id="title-link-${data.id}"
          title="Delete this project"
          class="stroke-red-500 hover:stroke-red-700 focus:stroke-red-700"
        />
      </button>
    </li>
  `;
};

export default ProjectLink;
