import { format } from 'date-fns';
import { html } from 'poor-man-jsx';
import { $ } from '../../utils/query';

const Taskbar = (calendar) => {
  const renderMonthName = () => {
    const currentDate = calendar.self.getDate().toDate();
    $.data('name', 'month-name').textContent = format(currentDate, 'MMMM yyyy');
  };

  const selectView = (e) => {
    calendar.self.changeView(e.target.value, true);
    renderMonthName();
  };

  const goToToday = () => {
    calendar.self.today();
    renderMonthName();
  };

  const previous = () => {
    calendar.self.prev();
    renderMonthName();
  };

  const next = () => {
    calendar.self.next();
    renderMonthName();
  };

  return html`
    <div data-name="taskbar">
      <select name="calendar-view" ${{ onChange: selectView }}>
        <option value="day">Daily</option>
        <option value="week">Weekly</option>
        <option value="month" selected>Month</option>
      </select>
      <button name="today" ${{ onClick: goToToday }}>Today</button>
      <button name="previous" ${{ onClick: previous }}><</button>
      <button name="next" ${{ onClick: next }}>></button>
      <h1 data-name="month-name" ${{ onMount: renderMonthName }}></h1>
    </div>
  `;
};

export default Taskbar;
