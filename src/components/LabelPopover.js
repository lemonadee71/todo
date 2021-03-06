import Component from '../helpers/component';
import $ from '../helpers/helpers';
import { getLabels } from '../modules/labels';
import NewLabelForm from './NewLabelForm';
import Label from './Label';

const LabelPopover = ({ taskLabels, toggleLabel }) => {
  let labels = getLabels();

  /*
   *  Event listeners
   */
  const closePopover = () => {
    $('#popover').classList.remove('visible');
  };

  const updateLabels = (e) => {
    let el = e.target;

    if (el.matches('.label[data-label-id]')) {
      el.classList.toggle('selected');

      toggleLabel({
        id: el.getAttribute('data-label-id'),
        color: el.getAttribute('data-color'),
        name: el.firstElementChild.textContent,
        selected: el.className.includes('selected'),
      });
    } else if (el.matches('.label[data-label-id] span')) {
      el.parentElement.classList.toggle('selected');

      toggleLabel({
        id: el.parentElement.getAttribute('data-label-id'),
        color: el.parentElement.getAttribute('data-color'),
        name: el.textContent,
        selected: el.parentElement.className.includes('selected'),
      });
    }
  };

  return Component.parseString`
    <div id="popover">
      <span class="close" ${{ onClick: closePopover }}>&times;</span>       
      <span class="section-header">Labels</span>
      <div id="label-list" ${{ onClick: updateLabels }}>
        ${
          labels.length
            ? labels.map((label) => Label({ label, taskLabels }))
            : ''
        }
      </div>
      <div id="new-label">   
        <span class="section-header">Create New Label</span>
        ${NewLabelForm()}     
      </div>
    </div>
  `;
};

export default LabelPopover;
