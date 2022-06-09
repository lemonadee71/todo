import { html } from 'poor-man-jsx';
import { CalendarIcon } from '../assets/icons';
import {
  formatDate,
  formatDateToNow,
  getDateColor,
  parseDate,
} from '../utils/date';
import { $ } from '../utils/query';
import Badge from './Badge';

// we take in `data` which is a reference to the original object
// so that changes in props are reflected
const DateBadge = (data, compact = false) => {
  const compactContent = html`
    <span class="md:hidden">${CalendarIcon('stroke-white', 16, 1.75)}</span>
    <span data-name="date-text" class="hidden md:inline">
      ${formatDate(data.dueDate)}
    </span>
  `;

  return Badge({
    content: compact ? compactContent : formatDate(data.dueDate),
    bgColor: getDateColor(data.dueDate),
    props: {
      key: 'date',
      ignore: 'data-interval-id',
      'data-tooltip': `Due ${formatDateToNow(parseDate(data.dueDate))}`,
      onMount: (e) => {
        // change status of badge every x minute(s)
        const id = setInterval(() => {
          if (compact) {
            $.data('name', 'date-text', e.target).textContent = formatDate(
              data.dueDate
            );
          } else {
            e.target.innerHTML = formatDate(data.dueDate);
          }

          e.target.style.backgroundColor = getDateColor(data.dueDate);
          e.target.dataset.tooltipText = `Due ${formatDateToNow(
            parseDate(data.dueDate)
          )}`;
        }, 3 * 60 * 1000);

        e.target.dataset.intervalId = id;
      },
      onUnmount: (e) => clearInterval(e.target.dataset.intervalId),
    },
  });
};

export default DateBadge;
