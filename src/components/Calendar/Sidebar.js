import { html } from 'poor-man-jsx';
import { useRoot } from '../../core/hooks';

const Sidebar = (calendar) => {
  const [data] = useRoot();

  const toggleProject = (e) => {
    calendar.self.toggleSchedules(e.target.value, !e.target.checked);
  };

  return html`
    <div data-name="sidebar">
      <ul
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
