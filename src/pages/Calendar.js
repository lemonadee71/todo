import { createPopper } from '@popperjs/core';
import { parseISO, subMinutes } from 'date-fns';
import { html, render } from 'poor-man-jsx';
import ToastUICalendar from 'tui-calendar';
import Core from '../core';
import { POPPER_CONFIG } from '../core/constants';
import { $ } from '../utils/query';
import { dispatchCustomEvent } from '../utils/dispatch';
import { formatToTZDate } from '../utils/date';
import Taskbar from '../components/Calendar/Taskbar';
import Sidebar from '../components/Calendar/Sidebar';
import CreationPopup from '../components/Calendar/CreationPopup';

const Calendar = () => {
  const calendar = {};

  const createSchedule = (data, start, end) => {
    const schedule = {
      start,
      end,
      id: data.id,
      calendarId: data.project,
      category: 'time',
      title: data.title,
      body: data.notes,
    };

    calendar.self.createSchedules([schedule]);
  };

  const toggleSchedule = (calendarId, toHide) => {
    calendar.self.toggleSchedules(calendarId, toHide);
  };

  const showTasks = () => {
    Core.main
      .getAllTasks()
      .filter((task) => task.dueDate)
      .forEach((task) => {
        const dueDate = parseISO(task.dueDate);
        const start = formatToTZDate(subMinutes(dueDate, '5'));
        const end = formatToTZDate(dueDate);

        createSchedule(task, start, end);
      });
  };

  const init = function () {
    calendar.self = new ToastUICalendar(this, {
      defaultView: 'month',
      taskView: false,
      // scheduleView: true,
      usageStatistics: false,
      useDetailPopup: true,
    });

    calendar.self.on({
      beforeCreateSchedule: (e) => {
        // make sure to close previous popup first
        const prevPopup = $('#creation-popup');
        if (prevPopup) dispatchCustomEvent(prevPopup, 'popupclose');

        // then create a new one
        const popup = render(
          CreationPopup(e, createSchedule)
        ).firstElementChild;
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
    ${Taskbar(calendar)} ${Sidebar(toggleSchedule)}
    <div data-name="calendar">
      <div ${{ onCreate: init, onDestroy: destroy }}></div>
    </div>
  `;
};

export default Calendar;
