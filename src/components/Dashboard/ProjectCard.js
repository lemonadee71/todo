import { html } from 'poor-man-jsx';
import { PROJECT } from '../../actions';
import { DeleteIcon } from '../../assets/icons';
import Core from '../../core';
import { getDateKeyword } from '../../utils/date';
import { useUndo } from '../../utils/undo';

const ProjectCard = (data, i) => {
  const deleteProject = useUndo({
    type: PROJECT,
    text: 'Project removed',
    payload: { id: data.id, project: data.id },
  });

  return html`
    <div
      key="${data.id}"
      class="grid grid-rows-[1fr_2fr_1fr] rounded-xl shadow-md bg-white dark:bg-[#272727] focus:ring group"
      data-id="${data.id}"
      data-position="${i}"
      onDblClick=${() => Core.router.navigate(data.link, { title: data.name })}
    >
      <div class="rounded-t-xl" style="background-color: ${data.color};"></div>

      <h3 class="font-medium px-3 pt-2 line-clamp-2 self-start">
        ${data.name}
      </h3>

      <div class="px-3 pb-2 self-end flex justify-between">
        <p class="text-[0.7rem] text-gray-400 dark:text-gray-300">
          Last opened:
          ${data.lastOpened ? getDateKeyword(data.lastOpened) : 'N/A'}
        </p>
        <div class="flex gap-1 items-center">
          <button
            class="invisible group-hover:visible cursor-pointer"
            onClick=${deleteProject}
          >
            ${DeleteIcon('stroke-red-600 hover:stroke-red-700', 15)}
          </button>
        </div>
      </div>
    </div>
  `;
};

export default ProjectCard;
