import { html } from 'poor-man-jsx';

const Label = (data, action) => {
  const chooseLabel = (e) => action(e.currentTarget.getAttribute('key'));

  return html`
    <div
      class="label"
      key="${data.id}"
      style="background-color: ${data.color};"
      ${{ onClick: chooseLabel }}
    >
      <span>${data.name}</span>
    </div>
  `;
};
export default Label;
