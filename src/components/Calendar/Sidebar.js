import { html, render } from 'poor-man-jsx';
import { useProject } from '../../core/hooks';

const Sidebar = (projectId, toggleSchedule) => {
  const [data, unsubscribe] = useProject(projectId);

  const toggleList = (e) => {
    toggleSchedule(e.target.value, !e.target.checked);
  };

  return html`
    <div
      is-list
      class="font-sans text-sm flex flex-col space-y-1"
      data-name="sidebar"
      onDestroy=${unsubscribe}
    >
      ${data.$lists
        .map(
          (list) =>
            html`
              <label key="${list.id}">
                <input
                  type="checkbox"
                  value="${list.id}"
                  checked
                  onChange=${toggleList}
                />
                ${list.name}
              </label>
            `
        )
        .map((item) => render(item))}
    </div>
  `;
};

export default Sidebar;
