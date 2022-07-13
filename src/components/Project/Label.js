import { html } from 'poor-man-jsx';
import { EditIcon } from '../../assets/icons';
import { runOnlyIfClick } from '../../utils/misc';

const Label = (data, clickAction, editAction, isSelected) => {
  const clickLabel = (e) => {
    clickAction(data.id, !e.currentTarget.matches('[data-selected]'));
  };

  const editLabel = (e) => {
    editAction(data);
    e.stopPropagation();
  };

  return html`
    <div
      key="${data.id}"
      class="group px-2 py-1 rounded flex justify-between items-center cursor-pointer break-all border border-solid ${isSelected
        ? 'border-white'
        : 'border-transparent'}"
      tabindex="0"
      style="background-color: ${data.color};"
      data-selected=${isSelected}
      onClick=${clickLabel}
      onKeydown=${runOnlyIfClick(clickLabel)}
    >
      <span>{% ${data.name} %}</span>

      <button
        class="w-0 opacity-0 focus:w-fit focus:opacity-100 group-hover:w-fit group-hover:opacity-100"
        onClick=${editLabel}
      >
        ${EditIcon({
          cls: 'stroke-gray-300 focus:stroke-white hover:stroke-white',
          id: `edit-${data.id}`,
          title: 'Edit label',
        })}
      </button>
    </div>
  `;
};

export default Label;
