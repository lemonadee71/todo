import { html } from '../helpers/component';
import { getProjectsDetails } from '../modules/projects';

const ProjectOptions = (location = '') => {
  const projects = getProjectsDetails();
  const defaultIds = ['all', 'today', 'week', 'upcoming', 'list-uncategorized'];
  const isDefault = (id) => defaultIds.includes(id);

  return html`<option
      value="uncategorized"
      disabled
      ${isDefault ? 'selected' : ''}
    >
      Uncategorized
    </option>
    ${projects.map(
      (proj) =>
        html`<option
          value="${proj.id}"
          ${location === proj.id ? 'selected' : ''}
          ${{ textContent: proj.name }}
        ></option>`
    )} `;
};

export default ProjectOptions;
