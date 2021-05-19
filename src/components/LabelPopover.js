import { html } from '../helpers/component';
import $, { append } from '../helpers/helpers';
import { getLabels } from '../modules/labels';
import NewLabelForm from './NewLabelForm';
import Label from './Label';
import event from '../modules/event';

const LabelPopover = ({ taskLabels, toggleLabel }) => {
  const labels = getLabels();

  const renderLabel = (label) => {
    append(Label({ label })).to($('#label-list'));
  };

  event.on('label.add.success', renderLabel);
  event.on('modal.close', () => event.off('label.add.success', renderLabel), {
    once: true,
  });

  const closePopover = () => {
    $('#popover').classList.remove('visible');
  };

  const updateLabels = (e) => {
    const el = e.target;
    let data;

    if (el.matches('.label[data-label-id]')) {
      el.classList.toggle('selected');
      data = {
        id: el.getAttribute('data-label-id'),
        color: el.getAttribute('data-color'),
        name: el.firstElementChild.textContent,
        selected: el.className.includes('selected'),
      };
    } else if (el.matches('.label[data-label-id] span')) {
      el.parentElement.classList.toggle('selected');
      data = {
        id: el.parentElement.getAttribute('data-label-id'),
        color: el.parentElement.getAttribute('data-color'),
        name: el.textContent,
        selected: el.parentElement.className.includes('selected'),
      };
    }

    toggleLabel(data);
  };

  return html`
    <div id="popover">
      <span class="close" ${{ onClick: closePopover }}>&times;</span>
      <span class="section-header">Labels</span>
      <div id="label-list" ${{ onClick: updateLabels }}>
        ${labels.length
          ? labels.map((label) => Label({ label, taskLabels }))
          : ''}
      </div>
      <div id="new-label">
        <span class="section-header">Create New Label</span>
        ${NewLabelForm()}
      </div>
    </div>
  `;
};

export default LabelPopover;
