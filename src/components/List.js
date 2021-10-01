import { html } from 'poor-man-jsx';

// * This is is-list and should update for every new task
const List = (data) =>
  html`
    <div>
      <p>${data.name}</p>
      <ul is-list></ul>
    </div>
  `;

export default List;
