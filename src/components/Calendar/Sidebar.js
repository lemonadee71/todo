import { html } from 'poor-man-jsx';
import { useRoot } from '../../core/hooks';
import { $, $$ } from '../../utils/query';

const Sidebar = (toggleSchedule) => {
  const [data, unsubscribe] = useRoot();

  const toggleProject = (e) => {
    toggleSchedule(e.target.value, !e.target.checked);

    if (!e.target.checked) $.attr('name', 'view-all').checked = false;
  };

  const toggleAll = (e) => {
    $$('input', $.data('name', 'user-projects')).forEach((input) => {
      input.checked = e.target.checked;
      toggleProject({ target: input });
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
        data-name="user-projects"
        ${{
          $children: data.$projects.map(
            (project) =>
              html`
                <li key="${project.id}">
                  <label>
                    <input
                      type="checkbox"
                      value="${project.id}"
                      checked
                      ${{ onChange: toggleProject }}
                    />
                    ${project.name}
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
