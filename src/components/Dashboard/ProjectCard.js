import { format } from 'date-fns';
import { html } from 'poor-man-jsx';

const ProjectCard = (data) => html`
  <div
    key="${data.id}"
    class="relative pb-2 rounded-xl shadow-xl bg-white dark:bg-[#272727]"
  >
    <div
      class="h-1/4 rounded-t-xl"
      style="background-color: ${data.color};"
    ></div>
    <h3 class="font-medium px-3 pt-2 line-clamp-2">${data.name}</h3>
    <p
      class="absolute bottom-2 left-3 text-xs text-gray-400 dark:text-gray-300"
    >
      Last opened: ${format(data.lastOpened, 'MM/dd/yyyy')}
    </p>
  </div>
`;

export default ProjectCard;
