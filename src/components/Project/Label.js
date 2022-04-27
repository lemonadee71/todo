import { html } from 'poor-man-jsx';

const Label = (data, clickAction, editAction, isSelected) => {
  const clickLabel = (e) => {
    // ignore button click
    if (e.target.nodeName === 'BUTTON' || e.target.nodeName === 'svg') return;

    const { selected } = e.currentTarget.dataset;

    clickAction(data.id, !selected);
  };

  const editLabel = () => editAction(data);

  return html`
    <div
      key="${data.id}"
      ${isSelected ? 'data-selected="true"' : ''}
      class="group w-full space-x-1 rounded px-2 py-1 flex flex-row justify-between items-center cursor-pointer border border-solid ${isSelected
        ? 'border-white'
        : 'border-transparent'}"
      style="background-color: ${data.color};"
      onClick=${clickLabel}
    >
      <p>{% ${data.name} %}</p>

      <button class="h-full invisible group-hover:visible" onClick=${editLabel}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="stroke-gray-600 hover:stroke-gray-800"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="#000000"
          fill="none"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <path stroke="none" d="M0 0h24v24H0z" fill="none" />
          <path d="M4 20h4l10.5 -10.5a1.5 1.5 0 0 0 -4 -4l-10.5 10.5v4" />
          <line x1="13.5" y1="6.5" x2="17.5" y2="10.5" />
        </svg>
      </button>
    </div>
  `;
};

export default Label;
