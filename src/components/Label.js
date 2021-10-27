import { html } from 'poor-man-jsx';

const Label = (data, action) => {
  const clickLabel = (e) => {
    const label = e.currentTarget;
    const [base, modifier] = label.className.split('--');

    if (modifier) label.className = base;
    else label.className = `${base}--selected`;

    action(label.getAttribute('key'));
  };

  return html`
    <div
      class="label"
      key="${data.id}"
      style="background-color: ${data.color};"
      ${{ onClick: clickLabel }}
    >
      <span>${data.name}</span>
    </div>
  `;
};
export default Label;
