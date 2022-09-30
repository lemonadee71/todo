import PoorManJSX, { html } from 'poor-man-jsx';
import { runOnlyIfClick } from '../../utils/keyboard';

const Label = ({ props: { data, selected, onclick, onedit } }) => {
  const clickLabel = (e) => {
    onclick(data.id, !e.currentTarget.matches('[data-selected]'));
  };

  const editLabel = () => onedit(data);

  return html`
    <div
      :key="${data.id}"
      class="group px-2 py-1 rounded flex justify-between items-center cursor-pointer break-all border border-solid"
      class:[border-white|border-transparent]=${selected}
      style="background-color: ${data.color};"
      tabindex="0"
      bool:data-selected=${selected}
      onClick=${clickLabel}
      onKeydown=${runOnlyIfClick(clickLabel)}
    >
      <span>${data.name}</span>

      <button
        class="w-0 opacity-0 focus:w-fit focus:opacity-100 group-hover:w-fit group-hover:opacity-100"
        onClick.stop=${editLabel}
        onKeydown.stop=${runOnlyIfClick(editLabel)}
      >
        <my-icon
          name="edit"
          id="edit-${data.id}"
          title="Edit label"
          class="stroke-gray-300 focus:stroke-white hover:stroke-white"
        />
      </button>
    </div>
  `;
};

PoorManJSX.customComponents.define('task-label', Label);

export default Label;
