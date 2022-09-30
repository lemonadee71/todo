import PoorManJSX, { apply, html } from 'poor-man-jsx';
import { formatDate, formatDateToNow, getDateColor } from '../utils/date';

const DateBadge = ({ props: { data, compact } }) => {
  const ref = {};

  const getColor = () => getDateColor(data.dueDate);

  const getDate = () => formatDate(data.dueDate);

  const getDateToNow = () => formatDateToNow(data.dueDate);

  const props = {
    _key: 'date',
    _skip: 'data-interval-id',
    'data-tooltip': `Due ${getDateToNow()}`,
    onLoad: (e) => {
      // change status of badge every x minute(s)
      const id = setInterval(() => {
        if (compact) {
          ref.current.textContent = getDate();
        } else {
          e.target.innerHTML = getDate();
        }

        apply(e.target, {
          'data-tooltip': `Due ${getDateToNow()}`,
          style: {
            backgroundColor: getColor(),
          },
        });
      }, 3 * 60 * 1000);

      e.target.dataset.intervalId = id;
    },
    onDestroy: (e) => clearInterval(e.target.dataset.intervalId),
  };

  return html`
    <common-badge background=${getColor()} props=${props}>
      ${compact
        ? html`
            <span class="md:hidden">
              <my-icon
                name="calendar"
                class="stroke-white stroke-2"
                size="16"
                decorative="true"
              />
            </span>
            <span :ref=${ref} class="hidden md:inline">${getDate()}</span>
          `
        : getDate()}
    </common-badge>
  `;
};

PoorManJSX.customComponents.define('date-badge', DateBadge);
