import { createPopper } from '@popperjs/core';
import { format, parseISO, subMinutes } from 'date-fns';
import { html, render } from 'poor-man-jsx';
import ToastUICalendar from 'tui-calendar';
import Core from '../core';
import { POPPER_CONFIG, TZ_DATE_FORMAT } from '../core/constants';
import Taskbar from '../components/Calendar/Taskbar';
import Sidebar from '../components/Calendar/Sidebar';
import CreationPopup from '../components/Calendar/CreationPopup';
import { $ } from '../utils/query';
import { dispatchCustomEvent } from '../utils/dispatch';

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
      // useCreationPopup: true,
      useDetailPopup: true,
    });

    calendar.self.on({
      beforeCreateSchedule: (e) => {
        // make sure to close previous popup first
        const prevPopup = $('#creation-popup');
        if (prevPopup) dispatchCustomEvent(prevPopup, 'popupclose');

        // then create a new one
        const popup = render(CreationPopup(calendar, e)).firstElementChild;
        this.after(popup);

        const ref = e.guide.guideElement
          ? e.guide.guideElement
          : Object.values(e.guide.guideElements)[0];
        const instance = createPopper(ref, popup, POPPER_CONFIG);

        popup.addEventListener('@destroy', () => {
          instance.destroy();
        });
      },
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
