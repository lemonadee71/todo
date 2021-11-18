import { html } from 'poor-man-jsx';
import { useRoot } from '../../core/hooks';
import { $, $$ } from '../../utils/query';

const Sidebar = (calendar) => {
  const [data] = useRoot();

  const toggleProject = (e) => {
    calendar.self.toggleSchedules(e.target.value, !e.target.checked);

    if (!e.target.checked) $.attr('name', 'view-all').checked = false;
  };

  const toggleAll = (e) => {
    $$('input', $.data('name', 'user-projects')).forEach((input) => {
      input.checked = e.target.checked;
      toggleProject({ target: input });
    });
  };

  return html`
    <div data-name="sidebar">
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
        data-name="user-projects"
        ${{
          $children: data.$projects.map(
            (project) =>
              html`
                <li>
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
