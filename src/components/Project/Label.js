import { html } from 'poor-man-jsx';
import { EditIcon } from '../../assets/icons';

const Label = (data, clickAction, editAction, isSelected) => {
  const clickLabel = (e) => {
    const { selected } = e.currentTarget.dataset;

    clickAction(data.id, !selected);
  };

  const editLabel = (e) => {
    editAction(data);
    e.stopPropagation();
  };

  return html`
    <div
      key="${data.id}"
      ${isSelected ? 'data-selected="true"' : ''}
      class="group space-x-1 rounded px-2 py-1 flex justify-between items-center cursor-pointer border border-solid ${isSelected
        ? 'border-white'
        : 'border-transparent'}"
      style="background-color: ${data.color};"
      onClick=${clickLabel}
    >
      <p>{% ${data.name} %}</p>

      <button class="invisible group-hover:visible" onClick=${editLabel}>
        ${EditIcon('stroke-gray-300 hover:stroke-white')}
      </button>
    </div>
  `;
};

export default Label;
