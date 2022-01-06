import { html } from 'poor-man-jsx';
import { useProject } from '../../core/hooks';
import { $, $$ } from '../../utils/query';

const Sidebar = (projectId, toggleSchedule) => {
  const [data, unsubscribe] = useProject(projectId);

  const toggleList = (e) => {
    toggleSchedule(e.target.value, !e.target.checked);

    if (!e.target.checked) $.attr('name', 'view-all').checked = false;
  };

  const toggleAll = (e) => {
    $$('input', $.data('name', 'project-lists')).forEach((input) => {
      input.checked = e.target.checked;
      toggleList({ target: input });
    });
  };

  return html`
    <div data-name="sidebar" ${{ onDestroy: unsubscribe }}>
      <label>
        <input
          name="view-all"
          type="checkbox"
          checked
          ${{ onChange: toggleAll }}
        />
        View all
      </label>
      <ul
        is-list
        data-name="project-lists"
        ${{
          $children: data.$lists.map(
            (list) =>
              html`
                <li key="${list.id}">
                  <label>
                    <input
                      type="checkbox"
                      value="${list.id}"
                      checked
                      ${{ onChange: toggleList }}
                    />
                    ${list.name}
                  </label>
                </li>
              `
          ),
        }}
      ></ul>
    </div>
  `;
};

export default Sidebar;
