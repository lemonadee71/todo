import { format, parseISO, subMinutes } from 'date-fns';
import { html } from 'poor-man-jsx';
import ToastUICalendar from 'tui-calendar';
import { $ } from '../utils/query';
import Core from '../core';

const Calendar = () => {
  let instance;

  /**
   * Taskbar
   */
  const renderMonthName = () => {
    const currentDate = instance.getDate().toDate();
    $.data('name', 'month-name').textContent = format(currentDate, 'MMMM');
  };

  const selectView = (e) => {
    instance.changeView(e.target.value, true);
    renderMonthName();
  };

  const goToToday = () => {
    instance.today();
    renderMonthName();
  };

  const previous = () => {
    instance.prev();
    renderMonthName();
  };

  const next = () => {
    instance.next();
    renderMonthName();
  };

  const init = function () {
    instance = new ToastUICalendar(this, {
      defaultView: 'month',
      taskView: false,
      // scheduleView: true,
      // disableClick: true,
      usageStatistics: false,
      useCreationPopup: true,
      useDetailPopup: true,
    });
  };

  const destroy = () => instance.destroy();

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
    </div>
    <div data-name="calendar">
      <h1 data-name="month-name" ${{ onMount: renderMonthName }}></h1>
      <div ${{ onCreate: init, onDestroy: destroy }}></div>
    </div>
  `;
};

export default Calendar;
