import { format, parseISO, subMinutes } from 'date-fns';
import { html } from 'poor-man-jsx';
import ToastUICalendar from 'tui-calendar';
import { $ } from '../utils/query';
import Core from '../core';
import { TZ_DATE_FORMAT } from '../core/constants';

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

  /**
   * Schedules
   */
  const showTasks = () => {
    const allTasks = Core.main.getAllTasks();
    const schedules = allTasks
      .filter((task) => task.dueDate)
      .map((task) => {
        const dueDate = parseISO(task.dueDate);
        const start = format(subMinutes(dueDate, '5'), TZ_DATE_FORMAT);
        const end = format(dueDate, TZ_DATE_FORMAT);

        return {
          start,
          end,
          id: task.id,
          calendarId: task.project,
          category: 'time',
          title: task.title,
          body: task.notes,
        };
      });

    instance.createSchedules(schedules);
  };

  /**
   * Instance
   */
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

    showTasks();
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
