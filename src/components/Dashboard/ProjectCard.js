import { html } from 'poor-man-jsx';
import { PROJECT } from '../../actions';
import Core from '../../core';
import { getDateKeyword } from '../../utils/date';
import { useUndo } from '../../utils/undo';

const ProjectCard = (data, idx) => {
  const openProject = () =>
    Core.router.navigate(data.link, { title: data.name });

  const deleteProject = useUndo({
    type: PROJECT,
    message: 'Project removed',
    data: { id: data.id, project: data.id },
  });

  const handleKeydown = (e) => {
    if (e.altKey) return;

    switch (e.key) {
      case 'Enter':
        openProject();
        e.preventDefault();
        break;
      case 'Delete':
      case 'Backspace':
        deleteProject();
        e.preventDefault();
        break;
      default:
    }
  };

  return html`
    <div
      :skip="class"
      :key="${data.id}"
      :sortable=${{
        action: PROJECT.MOVE,
        class: 'ring-4',
        getData: () => ({ project: data.id }),
      }}
      class="group grid grid-rows-[1fr_2fr_1fr] rounded-xl shadow-md bg-white dark:bg-[#272727]"
      tabindex="0"
      data-id="${data.id}"
      data-location="${data.id}"
      data-position="${idx}"
      onDblClick=${openProject}
      onKeydown.self=${handleKeydown}
    >
      <div class="rounded-t-xl" style="background-color: ${data.color};"></div>

      <h3 class="font-medium px-3 pt-2 line-clamp-2 self-start">
        ${data.name}
      </h3>

      <div class="px-3 pb-2 flex items-end justify-between">
        <p class="text-[0.7rem] text-gray-400 dark:text-gray-300">
          Last opened:
          ${data.lastOpened ? getDateKeyword(data.lastOpened) : 'N/A'}
        </p>
        <div class="flex gap-1 items-center">
          <button
            class="opacity-0 focus:opacity-100 group-hover:opacity-100"
            onClick=${deleteProject}
          >
            <my-icon
              name="delete"
              id="title-card-${data.id}"
              class="stroke-red-600 hover:stroke-red-700 focus:stroke-red-700"
              size="15"
              title="Delete this project"
            />
          </button>
        </div>
      </div>
    </div>
  `;
};

export default ProjectCard;
