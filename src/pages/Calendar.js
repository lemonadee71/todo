import { format, parseISO, subMinutes } from 'date-fns';
import { html } from 'poor-man-jsx';
import ToastUICalendar from 'tui-calendar';
import Core from '../core';
import { TZ_DATE_FORMAT } from '../core/constants';
import Taskbar from '../components/Calendar/Taskbar';
import Sidebar from '../components/Calendar/Sidebar';

const Calendar = () => {
  const calendar = {};

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

    calendar.self.createSchedules(schedules);
  };

  const init = function () {
    calendar.self = new ToastUICalendar(this, {
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

  const destroy = () => calendar.self.destroy();

  return html`
    ${Taskbar(calendar)} ${Sidebar(calendar)}
    <div data-name="calendar">
      <div ${{ onCreate: init, onDestroy: destroy }}></div>
    </div>
  `;
};

export default Calendar;
