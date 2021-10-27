import { html } from 'poor-man-jsx';

const Label = (data, action, isSelected) => {
  const clickLabel = (e) => {
    const label = e.currentTarget;
    const [base, modifier] = label.className.split('--');

    if (modifier) label.className = base;
    else label.className = `${base}--selected`;

    action(label.getAttribute('key'), !modifier);
  };

  return html`
    <div
      class="label${isSelected ? '--selected' : ''}"
      key="${data.id}"
      style="background-color: ${data.color};"
      ${{ onClick: clickLabel }}
    >
      <span>${data.name}</span>
    </div>
  `;
};
export default Label;
